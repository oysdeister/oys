import os
#!/usr/bin/env python3
import json, os
D = os.path.dirname(__file__)
BASE = os.environ.get("PROYECTO", os.getcwd())  # carpeta base del proyecto
sc = json.load(open(D + "/scenes_built.json"))["scenes"]
TR = 0.8
V = {"../media/src/d5fa69379c7249d39e647c155c18476e.mp4": "v1", "../media/src/892906aeff8347e98a952208dbb5682b.mp4": "v2"}


def hms(s):
    s = float(s); h = int(s // 3600); m = int(s % 3600 // 60); r = s % 60
    return (f"{h}:{m:02d}:{r:04.1f}" if h else f"{m}:{r:04.1f}").replace(".0", "")


def rect(r):
    return f"{r['x']},{r['y']},{r['w']},{r['h']}"


def mmss(sec):
    return f"{int(sec//60)} min {int(round(sec%60)):02d} s"


def ve(e):
    t = e["tipo"]
    if t == "pantalla":
        c = e["clip"]; v = V[c["src"]]
        out = [f"Clip **{v}** {hms(c['inicio'])}–{hms(c['fin'])} ({c['inicio']}–{c['fin']} s, {c['fin']-c['inicio']:.1f} s"
               + (f", velocidad ×{e['velocidad']}" if e.get("velocidad") else "") + f"); recorte `{rect(e['recorte'])}` sobre 1680×1048; panel 3D «{e.get('titulo','')}»."]
        for z in e.get("zooms", []):
            out.append(f"Zoom {'a `' + rect(z['rect']) + '`' if 'rect' in z else 'de vuelta al plano general'}" + (f" al decir «{z['clave']}»" if z.get("clave") else (f" en t={z['t']} s" if "t" in z else "")))
        for i, c2 in enumerate(e.get("callouts", []), 1):
            cuando = f"«{c2['clave']}»" if c2.get("clave") else f"t={c2.get('t')} s"
            out.append(f"Callout {i}: «{c2['texto']}» → `{rect(c2['rect'])}` ({cuando})")
        for f in e.get("foco", []):
            out.append(f"Foco en ({f['x']},{f['y']}) al decir «{f.get('clave')}»")
        return out
    if t in ("conceptos",):
        return [f"Tarjetas: " + " · ".join(i["titulo"] + (f" ({i['texto']})" if i.get("texto") else "") for i in e["items"])]
    if t == "flujo":
        return ["Flujo 3D: " + " → ".join(n["titulo"] + (f" [{n['codigo']}]" if n.get("codigo") else "") + (f" {n['importe']:,} {n.get('divisa','€')}".replace(",", ".") if "importe" in n else "") for n in e["nodos"])]
    if t == "estructura":
        r = e["raiz"]
        return [f"Árbol: {r['titulo']} → " + "; ".join(b["titulo"] + ": " + ", ".join(h["titulo"] + (f" ({h['detalle']})" if h.get("detalle") else "") for h in b.get("hijos", [])) for b in e["ramas"])]
    if t == "comparativa":
        et = e.get("etiquetas", {})
        return [f"Comparativa «{et.get('antes','Antes')}» / «{et.get('ahora','Ahora')}»: " + "; ".join(f"{f.get('aspecto','')}: {f['antes']} | {f['ahora']}" for f in e["filas"])]
    if t == "calculo":
        return [f"Contadores: {e['base']['etiqueta']} {e['base']['valor']:,} € → ".replace(",", ".") + " → ".join(p["etiqueta"] for p in e["pasos"]) + f" → {e.get('resultado','')}"]
    if t == "resumen":
        return ["Checklist: " + " · ".join(i["texto"] for i in e["items"])]
    if t in ("tip", "cuidado"):
        return [f"Tarjeta {'SIN PANTALLA' if e.get('_sinpantalla') else t}: «{e.get('titulo','')}» — {e['texto']}"]
    if t in ("portada", "capitulo", "cierre"):
        return [f"{t.capitalize()}: «{e['titulo']}»" + (f" — {e['subtitulo']}" if e.get("subtitulo") else "") + (f"; siguientes: {', '.join(e['siguientes'])}" if e.get("siguientes") else "")]
    return []


caps = []; cur = {"titulo": "Apertura", "numero": 0, "esc": []}
for e in sc:
    if e["tipo"] == "capitulo":
        caps.append(cur); cur = {"titulo": e["titulo"], "numero": e["numero"], "esc": [e]}
    else:
        cur["esc"].append(e)
caps.append(cur)
for c in caps:
    c["dur"] = sum(e["_est"] for e in c["esc"]) - TR * len(c["esc"])
    c["clips"] = sum(1 for e in c["esc"] if e["tipo"] == "pantalla")
total = sum(e["_est"] for e in sc) - TR * (len(sc) - 1)
nclips = sum(1 for e in sc if e["tipo"] == "pantalla")

L = []
A = L.append
A("# Guion fusionado · «Compras en el ERP: de la tarifa a la factura»\n")
A("Vídeo-tutorial NUEVO que fusiona y reordena las dos grabaciones Loom de la versión antigua del ERP (Deister, entorno «O&S Learning (Test)», diciembre de 2015):\n")
A("- **v1** «Gestión de compras: pedidos, albaranes y facturas» (14 min) — `media/src/d5fa69379c7249d39e647c155c18476e.mp4`")
A("- **v2** «Tarifas y documentos de compra en el sistema» (1 h 46 min, continuación de v1) — `media/src/892906aeff8347e98a952208dbb5682b.mp4`\n")
A(f"Voz: `es-ES-XimenaNeural` (castellano de España, tuteo). **{len(sc)} escenas, {nclips} clips de pantalla, 9 capítulos, duración estimada ≈ {total/60:.0f} min** "
  f"(estimación a 2,45 palabras/s, la velocidad medida de Ximena en la demo, más entrada 0,6 s + colchón 1,3 s por escena y 0,8 s de solape por transición). "
  "El JSON del motor está en `video/src/data/guion.json` (el ejemplo anterior se guardó como `guion.ejemplo.json`).\n")
A("## Cómo leer este guion\n")
A("- **Qué se hace**: el paso de negocio, redactado sin depender de la pantalla antigua. Es lo que la sesión de la versión nueva debe volver a grabar.")
A("- **SIN PANTALLA**: el paso existe en el procedimiento, pero no aparece en los vídeos de origen. En el vídeo antiguo se dice así, sin inventarlo; en la versión nueva **hay que grabarlo**.")
A("- **Qué se ve**: escena del motor. En las de `pantalla`: vídeo de origen, tramo (h:mm:ss y segundos), recorte `x,y,w,h` sobre 1680×1048, zooms y callouts. El motor numera solo los callouts de cada escena (1, 2, 3…) y el `etiqueta` de la escena da el paso global («Crear el pedido · paso 3 de 7»).")
A("- Todos los tramos y recortes se comprobaron sobre fotogramas reales (ver «Verificación»). Las anotaciones están en `kb/verif/clips/<id>_{a,b,c}.jpg` (inicio, mitad y final de cada clip, con el recorte y los callouts dibujados).\n")

A("## Índice de capítulos\n")
A("| Cap. | Título | Escenas | Clips | Duración estimada |")
A("|---|---|---|---|---|")
for c in caps:
    A(f"| {c['numero'] or '—'} | {c['titulo']} | {len(c['esc'])} | {c['clips']} | {mmss(c['dur'])} |")
A(f"| | **Total** | **{len(sc)}** | **{nclips}** | **{mmss(total)}** |\n")

A("## Procedimientos paso a paso (resumen para la versión nueva)\n")
procs = {}
for e in sc:
    et = e.get("etiqueta", "")
    if (("·" in et and e["tipo"] != "portada") or e.get("_sinpantalla")):
        key = et.split("·")[0].strip() if "·" in et else ("Sin pantalla" if e.get("_sinpantalla") else et)
        procs.setdefault(key, []).append(e)
for k, es in procs.items():
    A(f"**{k}**")
    for e in es:
        tag = "SIN PANTALLA" if e.get("_sinpantalla") else (V[e['clip']['src']] + " " + hms(e['clip']['inicio']) if e["tipo"] == "pantalla" else e["tipo"])
        A(f"- {e.get('titulo','')} — {e.get('_hace','')} *({tag}; `{e['id']}`)*")
    A("")

n = 0
for c in caps:
    A(f"## {'Capítulo ' + str(c['numero']) + ' · ' if c['numero'] else ''}{c['titulo']}  (≈ {mmss(c['dur'])})\n")
    for e in c["esc"]:
        n += 1
        titulo = e.get("titulo", "")
        et = f" — *{e['etiqueta']}*" if e.get("etiqueta") else ""
        A(f"### {n}. `{e['id']}` · {e['tipo']}{' · SIN PANTALLA' if e.get('_sinpantalla') else ''} · {titulo}{et}  (≈ {e['_est']:.0f} s)\n")
        if e.get("_hace"):
            A(f"**Qué se hace:** {e['_hace']}\n")
        A(f"**Narración:** {e.get('narracion','')}\n")
        vv = ve(e)
        if vv:
            A("**Qué se ve:**")
            for x in vv:
                A(f"- {x}")
            A("")
        if e.get("_nota"):
            A(f"> **Nota de revisión:** {e['_nota']}\n")

A(open(D + "/verificacion.md").read())
open(BASE + "/kb/guion_fusionado.md", "w").write("\n".join(L) + "\n")
print("md escrito", len(L), "líneas;", "total", round(total / 60, 1), "min")
for c in caps:
    print(c["numero"], c["titulo"], len(c["esc"]), c["clips"], mmss(c["dur"]))
