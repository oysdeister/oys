import re, os
# Uso: PREVIA_TRABAJO=<carpeta con fuentes/examen-*.app.js> python3 app/scripts/previa/bancos.py
F=os.path.join(os.environ.get('PREVIA_TRABAJO', os.path.abspath('previa-trabajo')), 'fuentes')
APP=os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'src', 'content', 'previa'))
for g in ['contabilidad','erp']:
    js=open(f'{F}/examen-{g}.app.js',encoding='utf-8').read()
    bloques=re.search(r'var BLOQUES=(\{.*?\});',js).group(1)
    bank=re.search(r'var BANK=\[\n(.*?)\n\];',js,re.S).group(1)
    gen=re.search(r'(var CLASIF=\[.*?\n\}\n)\n/\* ---------- estado',js,re.S).group(1)
    open(f'{F}/../previa/gen-{g}.js','w').write(gen)
    out=f"""/* Banco de preguntas del examen de la guía «{g}» (formación previa). Copia literal del examen original:
   b = bloque, q = pregunta, o = opciones, a = índice de la correcta en o, e = explicación. */
import type {{ PreguntaPrevia }} from './examen-comun';

export const BLOQUES: Record<string, string> = {bloques};

export const BANK: PreguntaPrevia[] = [
{bank}
];
"""
    open(f'{APP}/examen-{g}-banco.ts','w',encoding='utf-8').write(out)
    print(g, bank.count('\n')+1)
