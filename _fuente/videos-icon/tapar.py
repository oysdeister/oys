import subprocess,sys,json,os
# uso: tapar.py imagen x,y,w,h [x,y,w,h ...]  (sobrescribe la imagen)
img=sys.argv[1]; boxes=[b.split(',') for b in sys.argv[2:]]
vf=','.join(f'drawbox=x={x}:y={y}:w={w}:h={h}:color=0x30343a:t=fill' for x,y,w,h in boxes)
tmp=img+'.tmp.jpg'
subprocess.run(['ffmpeg','-v','error','-y','-i',img,'-vf',vf,'-q:v','3',tmp],check=True)
os.replace(tmp,img)
