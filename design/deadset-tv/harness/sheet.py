import sys,os,glob
from PIL import Image,ImageDraw,ImageChops,ImageStat
d=sys.argv[1]; out=sys.argv[2]
fs=sorted(glob.glob(d+'/*-tv.png'))
keep=[];prev=None
for f in fs:
    im=Image.open(f).convert('RGB'); sm=im.resize((80,45))
    if prev is not None:
        diff=ImageStat.Stat(ImageChops.difference(sm,prev)).mean
        if sum(diff)/3<4: continue
    prev=sm; keep.append((f,im))
keep=keep[:24]
W,H=int(sys.argv[3]) if len(sys.argv)>3 else 520,0; H=int(W*9/16); cols=int(sys.argv[4]) if len(sys.argv)>4 else 4; rows=(len(keep)+cols-1)//cols
S=Image.new('RGB',(cols*W,rows*(H+18)),'#333'); dr=ImageDraw.Draw(S)
for k,(f,im) in enumerate(keep):
    x=(k%cols)*W; y=(k//cols)*(H+18)
    S.paste(im.resize((W-4,H-4)),(x+2,y+18)); dr.text((x+4,y+3),os.path.basename(f)[:40],fill='#ff0')
S.save(out,quality=82); print(out,len(fs),len(keep))
