const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
execFileSync(process.execPath,['scripts/run-seo-build.cjs'],{cwd:root});
const read=p=>fs.readFileSync(path.join(root,'dist',p),'utf8');
const routes=JSON.parse(read('seo-manifest.json'));
test('every route has one canonical, matching metadata, valid schema and a sitemap policy',()=>{
 const titles=new Set();const sitemap=read('sitemap.xml');
 for(const r of routes){
  const html=read(r.pathname==='/'?'index.html':r.pathname.slice(1)+'.html');
  assert.equal((html.match(/<title>/g)||[]).length,1,r.pathname);
  assert.equal((html.match(/rel="canonical"/g)||[]).length,1,r.pathname);
  assert.equal((html.match(/name="description"/g)||[]).length,1,r.pathname);
  assert(!titles.has(r.title),r.title);titles.add(r.title);
  const schema=JSON.parse(html.match(/id="cavero-structured-data">([\s\S]*?)<\/script>/)[1]);
  assert.deepEqual(schema,r.schema);
  assert.equal(sitemap.includes('<loc>https://cavero-three.vercel.app'+r.pathname+'</loc>'),!r.noindex);
 }
});
test('budget landing links select only real variants within the budget',()=>{
 const html=read('relogios-ate-100-euros.html');
 const links=[...html.matchAll(/class="seo-card" href="([^"?]+)\?variant=(\d+)"/g)];
 assert(links.length>0);
 for(const [,p,i] of links){
  const r=routes.find(r=>r.pathname===p);
  const variant=r.schema['@graph'].find(x=>x['@type']==='ProductGroup').hasVariant[Number(i)];
  assert(variant.offers.price<=100);assert.equal(variant.url,'https://cavero-three.vercel.app'+p+'?variant='+i);
 }
});
test('internal landing links resolve and content survives without JavaScript',()=>{
 for(const file of ['relogios-desportivos.html','relogios-ate-100-euros.html','guias/relogio-para-oferecer.html']){
  const html=read(file);assert.equal((html.match(/<h1>/g)||[]).length,1);assert(!html.includes('data-seo-boot'));
  for(const [,href] of html.matchAll(/href="(\/[^"?#]*)/g)){
   const p=href==='/'?'index.html':href.slice(1);
   assert(fs.existsSync(path.join(root,'dist',p))||fs.existsSync(path.join(root,'dist',p+'.html')),href);
  }
 }
});
test('utility routes can be crawled to see noindex and product variants omit unverified ratings',()=>{
 assert(!read('robots.txt').includes('Disallow: /pesquisar'));
 for(const r of routes.filter(r=>r.type==='product')){
  const g=r.schema['@graph'].find(x=>x['@type']==='ProductGroup');
  assert(!g.aggregateRating);assert(!g.review);
  for(const v of g.hasVariant){assert(v.brand);assert(v.description);assert.equal(v.offers.shippingDetails.shippingRate.value,0);}
 }
});
