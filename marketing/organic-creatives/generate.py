#!/usr/bin/env python3
"""Render CAVERO organic creatives using unchanged catalog photographs.

This tool creates offline marketing assets only. It never changes the storefront,
product images, prices, or checkout. No watch is illustrated or synthesized.
"""
from __future__ import annotations

import hashlib
import io
import json
import math
import os
import shutil
import subprocess
import sys
import time
import zipfile
from pathlib import Path

import requests
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps, ImageStat

ROOT = Path(__file__).resolve().parent
OUT = ROOT / "output"
SOURCE = OUT / "sources"
OUT.mkdir(exist_ok=True)
SOURCE.mkdir(exist_ok=True)

PRODUCTS = [
    {
        "key": "velocity", "name": "CAVERO Velocity", "short": "Velocity",
        "headline": ["O TEU TEMPO.", "O TEU ESTILO."],
        "subline": "Um cronógrafo com presença.",
        "photo": "https://static.wixstatic.com/media/eb5ec1_ad79dbda21cf4672b8c6211f6757e693~mv2.jpg",
        "fallback": "https://caverowatches.vercel.app/img-velocity.js",
        "background": "#111412", "ink": "#F4F0E7", "muted": "#B8B4AA", "accent": "#C8A96C",
    },
    {
        "key": "chronos", "name": "CAVERO Chronos Ice", "short": "Chronos Ice",
        "headline": ["O DETALHE QUE", "MUDA TUDO."],
        "subline": "Azul gelo. Presença marcante.",
        "photo": "https://static.wixstatic.com/media/eb5ec1_ec87cb0fa40841dc9fa4613af69c4bac~mv2.jpg",
        "fallback": "https://caverowatches.vercel.app/img-chronos.js",
        "background": "#14232B", "ink": "#F4F0E7", "muted": "#B8C6CB", "accent": "#C8A96C",
    },
    {
        "key": "prestige", "name": "CAVERO Prestige", "short": "Prestige",
        "headline": ["ELEGÂNCIA", "SEM ESFORÇO."],
        "subline": "Um clássico para todos os dias.",
        "photo": "https://static.wixstatic.com/media/eb5ec1_8c425e0abcef493e9bc6cba2615f759b~mv2.jpg",
        "fallback": "https://caverowatches.vercel.app/img-prestige.js",
        "background": "#EAE4D8", "ink": "#171714", "muted": "#6B675F", "accent": "#8A6A3F",
    },
]

SIZES = {"feed-4x5": (1080, 1350), "square-1x1": (1080, 1080), "vertical-9x16": (1080, 1920)}


def font(size, serif=False, bold=False):
    base = "DejaVuSerif" if serif else "DejaVuSans"
    if bold:
        base += "-Bold"
    paths = [f"/usr/share/fonts/truetype/dejavu/{base}.ttf",
             f"/usr/share/fonts/truetype/dejavu/{base}.ttf"]
    for path in paths:
        if Path(path).exists():
            return ImageFont.truetype(path, size)
    return ImageFont.truetype(base + ".ttf", size)


def tracked(draw, text, x, y, f, fill, spacing=0, anchor="la"):
    width = sum(f.getlength(c) for c in text) + max(0, len(text)-1)*spacing
    if anchor == "ma":
        x -= width/2
    elif anchor == "ra":
        x -= width
    for c in text:
        draw.text((round(x),round(y)),c,font=f,fill=fill,anchor="la")
        x += f.getlength(c)+spacing
    return width


def fit(text, maximum, size, serif=False, bold=False, spacing=0):
    while size > 17:
        f = font(size,serif,bold)
        if sum(f.getlength(c) for c in text)+(len(text)-1)*spacing <= maximum:
            return f
        size -= 1
    return font(size,serif,bold)


def fetch_photo(p):
    target = SOURCE / (p["key"]+".png")
    if target.exists():
        return Image.open(target).convert("RGB")
    session = requests.Session()
    session.headers["User-Agent"] = "CAVERO organic creative renderer/1.0"
    errors=[]
    for url in [p["photo"],p["fallback"]]:
        for attempt in range(2):
            try:
                response=session.get(url,timeout=35)
                response.raise_for_status()
                if url.endswith(".js"):
                    import base64,re
                    match=re.search(r"data:image/[^;]+;base64,([A-Za-z0-9+/=]+)",response.text)
                    if not match:
                        raise ValueError("No embedded catalog photograph found")
                    data=base64.b64decode(match.group(1))
                else:
                    data=response.content
                image=ImageOps.exif_transpose(Image.open(io.BytesIO(data))).convert("RGB")
                image.load()
                if min(image.size)<200:
                    raise ValueError("Photograph is too small")
                image.save(target)
                p["source_used"]=url
                p["source_sha256"]=hashlib.sha256(data).hexdigest()
                p["dimensions"]=list(image.size)
                print(f"SOURCE {p['name']}: {image.width}x{image.height} | {url}",flush=True)
                return image
            except Exception as exc:
                errors.append(f"{type(exc).__name__}: {exc}")
                time.sleep(1)
    raise RuntimeError(f"Cannot load real photograph for {p['name']}: {'; '.join(errors)}")


def photo_panel(canvas, photo, box, color, contain=True):
    """Preserve the photo, including all dial, logos, case and bracelet details."""
    x,y,w,h=map(int,box)
    bg=Image.new("RGB",(w,h),color)
    # A soft ambient backdrop is derived from the actual photo, not a new watch.
    ambient=ImageOps.fit(photo,(w,h),method=Image.Resampling.LANCZOS)
    ambient=ambient.filter(ImageFilter.GaussianBlur(65))
    bg=Image.blend(bg,ambient,.13)
    if contain:
        foreground=ImageOps.contain(photo,(w,h),method=Image.Resampling.LANCZOS)
        bg.paste(foreground,((w-foreground.width)//2,(h-foreground.height)//2))
    else:
        bg=ImageOps.fit(photo,(w,h),method=Image.Resampling.LANCZOS)
    canvas.paste(bg,(x,y))
    return (x,y,w,h)


def line(draw,x1,y1,x2,y2,color,width=1):
    draw.line((x1,y1,x2,y2),fill=color,width=width)


def logo(draw,y,p,scale=1):
    ink=p["ink"]; accent=p["accent"]
    f=font(round(33*scale),serif=True)
    tracked(draw,"CAVERO",540,y,f,ink,spacing=round(5.3*scale),anchor="ma")
    f=font(round(12*scale))
    tracked(draw,"W A T C H E S",540,y+round(53*scale),f,accent,anchor="ma")


def heading(draw,lines,y,p,max_width=940,size=73,line_gap=17,center=False):
    for text in lines:
        f=fit(text,max_width,size,serif=True,spacing=-.7)
        x=540 if center else 70
        tracked(draw,text,x,y,f,p["ink"],spacing=-.7,anchor="ma" if center else "la")
        y+=f.size+line_gap
    return y


def render(p,photo,format_name):
    w,h=SIZES[format_name]
    im=Image.new("RGB",(w,h),p["background"])
    d=ImageDraw.Draw(im)
    ink,muted,accent=p["ink"],p["muted"],p["accent"]
    if format_name=="feed-4x5":
        logo(d,66,p)
        line(d,70,178,1010,178,accent)
        tracked(d,"THE CAVERO COLLECTION",70,207,font(15,bold=True),accent,spacing=2)
        heading(d,p["headline"],265,p,size=67,line_gap=11)
        photo_panel(im,photo,(54,477,972,610),p["background"])
        d=ImageDraw.Draw(im)
        tracked(d,p["name"],70,1110,font(35,serif=True),ink)
        tracked(d,p["subline"],70,1170,fit(p["subline"],940,22),muted)
        line(d,70,1232,1010,1232,accent)
        tracked(d,"DESCOBRE A COLEÇÃO",70,1256,font(16,bold=True),accent,spacing=1.5)
        tracked(d,"OWN YOUR TIME",1010,1256,font(12),muted,spacing=1,anchor="ra")
    elif format_name=="square-1x1":
        logo(d,39,p,.85)
        line(d,70,138,1010,138,accent)
        heading(d,p["headline"],174,p,size=57,line_gap=7)
        photo_panel(im,photo,(54,353,972,525),p["background"])
        d=ImageDraw.Draw(im)
        tracked(d,p["name"],70,895,font(32,serif=True),ink)
        line(d,70,958,1010,958,accent)
        tracked(d,"DESCOBRE A COLEÇÃO",70,980,font(15,bold=True),accent,spacing=1)
        tracked(d,"OWN YOUR TIME",1010,980,font(12),muted,spacing=1,anchor="ra")
    else:
        # Safe text areas for Reels/Stories/TikTok; no important copy in bottom 180px.
        logo(d,115,p,1.1)
        line(d,70,236,1010,236,accent)
        tracked(d,"THE CAVERO COLLECTION",70,278,font(17,bold=True),accent,spacing=2)
        heading(d,p["headline"],343,p,size=75,line_gap=18)
        photo_panel(im,photo,(30,624,1020,930),p["background"])
        d=ImageDraw.Draw(im)
        tracked(d,p["name"],70,1577,font(46,serif=True),ink)
        tracked(d,p["subline"],70,1651,fit(p["subline"],940,25),muted)
        line(d,70,1710,1010,1710,accent)
        tracked(d,"DESCOBRE A COLEÇÃO",70,1741,font(20,bold=True),accent,spacing=1)
        tracked(d,"LINK NA BIO",70,1791,font(14),muted,spacing=1)
    path=OUT/(f"cavero-{p['key']}-{format_name}.png")
    im.save(path,optimize=True)
    return path


def make_video(images):
    """Create a silent 12-second product slideshow if ffmpeg is installed."""
    if not shutil.which("ffmpeg"):
        return None
    frames=OUT/"video-frames";frames.mkdir(exist_ok=True)
    # Three real-product stills, with a subtle zoom. No invented watch movement.
    fps=24
    for i in range(3*4*fps):
        index=i//(4*fps); position=i%(4*fps)
        src=images[index]
        scale=1+.035*(position/(4*fps-1))
        nw,nh=round(src.width*scale),round(src.height*scale)
        frame=src.resize((nw,nh),Image.Resampling.LANCZOS)
        left=(nw-1080)//2;top=(nh-1920)//2
        frame=frame.crop((left,top,left+1080,top+1920))
        frame.save(frames/f"{i:04d}.jpg",quality=91)
    target=OUT/"cavero-organic-12s.mp4"
    subprocess.run(["ffmpeg","-y","-loglevel","error","-framerate",str(fps),"-i",str(frames/"%04d.jpg"),"-c:v","libx264","-pix_fmt","yuv420p","-r",str(fps),"-crf","22","-movflags","+faststart",str(target)],check=True)
    shutil.rmtree(frames)
    return target


def main():
    outputs=[];video_frames=[]
    for p in PRODUCTS:
        photo=fetch_photo(p)
        for format_name in SIZES:
            path=render(p,photo,format_name)
            outputs.append(path)
            if format_name=="vertical-9x16":
                video_frames.append(Image.open(path).convert("RGB"))
    video=make_video(video_frames)
    if video:outputs.append(video)
    manifest={"collection":"CAVERO Watches", "source":"rduarte1512/cavero", "products":PRODUCTS,"formats":SIZES,"files":[x.name for x in outputs],"note":"Real catalog photography; product appearance not synthesized or changed. Prices and testimonials intentionally omitted."}
    (OUT/"manifest.json").write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding="utf-8")
    (OUT/"README.txt").write_text("CAVERO — CRIATIVOS ORGÂNICOS\n\nFotografias originais do catálogo. Nenhum relógio inventado.\nFeed Instagram/Facebook: 1080x1350. Quadrado: 1080x1080.\nTikTok/Reels/Stories: 1080x1920. Vídeo vertical: 12 segundos, sem áudio.\nNão contém preços, avaliações, descontos ou promessas não verificadas.\nPublicar com a ligação real da loja na bio.\n",encoding="utf-8")
    package=OUT/"cavero-organic-real-products.zip"
    with zipfile.ZipFile(package,"w",zipfile.ZIP_DEFLATED) as z:
        for path in outputs+[OUT/"manifest.json",OUT/"README.txt"]:
            z.write(path,path.name)
    print("Generated:", ", ".join(x.name for x in outputs),flush=True)
    print("PACKAGE:",package.name,flush=True)

if __name__=="__main__":
    main()
