import { getStripe, json } from './_lib/store.js';

const SUPPORT_EMAIL = 'caverowatches@sapo.pt';

function dayKey(){
  return new Intl.DateTimeFormat('en-CA', { timeZone:'Europe/Lisbon', year:'numeric', month:'2-digit', day:'2-digit' }).format(new Date());
}

function esc(value=''){
  return String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
}

function statusInfo(status){
  return ({
    pending:['Encomenda confirmada','A tua encomenda está a ser preparada. Assim que a expedição for registada, passamos a indicar a fase de transporte.'],
    processing:['Preparação para expedição','A tua encomenda está na fase de preparação e organização para entrega à transportadora.'],
    shipped:['Encomenda expedida','A tua encomenda já entrou no circuito de transporte.'],
    in_transit:['Em trânsito','A transportadora está a encaminhar a tua encomenda para o destino.'],
    out_for_delivery:['Em distribuição','A tua encomenda encontra-se na fase final de entrega.'],
    delayed:['Atualização no transporte','Foi registado um atraso ou uma alteração no percurso da encomenda.'],
    exception:['Ocorrência no transporte','Existe uma ocorrência registada no transporte. Consulta o tracking, quando disponível, ou contacta-nos.'],
    delivered:['Encomenda entregue','A encomenda foi registada como entregue. Se ainda não a recebeste, contacta-nos para verificarmos a situação.']
  })[status] || ['Encomenda confirmada','A tua encomenda está a ser preparada.'];
}

function validTrackingUrl(value){
  try { const url=new URL(value); return url.protocol==='https:' ? url.toString() : ''; }
  catch { return ''; }
}

async function sendTrackingEmail({to, order, status, carrier, trackingNumber, trackingUrl, idempotencyKey}){
  const apiKey=process.env.RESEND_API_KEY?.trim();
  const from=process.env.CAVERO_TRACKING_EMAIL_FROM?.trim();
  if(!apiKey || !from) throw new Error('Serviço de email ainda não configurado.');
  const [title,description]=statusInfo(status);
  const reference=String(order||'CAVERO').slice(0,8).toUpperCase();
  const safeUrl=validTrackingUrl(trackingUrl);
  const details=[
    `Encomenda: ${reference}`,
    carrier ? `Transportadora: ${carrier}` : '',
    trackingNumber ? `Tracking: ${trackingNumber}` : ''
  ].filter(Boolean).join('\n');
  const html=`<div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;color:#171714"><div style="background:#11110f;color:white;padding:22px;border-radius:16px 16px 0 0"><strong style="font-size:22px;letter-spacing:.12em">CAVERO</strong><br><span style="font-size:11px;letter-spacing:.18em;opacity:.7">WATCHES</span></div><div style="padding:28px;border:1px solid #e7e3da;border-top:0;border-radius:0 0 16px 16px"><div style="font-size:11px;font-weight:800;letter-spacing:.14em;color:#856d47">ATUALIZAÇÃO DIÁRIA DA ENCOMENDA</div><h1 style="font-size:25px">${esc(title)}</h1><p style="line-height:1.7;color:#5f5d56">${esc(description)}</p><div style="background:#f7f6f1;padding:16px;border-radius:12px;line-height:1.7"><strong>Encomenda:</strong> ${esc(reference)}${carrier?`<br><strong>Transportadora:</strong> ${esc(carrier)}`:''}${trackingNumber?`<br><strong>Tracking:</strong> ${esc(trackingNumber)}`:''}</div>${safeUrl?`<p><a href="${esc(safeUrl)}" style="display:inline-block;background:#11110f;color:white;padding:12px 18px;border-radius:999px;text-decoration:none;font-weight:700">Acompanhar encomenda</a></p>`:''}<p style="font-size:13px;line-height:1.6;color:#6b6962">Prazo estimado apresentado pela CAVERO: 5–13 dias. Esta mensagem usa o estado mais recente registado para a encomenda.</p><p style="font-size:13px;line-height:1.6;color:#6b6962">Apoio: <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a></p></div></div>`;
  const text=`CAVERO Watches\n\n${title}\n${description}\n\n${details}${safeUrl?`\nAcompanhar: ${safeUrl}`:''}\n\nPrazo estimado: 5–13 dias.\nApoio: ${SUPPORT_EMAIL}`;
  const response=await fetch('https://api.resend.com/emails',{
    method:'POST',
    headers:{'Content-Type':'application/json','Authorization':`Bearer ${apiKey}`,'Idempotency-Key':idempotencyKey},
    body:JSON.stringify({from,to:[to],reply_to:SUPPORT_EMAIL,subject:`Atualização da encomenda ${reference} — ${title}`,html,text})
  });
  if(!response.ok) throw new Error(`Falha no serviço de email: ${response.status}`);
}

export default async function handler(req,res){
  if(req.method!=='GET') return json(res,405,{error:'Método não permitido.'});
  const secret=process.env.CRON_SECRET?.trim();
  if(secret && req.headers.authorization!==`Bearer ${secret}`) return json(res,401,{error:'Não autorizado.'});

  try{
    const stripe=getStripe();
    const today=dayKey();
    const since=Math.floor(Date.now()/1000)-(45*86400);
    const page=await stripe.checkout.sessions.list({limit:100,created:{gte:since}});
    const sessions=page.data.filter(s=>s.payment_status==='paid' && s.metadata?.store==='cavero');
    const result={checked:sessions.length,sent:0,skipped:0,failed:0};

    for(const session of sessions){
      try{
        if(!session.payment_intent){result.skipped++;continue;}
        const pi=await stripe.paymentIntents.retrieve(session.payment_intent);
        const meta=pi.metadata||{};
        const status=(meta.fulfillment_status||'pending').toLowerCase();
        if(['cancelled','canceled','refunded'].includes(status)){result.skipped++;continue;}
        if(meta.tracking_email_last_date===today){result.skipped++;continue;}
        if(status==='delivered' && meta.tracking_email_last_status==='delivered'){result.skipped++;continue;}
        const ageHours=(Date.now()/1000-session.created)/3600;
        if(ageHours<18 && status!=='delivered'){result.skipped++;continue;}
        const email=session.customer_details?.email||session.customer_email;
        if(!email){result.skipped++;continue;}

        await sendTrackingEmail({
          to:email,
          order:meta.order_reference||session.client_reference_id||session.id,
          status,
          carrier:meta.carrier||meta.shipping_carrier||'',
          trackingNumber:meta.tracking_number||'',
          trackingUrl:meta.tracking_url||'',
          idempotencyKey:`cavero-tracking-${pi.id}-${today}`
        });
        await stripe.paymentIntents.update(pi.id,{metadata:{...meta,tracking_email_last_date:today,tracking_email_last_status:status}});
        result.sent++;
      }catch(error){
        result.failed++;
        console.error('CAVERO tracking email:',session.id,error.message);
      }
    }
    return json(res,200,{ok:true,date:today,...result});
  }catch(error){
    console.error('CAVERO daily tracking job:',error.message);
    return json(res,500,{error:'Não foi possível executar o acompanhamento diário.'});
  }
}
