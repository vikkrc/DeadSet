import sys,glob,os
from PIL import Image, ImageDraw
def dhash(im,s=12):
    g=im.convert('L').resize((s+1,s)); p=list(g.getdata())
    return tuple(p[r*(s+1)+c]>p[r*(s+1)+c+1] for r in range(s) for c in range(s))
def ham(a,b): return sum(x!=y for x,y in zip(a,b))
def sheet(mode,kind,tags=('lobby','a','b','final'),w=None,cols=None,limit=60,thr=8,maxh=844):
    fs=sorted(f for f in glob.glob(f'./shots/{mode}/*-{kind}.png') if f.split('-')[-2] in tags)
    keep=[];hs=[]
    for f in fs:
        im=Image.open(f); im=im.crop((0,0,im.width,min(im.height,maxh)))
        h=dhash(im)
        if any(ham(h,x)<thr for x in hs): continue
        hs.append(h); keep.append((f,im))
    keep=keep[:limit]
    w=w or (195 if kind=='phone' else 400); cols=cols or (8 if kind=='phone' else 4)
    th=[(f,im.resize((w,int(im.height*w/im.width)))) for f,im in keep]
    rh=max(t.height for _,t in th)+16
    rows=(len(th)+cols-1)//cols
    S=Image.new('RGB',(cols*(w+6),rows*rh),'#444');d=ImageDraw.Draw(S)
    for i,(f,t) in enumerate(th):
        x=(i%cols)*(w+6);y=(i//cols)*rh;S.paste(t,(x,y+14));d.text((x+2,y+1),os.path.basename(f)[:30],fill='#ff0')
    out=f'./sheets/{mode}-{kind}.png';os.makedirs(os.path.dirname(out),exist_ok=True);S.save(out);print(out,len(keep),S.size)
for m in sys.argv[1:]:
    sheet(m,'phone');sheet(m,'tv')
