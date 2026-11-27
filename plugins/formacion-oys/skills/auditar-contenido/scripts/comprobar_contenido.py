#!/usr/bin/env python3
"""Comprobaciones automáticas del contenido de la plataforma (solo lectura).

Uso (desde la raíz del repo):
  python3 -I plugins/formacion-oys/skills/auditar-contenido/scripts/comprobar_contenido.py [--contenido app/src/content] [--ids-contra <ref-git>]

Qué hace:
  1. JSON válido y recuento de bloques.
  2. Pasos sin «detalle»; partes con pasos y sin «ruta»; bloques con menos de 2 «problemas».
  3. Rutas escritas con «>» en vez de «›» en pasos y rutas.
  4. Frases vetadas («Según la documentación», «cabe destacar»...) y texto interno
     («No sabemos», «no está comprobado», «no lo hemos conseguido»).
  5. Cuentas: operaciones «a ± b = c» que no cuadran (importes con coma decimal).
  6. Con --ids-contra <ref>: ids de módulo/bloque/parte presentes en <ref> y perdidos hoy.
No escribe nada: el resultado se vuelca a auditoria/<informe>.md a mano, tras revisarlo.
"""
import argparse, json, re, subprocess, sys
from pathlib import Path

VETADAS = ["según la documentación", "cabe destacar", "es importante señalar", "versión anterior", "erp antiguo"]
INTERNAS = ["no sabemos", "no está comprobado", "no esta comprobado", "no lo hemos conseguido", "no está claro si"]
NUM = r"-?\d{1,3}(?:\.\d{3})*(?:,\d+)?|-?\d+(?:,\d+)?"


def num(s):
    return float(s.replace(".", "").replace(",", "."))


def textos(o, ruta=""):
    """Recorre el JSON y devuelve (ruta, texto) de cada cadena."""
    if isinstance(o, str):
        yield ruta, o
    elif isinstance(o, dict):
        for k, v in o.items():
            yield from textos(v, f"{ruta}/{k}")
    elif isinstance(o, list):
        for i, v in enumerate(o):
            yield from textos(v, f"{ruta}[{i}]")


def ids_de(o):
    out = set()
    if isinstance(o, dict):
        if isinstance(o.get("id"), str):
            out.add(o["id"])
        for v in o.values():
            out |= ids_de(v)
    elif isinstance(o, list):
        for v in o:
            out |= ids_de(v)
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--contenido", default="app/src/content")
    ap.add_argument("--ids-contra", default=None, help="ref de git con la versión anterior")
    a = ap.parse_args()
    base = Path(a.contenido)
    ficheros = sorted(p for p in base.glob("*.json"))
    n_bloques = 0
    for f in ficheros:
        try:
            d = json.loads(f.read_text())
        except Exception as e:
            print(f"[JSON] {f.name}: NO carga ({e})")
            continue
        for e in d.get("ejercicios", []):
            n_bloques += 1
            bid = e["id"]
            sin_detalle = sum(1 for s in e["secciones"] for p in s["pasos"] if not p.get("detalle"))
            total = sum(len(s["pasos"]) for s in e["secciones"])
            if sin_detalle:
                print(f"[DETALLE] {bid}: {sin_detalle}/{total} pasos sin detalle")
            for s in e["secciones"]:
                if s["pasos"] and not s.get("ruta"):
                    print(f"[RUTA] {s['id']}: parte con pasos y sin ruta")
            if total and len(e.get("problemas", [])) < 2:
                print(f"[PROBLEMAS] {bid}: {len(e.get('problemas', []))} (mínimo 2 si trabaja en el ERP)")
            if not e.get("aprendido"):
                print(f"[APRENDIDO] {bid}: vacío")
            titulo = e["titulo"]
            if ":" in titulo or "(" in titulo or re.search(r"[A-Za-z]+_[a-z]+", titulo):
                print(f"[TITULO] {bid}: «{titulo}» (con dos puntos, paréntesis o código)")
        for r, t in textos(d):
            low = t.lower()
            for v in VETADAS:
                if v in low:
                    print(f"[VETADA] {f.name}{r}: «{v}»")
            for v in INTERNAS:
                if v in low:
                    print(f"[INTERNO] {f.name}{r}: «{v}»")
            if re.search(r"(Gestión|Finanzas|Contabilidad|Terceros|Maestros) > ", t):
                print(f"[FLECHA] {f.name}{r}: ruta con «>» en vez de «›»")
            for m in re.finditer(rf"((?:{NUM})(?:\s*[×x*]\s*(?:{NUM}))?(?:\s*[+−-]\s*(?:{NUM})(?:\s*%)?)+)\s*=\s*({NUM})", t):
                expr, res = m.group(1), m.group(2)
                try:
                    e2 = expr.replace("−", "-").replace("×", "*").replace(" x ", "*")
                    e2 = re.sub(r"(\d{1,3}(?:\.\d{3})+)", lambda k: k.group(1).replace(".", ""), e2).replace(",", ".")
                    if "%" in e2:
                        continue
                    val = eval(e2, {"__builtins__": {}})  # solo aritmética del propio JSON
                    if abs(val - num(res)) > 0.011:
                        print(f"[CUENTA] {f.name}{r}: «{expr} = {res}» da {val:.2f}")
                except Exception:
                    pass
    print(f"\n{len(ficheros)} ficheros, {n_bloques} bloques revisados.")
    if a.ids_contra:
        perdidos = set()
        for f in ficheros:
            ref = subprocess.run(["git", "show", f"{a.ids_contra}:{f.as_posix()}"], capture_output=True, text=True)
            if ref.returncode == 0:
                antes = ids_de(json.loads(ref.stdout))
                hoy = ids_de(json.loads(f.read_text()))
                perdidos |= {(f.name, i) for i in antes - hoy}
        # un id puede haber cambiado de fichero: no es pérdida si existe en otro
        todos = set()
        for f in ficheros:
            todos |= ids_de(json.loads(f.read_text()))
        reales = sorted(i for _, i in perdidos if i not in todos)
        print(f"Ids perdidos respecto a {a.ids_contra}: {len(reales)}")
        for i in reales:
            print("  PERDIDO:", i)
        sys.exit(1 if reales else 0)


if __name__ == "__main__":
    main()
