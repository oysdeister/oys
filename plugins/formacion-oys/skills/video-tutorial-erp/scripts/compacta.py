import json,sys
d=json.load(open(sys.argv[1])); out=open(sys.argv[2],'w')
buf=[];start=None
for s in d['transcription']:
    t=s['timestamps']['from'][:8]; 
    if start is None: start=t
    buf.append(s['text'].strip())
    if sum(len(x) for x in buf)>220:
        out.write(f"[{start}] {' '.join(buf)}\n"); buf=[];start=None
if buf: out.write(f"[{start}] {' '.join(buf)}\n")
