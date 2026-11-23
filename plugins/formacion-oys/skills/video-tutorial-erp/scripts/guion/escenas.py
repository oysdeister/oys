# -*- coding: utf-8 -*-
"""Escenas del tutorial fusionado (fuente única para guion.json y guion_fusionado.md).

Campos con «_» son solo para el documento legible:
  _hace  : qué se hace (independiente de la pantalla, para rehacerlo en la versión nueva)
  _nota  : aviso de revisión / corrección
  _vs    : en callouts/zooms/foco, segundo del VÍDEO de origen (se convierte a «t» de escena)
"""
V1 = "../media/src/d5fa69379c7249d39e647c155c18476e.mp4"
V2 = "../media/src/892906aeff8347e98a952208dbb5682b.mp4"

R = {"x": 0, "y": 88, "w": 1680, "h": 918}        # ventana del ERP sin barra de Chrome ni de Windows
RM = {"x": 0, "y": 115, "w": 1080, "h": 640}      # escritorio: árbol de menú
RMOD = {"x": 110, "y": 150, "w": 1460, "h": 820}  # ventanas emergentes (lookups, series)

def clip(v, a, b):
    return {"src": v, "inicio": a, "fin": b}

E = []
def add(**k):
    E.append(k)

# ───────────────────────────── PORTADA ─────────────────────────────
add(id="portada", tipo="portada", etiqueta="Tutorial · Módulo de Compras",
    titulo="Compras en el ERP",
    subtitulo="Tarifas, pedidos, albaranes y facturas",
    narracion="¡Hola! Soy Ximena y te acompaño en este tutorial de compras. Vamos a recorrer, con calma y con un ejemplo real, todo el camino de una compra: desde el precio de la tarifa hasta el asiento de la factura.")

add(id="mapa", tipo="conceptos", titulo="Qué vas a aprender", subtitulo="Ocho capítulos, un mismo ejemplo",
    disposicion="rejilla",
    items=[
        {"titulo": "Tarifas", "texto": "De dónde sale el precio", "icono": "tarifa", "clave": "tarifas"},
        {"titulo": "Tipos y series", "texto": "Cómo se numeran los documentos", "icono": "engranaje", "clave": "tipos"},
        {"titulo": "El pedido", "texto": "Crearlo, valorarlo y validarlo", "icono": "pedido", "clave": "pedido"},
        {"titulo": "Albarán y factura", "texto": "Recibir, conformar y contabilizar", "icono": "factura", "clave": "albarán"},
    ],
    narracion="Primero verás las tarifas, porque de ellas sale el precio. Después, los tipos de documento y sus series de numeración. Luego crearemos y validaremos un pedido. Y para terminar, el albarán y la factura, hasta los asientos contables.",
    _hace="Presentar el índice del tutorial.")

add(id="ejemplo", tipo="conceptos", titulo="El ejemplo que seguiremos", subtitulo="Datos de un entorno de formación",
    disposicion="lista",
    items=[
        {"titulo": "Proveedor P00001 · SEAT", "icono": "proveedor", "clave": "SEAT"},
        {"titulo": "Artículos COCHE A6 y COCHE A4", "icono": "stock", "clave": "coches"},
        {"titulo": "Empresa 01 · Delegación D01 · Almacén D01", "icono": "capas", "clave": "empresa"},
    ],
    narracion="Usaremos los datos de un entorno de formación de una versión anterior del ERP. Compraremos al proveedor SEAT dos modelos de coches, el A6 y el A4, para la empresa 01, delegación y almacén D cero uno. Los nombres son de prueba; lo que cuenta es el circuito.",
    _hace="Fijar los datos de ejemplo: un proveedor con tarifa, dos artículos (uno en la tarifa y otro no), una empresa con su delegación y almacén.",
    _nota="Los datos son de demo y alguno es poco realista (ver capítulo 2).")

# ───────────────────────────── CAP 1 ─────────────────────────────
add(id="cap1", tipo="capitulo", numero=1, titulo="El ciclo de compra", subtitulo="Pedido, albarán y factura",
    narracion="Capítulo uno: el ciclo de compra.")

add(id="ciclo", tipo="flujo", titulo="Tres documentos, un mismo circuito",
    nodos=[
        {"id": "ped", "titulo": "Pedido", "subtitulo": "Lo que encargas", "icono": "pedido", "clave": "pedido", "codigo": "151201PC000003", "importe": 10000},
        {"id": "alb", "titulo": "Albarán", "subtitulo": "Lo que recibes", "icono": "albaran", "clave": "albarán", "codigo": "201501RC-000002", "importe": 9000},
        {"id": "fac", "titulo": "Factura", "subtitulo": "Lo que pagas", "icono": "factura", "clave": "factura", "codigo": "FACT-1", "importe": 10890},
    ],
    enlaces=[{"de": "ped", "a": "alb", "texto": "recepción"}, {"de": "alb", "a": "fac", "texto": "conformar"}],
    narracion="El ciclo básico tiene tres documentos. En el pedido dices qué quieres comprar y a qué proveedor. El albarán le cuenta al sistema que la mercancía ha llegado. Y la factura recoge tu compromiso de pago. ¿Ves que los importes no coinciden? Llegaron menos coches de los pedidos y la factura lleva IVA. Lo entenderás paso a paso.",
    _hace="Explicar el ciclo Pedido → Albarán → Factura y qué representa cada documento.",
    _nota="Importes reales del ejemplo: pedido 10.000 (sin IVA), albarán 9.000 (3 de 4 COCHE A4), factura 10.890 (9.000 + 21 % IVA).")

add(id="antes", tipo="estructura", titulo="Antes del primer pedido",
    raiz={"titulo": "Lo que debe existir", "icono": "check", "clave": "existir"},
    ramas=[
        {"titulo": "Maestros", "icono": "capas", "clave": "maestros", "hijos": [
            {"titulo": "Artículo", "clave": "artículo"},
            {"titulo": "Proveedor", "clave": "proveedor"},
            {"titulo": "Tarifa de compra", "clave": "tarifa"}]},
        {"titulo": "Parametrización", "icono": "engranaje", "clave": "parametrización", "hijos": [
            {"titulo": "Tipo de documento", "clave": "tipo"},
            {"titulo": "Serie de numeración", "clave": "serie"},
            {"titulo": "Workflow", "clave": "workflow"}]},
    ],
    narracion="Para que todo esto funcione tiene que existir algo antes. En los maestros: el artículo, el proveedor y su tarifa de compra. Y en la parametrización: el tipo de documento, su serie de numeración y, si lo hay, el workflow de aprobación.",
    _hace="Repasar los requisitos previos: maestros (artículo, proveedor, tarifa) y parametrización (tipo de documento, serie, workflow).")

add(id="menu-compras", tipo="pantalla", titulo="El módulo de Compras", url="erp/desktop · Compras",
    clip=clip(V1, 136, 139.5), recorte=RM,
    zooms=[{"clave": "carpeta", "rect": {"x": 0, "y": 260, "w": 420, "h": 360}, "dur": 1.6}],
    callouts=[
        {"clave": "compras", "rect": {"x": 20, "y": 274, "w": 340, "h": 24}, "texto": "Compras", "lado": "derecha"},
        {"clave": "carpeta", "rect": {"x": 20, "y": 300, "w": 300, "h": 242}, "texto": "Una carpeta por documento", "lado": "derecha"},
        {"clave": "maestros", "rect": {"x": 20, "y": 542, "w": 300, "h": 66}, "texto": "Maestros: Tarifas y Documentos", "lado": "derecha"},
    ],
    narracion="Todo el circuito vive en el módulo de Compras. Cada documento tiene su carpeta: concursos, ofertas, pedidos, albaranes, facturas… Y en maestros encontrarás las tarifas y los tipos de documento.",
    _hace="Abrir el módulo Compras y localizar sus carpetas y Maestros › Tarifas / Documentos.")

add(id="repaso-cap1", tipo="resumen", etiqueta="Capítulo 1",
    items=[
        {"texto": "Pedido: qué compras y a quién", "clave": "pedido"},
        {"texto": "Albarán: lo que ha llegado", "clave": "albarán"},
        {"texto": "Factura: lo que debes pagar", "clave": "factura"},
        {"texto": "Antes: maestros y parametrización", "clave": "antes"},
    ],
    narracion="En resumen: el pedido dice qué compras y a quién, el albarán registra lo que ha llegado y la factura lo que debes pagar. Y antes de empezar, maestros y parametrización.")

# ───────────────────────────── CAP 2 ─────────────────────────────
add(id="cap2", tipo="capitulo", numero=2, titulo="Tarifas", subtitulo="Cabecera, líneas, descuentos y escalados",
    narracion="Capítulo dos: las tarifas.")

add(id="tarifa-concepto", tipo="conceptos", titulo="¿Qué es una tarifa?", subtitulo="Un concepto aparte del artículo",
    items=[
        {"titulo": "Se define sola", "texto": "Código y condiciones; luego, sus artículos", "icono": "tarifa", "clave": "sola"},
        {"titulo": "Un artículo, varias tarifas", "texto": "De compra, de venta…", "icono": "capas", "clave": "varias"},
        {"titulo": "Precios o descuentos", "texto": "Dos clases de tarifa", "icono": "euro", "clave": "precios"},
        {"titulo": "Con vigencia", "texto": "Fechas de inicio y fin", "icono": "calendario", "clave": "fechas"},
    ],
    narracion="Una tarifa es un concepto aparte: se define sola, con su código y sus condiciones, y después se le cuelgan los artículos. No vas del artículo a la tarifa, sino al revés. Un mismo artículo puede estar en varias tarifas, de compra o de venta. Las hay de precios y de descuentos. Y todas tienen fechas de validez.",
    _hace="Explicar que la tarifa se crea de forma independiente y se le asocian artículos; tipos (precios / descuentos); vigencia.")

add(id="articulo-sin-precio", tipo="pantalla", titulo="La ficha del artículo", url="Maestro de artículos",
    clip=clip(V1, 424, 431.5), recorte=R,
    zooms=[{"clave": "unidad", "rect": {"x": 0, "y": 230, "w": 1680, "h": 320}, "dur": 1.5},
           {"clave": "abajo"}],
    callouts=[
        {"clave": "código", "rect": {"x": 4, "y": 290, "w": 860, "h": 24}, "texto": "Artículo COCHE A3", "lado": "abajo"},
        {"clave": "unidad base", "rect": {"x": 866, "y": 290, "w": 100, "h": 24}, "texto": "Unidad base UNI", "lado": "abajo"},
        {"clave": "unidades de", "rect": {"x": 836, "y": 436, "w": 830, "h": 92}, "texto": "Unidades de precios, compras…", "lado": "izquierda"},
        {"clave": "abajo", "rect": {"x": 0, "y": 734, "w": 1680, "h": 74}, "texto": "Proveedores habituales", "lado": "arriba"},
    ],
    narracion="Fíjate en la ficha de un artículo. Tiene su código, su unidad base y las unidades de precios o de compras. Lo que no tiene es un precio de compra: el precio no vive en el artículo, vive en la tarifa. Más abajo, eso sí, aparecen sus proveedores.",
    _hace="Abrir un artículo y comprobar que no tiene campo de tarifa ni precio de compra; sí unidades y proveedores.",
    _nota="Clip cortado antes de 435 s, cuando se despliega el menú «Características» sobre la ficha.")

add(id="menu-tarifas", tipo="pantalla", titulo="Dónde están las tarifas", url="erp/desktop · Compras › Maestros › Tarifas",
    clip=clip(V1, 501, 512), recorte=RM,
    zooms=[{"clave": "tres", "rect": {"x": 0, "y": 330, "w": 420, "h": 300}, "dur": 1.5}],
    callouts=[
        {"clave": "condiciones", "rect": {"x": 70, "y": 370, "w": 240, "h": 22}, "texto": "Condiciones tarifados"},
        {"clave": "precios", "rect": {"x": 70, "y": 392, "w": 220, "h": 88}, "texto": "Precios › Registro", "lado": "derecha"},
        {"clave": "descuentos", "rect": {"x": 70, "y": 480, "w": 200, "h": 22}, "texto": "Descuentos"},
    ],
    foco=[{"clave": "registro", "x": 140, "y": 425}],
    narracion="Las tarifas de compra están en Compras, maestros, tarifas. Verás tres entradas: condiciones de tarifado, precios y descuentos. Para mantener precios entra en precios y después en registro.",
    _hace="Navegar a Compras › Maestros › Tarifas › Precios › Registro.")

add(id="anatomia", tipo="estructura", titulo="Anatomía de una tarifa de compra",
    raiz={"titulo": "Tarifa de compra", "subtitulo": "COMPRA · G00003", "icono": "tarifa", "clave": "tarifa"},
    ramas=[
        {"titulo": "Cabecera", "icono": "cabecera", "clave": "cabecera", "hijos": [
            {"titulo": "Código y divisa", "detalle": "EUR", "clave": "código"},
            {"titulo": "Fechas de validez", "detalle": "inicio → fin", "clave": "validez"},
            {"titulo": "Prioridad y días", "detalle": "lunes a domingo", "clave": "prioridad"}]},
        {"titulo": "Líneas", "icono": "lineas", "clave": "líneas", "hijos": [
            {"titulo": "Artículo y unidad", "clave": "artículo"},
            {"titulo": "Vigencia de la línea", "clave": "vigencia"},
            {"titulo": "Precio y descuentos", "clave": "precio"}]},
        {"titulo": "Descuentos", "icono": "euro", "clave": "descuentos generales", "hijos": [
            {"titulo": "Descuentos generales", "detalle": "−10 % · −12 %", "clave": "escalones"},
            {"titulo": "Escalado", "detalle": "según cantidad", "clave": "escalado"}]},
    ],
    narracion="Una tarifa tiene tres partes. La cabecera, con el código, la divisa, las fechas de validez, la prioridad y los días en que se aplica. Las líneas, una por artículo, con su unidad, su vigencia y su precio. Y por línea, los descuentos generales, que pueden ir por escalones y ser de tipo escalado.",
    _hace="Describir la estructura: cabecera (código, divisa, validez, prioridad, días), líneas (artículo, unidad, vigencia, precio) y descuentos por línea.")

add(id="cabecera-compra", tipo="pantalla", titulo="La cabecera: tarifa COMPRA", url="Tarifas de precios de compras",
    clip=clip(V1, 541, 577), recorte=R,
    zooms=[{"clave": "fechas", "rect": {"x": 820, "y": 250, "w": 740, "h": 90}, "dur": 1.5},
           {"clave": "parámetros", "rect": {"x": 0, "y": 320, "w": 1680, "h": 90}},
           {"clave": "vista"}],
    callouts=[
        {"clave": "código", "rect": {"x": 0, "y": 264, "w": 740, "h": 50}, "texto": "COMPRA · EUR", "lado": "abajo"},
        {"clave": "fechas", "rect": {"x": 1245, "y": 262, "w": 300, "h": 52}, "texto": "01-04-2015 → 31-08-2015", "lado": "abajo"},
        {"clave": "parámetros", "rect": {"x": 0, "y": 344, "w": 1680, "h": 52}, "texto": "Prioridad 0 · lunes a viernes", "lado": "abajo"},
        {"clave": "vista", "rect": {"x": 0, "y": 540, "w": 1680, "h": 52}, "texto": "COMPRA caducada · G00003 vigente", "lado": "abajo"},
    ],
    narracion="Esta es la cabecera de la tarifa COMPRA: su código, la divisa en euros y las fechas de validez, del 1 de abril al 31 de agosto de 2015. Ya estaba caducada. En los parámetros de aplicación hay una prioridad, cuyo uso no se explica en la grabación, y los días de la semana, aquí de lunes a viernes. En la vista, la otra tarifa, G cero cero cero cero tres, sigue vigente.",
    _hace="Consultar una tarifa: código, divisa, fecha inicio/fin, parámetros de aplicación (prioridad, días). Identificar si está vigente.",
    _nota="La prioridad entre tarifas no se explica en las fuentes: no se afirma su efecto.")

add(id="lineas-compra", tipo="pantalla", titulo="Las líneas de la tarifa", url="Tarifas de precios de compras · Líneas",
    clip=clip(V1, 541, 577), recorte=R, clipDesde=0.3,
    zooms=[{"clave": "líneas", "rect": {"x": 0, "y": 610, "w": 1680, "h": 330}, "dur": 1.5}],
    callouts=[
        {"clave": "artículo", "rect": {"x": 30, "y": 624, "w": 750, "h": 30}, "texto": "Artículo y unidad", "lado": "arriba"},
        {"clave": "vigencia", "rect": {"x": 780, "y": 624, "w": 176, "h": 30}, "texto": "Vigencia de la línea", "lado": "arriba"},
        {"clave": "precio", "rect": {"x": 956, "y": 624, "w": 226, "h": 30}, "texto": "Precio y precio unitario", "lado": "arriba"},
        {"clave": "descuento de", "rect": {"x": 1182, "y": 624, "w": 198, "h": 30}, "texto": "Dto. tarifa · Dto. comercial", "lado": "arriba"},
        {"clave": "35.000", "rect": {"x": 0, "y": 710, "w": 1182, "h": 26}, "texto": "COCHE A6 · 35.000", "lado": "abajo"},
    ],
    narracion="Debajo están las líneas. Cada una lleva el artículo y la unidad en que se da el precio; en clase se puso el ejemplo de la unidad, la caja o el palé. Después, la vigencia de la línea, que por defecto hereda la de la cabecera; el precio y el precio unitario; y el descuento de tarifa y el comercial. En esta tarifa, el COCHE A6 vale 35.000 euros.",
    _hace="Revisar columnas de línea: artículo, unidad, inicio/fin vigencia, precio, precio unitario, descuento tarifa, descuento comercial, IVA incluido, precio neto.")

add(id="linea-a6", tipo="pantalla", titulo="Una línea por dentro: COCHE A6 en G00003", url="Tarifas de compras (precios) · línea",
    clip=clip(V1, 600, 625), recorte=R,
    zooms=[{"clave": "línea", "rect": {"x": 0, "y": 360, "w": 1680, "h": 100}, "dur": 1.5}],
    callouts=[
        {"clave": "COCHE", "rect": {"x": 4, "y": 408, "w": 560, "h": 30}, "texto": "COCHE A6 · UNI", "lado": "abajo"},
        {"clave": "vigente", "rect": {"x": 795, "y": 408, "w": 250, "h": 30}, "texto": "01-04-2015 → 01-01-3000", "lado": "abajo"},
        {"clave": "2.000", "rect": {"x": 1060, "y": 406, "w": 300, "h": 34}, "texto": "Precio 2.000", "lado": "abajo"},
        {"clave": "escalado de", "rect": {"x": 4, "y": 320, "w": 150, "h": 24}, "texto": "Escalado de precios", "lado": "derecha"},
    ],
    narracion="Ahora abrimos una línea de la otra tarifa, la G cero cero cero cero tres. Es el mismo COCHE A6, en unidades, vigente hasta el año 3000. Y el precio es de 2.000 euros. Arriba tienes además un botón de escalado de precios, que en la grabación no se llega a abrir.",
    _hace="Entrar en una línea de tarifa: artículo, unidad, vigencia, precio; existe el botón «Escalado de precios».")

add(id="a6-dos-precios", tipo="comparativa", titulo="Mismo artículo, dos tarifas, dos precios",
    etiquetas={"antes": "Tarifa COMPRA", "ahora": "Tarifa G00003"},
    filas=[
        {"aspecto": "Validez", "antes": "Hasta 31-08-2015", "ahora": "Hasta 01-01-3000", "marca": "cambio", "clave": "tarifa"},
        {"aspecto": "Días", "antes": "Lunes a viernes", "ahora": "Los siete días", "marca": "cambio", "clave": "distintas"},
        {"aspecto": "COCHE A6", "antes": "35.000 €", "ahora": "2.000 €", "marca": "cambio", "clave": "vigente"},
        {"aspecto": "En el ejemplo", "antes": "Caducada", "ahora": "La que usa el pedido", "marca": "mejora", "clave": "seguiremos"},
    ],
    narracion="Ojo: el mismo COCHE A6 vale 35.000 euros en una tarifa y 2.000 en la otra. No es un fallo: son dos tarifas distintas con datos de prueba poco realistas. Lo importante: el precio del pedido depende de la tarifa vigente del proveedor. En nuestro ejemplo es la G cero cero cero cero tres, a 2.000 euros, y esa es la cifra que seguiremos.",
    _hace="Explicar que el precio depende de la tarifa aplicada; comparar dos tarifas del mismo artículo.",
    _nota="CORRECCIÓN: en los originales la diferencia 35.000 / 2.000 no se comenta. Se presenta como dos tarifas distintas con datos de demo y se fija 2.000 (G00003) como precio del ejemplo, que es el que aparece después en el pedido.")

add(id="descuentos-generales", tipo="pantalla", titulo="Descuentos generales de la línea", url="Tarifas de compras (precios) · descuentos",
    clip=clip(V1, 640, 668), recorte=R,
    zooms=[{"clave": "debajo", "rect": {"x": 0, "y": 770, "w": 1680, "h": 110}, "dur": 1.5}],
    callouts=[
        {"clave": "10", "rect": {"x": 455, "y": 814, "w": 100, "h": 54}, "texto": "−10,00 y −12,00", "lado": "arriba"},
        {"clave": "escalado", "rect": {"x": 640, "y": 814, "w": 206, "h": 54}, "texto": "Escalado · Precio base", "lado": "arriba"},
        {"clave": "aviso", "rect": {"x": 1408, "y": 814, "w": 258, "h": 54}, "texto": "Liquidación: Distribuidor · Factura", "lado": "arriba"},
    ],
    narracion="Debajo de la línea están los descuentos generales: dos escalones de descuento comercial, del 10 y del 12 por ciento. Son de tipo escalado, es decir, según la cantidad, sobre el precio base; los tramos no se llegan a ver. Y un aviso: en el pedido del ejemplo el A6 entra a 2.000 euros justos, sin descuento en la línea.",
    _hace="Revisar los descuentos de una línea: orden, valor, fórmula (porcentaje), tipo (escalado), base de cálculo, canal y período de liquidación.",
    _nota="CORRECCIÓN: la columna marcada es «Escandallo» (no «Escalando», como decía el informe v1). Las fuentes no explican cuándo se aplican estos descuentos; en el pedido el A6 sale a 2.000 × 3 = 6.000 sin descuento. No se afirma el mecanismo.")

add(id="calculo-escalon", tipo="calculo", titulo="La aritmética de un escalón", etiqueta="Ejemplo ilustrativo",
    divisa="€", base={"etiqueta": "Precio de tarifa · COCHE A6", "valor": 2000},
    pasos=[{"etiqueta": "Si aplicara el escalón del 10 %", "porcentaje": -10, "clave": "10"}],
    resultado="Precio con ese descuento",
    narracion="Solo para que veas la cuenta: si se aplicara el escalón del 10 por ciento a 2.000 euros, el precio quedaría en 1.800. Es un ejemplo de cálculo, no lo que pasó en el pedido.",
    _hace="Ilustrar el cálculo de un descuento porcentual sobre el precio base.",
    _nota="Ilustrativo: no se aplicó en la demo.")

add(id="tip-vigencia", tipo="tip", titulo="Cambia precios con nuevas vigencias",
    texto="No sobrescribas el precio: cierra el tramo de fechas y abre otro. «Hasta ayer valía tanto; desde mañana, tanto».",
    narracion="Un consejo de la propia clase: cuando un proveedor cambia el precio, no lo machaques. Actualiza la tarifa por rangos de fecha: hasta ayer valía tanto y a partir de mañana vale tanto. Así el histórico queda claro y los administrativos reciben la tarifa ya al día.",
    _hace="Mantener tarifas por tramos de vigencia.")

add(id="cuidado-caducada", tipo="cuidado", titulo="Sin tarifa vigente, no hay precio",
    texto="Si el proveedor no tiene tarifa (o la suya está fuera de fechas), el pedido no propone precio y la línea queda a 0.",
    narracion="Y un cuidado: si el proveedor no tiene tarifa, el pedido no te propondrá ningún precio y la línea quedará a cero. Lo verás en directo en el capítulo seis.",
    _hace="Advertir del precio 0 cuando no hay tarifa aplicable.",
    _nota="Que una tarifa caducada no se aplique se deduce de «esta estaría caducada» (v1); lo demostrado es el caso sin tarifa (COCHE A4 a 0).")

add(id="repaso-cap2", tipo="resumen", etiqueta="Capítulo 2",
    items=[
        {"texto": "La tarifa se define aparte del artículo", "clave": "aparte"},
        {"texto": "Cabecera: código, divisa, validez", "clave": "cabecera"},
        {"texto": "Líneas: artículo, unidad, vigencia, precio", "clave": "líneas"},
        {"texto": "Descuentos por escalones", "clave": "escalones"},
        {"texto": "Precio según la tarifa vigente", "clave": "vigente"},
    ],
    narracion="Repasemos. La tarifa se define aparte del artículo. La cabecera lleva código, divisa y validez. Las líneas, artículo, unidad, vigencia y precio. Puede haber descuentos por escalones. Y el precio depende siempre de la tarifa vigente.")

# ───────────────────────────── CAP 3 ─────────────────────────────
add(id="cap3", tipo="capitulo", numero=3, titulo="Dónde se aplica la tarifa", subtitulo="Proveedor, delegación y permisos",
    narracion="Capítulo tres: dónde se aplica la tarifa.")

add(id="reglas-aplicacion", tipo="estructura", titulo="¿De dónde sale el precio?",
    raiz={"titulo": "Precio propuesto", "icono": "euro", "clave": "precio"},
    ramas=[
        {"titulo": "Compras", "icono": "proveedor", "clave": "compras", "hijos": [
            {"titulo": "Tarifa del proveedor", "detalle": "Datos económicos", "clave": "proveedor"},
            {"titulo": "Sin tarifa: a mano", "clave": "mano"}]},
        {"titulo": "Ventas", "icono": "usuario", "clave": "ventas", "hijos": [
            {"titulo": "1.º Tarifa del cliente", "clave": "cliente"},
            {"titulo": "2.º Tarifa de la delegación", "clave": "delegación"},
            {"titulo": "Toda venta lleva delegación", "clave": "toda"}]},
    ],
    narracion="El precio propuesto sale de sitios distintos en compras y en ventas. En compras, de la tarifa del proveedor; si no tiene, lo pones a mano. En ventas, el sistema mira primero la tarifa del cliente y, si no tiene, la de la delegación. Por eso toda venta se hace desde una delegación.",
    _hace="Explicar la resolución de tarifa: compras → proveedor; ventas → cliente y, si no, delegación.")

add(id="correccion-delegacion", tipo="comparativa", titulo="Una corrección importante",
    etiquetas={"antes": "Se dijo al principio", "ahora": "Lo correcto"},
    filas=[
        {"aspecto": "Delegación", "antes": "Tarifa de compra y de venta", "ahora": "Solo tarifa de venta", "marca": "cambio", "clave": "solo"},
        {"aspecto": "Tarifa de compra", "antes": "Proveedor o delegación", "ahora": "Siempre en el proveedor", "marca": "cambio", "clave": "siempre"},
    ],
    narracion="En la primera grabación se dijo que la delegación admite tarifa de compra y de venta. El propio formador lo rectificó en la siguiente sesión: en la delegación solo se define tarifa de venta. La de compra va siempre en el proveedor.",
    _hace="Dejar claro que en la delegación solo hay tarifa de venta.",
    _nota="CORRECCIÓN entre vídeos: v1 (11:27–13:18) afirmaba compra y venta en la delegación; v2 (01:00–02:30) lo corrige.")

add(id="delegacion", tipo="pantalla", titulo="La ficha de la delegación", url="Maestro de delegaciones",
    clip=clip(V2, 100, 124), recorte=R,
    zooms=[{"clave": "condiciones", "rect": {"x": 0, "y": 600, "w": 900, "h": 170}, "dur": 1.5}],
    callouts=[
        {"clave": "Tarragona", "rect": {"x": 0, "y": 264, "w": 656, "h": 26}, "texto": "TGN · Almacén Tarragona", "lado": "abajo"},
        {"clave": "condiciones", "rect": {"x": 0, "y": 640, "w": 830, "h": 78}, "texto": "Condiciones comerciales", "lado": "arriba"},
    ],
    foco=[{"clave": "precios", "x": 200, "y": 676}, {"clave": "descuento", "x": 560, "y": 676}, {"clave": "familia", "x": 200, "y": 702}],
    narracion="Esta es la ficha de una delegación, la de Tarragona. En el bloque de condiciones comerciales hay tres campos: tarifa de precios, tarifa de descuento y descuentos por familia. Juntos forman la tarifa de venta de la delegación.",
    _hace="Abrir una delegación y localizar Condiciones comerciales (tarifa precios, tarifa descuento, descuentos familia).",
    _nota="El maestro de delegaciones se abrió por URL; la ruta de menú no se ve en las fuentes.")

add(id="lookup-ventas", tipo="pantalla", titulo="Solo tarifas de venta", url="Tarifas de precios de ventas (definición)",
    clip=clip(V2, 81, 89), recorte=RMOD,
    zooms=[{"clave": "lista", "rect": {"x": 180, "y": 330, "w": 1310, "h": 180}, "dur": 1.4}],
    callouts=[
        {"clave": "lista", "rect": {"x": 186, "y": 176, "w": 600, "h": 26}, "texto": "Tarifas de precios de ventas", "lado": "abajo"},
        {"clave": "ninguna", "rect": {"x": 186, "y": 405, "w": 1290, "h": 84}, "texto": "VENTA · VENTA02 · VENTA02B", "lado": "abajo"},
    ],
    narracion="La prueba: al desplegar la tarifa de precios de la delegación, la lista que aparece es la de tarifas de venta. No hay ninguna de compra.",
    _hace="Desplegar el campo Tarifa precios de la delegación y comprobar que solo ofrece tarifas de venta.")

add(id="tarifa-proveedores", tipo="pantalla", titulo="La compra se tarifa por proveedor", url="Tarifas de precios de compras · G00003",
    clip=clip(V2, 335, 370), recorte=R,
    zooms=[{"clave": "pestaña", "rect": {"x": 0, "y": 170, "w": 700, "h": 120}, "dur": 1.5}, {"clave": "filtrado"}],
    callouts=[
        {"clave": "pestaña", "rect": {"x": 128, "y": 178, "w": 110, "h": 28}, "texto": "Pestaña Proveedores", "lado": "derecha"},
    ],
    narracion="En compras manda el proveedor: cada uno te vende con sus condiciones, y su tarifa de venta es tu tarifa de compra. Por eso la tarifa de compra se asocia al proveedor. Desde la propia tarifa, la pestaña proveedores te lleva al maestro de proveedores, filtrado por los que la usan.",
    _hace="Desde una tarifa de compra, consultar qué proveedores la tienen asignada (pestaña Proveedores).")

add(id="proveedor-tarifa", tipo="pantalla", titulo="Asignar la tarifa al proveedor", url="Maestro de proveedores · P00001",
    clip=clip(V2, 449, 482), recorte=R,
    zooms=[{"clave": "datos económicos", "rect": {"x": 0, "y": 690, "w": 1300, "h": 210}, "dur": 1.5}],
    callouts=[
        {"clave": "SEAT", "rect": {"x": 0, "y": 266, "w": 520, "h": 26}, "texto": "Proveedor P00001 · SEAT", "lado": "abajo"},
        {"clave": "datos económicos", "rect": {"x": 0, "y": 710, "w": 1680, "h": 96}, "texto": "Datos económicos", "lado": "arriba"},
        {"clave": "COMPRA", "rect": {"x": 836, "y": 730, "w": 326, "h": 26}, "texto": "Tarifa precios: COMPRA → G00003", "lado": "arriba"},
        {"clave": "grabado", "rect": {"x": 1290, "y": 862, "w": 380, "h": 26}, "texto": "Modificado 11-12-2015 11:22:16", "lado": "arriba"},
    ],
    narracion="Así se asigna, en el proveedor SEAT. En la ficha del tercero, la pestaña proveedores abre el maestro de proveedores. En el bloque de datos económicos está el campo tarifa precios, junto a la tarifa de descuentos y la de descuentos por familia. Aquí se cambia de la tarifa COMPRA, caducada, a la G cero cero cero cero tres, y al quedar grabado cambia la fecha de modificación.",
    _hace="Terceros › proveedor › pestaña Proveedores › Datos económicos › Tarifa precios = tarifa vigente; grabar (Validar).",
    _nota="No se ve el clic en «Validar»; el cambio queda acreditado por la fecha de modificación (11-12-2015 11:22:16).")

add(id="tip-codigo-tarifa", tipo="tip", titulo="Un código que se entienda",
    texto="En la demo, SEAT acaba con una tarifa llamada G00003 «VEHICULOS A MOGOLLON», el nombre de la propia empresa. Usa códigos que identifiquen al proveedor.",
    narracion="Un detalle de la demo que puede confundir: a SEAT se le asigna una tarifa que se llama igual que la propia empresa. Funciona, pero en tu caso usa códigos que identifiquen al proveedor; te ahorrarás errores.",
    _hace="Nombrar las tarifas de compra con un código reconocible por proveedor.")

add(id="flujo-precio", tipo="flujo", titulo="Cómo llega el precio al pedido",
    nodos=[
        {"id": "lin", "titulo": "Línea de pedido", "subtitulo": "COCHE A6", "icono": "pedido", "clave": "línea"},
        {"id": "prov", "titulo": "Proveedor", "subtitulo": "P00001 SEAT", "icono": "proveedor", "clave": "proveedor"},
        {"id": "tar", "titulo": "Tarifa", "subtitulo": "G00003", "icono": "tarifa", "clave": "tarifa"},
        {"id": "pre", "titulo": "Precio propuesto", "subtitulo": "editable", "icono": "euro", "clave": "propone", "importe": 2000},
    ],
    enlaces=[{"de": "lin", "a": "prov", "texto": "¿a quién?"}, {"de": "prov", "a": "tar", "texto": "Tarifa precios"}, {"de": "tar", "a": "pre", "texto": "artículo"}],
    narracion="Junta las piezas. Al crear una línea de pedido, el sistema mira el proveedor, busca su tarifa de precios, encuentra el artículo y te propone el precio: 2.000 euros para el A6.",
    _hace="Resumir la cadena línea → proveedor → tarifa → precio propuesto.")

add(id="politica-precios", tipo="conceptos", titulo="¿Precio de tarifa o precio pactado?",
    items=[
        {"titulo": "Precargado", "texto": "Sale de la tarifa al crear la línea", "icono": "tarifa", "clave": "precarga"},
        {"titulo": "Pactado", "texto": "Se puede cambiar: de 2.000 a 1.800", "icono": "cambio", "clave": "pactas"},
        {"titulo": "Sin tarifa", "texto": "El precio se teclea", "icono": "alerta", "clave": "teclea"},
        {"titulo": "Por usuario", "texto": "Quién puede tocar el precio", "icono": "usuario", "clave": "usuario"},
    ],
    narracion="En el pedido tienes dos posibilidades. El sistema precarga el precio de la tarifa, o pactas otro y lo cambias, por ejemplo de 2.000 a 1.800. Si no hay tarifa, lo teclea quien hace el pedido. Y se puede decidir por usuario quién puede tocar el precio y quién no.",
    _hace="Explicar precio precargado vs pactado y el control por usuario.")

add(id="permisos-precios", tipo="pantalla", titulo="Permiso «Precios» por grupo", url="Configuración de grupos de usuarios · Permisos",
    clip=clip(V2, 4036, 4056), recorte={"x": 0, "y": 140, "w": 1400, "h": 800},
    zooms=[{"clave": "fila", "rect": {"x": 0, "y": 560, "w": 1400, "h": 150}, "dur": 1.5}],
    callouts=[
        {"clave": "public", "rect": {"x": 4, "y": 256, "w": 700, "h": 26}, "texto": "Grupo public", "lado": "abajo"},
        {"clave": "agrupación", "rect": {"x": 828, "y": 348, "w": 316, "h": 22}, "texto": "Pedidos de compras", "lado": "abajo"},
        {"clave": "fila", "rect": {"x": 0, "y": 606, "w": 1340, "h": 28}, "texto": "Precios", "lado": "arriba"},
        {"clave": "tres", "rect": {"x": 1174, "y": 630, "w": 164, "h": 58}, "texto": "Ver · Ver y modificar · No permitido", "lado": "izquierda"},
    ],
    narracion="¿Dónde se decide? En los permisos del grupo de usuarios. Aquí ves el grupo public con la agrupación pedidos de compras. La fila precios admite tres valores: ver precios, ver y modificar precios, o no permitido. Se llega desde la configuración de usuarios, pinchando en su grupo funcional de gestión.",
    _hace="Configuración de usuarios › grupo funcional de gestión › Permisos › agrupación Pedidos de compras › Precios (Ver / Ver y modificar / No permitido).",
    _nota="PRIVACIDAD: no se usa la rejilla «Usuarios» (nombres y e-mails reales, v2 ~3830–3940 s). Este tramo solo muestra el grupo y sus permisos.")

add(id="cuidado-public", tipo="cuidado", titulo="No toques el grupo public",
    texto="Todos los usuarios lo usan por defecto. Crea un grupo nuevo (por ejemplo, «comprador») copiado de public, cambia solo el permiso y asígnaselo a quien toque.",
    narracion="Cuidado: el grupo public lo usan todos por defecto. Si le quitas los precios, nadie los verá. Crea un grupo nuevo, por ejemplo comprador, copiado de public, cambia solo ese permiso y asígnalo a quien corresponda.",
    _hace="Crear un grupo específico en lugar de modificar el grupo por defecto.")

add(id="repaso-cap3", tipo="resumen", etiqueta="Capítulo 3",
    items=[
        {"texto": "Compras: tarifa en el proveedor", "clave": "proveedor"},
        {"texto": "Delegación: solo tarifa de venta", "clave": "delegación"},
        {"texto": "Ventas: cliente y luego delegación", "clave": "cliente"},
        {"texto": "Permiso Precios por grupo", "clave": "permiso"},
    ],
    narracion="En resumen: en compras, la tarifa va en el proveedor. La delegación solo lleva tarifa de venta. En ventas manda el cliente y luego la delegación. Y el permiso de precios se da por grupo de usuarios.")

# ───────────────────────────── CAP 4 ─────────────────────────────
add(id="cap4", tipo="capitulo", numero=4, titulo="Tipos de documento y series", subtitulo="Cómo se numera cada documento",
    narracion="Capítulo cuatro: tipos de documento y series.")

add(id="menu-documentos", tipo="pantalla", titulo="Maestros de documentos", url="erp/desktop · Compras › Maestros › Documentos",
    clip=clip(V1, 164, 187), recorte=RM,
    zooms=[{"clave": "concursos", "rect": {"x": 0, "y": 370, "w": 420, "h": 290}, "dur": 1.5}],
    callouts=[
        {"clave": "concursos", "rect": {"x": 86, "y": 408, "w": 200, "h": 88}, "texto": "Circuitos largos", "lado": "derecha"},
        {"clave": "pedidos", "rect": {"x": 86, "y": 518, "w": 200, "h": 66}, "texto": "Pedidos · Albaranes · Facturas", "lado": "derecha"},
        {"clave": "clasificaciones", "rect": {"x": 86, "y": 606, "w": 230, "h": 44}, "texto": "Clasificaciones · Bloqueos", "lado": "derecha"},
    ],
    narracion="Los tipos se definen en Compras, maestros, documentos. Hay entradas para concursos, ofertas, formularios, solicitudes o acuerdos, que sirven para circuitos más largos. Las que nos interesan son pedidos, albaranes y facturas. Además están las clasificaciones y los bloqueos o autorizaciones.",
    _hace="Navegar a Compras › Maestros › Documentos e identificar los tipos de pedido, albarán y factura.")

add(id="tipos-pedido-lista", tipo="pantalla", titulo="Dos tipos de pedido", url="Tipología de pedidos de compras",
    clip=clip(V2, 1070, 1076), recorte={"x": 0, "y": 140, "w": 1400, "h": 560},
    zooms=[{"clave": "dos", "rect": {"x": 0, "y": 200, "w": 1400, "h": 180}, "dur": 1.4}],
    callouts=[
        {"clave": "dos", "rect": {"x": 0, "y": 322, "w": 1300, "h": 44}, "texto": "PC (serie PC-) · PC2 (serie PC2-)", "lado": "abajo"},
    ],
    narracion="Al abrir los tipos de pedido aparecen dos: PC y PC2, los dos pedidos de compra, cada uno con su serie. El código del tipo debe dejar claro el circuito que representa.",
    _hace="Abrir la tipología de pedidos de compra y ver los tipos existentes.",
    _nota="Se evita 1060 s (error JRepException en pantalla).")

add(id="tip-clasificacion", tipo="tip", titulo="¿Otro tipo o una clasificación?",
    texto="Si la diferencia cambia el comportamiento, crea otro tipo de documento. Si solo es informativa (urgente, normal…), usa la clasificación.",
    narracion="Una regla útil de la clase: si una diferencia entre pedidos cambia su comportamiento, crea otro tipo de documento. Si solo es informativa, como urgente o normal, usa la clasificación.",
    _hace="Decidir entre crear un tipo de documento o usar el campo Clasificación.")

add(id="ficha-pc", tipo="pantalla", titulo="La ficha del tipo PC", url="Tipología de pedidos de compras · PC",
    clip=clip(V2, 1088, 1120), recorte=R,
    zooms=[{"clave": "código", "rect": {"x": 0, "y": 240, "w": 1680, "h": 60}, "dur": 1.4}, {"clave": "abajo"}],
    callouts=[
        {"clave": "código", "rect": {"x": 4, "y": 268, "w": 548, "h": 24}, "texto": "Tipo PC · Pedido de Compra", "lado": "abajo"},
        {"clave": "serie", "rect": {"x": 794, "y": 268, "w": 128, "h": 24}, "texto": "Serie PC-", "lado": "abajo"},
        {"clave": "estado", "rect": {"x": 1560, "y": 268, "w": 100, "h": 24}, "texto": "Estado Activo", "lado": "abajo"},
    ],
    narracion="Esta es la ficha del tipo PC. Arriba, el código, la descripción y la serie, el prefijo con el que se numeran sus pedidos. Y el estado: un tipo que ya no usas se desactiva, no se borra. Las demás opciones las verás abajo en el capítulo siguiente.",
    _hace="Abrir el tipo de pedido: código, descripción, serie, estado (activo/no activo).")

add(id="serie-ficha", tipo="pantalla", titulo="La serie de numeración", url="Series de justificantes · PC-",
    clip=clip(V2, 1240, 1290), recorte=RMOD,
    zooms=[{"clave": "numerador", "rect": {"x": 170, "y": 430, "w": 900, "h": 70}, "dur": 1.5}, {"clave": "perpetua"}],
    callouts=[
        {"clave": "tabla", "rect": {"x": 696, "y": 382, "w": 200, "h": 24}, "texto": "Serie PC-", "lado": "abajo"},
        {"clave": "numerador", "rect": {"x": 182, "y": 442, "w": 112, "h": 50}, "texto": "Numerador", "lado": "abajo"},
        {"clave": "seis", "rect": {"x": 296, "y": 442, "w": 124, "h": 50}, "texto": "Justificación 6", "lado": "abajo"},
        {"clave": "separador", "rect": {"x": 422, "y": 442, "w": 172, "h": 50}, "texto": "Excluir separador ✓", "lado": "abajo"},
        {"clave": "cronológico", "rect": {"x": 596, "y": 442, "w": 184, "h": 50}, "texto": "Control cronológico", "lado": "abajo"},
        {"clave": "perpetua", "rect": {"x": 782, "y": 442, "w": 224, "h": 50}, "texto": "Renovación Perpetua", "lado": "abajo"},
    ],
    narracion="Desde el campo serie se abre la tabla de series de justificantes, una fila por tabla y serie. El código de la serie lo decides tú. Numerador indica que numera correlativamente. Justificación, seis: el contador se rellena con ceros hasta seis cifras. Excluir separador quita el guion. Control cronológico, ahora lo vemos. Y la renovación: anual o perpetua.",
    _hace="Desde Serie, abrir Series de justificantes: tabla, serie, numerador, justificación, excluir separador, control cronológico, renovación, fechas.",
    _nota="Se evita 1165–1199 s (avisos de Gmail en la esquina inferior derecha).")

add(id="numero-documento", tipo="estructura", titulo="Cómo se forma el número",
    raiz={"titulo": "151201PC000003", "subtitulo": "Pedido del ejemplo", "icono": "documento", "clave": "número"},
    ramas=[
        {"titulo": "Máscara", "icono": "calendario", "clave": "máscara", "hijos": [
            {"titulo": "yy · año", "detalle": "15", "clave": "año"},
            {"titulo": "mm · mes", "detalle": "12", "clave": "mes"},
            {"titulo": "#e · empresa", "detalle": "01", "clave": "empresa"}]},
        {"titulo": "Serie", "icono": "cabecera", "clave": "serie", "hijos": [
            {"titulo": "PC", "detalle": "sin guion", "clave": "guion"}]},
        {"titulo": "Contador", "icono": "lineas", "clave": "contador", "hijos": [
            {"titulo": "6 cifras", "detalle": "000003", "clave": "cifras"}]},
    ],
    narracion="Mira el número real de nuestro pedido: quince, doce, cero uno, PC, y un tres con ceros delante. Tiene tres piezas. La máscara: año 15, mes 12 y empresa 01. La serie: PC, sin el guion, porque está marcado excluir separador. Y el contador, con sus seis cifras.",
    _hace="Explicar la composición: máscara (año, mes, empresa) + serie + contador justificado.",
    _nota="CORRECCIÓN: el formador dice «PC guion 0000001» (7 cifras); con justificación 6 son 6 cifras (000001). En el número real 151201PC000003 el guion no aparece, coherente con «Excluir separador» marcado en todas las series (verificado en el fotograma de 1225 s).")

add(id="series-mascara", tipo="pantalla", titulo="Series generadas por máscara", url="Series de justificantes · Vista",
    clip=clip(V2, 1505, 1540), recorte=RMOD,
    zooms=[{"clave": "descripción", "rect": {"x": 140, "y": 650, "w": 900, "h": 240}, "dur": 1.5}],
    callouts=[
        {"clave": "descripción", "rect": {"x": 330, "y": 664, "w": 420, "h": 160}, "texto": "Copy from mask [yy#e] + serie [PC-]", "lado": "derecha"},
        {"clave": "nuestro", "rect": {"x": 140, "y": 814, "w": 1300, "h": 22}, "texto": "151201PC- · máscara [yymm#e]", "lado": "abajo"},
    ],
    narracion="No tienes que crear estas series a mano. Si la serie lleva máscara, el sistema genera una copia con el año, el mes o la empresa delante. Lo dice la descripción: copia desde la máscara, más la serie PC. Así salen quince cero uno PC o quince doce cero uno PC, que es la de nuestro pedido.",
    _hace="Ver en la rejilla de series las copias generadas automáticamente a partir de la máscara.",
    _nota="Códigos de máscara literales en pantalla: [yy#mm#e], [yy#e], [yymm#e] (el formador dice «arroba e»; en pantalla es «#e»).")

add(id="control-cronologico", tipo="comparativa", titulo="Control cronológico",
    etiquetas={"antes": "Sin control", "ahora": "Con control"},
    filas=[
        {"aspecto": "El número", "antes": "Único, no necesariamente en orden de fecha", "ahora": "Sigue el orden de las fechas", "marca": "cambio", "clave": "único"},
        {"aspecto": "Pedido de ayer grabado hoy", "antes": "Recibe un número posterior", "ahora": "Se comprueba la fecha", "marca": "cambio", "clave": "ayer"},
    ],
    narracion="Sin control cronológico, el número solo tiene que ser único. Lo normal es que caigan en orden, pero un pedido con fecha de ayer grabado hoy recibe un número posterior al de uno de hoy. Si marcas el control, el sistema verifica que cada número nuevo se genere con fecha posterior a la del anterior.",
    _hace="Explicar la opción Control cronológico de la serie.")

add(id="cuidado-desbordamiento", tipo="cuidado", titulo="Dimensiona la justificación",
    texto="Con 6 cifras caben 999.999 documentos. El siguiente vuelve a dar 000001, se rechaza por duplicado y no se pueden crear más pedidos. Máscara + serie + contador ≤ 20 posiciones.",
    narracion="Cuidado con quedarte corto. Con seis cifras caben 999.999 documentos. El siguiente pierde una cifra, vuelve a dar el uno, y el sistema lo rechaza por duplicado: de repente no se pueden crear pedidos. Y recuerda que máscara, serie y contador tienen que caber en las 20 posiciones del número.",
    _hace="Calcular el tamaño de la serie según el volumen esperado y el límite de 20 posiciones.",
    _nota="Regla explicada oralmente (v2 25:13–29:37); el nombre del campo de 20 posiciones no se ve en pantalla.")

add(id="tip-series", tipo="tip", titulo="Sentido común con las series",
    texto="Mil pedidos al año: seis cifras sobran. No metas en la serie lo que ya está en el documento (empresa, año, tipo, delegación).",
    narracion="Y un consejo: seis cifras, el valor por defecto, dan para muchos años en la mayoría de empresas. Y no metas en la serie información que ya está en el documento, como la empresa, el año o la delegación, salvo que te haga falta de verdad.",
    _hace="Diseñar series sin información redundante.")

add(id="repaso-cap4", tipo="resumen", etiqueta="Capítulo 4",
    items=[
        {"texto": "Tipos en Compras › Maestros › Documentos", "clave": "tipos"},
        {"texto": "Cada tipo tiene su serie", "clave": "serie"},
        {"texto": "Número = máscara + serie + contador", "clave": "máscara"},
        {"texto": "Control cronológico, si lo exiges", "clave": "control"},
        {"texto": "Ojo al límite de cifras", "clave": "límite"},
    ],
    narracion="Repaso: los tipos están en Compras, maestros, documentos, y cada tipo tiene su serie. El número se forma con máscara, serie y contador. Activa el control cronológico si lo exiges. Y vigila el límite de cifras.")

# ───────────────────────────── CAP 5 ─────────────────────────────
add(id="cap5", tipo="capitulo", numero=5, titulo="El tipo de pedido por dentro", subtitulo="Origen, valoración, anticipos, interempresa y tipos",
    narracion="Capítulo cinco: el tipo de pedido por dentro.")

add(id="opciones-pc", tipo="estructura", titulo="Las opciones del tipo de pedido",
    raiz={"titulo": "Tipo de pedido PC", "icono": "engranaje", "clave": "opciones"},
    ramas=[
        {"titulo": "Origen y precio", "icono": "documento", "clave": "origen", "hijos": [
            {"titulo": "Documento origen", "clave": "documento"},
            {"titulo": "Valoración", "clave": "valoración"},
            {"titulo": "Descuentos especiales", "clave": "especiales"},
            {"titulo": "Anticipos", "clave": "anticipos"}]},
        {"titulo": "Relaciones", "icono": "capas", "clave": "relaciones", "hijos": [
            {"titulo": "Interempresa", "clave": "interempresa"},
            {"titulo": "Validar catálogo", "clave": "catálogo"},
            {"titulo": "Impresión", "clave": "impresión"}]},
        {"titulo": "Control", "icono": "check", "clave": "control", "hijos": [
            {"titulo": "Tipo: normal, reposición…", "clave": "normal"},
            {"titulo": "Workflow", "clave": "workflow"},
            {"titulo": "Campos a ocultar", "clave": "ocultar"}]},
    ],
    narracion="Estas son las opciones que repasaremos. Sobre el origen y el precio: documento origen, valoración, descuentos especiales y anticipos. Sobre relaciones: interempresa, validar catálogo e impresión. Y de control: la clase de pedido, normal o reposición, el workflow y los campos a ocultar.",
    _hace="Presentar los bloques de la ficha del tipo de pedido.")

add(id="documento-origen", tipo="pantalla", titulo="Documento origen", url="Tipología de pedidos de compras · Documento origen",
    clip=clip(V2, 1852, 1872), recorte=R,
    zooms=[{"clave": "primer", "rect": {"x": 0, "y": 300, "w": 1680, "h": 80}, "dur": 1.4}],
    callouts=[
        {"_vs": 1852.3, "rect": {"x": 172, "y": 348, "w": 150, "h": 184}, "texto": "Orígenes posibles", "lado": "derecha", "hasta": 3.5},
        {"clave": "primer", "rect": {"x": 0, "y": 326, "w": 530, "h": 22}, "texto": "Tabla origen: Ninguna / Solicitud compras", "lado": "abajo"},
        {"clave": "condición", "rect": {"x": 0, "y": 352, "w": 1640, "h": 22}, "texto": "Condición de selección", "lado": "abajo"},
        {"clave": "actualización", "rect": {"x": 552, "y": 326, "w": 254, "h": 22}, "texto": "Actualización tabla origen", "lado": "abajo"},
    ],
    narracion="Documento origen. La lista admite muchos orígenes: ofertas, acuerdos marco, órdenes de trabajo, pedidos de venta… En clase se explican dos. Con tabla origen ninguna, el pedido es el primer documento del circuito. Si eliges solicitud de compras, el pedido nace de una solicitud, y la condición de selección, una sentencia de tipo SQL, filtra qué solicitudes valen. Al lado, la actualización de la tabla origen.",
    _hace="Definir si el pedido tiene documento origen (ninguno / solicitud de compra) y la condición de selección.",
    _nota="CORRECCIÓN: el desplegable Tabla origen (1852 s) ofrece: Oferta compras, Pedido compras, Acuerdos marco, Órdenes de trabajo, Pedido ventas, Solicitud compras, Orden producción, Acuerdos de ventas, Descuento general, Descuento familia y Ninguna; el informe solo citaba Ninguna / Solicitud compras. Solo se explican esas dos.")

add(id="actualizar-origen", tipo="flujo", titulo="Actualizar el origen",
    nodos=[
        {"id": "p", "titulo": "Pedido", "subtitulo": "Pedidas", "icono": "pedido", "clave": "pido", "importe": 3, "divisa": "uds"},
        {"id": "a", "titulo": "Albarán", "subtitulo": "Recibidas", "icono": "albaran", "clave": "recibo", "importe": 3, "divisa": "uds"},
        {"id": "r", "titulo": "Pedido actualizado", "subtitulo": "Pendientes", "icono": "check", "clave": "pendientes", "importe": 0, "divisa": "uds"},
    ],
    enlaces=[{"de": "p", "a": "a", "texto": "recepción"}, {"de": "a", "a": "r", "texto": "sumando"}],
    narracion="Esa opción decide si el documento siguiente actualiza su origen sumando, restando o nada. El ejemplo de la clase: pido 3 y recibo 3; el pedido queda con 3 servidas y 0 pendientes. Lo verás en el albarán, que actualiza el pedido sumando.",
    _hace="Explicar la actualización del documento origen (sumar/restar/no actualizar).")

add(id="valoracion", tipo="pantalla", titulo="Valoración", url="Tipología de pedidos de compras · Valoración",
    clip=clip(V2, 1937, 1950), recorte=R,
    zooms=[{"clave": "fecha", "rect": {"x": 0, "y": 380, "w": 700, "h": 160}, "dur": 1.4}],
    callouts=[
        {"clave": "poner precio", "rect": {"x": 132, "y": 432, "w": 30, "h": 24}, "texto": "Valorar ✓", "lado": "derecha"},
        {"clave": "fecha", "rect": {"x": 4, "y": 452, "w": 104, "h": 72}, "texto": "Fecha inicio · Fecha fin · Documento · No valorar", "lado": "derecha"},
    ],
    narracion="Marcar valorar es poner precio a las líneas. La fecha de valoración decide con qué fecha se busca ese precio: la de inicio o la de fin, cuando el pedido cubre un periodo; la del documento, que es lo habitual; o no valorar.",
    _hace="Elegir la fecha de valoración (inicio, fin, documento, no valorar) y marcar Valorar.")

add(id="rappel", tipo="flujo", titulo="Descuentos especiales: el rappel",
    nodos=[
        {"id": "e", "titulo": "Pedidos etiquetados", "subtitulo": "con descuento especial", "icono": "pedido", "clave": "etiqueta"},
        {"id": "s", "titulo": "Proceso periódico", "subtitulo": "suma el volumen", "icono": "reloj", "clave": "periódico"},
        {"id": "v", "titulo": "Albarán de venta", "subtitulo": "al proveedor", "icono": "albaran", "clave": "reclamar"},
    ],
    narracion="Los descuentos especiales no son los escalados de la tarifa. Piensa en un rappel: si este año te compro más de 3.000 unidades, me haces un 5 por ciento a posteriori. El pedido solo queda etiquetado; un proceso periódico suma los pedidos y genera un albarán de venta para reclamar el importe al proveedor. En clase solo se presentó la idea.",
    _hace="Distinguir descuentos de tarifa y descuentos especiales (rappel a posteriori).",
    _nota="Concepto sin demostración; el formador admite no dominarlo.")

add(id="anticipos", tipo="calculo", titulo="Anticipos", etiqueta="Pedido con anticipo",
    divisa="€", base={"etiqueta": "Pedido", "valor": 2000},
    pasos=[{"etiqueta": "Anticipo ya pagado", "importe": -1000, "clave": "mil"}],
    resultado="Factura por el pendiente",
    narracion="Los anticipos son pagos por adelantado a un proveedor. Si un pedido de 2.000 euros está vinculado a un anticipo de mil, la factura de compra solo será por el pendiente: otros mil.",
    _hace="Vincular un anticipo al pedido para facturar solo el pendiente.")

add(id="interempresa", tipo="flujo", titulo="Facturación interempresa",
    nodos=[
        {"id": "c", "titulo": "Pedido de compra", "subtitulo": "Sociedad 1", "icono": "pedido", "clave": "compra"},
        {"id": "v", "titulo": "Pedido de venta", "subtitulo": "Sociedad 2 · simétrico", "icono": "documento", "clave": "simétrico"},
    ],
    enlaces=[{"de": "c", "a": "v", "texto": "lo genera el sistema"}],
    narracion="En un grupo con varias sociedades en el mismo sistema, el proveedor puede ser otra empresa del grupo. Con el campo pedido de venta del bloque interempresa, al grabar el pedido de compra el sistema genera el pedido de venta simétrico en la otra sociedad. Así nadie tiene que teclearlo dos veces.",
    _hace="Asociar un tipo de pedido de venta para generar el documento simétrico en compras intercompañía.",
    _nota="Concepto explicado oralmente; no se muestra ningún pedido interempresa real.")

add(id="tipos-pedido", tipo="pantalla", titulo="Clases de pedido", url="Tipología de pedidos de compras · Indicativos",
    clip=clip(V2, 2396, 2420), recorte=R,
    zooms=[{"clave": "normal", "rect": {"x": 0, "y": 460, "w": 700, "h": 140}, "dur": 1.4}],
    callouts=[
        {"clave": "normal", "rect": {"x": 168, "y": 508, "w": 116, "h": 78}, "texto": "Normal · Reposición · Programación · Muestras", "lado": "derecha"},
    ],
    narracion="En indicativos eliges la clase de pedido: normal, reposición, programación o muestras. El de este tutorial es normal. El de reposición lo genera el propio sistema. Programación y muestras se nombran en la clase, pero no se explican.",
    _hace="Elegir la clase del tipo de pedido (Normal, Reposición, Programación, Muestras).")

add(id="reposicion", tipo="flujo", titulo="Reposición automática",
    nodos=[
        {"id": "s", "titulo": "Stock bajo mínimo", "subtitulo": "p. ej. 10 ruedas", "icono": "stock", "clave": "mínimo"},
        {"id": "p", "titulo": "Proceso programado", "subtitulo": "cada hora, día…", "icono": "reloj", "clave": "programado"},
        {"id": "a", "titulo": "Aviso o pedido", "subtitulo": "tipo reposición", "icono": "pedido", "clave": "aviso"},
        {"id": "m", "titulo": "E-mail al proveedor", "icono": "flecha", "clave": "correo"},
    ],
    narracion="Así funciona la reposición. Defines un stock mínimo, por ejemplo diez ruedas. Un proceso programado revisa el stock cada hora o cada día. Si está en el mínimo, genera un aviso o directamente un pedido de reposición, con el precio de la tarifa, y lo envía por correo al proveedor. Por eso necesita tarifas ya creadas.",
    _hace="Explicar la reposición automática por stock mínimo.",
    _nota="Concepto oral, sin demostración.")

add(id="validar-catalogo", tipo="pantalla", titulo="Validar catálogo", url="Tipología de pedidos de compras · Indicativos",
    clip=clip(V2, 1088, 1110), recorte=R,
    zooms=[{"clave": "catálogo", "rect": {"x": 0, "y": 460, "w": 700, "h": 120}, "dur": 1.4}],
    callouts=[
        {"clave": "catálogo", "rect": {"x": 4, "y": 520, "w": 276, "h": 22}, "texto": "Validar catálogo: No", "lado": "derecha"},
    ],
    narracion="Validar catálogo. Por defecto, un pedido admite todos los artículos del maestro. Si lo activas, solo los del catálogo de la delegación o del almacén. El ejemplo de la clase: una cadena con hipermercados, que piden de todo, y supermercados con un surtido reducido.",
    _hace="Limitar los artículos pedibles al catálogo de la delegación/almacén (Validar catálogo).",
    _nota="Nunca se prueba con valor «Sí» en las fuentes.")

add(id="impresion", tipo="pantalla", titulo="Impresión de documentos", url="Tipología de pedidos de compras · Impresión",
    clip=clip(V2, 2978, 2996), recorte=R,
    zooms=[{"clave": "pestaña", "rect": {"x": 0, "y": 450, "w": 700, "h": 110}, "dur": 1.4}],
    callouts=[
        {"clave": "pestaña", "rect": {"x": 106, "y": 466, "w": 176, "h": 22}, "texto": "Impresión de documentos", "lado": "derecha"},
        {"clave": "objeto", "rect": {"x": 4, "y": 514, "w": 420, "h": 24}, "texto": "Objeto impresión", "lado": "derecha"},
    ],
    narracion="En la pestaña impresión de documentos se vincula el objeto de impresión: el formato en papel o PDF, distinto de la pantalla con la que editas. Si una empresa usa dos impresos, por ejemplo uno rosa y otro verde, tendrá dos tipos de pedido, cada uno con el suyo.",
    _hace="Asociar al tipo de pedido el objeto (formato) de impresión.")

add(id="campos-ocultar", tipo="pantalla", titulo="Workflow y campos a ocultar", url="Tipología de pedidos de compras · Campos a ocultar",
    clip=clip(V2, 3758, 3775), recorte=R,
    zooms=[{"clave": "casillas", "rect": {"x": 0, "y": 560, "w": 1680, "h": 140}, "dur": 1.4}],
    callouts=[
        {"clave": "casillas", "rect": {"x": 138, "y": 574, "w": 120, "h": 22}, "texto": "Campos a ocultar", "lado": "derecha"},
        {"clave": "fechas", "rect": {"x": 0, "y": 606, "w": 1660, "h": 88}, "texto": "Una casilla por campo de línea", "lado": "abajo"},
    ],
    narracion="En datos generales está el tipo de workflow, en PC el departamental; lo verás al validar. Y la pestaña campos a ocultar tiene casillas, una por cada dato de la línea: fechas de entrega, stock, lote, código de barras… Afecta a todos los usuarios del tipo. Si quieres que uno pueda modificar un dato y otro no, eso va en el perfil del usuario.",
    _hace="Asignar el tipo de workflow y elegir qué campos de línea se ocultan en este tipo de pedido.",
    _nota="Las fuentes no aclaran si la casilla marcada oculta o muestra el campo; no se afirma.")

add(id="repaso-cap5", tipo="resumen", etiqueta="Capítulo 5",
    items=[
        {"texto": "Origen: ninguno o solicitud", "clave": "origen"},
        {"texto": "Valoración con fecha de documento", "clave": "valora"},
        {"texto": "Rappel y anticipos", "clave": "rappel"},
        {"texto": "Interempresa: pedido simétrico", "clave": "simétrico"},
        {"texto": "Clase, catálogo, impresión", "clave": "clase"},
        {"texto": "Workflow y campos a ocultar", "clave": "workflow"},
    ],
    narracion="Repaso: el origen puede ser ninguno o una solicitud. Se valora, normalmente, con la fecha del documento. Hay rappel y anticipos. En interempresa se genera el pedido simétrico. Y además: clase de pedido, catálogo, impresión, workflow y campos a ocultar.")

# ───────────────────────────── CAP 6 ─────────────────────────────
add(id="cap6", tipo="capitulo", numero=6, titulo="Crear y validar el pedido", subtitulo="Cabecera, líneas y workflow",
    narracion="Capítulo seis: crear y validar el pedido.")

add(id="menu-pedidos", tipo="pantalla", titulo="Compras › Pedidos › Registro", url="erp/desktop · Compras › Pedidos",
    clip=clip(V2, 3070, 3072.8), recorte=RM,
    zooms=[{"clave": "registro", "rect": {"x": 0, "y": 290, "w": 420, "h": 250}, "dur": 1.2}],
    callouts=[
        {"clave": "pedidos", "rect": {"x": 20, "y": 308, "w": 200, "h": 24}, "texto": "Compras › Pedidos", "lado": "derecha"},
        {"clave": "registro", "rect": {"x": 50, "y": 331, "w": 150, "h": 22}, "texto": "Registro", "lado": "derecha"},
        {"clave": "seguimiento", "rect": {"x": 50, "y": 353, "w": 300, "h": 176}, "texto": "b2b, e-Procurement, Impresión, Situación, Seguimiento…", "lado": "derecha"},
    ],
    narracion="Para crear el pedido, abre Compras, pedidos, registro. En la misma carpeta tienes también la impresión, la situación, el seguimiento y el workflow de los pedidos.",
    _hace="Abrir Compras › Pedidos › Registro.",
    _nota="Se evita 3075,5–3117 s: aparece una pantalla de inicio de sesión (usuario visible, contraseña enmascarada).")

add(id="alta-cabecera", tipo="pantalla", titulo="La cabecera del pedido", url="Pedidos compras · nuevo",
    clip=clip(V2, 3272, 3300), recorte=R,
    zooms=[{"clave": "unidad", "rect": {"x": 0, "y": 250, "w": 840, "h": 150}, "dur": 1.4},
           {"clave": "serie", "rect": {"x": 830, "y": 250, "w": 840, "h": 120}}],
    callouts=[
        {"clave": "unidad", "rect": {"x": 0, "y": 262, "w": 830, "h": 128}, "texto": "PC · Empresa 01 · Delegación D01 · Almacén D01", "lado": "abajo"},
        {"clave": "entrega", "rect": {"x": 836, "y": 262, "w": 290, "h": 52}, "texto": "Fecha y plazo de entrega", "lado": "abajo"},
        {"clave": "serie", "rect": {"x": 1250, "y": 262, "w": 336, "h": 24}, "texto": "151201PC- : se completa al guardar", "lado": "abajo"},
        {"clave": "referencia", "rect": {"x": 1250, "y": 288, "w": 336, "h": 76}, "texto": "Origen · Referencia · Clasificación", "lado": "abajo"},
    ],
    narracion="Con el botón nuevo aparece un pedido en blanco. En la unidad de negocio eliges el tipo, PC, la empresa, la delegación, el departamento y el almacén donde recibirás la mercancía. Las fechas de entrega son el plazo que das al proveedor. Con el tipo llega la serie con su máscara; el número se completa al guardar. Y además: origen, referencia y clasificación.",
    _hace="Nuevo pedido: tipo, empresa, delegación, departamento, almacén; fechas de pedido y entrega; serie (número al guardar); origen, referencia, clasificación.",
    _nota="Según la clase, si el proveedor tiene plazo de entrega en su ficha, el sistema ajusta las fechas; no se demuestra.")

add(id="proveedor-direccion", tipo="pantalla", titulo="Proveedor y dirección", url="Direcciones de terceros",
    clip=clip(V2, 3366, 3373), recorte=RMOD,
    zooms=[{"clave": "dirección", "rect": {"x": 180, "y": 360, "w": 1310, "h": 100}, "dur": 1.4}],
    callouts=[
        {"clave": "dirección", "rect": {"x": 190, "y": 406, "w": 1290, "h": 26}, "texto": "SEAT · dirección 0 · Gran Via · Barcelona", "lado": "abajo"},
    ],
    narracion="En pedir a eliges el proveedor, SEAT, y el sistema trae su dirección cero, la fiscal. Un proveedor puede tener varias direcciones: la central, donde mandas las facturas, y sucursales desde las que sirve. Distingue bien facturación, pedido y recepción.",
    _hace="Elegir proveedor y su dirección (0 = fiscal); revisar Pedir a / Facturado por / Recepcionar en / Enviar a.",
    _nota="No se usa la lista de proveedores (3340–3355 s) porque muestra nombres de terceros con apariencia de personas.")

add(id="lineas-a6", tipo="pantalla", titulo="Primera línea: COCHE A6", url="Líneas de pedido",
    clip=clip(V2, 3612, 3636), recorte=R,
    zooms=[{"clave": "línea", "rect": {"x": 0, "y": 450, "w": 1680, "h": 80}, "dur": 1.4}],
    callouts=[
        {"clave": "artículo", "rect": {"x": 228, "y": 488, "w": 160, "h": 26}, "texto": "COCHE A6", "lado": "abajo"},
        {"clave": "tres", "rect": {"x": 842, "y": 488, "w": 100, "h": 26}, "texto": "3", "lado": "abajo"},
        {"clave": "2.000", "rect": {"x": 968, "y": 488, "w": 120, "h": 26}, "texto": "2.000 de la tarifa", "lado": "abajo"},
        {"clave": "6.000", "rect": {"x": 1188, "y": 488, "w": 96, "h": 26}, "texto": "6.000", "lado": "abajo"},
        {"clave": "validada", "rect": {"x": 1486, "y": 488, "w": 90, "h": 26}, "texto": "Validada", "lado": "abajo"},
    ],
    narracion="Al guardar la cabecera, el pedido ya tiene número. Pasamos a las líneas. Las fechas de entrega se heredan de la cabecera. Elegimos el artículo, COCHE A6, y una cantidad de tres. Al grabar, el precio aparece solo: 2.000 euros, los de la tarifa del proveedor. Importe neto, 6.000. La línea queda validada.",
    _hace="Añadir línea: artículo y cantidad; el precio se propone desde la tarifa del proveedor; importe neto calculado.")

add(id="lineas-a4", tipo="pantalla", titulo="Segunda línea: COCHE A4, sin tarifa", url="Líneas de pedido",
    clip=clip(V2, 3706, 3729), recorte=R,
    zooms=[{"clave": "cero", "rect": {"x": 0, "y": 450, "w": 1680, "h": 80}, "dur": 1.4}, {"clave": "órdenes", "rect": {"x": 0, "y": 660, "w": 1680, "h": 90}}],
    callouts=[
        {"clave": "cero", "rect": {"x": 968, "y": 488, "w": 120, "h": 26}, "texto": "Sin tarifa: 0", "lado": "abajo", "hasta": 9},
        {"clave": "mano", "rect": {"x": 968, "y": 488, "w": 120, "h": 26}, "texto": "A mano: 1.000", "lado": "abajo"},
        {"clave": "órdenes", "rect": {"x": 0, "y": 694, "w": 1660, "h": 34}, "texto": "Órdenes 3 y 1", "lado": "arriba"},
    ],
    narracion="Ahora el COCHE A4, cuatro unidades. Como no está en la tarifa, el precio queda a cero, y aun así la línea se valida. Lo tecleamos a mano: 1.000 euros, importe 4.000. Fíjate en los órdenes de las líneas: uno y tres. Se numeran saltando de dos en dos, para poder intercalar una línea entre medias.",
    _hace="Añadir un artículo sin tarifa: precio 0, teclear el precio pactado; observar la numeración de líneas.",
    _nota="El formador dice «de dos en dos (2, 4, 6)»; en pantalla son 1 y 3. Se evita 3695–3705 s (ventana emergente en blanco).")

add(id="cuidado-precio-cero", tipo="cuidado", titulo="Un precio cero también se valida",
    texto="La línea del A4 quedó «Validada» con importe 0,00. Revisa los precios antes de enviar el pedido.",
    narracion="Cuidado con esto: una línea con precio cero también queda validada. Revisa siempre los precios antes de enviar el pedido.",
    _hace="Revisar líneas a 0 antes de validar/enviar.")

add(id="calculo-pedido", tipo="calculo", titulo="El importe del pedido", etiqueta="Pedido 151201PC000003",
    divisa="€", base={"etiqueta": "COCHE A6 · 3 × 2.000", "valor": 6000},
    pasos=[{"etiqueta": "COCHE A4 · 4 × 1.000", "importe": 4000, "clave": "4.000"}],
    resultado="Importe neto del pedido",
    narracion="Sumamos: 6.000 del A6 más 4.000 del A4. El pedido queda en 10.000 euros, sin IVA.",
    _hace="Comprobar el importe neto del pedido.")

add(id="validar-pedido", tipo="pantalla", titulo="Validar: el workflow entra en juego", url="Pedidos compras · 151201PC000003",
    clip=clip(V2, 4072, 4132), recorte=R,
    callouts=[
        {"_vs": 4074, "rect": {"x": 1008, "y": 366, "w": 200, "h": 24}, "texto": "Bloqueado 26000", "lado": "abajo"},
        {"_vs": 4080, "rect": {"x": 270, "y": 972, "w": 360, "h": 30}, "texto": "Enviar a Director General · >3000€ Autorizar", "lado": "arriba"},
        {"_vs": 4094, "rect": {"x": 620, "y": 396, "w": 440, "h": 304}, "texto": "Autorizar: motivo", "lado": "derecha"},
        {"_vs": 4103, "rect": {"x": 210, "y": 972, "w": 180, "h": 30}, "texto": "Aprobar Jefe de Central", "lado": "arriba"},
        {"_vs": 4111, "rect": {"x": 210, "y": 972, "w": 180, "h": 30}, "texto": "Aprobar Director General", "lado": "arriba"},
        {"_vs": 4119, "rect": {"x": 210, "y": 972, "w": 150, "h": 30}, "texto": "Aprobación Comité", "lado": "arriba"},
        {"_vs": 4127, "rect": {"x": 210, "y": 972, "w": 160, "h": 30}, "texto": "Confirmar Envío mail", "lado": "arriba"},
    ],
    narracion="Pulsamos validar y el pedido no queda libre: se bloquea por el workflow del tipo PC. Es lo esperado, no un error. Como supera 3.000 euros, aparece el botón de autorizar, que pide un motivo. Después llega una cadena de aprobaciones, cada una como un botón en la barra inferior: jefe de central, director general y comité. Por último, confirmar el envío del pedido por correo al proveedor. Estos pasos son propios de esta instalación; en la tuya serán los que defina el workflow.",
    _hace="Validar el pedido; atender las aprobaciones del workflow (autorización con motivo, aprobaciones sucesivas, confirmación de envío).",
    _nota="CORRECCIÓN: el informe de tramo 4 decía 26000 → 26010 «OTRO WORKFLOW» y botones «Enviar a Director General / >3000€ Autorizar». Los fotogramas muestran la secuencia completa: >3000€ Autorizar (4085 s) → Aprobar Jefe de Central (4104) → Aprobar Director General (4112) → Aprobación Comité (4120) → Confirmar Envío mail (4128). Coincide con el audio (1:08:08). La utilidad de e-mail no estaba configurada y se forzó «Confirmar Envío mail»; no se muestra la dirección tecleada.")

add(id="workflow-pedido", tipo="flujo", titulo="Del bloqueo al pedido validado",
    nodos=[
        {"id": "b", "titulo": "Bloqueado", "subtitulo": "26000", "icono": "alerta", "clave": "bloqueado"},
        {"id": "j", "titulo": "Jefe de Central", "icono": "usuario", "clave": "jefe"},
        {"id": "d", "titulo": "Director General", "icono": "usuario", "clave": "director"},
        {"id": "c", "titulo": "Comité", "icono": "usuario", "clave": "comité"},
        {"id": "v", "titulo": "Validado", "subtitulo": "tras el envío", "icono": "check", "clave": "validado", "importe": 10000},
    ],
    narracion="En resumen: bloqueado, aprobación del jefe de central, del director general y del comité, y tras confirmar el envío, validado.",
    _hace="Resumir los estados del pedido durante el workflow.")

add(id="pedido-validado", tipo="pantalla", titulo="Pedido validado", url="Pedidos compras · 151201PC000003",
    clip=clip(V2, 4196, 4201.5), recorte=R,
    callouts=[
        {"clave": "validado", "rect": {"x": 1008, "y": 366, "w": 200, "h": 24}, "texto": "Validado", "lado": "abajo"},
        {"clave": "10.000", "rect": {"x": 1500, "y": 764, "w": 160, "h": 26}, "texto": "Importe neto 10.000,00", "lado": "arriba"},
        {"clave": "servida", "rect": {"x": 0, "y": 972, "w": 900, "h": 30}, "texto": "Aparece Marcar como servida", "lado": "arriba"},
    ],
    narracion="Ya está: estado validado, importe neto 10.000 euros. En la barra inferior aparece un botón nuevo, marcar como servida, señal de que el pedido ya puede recibirse.",
    _hace="Comprobar estado Validado e importe neto.")

add(id="repaso-cap6", tipo="resumen", etiqueta="Capítulo 6",
    items=[
        {"texto": "Cabecera: unidad de negocio y proveedor", "clave": "cabecera"},
        {"texto": "El número se genera al guardar", "clave": "número"},
        {"texto": "Precio de tarifa, o a mano si no hay", "clave": "precio"},
        {"texto": "Validar dispara el workflow", "clave": "validar"},
    ],
    narracion="Repaso: la cabecera define la unidad de negocio y el proveedor. El número se genera al guardar. El precio sale de la tarifa o se teclea si no la hay. Y validar dispara el workflow.")

# ───────────────────────────── CAP 7 ─────────────────────────────
add(id="cap7", tipo="capitulo", numero=7, titulo="Del pedido al albarán", subtitulo="Recepción, parciales y contabilización",
    narracion="Capítulo siete: del pedido al albarán.")

add(id="tipologia-rc", tipo="pantalla", titulo="El tipo de albarán RC", url="Tipología de albaranes y suministros de compras",
    clip=clip(V2, 4262, 4292), recorte=R,
    zooms=[{"clave": "origen", "rect": {"x": 0, "y": 240, "w": 1680, "h": 140}, "dur": 1.4}],
    callouts=[
        {"clave": "recepción", "rect": {"x": 0, "y": 266, "w": 870, "h": 26}, "texto": "RC · Recepción de Compra · serie RC-", "lado": "abajo"},
        {"clave": "origen", "rect": {"x": 0, "y": 324, "w": 370, "h": 26}, "texto": "Tabla origen: Pedidos", "lado": "abajo"},
        {"clave": "condición", "rect": {"x": 0, "y": 350, "w": 370, "h": 24}, "texto": "estcab in ('V','P')", "lado": "abajo"},
        {"clave": "sumando", "rect": {"x": 584, "y": 324, "w": 256, "h": 26}, "texto": "Actualizar origen: Sumando", "lado": "abajo"},
        {"clave": "cuentas", "rect": {"x": 1166, "y": 266, "w": 260, "h": 26}, "texto": "NDIS → DISP", "lado": "abajo"},
    ],
    narracion="El albarán también tiene su tipo: RC, recepción de compra, en Compras, maestros, documentos, albaranes. Su tabla origen es pedidos. La condición de selección solo admite pedidos validados o parciales. Actualiza el origen sumando lo recibido. Y mueve la mercancía entre cuentas logísticas: de no disponible a disponible.",
    _hace="Definir el tipo de albarán de recepción: origen pedidos, condición (validado/parcial), actualizar origen sumando, cuentas logísticas origen/destino.")

add(id="reglas-rc", tipo="conceptos", titulo="Reglas del albarán de recepción",
    items=[
        {"titulo": "Nace de un pedido", "texto": "No se recibe lo que no se ha pedido", "icono": "pedido", "clave": "nace"},
        {"titulo": "Pedido V o P", "texto": "Validado o servido parcial", "icono": "check", "clave": "validado"},
        {"titulo": "Suma al pedido", "texto": "La devolución restaría", "icono": "mas", "clave": "suma"},
        {"titulo": "Albarán o suministro", "texto": "Igual para el sistema", "icono": "documento", "clave": "suministro"},
    ],
    narracion="Cuatro reglas. El albarán de recepción nace de un pedido: lo normal es no recibir nada que no se haya pedido, aunque podría existir otro tipo sin origen. El pedido debe estar validado o parcial. Cada recepción suma a la cantidad servida; una devolución restaría. Y albarán o suministro funcionan igual: el albarán implica papel.",
    _hace="Resumir las reglas del albarán de recepción.")

add(id="alta-albaran", tipo="pantalla", titulo="Nuevo albarán", url="Albaranes compras · nuevo",
    clip=clip(V2, 4786, 4800), recorte=R,
    zooms=[{"clave": "origen", "rect": {"x": 830, "y": 250, "w": 840, "h": 150}, "dur": 1.4}],
    callouts=[
        {"clave": "tipo", "rect": {"x": 0, "y": 266, "w": 620, "h": 26}, "texto": "Tipo RC", "lado": "abajo"},
        {"clave": "guardar", "rect": {"x": 1250, "y": 264, "w": 350, "h": 24}, "texto": "201501RC- : se numera al guardar", "lado": "abajo"},
        {"clave": "origen", "rect": {"x": 1250, "y": 290, "w": 350, "h": 24}, "texto": "Origen: obligatorio", "lado": "abajo"},
        {"clave": "cuentas", "rect": {"x": 0, "y": 688, "w": 420, "h": 50}, "texto": "NDIS No disponible → DISP Disponible", "lado": "arriba"},
    ],
    narracion="En Compras, albaranes, creamos uno nuevo de tipo RC, con la misma empresa, delegación y almacén. El número se completa al guardar. Como el tipo tiene tabla origen, el campo origen es obligatorio. Y ya ves las cuentas logísticas que heredará.",
    _hace="Nuevo albarán: tipo RC, empresa/delegación/almacén, fecha de recepción; informar Origen.")

add(id="popup-pedidos", tipo="pantalla", titulo="Elegir el pedido de origen", url="Pedidos de compras (selección)",
    clip=clip(V2, 4836, 4850), recorte=RMOD,
    zooms=[{"clave": "misma", "rect": {"x": 180, "y": 400, "w": 1310, "h": 120}, "dur": 1.4}],
    callouts=[
        {"clave": "misma", "rect": {"x": 186, "y": 444, "w": 1300, "h": 62}, "texto": "Pedidos de la misma empresa y delegación", "lado": "abajo"},
        {"clave": "nuestro", "rect": {"x": 186, "y": 444, "w": 1300, "h": 22}, "texto": "151201PC000003 · 10.000,00", "lado": "arriba"},
    ],
    narracion="La lista solo muestra pedidos de la misma empresa y delegación. Ojo, porque es el error típico de las pruebas: si el albarán no coincide en empresa, delegación o departamento, no encontrarás el pedido. Elegimos el nuestro, el de 10.000 euros, y el sistema trae el proveedor, la divisa y la forma de pago.",
    _hace="Seleccionar el pedido de origen (mismo empresa/delegación/departamento); se heredan proveedor, divisa, tipo de efecto y forma de pago.")

add(id="albaran-guardado", tipo="pantalla", titulo="Albarán creado", url="Albaranes compras · 201501RC-000002",
    clip=clip(V2, 4893, 4906), recorte=R,
    callouts=[
        {"clave": "número", "rect": {"x": 1270, "y": 262, "w": 340, "h": 24}, "texto": "201501RC-000002", "lado": "abajo"},
        {"clave": "origen", "rect": {"x": 1270, "y": 288, "w": 340, "h": 24}, "texto": "Origen 151201PC000003", "lado": "abajo"},
        {"clave": "validado", "rect": {"x": 1008, "y": 366, "w": 120, "h": 24}, "texto": "Validado", "lado": "abajo"},
        {"clave": "agregar", "rect": {"x": 272, "y": 206, "w": 150, "h": 24}, "texto": "Agregar líneas pedido", "lado": "abajo"},
    ],
    narracion="Al insertar, el albarán recibe su número, con el pedido como origen, y queda validado solo: algunos tipos se autovalidan. Arriba aparece el botón clave: agregar líneas pedido.",
    _hace="Guardar la cabecera del albarán; localizar «Agregar líneas pedido».")

add(id="agregar-lineas", tipo="pantalla", titulo="Agregar las líneas del pedido", url="Selección de líneas de pedido",
    clip=clip(V2, 4996, 5046), recorte=R,
    callouts=[
        {"_vs": 4997, "rect": {"x": 0, "y": 596, "w": 1660, "h": 46}, "texto": "Pendientes: A6 · 3 y A4 · 4", "lado": "abajo"},
        {"_vs": 5002, "rect": {"x": 0, "y": 596, "w": 60, "h": 46}, "texto": "Marcadas", "lado": "derecha"},
        {"_vs": 5022, "rect": {"x": 958, "y": 620, "w": 176, "h": 24}, "texto": "Cantidad del A4: 3", "lado": "abajo"},
        {"_vs": 5029, "rect": {"x": 312, "y": 972, "w": 140, "h": 30}, "texto": "Agregar líneas pedido", "lado": "arriba"},
        {"_vs": 5039, "rect": {"x": 0, "y": 596, "w": 1660, "h": 24}, "texto": "Queda 1 COCHE A4 · pedido Parcial", "lado": "abajo"},
    ],
    narracion="El botón abre las líneas del pedido que aún no se han recibido: tres A6 y cuatro A4. Marcamos las dos. Pero el camión solo trae tres A4, así que cambiamos su cantidad antes de agregar. Pulsamos agregar líneas pedido y el sistema las copia al albarán y lo valida. Si volvemos a abrir la selección, solo queda un A4 pendiente, y el pedido de origen ya figura como parcial.",
    _hace="Agregar líneas del pedido: marcar, ajustar la cantidad recibida, agregar; lo no recibido queda pendiente.",
    _nota="Clip acelerado. Marcado ≈5002 s, edición de cantidad ≈5026 s, transacción ≈5034 s, resultado (pendiente 1, pedido Parcial) ≈5042 s. El informe decía 4915–5030; el tramo útil verificado es 4996–5046.")

add(id="albaran-lineas", tipo="pantalla", titulo="Las líneas del albarán", url="Albaranes compras · 201501RC-000002",
    clip=clip(V2, 5352, 5369), recorte=R,
    callouts=[
        {"clave": "líneas", "rect": {"x": 0, "y": 862, "w": 1640, "h": 50}, "texto": "A4 · 3 × 1.000 · A6 · 3 × 2.000", "lado": "arriba"},
        {"clave": "9.000", "rect": {"x": 1300, "y": 912, "w": 200, "h": 28}, "texto": "9.000,00", "lado": "arriba"},
        {"clave": "contabilizar", "rect": {"x": 322, "y": 972, "w": 80, "h": 30}, "texto": "Contabilizar", "lado": "arriba"},
    ],
    narracion="Estas son las líneas del albarán: tres A4 a 1.000 y tres A6 a 2.000, ambas validadas. Total, 9.000 euros. Abajo está el botón contabilizar.",
    _hace="Revisar líneas y total del albarán.",
    _nota="Se corta antes del spinner «Realizando transacción» (≈5372 s). Verificar al renderizar que el plano previo es el mismo desplazamiento de página.")

add(id="calculo-albaran", tipo="calculo", titulo="El importe del albarán", etiqueta="Albarán 201501RC-000002",
    divisa="€", base={"etiqueta": "COCHE A6 · 3 × 2.000", "valor": 6000},
    pasos=[{"etiqueta": "COCHE A4 · 3 × 1.000 (de 4)", "importe": 3000, "clave": "3.000"}],
    resultado="Importe del albarán",
    narracion="La cuenta: 6.000 del A6 más 3.000 de los tres A4 recibidos. 9.000 euros. El cuarto A4 sigue pendiente.",
    _hace="Comprobar el importe del albarán frente al pedido.")

add(id="pedido-parcial", tipo="pantalla", titulo="El pedido, ahora parcial", url="Pedidos compras · 151201PC000003",
    clip=clip(V2, 5165, 5182), recorte=R,
    callouts=[
        {"clave": "parcial", "rect": {"x": 1008, "y": 314, "w": 160, "h": 24}, "texto": "Parcial", "lado": "abajo"},
        {"clave": "línea", "rect": {"x": 0, "y": 890, "w": 1660, "h": 48}, "texto": "A4: 4 pedidas, 3 servidas · A6: Servida", "lado": "arriba"},
    ],
    narracion="Al refrescar el pedido, su estado es parcial. Cada línea tiene el suyo: el A6 está servido, tres de tres; el A4, parcial, tres de cuatro.",
    _hace="Refrescar el pedido y revisar estado de cabecera y de cada línea (Servida / Parcial).")

add(id="opciones-parcial", tipo="conceptos", titulo="¿Y el coche que falta?",
    items=[
        {"titulo": "Esperar el resto", "texto": "Otro albarán con el mismo origen", "icono": "albaran", "clave": "esperar"},
        {"titulo": "Marcar como servido", "texto": "Se cierra y se factura lo recibido", "icono": "check", "clave": "marcar"},
        {"titulo": "Seguimiento", "texto": "Sale en los informes de pendientes", "icono": "buscar", "clave": "informes"},
    ],
    narracion="Con el A4 que falta tienes dos caminos. Esperar: cuando llegue, otro albarán con el mismo origen te ofrecerá la línea pendiente. O marcar el pedido como servido: queda cerrado y se factura solo lo recibido. Mientras tanto, aparecerá en los informes de pedidos pendientes.",
    _hace="Decidir qué hacer con lo pendiente: nuevo albarán o «Marcar como servido».")

add(id="asiento-albaran-pantalla", tipo="pantalla", titulo="Contabilizar el albarán", url="Movimientos contables en tiempo real",
    clip=clip(V2, 5425, 5445), recorte=R,
    zooms=[{"clave": "cuenta", "rect": {"x": 0, "y": 360, "w": 1120, "h": 50}, "dur": 1.4}, {"clave": "vista", "rect": {"x": 0, "y": 770, "w": 1680, "h": 80}}],
    callouts=[
        {"clave": "asiento", "rect": {"x": 560, "y": 288, "w": 320, "h": 48}, "texto": "Asiento 63 · Diario Compras", "lado": "abajo"},
        {"clave": "documento", "rect": {"x": 1110, "y": 288, "w": 330, "h": 24}, "texto": "201501RC-000002", "lado": "abajo"},
        {"clave": "cuenta", "rect": {"x": 6, "y": 374, "w": 1100, "h": 24}, "texto": "4009 · Proveedores, facturas pendientes de recibir o de formalizar", "lado": "abajo"},
        {"clave": "vista", "rect": {"x": 0, "y": 790, "w": 1660, "h": 46}, "texto": "4009 haber 9.000 · 6000 debe 9.000", "lado": "arriba"},
    ],
    narracion="Al contabilizar, el botón pasa a descontabilizar y, en la pestaña apuntes, ves el asiento 63 del diario de compras, con el albarán como documento. La cuenta 4009 se llama proveedores, facturas pendientes de recibir o de formalizar. En la vista, la 4009 va al haber por 9.000 euros y la 6000 al debe por lo mismo.",
    _hace="Contabilizar el albarán y consultar el asiento (pestaña Apuntes).")

add(id="asiento-albaran", tipo="comparativa", titulo="El asiento del albarán",
    etiquetas={"antes": "Debe", "ahora": "Haber"},
    filas=[
        {"aspecto": "Cuenta", "antes": "6000 · compras", "ahora": "4009 · facturas pendientes de recibir", "marca": "igual", "clave": "cuenta"},
        {"aspecto": "Importe", "antes": "9.000 €", "ahora": "9.000 €", "marca": "igual", "clave": "9.000"},
    ],
    narracion="Léelo así: al debe, la 6000, la cuenta de compras de los artículos; al haber, la 4009, porque la mercancía ya es tuya pero la factura todavía no ha llegado. 9.000 euros a cada lado.",
    _hace="Interpretar el asiento del albarán: 6000 al debe, 4009 al haber.",
    _nota="Descripción de la 6000 tomada de la explicación oral («cuenta de compras del artículo»); en pantalla solo se ve el número 6000.000000.")

add(id="por-que-4009", tipo="conceptos", titulo="¿Por qué contabilizar el albarán?",
    items=[
        {"titulo": "Gasto ya incurrido", "texto": "Mercancía recibida sin factura", "icono": "stock", "clave": "gasto"},
        {"titulo": "Opcional", "texto": "Empresas de stock, sí; servicios, quizá no", "icono": "engranaje", "clave": "opcional"},
        {"titulo": "Según el tipo", "texto": "Sin tipo de asiento, no hay botón", "icono": "documento", "clave": "botón"},
        {"titulo": "Cuadrar la 4009", "texto": "Cuenta genérica: vigílala", "icono": "alerta", "clave": "cuadre"},
    ],
    narracion="¿Para qué? Para reflejar un gasto ya incurrido: tienes la mercancía y sabes a quién se la debes, aunque no tengas factura. Es opcional: tiene sentido en empresas con stock y menos en servicios. El botón solo aparece si el tipo de albarán tiene tipo de asiento. Y la 4009 es una cuenta genérica, así que conviene vigilar su cuadre.",
    _hace="Decidir la política de contabilización de albaranes (cuenta 4009).")

add(id="valorar-sin-pedido", tipo="pantalla", titulo="¿Y si el albarán no tiene pedido?", url="Tipología de albaranes · Valoración",
    clip=clip(V2, 5644, 5658), recorte=R,
    zooms=[{"clave": "tipo", "rect": {"x": 0, "y": 380, "w": 700, "h": 140}, "dur": 1.4}],
    callouts=[
        {"clave": "tipo", "rect": {"x": 170, "y": 410, "w": 126, "h": 90}, "texto": "Tarifa · Última compra · Coste medio · No", "lado": "derecha"},
    ],
    narracion="Si el albarán viene de un pedido, el precio lo marca el pedido. Si no tiene origen, lo decide el tipo de albarán, en valoración: tarifa, última compra o coste medio. Una empresa de stock quizá prefiera coste medio; la caja de leche que llega cada día, última compra.",
    _hace="Elegir el criterio de valoración del tipo de albarán para albaranes sin pedido.",
    _nota="Se corta antes de 5660 s (pestaña de Google Calendar con aviso de reunión).")

add(id="repaso-cap7", tipo="resumen", etiqueta="Capítulo 7",
    items=[
        {"texto": "El albarán nace del pedido", "clave": "nace"},
        {"texto": "Agregar líneas y ajustar cantidades", "clave": "agregar"},
        {"texto": "Recepción parcial: pedido Parcial", "clave": "parcial"},
        {"texto": "Asiento: 6000 contra 4009", "clave": "asiento"},
        {"texto": "Sin pedido, valora el tipo", "clave": "valora"},
    ],
    narracion="Repaso: el albarán nace del pedido. Con agregar líneas traes las del pedido y ajustas lo recibido; si falta algo, el pedido queda parcial. El asiento lleva la 6000 contra la 4009. Y sin pedido, valora el tipo de albarán.")

# ───────────────────────────── CAP 8 ─────────────────────────────
add(id="cap8", tipo="capitulo", numero=8, titulo="Del albarán a la factura", subtitulo="Conformar, controlar y contabilizar",
    narracion="Capítulo ocho: del albarán a la factura.")

add(id="tipologia-fca", tipo="pantalla", titulo="El tipo de factura FCA", url="Tipología de facturas de compras",
    clip=clip(V2, 5686, 5694), recorte=R,
    zooms=[{"clave": "suministros", "rect": {"x": 0, "y": 250, "w": 1680, "h": 190}, "dur": 1.4}],
    callouts=[
        {"clave": "albaranes", "rect": {"x": 0, "y": 266, "w": 1680, "h": 26}, "texto": "FCA · Factura de Compra de Albaranes · FC-", "lado": "abajo"},
        {"clave": "suministros", "rect": {"x": 0, "y": 324, "w": 560, "h": 26}, "texto": "Tabla origen: Suministros", "lado": "abajo"},
        {"clave": "facturados", "rect": {"x": 0, "y": 350, "w": 700, "h": 24}, "texto": "estcab != 'F'", "lado": "abajo"},
        {"clave": "asiento", "rect": {"x": 4, "y": 406, "w": 280, "h": 24}, "texto": "Tipo asiento FCA", "lado": "abajo"},
    ],
    narracion="La factura también tiene tipo: FCA, factura de compra de albaranes, serie FC. Su origen son los suministros, es decir, los albaranes, y solo los que no están facturados. Lleva su tipo de asiento para contabilizar. Fíjate en que el tipo de workflow está vacío: luego lo echaremos de menos.",
    _hace="Revisar el tipo de factura: origen suministros, condición (no facturados), tipo de asiento, tipo de workflow.",
    _nota="Ruta: Compras › Maestros › Documentos › Facturas. Se evita 5660–5683 s (Google Calendar).")

add(id="alta-factura", tipo="pantalla", titulo="Registrar la factura del proveedor", url="Facturas compras · nueva",
    clip=clip(V2, 5816, 5845), recorte=R,
    zooms=[{"clave": "SEAT", "rect": {"x": 0, "y": 370, "w": 840, "h": 110}, "dur": 1.4}, {"clave": "8.750", "rect": {"x": 830, "y": 860, "w": 840, "h": 80}}],
    callouts=[
        {"clave": "SEAT", "rect": {"x": 0, "y": 398, "w": 420, "h": 24}, "texto": "Proveedor P00001 · SEAT", "lado": "abajo"},
        {"clave": "8.750", "rect": {"x": 1250, "y": 900, "w": 410, "h": 26}, "texto": "Importe factura 8.750", "lado": "arriba"},
        {"clave": "número", "rect": {"x": 1250, "y": 262, "w": 350, "h": 24}, "texto": "1215FC-000001", "lado": "abajo"},
    ],
    narracion="En Compras, facturas, registro, creamos una factura FCA. Su número interno se genera con la serie. El campo factura proveedor, en rojo, es obligatorio: aquí va el número que trae el papel, FACT uno, y no se puede repetir para el mismo proveedor y fecha. Elegimos SEAT, que completa el resto de datos, y tecleamos el importe del papel: 8.750 euros.",
    _hace="Nueva factura: tipo FCA; número de factura del proveedor (obligatorio, único por proveedor y fecha); proveedor; importe total de la factura en papel.",
    _nota="CORRECCIÓN: el importe 8.750 es un dato puesto a propósito por el formador («imaginemos que me dicen que son 8.750»); no cuadra con el albarán y provoca después el error 3000.")

add(id="conformar-menu", tipo="pantalla", titulo="Conformar albaranes", url="Facturas compras · 1215FC-000001",
    clip=clip(V2, 5860, 5872), recorte=R,
    zooms=[{"clave": "botón", "rect": {"x": 300, "y": 190, "w": 560, "h": 250}, "dur": 1.4}],
    callouts=[
        {"clave": "botón", "rect": {"x": 384, "y": 204, "w": 190, "h": 216}, "texto": "Conformar albaranes y variantes", "lado": "derecha"},
    ],
    narracion="Una factura puede venir de varios albaranes, por eso no se enlaza con un campo origen sino con el botón conformar albaranes. El menú tiene variantes: por otros terceros, por CIF, por delegación, desconformar o ver diferencias respecto al albarán.",
    _hace="Abrir «Conformar albaranes» y elegir la opción.")

add(id="conformar-rejilla", tipo="pantalla", titulo="Elegir el albarán", url="Conformar albaranes",
    clip=clip(V2, 5880, 5912), recorte=R,
    zooms=[{"clave": "totales", "rect": {"x": 0, "y": 370, "w": 1680, "h": 180}, "dur": 1.4}],
    callouts=[
        {"clave": "proveedor", "rect": {"x": 0, "y": 516, "w": 1660, "h": 26}, "texto": "201501RC-000002 · 9.000 · con IVA 10.890", "lado": "abajo"},
        {"clave": "totales", "rect": {"x": 0, "y": 384, "w": 1680, "h": 58}, "texto": "Importe factura 8.750", "lado": "abajo"},
        {"clave": "conformar", "rect": {"x": 0, "y": 972, "w": 600, "h": 30}, "texto": "Marcar · Conformar", "lado": "arriba"},
    ],
    narracion="El sistema busca los albaranes del mismo proveedor y divisa. Aparece el nuestro: 9.000 euros, 10.890 con IVA. Arriba, los totales comparan lo conciliado con el importe de la factura. Marcamos el albarán, se puede marcar más de uno, y pulsamos conformar.",
    _hace="Marcar uno o varios albaranes del proveedor y conformar.")

add(id="factura-impuestos", tipo="pantalla", titulo="Líneas e impuestos copiados", url="Facturas compras · 1215FC-000001",
    clip=clip(V2, 5933, 5938), recorte=R,
    zooms=[{"clave": "impuestos", "rect": {"x": 0, "y": 600, "w": 1680, "h": 100}, "dur": 1.4}],
    callouts=[
        {"clave": "impuestos", "rect": {"x": 0, "y": 636, "w": 1660, "h": 26}, "texto": "IVA general · base 9.000 · cuota 1.890", "lado": "arriba"},
        {"clave": "neto", "rect": {"x": 1250, "y": 900, "w": 410, "h": 42}, "texto": "Factura 8.750 · Importe neto 10.890", "lado": "arriba"},
    ],
    narracion="La factura toma las líneas y los impuestos del albarán: IVA general, base 9.000 y cuota 1.890. Abajo conviven dos cifras: el importe que tecleaste, 8.750, y el que llaman importe neto, 10.890, que en realidad ya lleva el IVA.",
    _hace="Comprobar líneas, base imponible, cuota de IVA y total calculado tras conformar.")

add(id="calculo-iva", tipo="calculo", titulo="El total calculado", etiqueta="Factura FACT-1",
    divisa="€", base={"etiqueta": "Base imponible (albarán)", "valor": 9000},
    pasos=[{"etiqueta": "IVA general 21 %", "porcentaje": 21, "clave": "21"}],
    resultado="Total con IVA",
    narracion="La cuenta del sistema: 9.000 euros más el 21 por ciento de IVA dan 10.890. El papel decía 8.750. Algo no cuadra.",
    _hace="Calcular el total con IVA.",
    _nota="CORRECCIÓN: la transcripción dice «10.990»; el ERP muestra 10.890,00.")

add(id="cuidado-neto", tipo="cuidado", titulo="«Importe neto» lleva IVA",
    texto="En la factura de compra, el campo «Importe neto» muestra el total calculado con IVA. No lo confundas con la base.",
    narracion="Cuidado con el nombre: en esta pantalla, importe neto es el total con IVA, no la base imponible.",
    _hace="Interpretar correctamente los importes de la factura.")

add(id="crc", tipo="flujo", titulo="El aviso del CRC",
    nodos=[
        {"id": "a", "titulo": "Abres la pantalla", "subtitulo": "se calcula un CRC", "icono": "pantalla", "clave": "abres"},
        {"id": "b", "titulo": "Algo cambia", "subtitulo": "otra pestaña u otro usuario", "icono": "cambio", "clave": "cambia"},
        {"id": "c", "titulo": "Al grabar", "subtitulo": "no coincide", "icono": "alerta", "clave": "grabar"},
        {"id": "d", "titulo": "Recargar", "subtitulo": "Alt + R y repetir", "icono": "check", "clave": "recarga"},
    ],
    narracion="Al cambiar el tipo FCA con la factura abierta, salió el aviso de que el CRC ha cambiado. Cuando abres una pantalla, el sistema calcula una huella, un CRC, de los datos y de su parametrización. Si algo cambia mientras tanto, en otra pestaña o por otro usuario, al grabar no coincide y te para. No es un error de datos: recarga y repite.",
    _hace="Ante «el CRC ha cambiado», recargar la pantalla y repetir la acción.",
    _nota="El cuadro del mensaje CRC no aparece en ningún fotograma (pantalla fija 5980–6120 s); se explica con diagrama.")

add(id="forzar-actualizacion", tipo="pantalla", titulo="Forzar actualización de datos", url="Facturas compras",
    clip=clip(V2, 6140, 6150), recorte=R,
    zooms=[{"clave": "botón", "rect": {"x": 900, "y": 100, "w": 640, "h": 120}, "dur": 1.2}],
    callouts=[
        {"clave": "botón", "rect": {"x": 1100, "y": 112, "w": 340, "h": 86}, "texto": "Forzar actualización (Alt + R)", "lado": "abajo"},
    ],
    narracion="Para recargar tienes este botón de la barra superior: forzar actualización de datos, con el atajo alt más erre.",
    _hace="Pulsar «Forzar actualización de datos» (Alt+R).")

add(id="error-3000", tipo="comparativa", titulo="Error 3000: los importes no cuadran",
    etiquetas={"antes": "Tecleado (proveedor)", "ahora": "Calculado (sistema)"},
    filas=[
        {"aspecto": "Factura FACT-1", "antes": "8.750 €", "ahora": "10.890 €", "marca": "cambio", "clave": "compara"},
        {"aspecto": "Al validar", "antes": "Workflow: error 3000, bloqueada", "ahora": "Corregido a 10.890: cuadra", "marca": "mejora", "clave": "avisa"},
    ],
    narracion="Ahora sí, validamos, y el workflow compara el importe tecleado con el calculado. No coinciden, así que bloquea la factura con el error 3000: importe proveedor diferente importe factura. Te avisa si el proveedor factura mal o si el precio del pedido estaba equivocado.",
    _hace="Validar la factura; si el workflow bloquea por diferencia de importes (error 3000), revisar y corregir el importe.",
    _nota="El texto del error 3000 se cita del audio (1:42:38); no aparece en ningún fotograma.")

add(id="correccion-importe", tipo="pantalla", titulo="Importe corregido y albarán facturado", url="Facturas compras · 1215FC-000001",
    clip=clip(V2, 6232, 6262), recorte=R,
    zooms=[{"clave": "líneas", "rect": {"x": 0, "y": 760, "w": 1680, "h": 180}, "dur": 1.4}],
    callouts=[
        {"clave": "10.890", "rect": {"x": 1498, "y": 580, "w": 162, "h": 24}, "texto": "Importe factura 10.890", "lado": "abajo"},
        {"clave": "líneas", "rect": {"x": 0, "y": 788, "w": 1660, "h": 34}, "texto": "A6 6.000 · A4 3.000", "lado": "arriba"},
        {"clave": "facturado", "rect": {"x": 0, "y": 896, "w": 1660, "h": 28}, "texto": "Albarán origen: Facturado", "lado": "arriba"},
    ],
    narracion="El importe de la factura queda en 10.890. Debajo, las líneas que vinieron del albarán; los precios se arrastran desde el pedido. Y en albarán origen, el nuestro ya figura como facturado.",
    _hace="Verificar importe corregido, líneas y estado «Facturado» del albarán de origen.")

add(id="asiento-factura-pantalla", tipo="pantalla", titulo="Contabilizar la factura", url="Movimientos contables en tiempo real",
    clip=clip(V2, 6344, 6356), recorte=R,
    zooms=[{"clave": "tres", "rect": {"x": 0, "y": 680, "w": 1680, "h": 90}, "dur": 1.4}],
    callouts=[
        {"clave": "asiento", "rect": {"x": 700, "y": 190, "w": 120, "h": 22}, "texto": "Asiento 64", "lado": "abajo"},
        {"clave": "documento", "rect": {"x": 1250, "y": 190, "w": 240, "h": 22}, "texto": "FACT-1", "lado": "abajo"},
        {"clave": "tres", "rect": {"x": 0, "y": 694, "w": 1660, "h": 66}, "texto": "4000.000002 SEAT · 4720 · 4009", "lado": "arriba"},
    ],
    narracion="Por último, contabilizamos la factura: asiento 64, con FACT uno como documento. Tiene tres líneas: la cuenta del proveedor SEAT al haber por 10.890; la 4720, la del IVA, al debe por 1.890; y la 4009 al debe por 9.000.",
    _hace="Contabilizar la factura y revisar su asiento.",
    _nota="El vídeo de origen termina a 6396 s con el widget del grabador (≥6389 s); el clip acaba en 6356.")

add(id="asiento-factura", tipo="estructura", titulo="El asiento de la factura",
    raiz={"titulo": "FACT-1", "subtitulo": "10.890 €", "icono": "factura", "clave": "ordenado"},
    ramas=[
        {"titulo": "Debe", "icono": "mas", "clave": "debe", "hijos": [
            {"titulo": "4720 · IVA", "detalle": "1.890 €", "clave": "IVA"},
            {"titulo": "4009 · cancela el albarán", "detalle": "9.000 €", "clave": "cancela"}]},
        {"titulo": "Haber", "icono": "proveedor", "clave": "haber", "hijos": [
            {"titulo": "4000.000002 · SEAT", "detalle": "10.890 €", "clave": "SEAT"}]},
    ],
    narracion="Ordenado queda así. Al debe: el IVA, 1.890, y la 4009 por 9.000, que cancela lo que puso el albarán. Al haber: la deuda con SEAT, 10.890 euros.",
    _hace="Interpretar el asiento de la factura.")

add(id="vida-4009", tipo="flujo", titulo="La vida de la cuenta 4009",
    nodos=[
        {"id": "a", "titulo": "Albarán", "subtitulo": "4009 al haber", "icono": "albaran", "clave": "albarán", "importe": 9000},
        {"id": "f", "titulo": "Factura", "subtitulo": "4009 al debe", "icono": "factura", "clave": "factura", "importe": 9000},
        {"id": "s", "titulo": "Saldo 4009", "subtitulo": "cuadrado", "icono": "check", "clave": "cero", "importe": 0},
    ],
    narracion="Y esta es la vida de la 4009: el albarán la abona por 9.000, la factura la carga por lo mismo, y su saldo vuelve a cero. Si algún albarán se queda sin factura, lo verás aquí.",
    _hace="Explicar cómo la factura cancela el saldo de la 4009 generado por el albarán.")

add(id="repaso-cap8", tipo="resumen", etiqueta="Capítulo 8",
    items=[
        {"texto": "Número del proveedor, obligatorio y único", "clave": "número"},
        {"texto": "Conformar uno o varios albaranes", "clave": "conforma"},
        {"texto": "CRC: recarga y repite", "clave": "CRC"},
        {"texto": "Error 3000: importes distintos", "clave": "3000"},
        {"texto": "La factura cancela la 4009", "clave": "cancela"},
    ],
    narracion="Repaso: el número de factura del proveedor es obligatorio y único. La factura se conforma con uno o varios albaranes. Si sale el CRC, recarga y repite. El error 3000 avisa de importes distintos. Y al contabilizar, la factura cancela la 4009.")

# ───────────────────────────── CAP 9 ─────────────────────────────
add(id="cap9", tipo="capitulo", numero=9, titulo="Resumen final", subtitulo="Todo el circuito de un vistazo",
    narracion="Capítulo nueve: resumen final.")

add(id="ciclo-completo", tipo="flujo", titulo="El circuito completo",
    nodos=[
        {"id": "t", "titulo": "Tarifa", "subtitulo": "G00003 · A6", "icono": "tarifa", "clave": "tarifa", "importe": 2000},
        {"id": "p", "titulo": "Pedido", "subtitulo": "validado", "icono": "pedido", "clave": "pedido", "codigo": "151201PC000003", "importe": 10000},
        {"id": "a", "titulo": "Albarán", "subtitulo": "3 de 4 A4", "icono": "albaran", "clave": "albarán", "codigo": "201501RC-000002", "importe": 9000},
        {"id": "f", "titulo": "Factura", "subtitulo": "con IVA", "icono": "factura", "clave": "factura", "codigo": "FACT-1", "importe": 10890},
    ],
    narracion="Todo el recorrido. La tarifa del proveedor puso el precio del A6, 2.000 euros. El pedido sumó 10.000 y pasó el workflow. El albarán recibió 9.000, con un A4 pendiente, y se contabilizó contra la 4009. Y la factura, conformada con ese albarán, se validó por 10.890 con IVA y canceló la 4009.",
    _hace="Recapitular el circuito con las cifras del ejemplo.")

add(id="errores-tipicos", tipo="conceptos", titulo="Errores típicos y su solución",
    items=[
        {"titulo": "Precio 0", "texto": "Revisa la tarifa del proveedor", "icono": "alerta", "clave": "cero"},
        {"titulo": "No encuentro el pedido", "texto": "Misma empresa y delegación; estado V o P", "icono": "buscar", "clave": "encuentras"},
        {"titulo": "Pedido bloqueado", "texto": "Es el workflow, no un error", "icono": "reloj", "clave": "bloqueado"},
        {"titulo": "El CRC ha cambiado", "texto": "Forzar actualización (Alt + R)", "icono": "cambio", "clave": "CRC"},
        {"titulo": "Error 3000", "texto": "Importe tecleado ≠ calculado", "icono": "factura", "clave": "3000"},
    ],
    narracion="Y por si te atascas. ¿Precio cero? Revisa la tarifa del proveedor. ¿No encuentras el pedido al hacer el albarán? Comprueba empresa, delegación y que esté validado o parcial. ¿Pedido bloqueado? Es el workflow. ¿El CRC ha cambiado? Recarga. ¿Error 3000? El importe tecleado no coincide con el calculado.",
    _hace="Repasar incidencias frecuentes y su solución.")

add(id="checklist", tipo="resumen", titulo="Checklist de una compra",
    items=[
        {"texto": "Tarifa vigente asignada al proveedor", "clave": "tarifa"},
        {"texto": "Tipo y serie bien dimensionados", "clave": "serie"},
        {"texto": "Pedido validado tras el workflow", "clave": "pedido"},
        {"texto": "Albarán con lo realmente recibido", "clave": "albarán"},
        {"texto": "Factura conformada y cuadrada", "clave": "factura"},
        {"texto": "4009 sin saldos olvidados", "clave": "4009"},
    ],
    narracion="Tu checklist: tarifa vigente asignada al proveedor; tipo y serie bien dimensionados; pedido validado tras el workflow; albarán con lo realmente recibido; factura conformada y cuadrada; y la 4009, sin saldos olvidados.")

add(id="cierre", tipo="cierre", titulo="¡Ya dominas el circuito de compras!",
    subtitulo="De la tarifa al asiento de la factura",
    siguientes=["Workflow de aprobación", "Contabilidad de compras", "Devoluciones", "Seguimiento de pedidos"],
    narracion="Y hasta aquí este tutorial. Ya sabes llevar una compra desde la tarifa hasta el asiento de la factura. En próximos vídeos veremos el workflow, la contabilidad, las devoluciones y el seguimiento de pedidos. ¡Hasta pronto!")


# ═════════════ PASO A PASO (añadido tras el matiz del usuario) ═════════════
def sinpantalla(id, titulo, texto, narracion, hace):
    add(id=id, tipo="cuidado", etiqueta="Sin pantalla", titulo=titulo, texto=texto, narracion=narracion,
        _hace=hace, _sinpantalla=True,
        _nota="SIN PANTALLA: el paso no aparece en los vídeos de origen; no se muestra ni se describe más allá de lo que consta.")

# --- Cap 2: crear tarifa (no grabado)
sinpantalla("sp-alta-tarifa", "Alta de una tarifa nueva",
    "En la grabación solo se consulta una tarifa existente. El alta de cabecera y líneas no se ve.",
    "Un aviso: en la grabación solo se consulta una tarifa que ya existía. El alta de una tarifa nueva, con su cabecera y sus líneas, no aparece, así que no te la enseñamos clic a clic.",
    "Crear tarifa: nueva cabecera (código, divisa, fechas) y añadir líneas (artículo, unidad, vigencia, precio). Grabar en la versión nueva.")

# --- Cap 3: asignar tarifa al proveedor
sinpantalla("sp-terceros", "Cómo llegar a Terceros",
    "En el vídeo la ficha de terceros se abre tecleando su dirección; la ruta de menú no se ve.",
    "Primer paso: abrir la ficha de terceros. En el vídeo se abre tecleando su dirección en el navegador, así que la ruta del menú no la verás.",
    "Abrir el maestro de Terceros y buscar el proveedor.")

add(id="prov-paso1", tipo="pantalla", etiqueta="Asignar tarifa · paso 1 de 4", titulo="Abre el tercero y su pestaña Proveedores", url="Terceros · P00001",
    clip=clip(V2, 439, 443.8), recorte=R,
    callouts=[
        {"clave": "SEAT", "rect": {"x": 0, "y": 292, "w": 800, "h": 24}, "texto": "Tercero P00001 · SEAT", "lado": "abajo"},
        {"clave": "pestaña", "rect": {"x": 184, "y": 206, "w": 100, "h": 26}, "texto": "Pulsa Proveedores", "lado": "abajo"},
    ],
    narracion="En la ficha del tercero SEAT, pulsa la pestaña proveedores. Se abre el maestro de proveedores de ese tercero.",
    _hace="En la ficha del tercero, pulsar la pestaña Proveedores.")

add(id="prov-paso2", tipo="pantalla", etiqueta="Asignar tarifa · paso 2 de 4", titulo="Busca Tarifa precios en Datos económicos", url="Maestro de proveedores · P00001",
    clip=clip(V2, 448, 458), recorte=R,
    zooms=[{"clave": "datos", "rect": {"x": 0, "y": 690, "w": 1300, "h": 210}, "dur": 1.4}],
    callouts=[
        {"clave": "datos", "rect": {"x": 0, "y": 710, "w": 1680, "h": 96}, "texto": "Bloque Datos económicos", "lado": "arriba"},
        {"clave": "COMPRA", "rect": {"x": 836, "y": 730, "w": 326, "h": 26}, "texto": "Tarifa precios: COMPRA (caducada)", "lado": "arriba"},
    ],
    narracion="Baja hasta el bloque datos económicos. El campo tarifa precios tiene la tarifa COMPRA, que ya está caducada. Abre su lista desplegable.",
    _hace="En Datos económicos, localizar Tarifa precios y abrir su lista.")

add(id="prov-paso3", tipo="pantalla", etiqueta="Asignar tarifa · paso 3 de 4", titulo="Elige la tarifa vigente", url="Tarifas de precios de compras (definición)",
    clip=clip(V2, 463.5, 468), recorte=RMOD,
    zooms=[{"clave": "vigente", "rect": {"x": 180, "y": 380, "w": 1310, "h": 100}, "dur": 1.2}],
    callouts=[
        {"clave": "COMPRA", "rect": {"x": 188, "y": 406, "w": 1290, "h": 26}, "texto": "COMPRA · hasta 31-08-2015", "lado": "arriba"},
        {"clave": "elige", "rect": {"x": 188, "y": 433, "w": 1290, "h": 26}, "texto": "Elige G00003 · hasta 01-01-3000", "lado": "abajo"},
    ],
    narracion="La lista muestra las tarifas de compra con sus fechas: COMPRA, caducada, y G cero cero cero cero tres, vigente. Elige la G cero cero cero cero tres.",
    _hace="Seleccionar en la lista la tarifa de compra vigente.")

# --- Cap 4: serie
add(id="abrir-serie", tipo="pantalla", etiqueta="Definir la serie · paso 2 de 3", titulo="Abre la lista de series", url="Series de justificantes",
    clip=clip(V2, 1155, 1160.5), recorte=RMOD,
    zooms=[{"clave": "copias", "rect": {"x": 180, "y": 400, "w": 1310, "h": 260}, "dur": 1.4}],
    callouts=[
        {"clave": "lupa", "rect": {"x": 188, "y": 405, "w": 1290, "h": 248}, "texto": "Series de Pedidos de compras", "lado": "abajo"},
        {"clave": "copias", "rect": {"x": 188, "y": 570, "w": 1290, "h": 24}, "texto": "151201PC- · copia con máscara", "lado": "abajo"},
        {"clave": "abre", "rect": {"x": 188, "y": 597, "w": 1290, "h": 24}, "texto": "Abre PC-", "lado": "abajo"},
    ],
    narracion="Desde la lupa del campo serie se abre la lista de series de pedidos de compras. Verás la PC y varias copias con máscara. Abre la serie PC.",
    _hace="Desde el campo Serie del tipo de documento, abrir la lista de series y entrar en la serie.")

sinpantalla("sp-alta-serie", "Crear una serie nueva",
    "La grabación consulta la serie PC-; no se ve cómo se da de alta una serie ni cómo se asigna una máscara.",
    "La grabación consulta la serie PC, pero no muestra cómo se crea una serie nueva ni cómo se le asigna una máscara.",
    "Crear una serie (tabla, código, numerador, justificación, separador, control cronológico, renovación, máscara) y asignarla al tipo de documento.")

# --- Cap 6: pedido
add(id="ped-nuevo", tipo="pantalla", etiqueta="Crear el pedido · paso 2 de 7", titulo="Pulsa Nuevo", url="Pedidos compras",
    clip=clip(V2, 3118, 3136), recorte=R,
    callouts=[
        {"clave": "anterior", "rect": {"x": 1008, "y": 366, "w": 200, "h": 24}, "texto": "Pedido anterior: Bloqueado", "lado": "abajo"},
        {"clave": "nuevo", "rect": {"x": 1150, "y": 112, "w": 50, "h": 50}, "texto": "Pulsa Nuevo", "lado": "abajo"},
        {"clave": "blanco", "rect": {"x": 1250, "y": 264, "w": 336, "h": 24}, "texto": "151201PC- sin número", "lado": "abajo"},
    ],
    narracion="Se abre el último pedido, el anterior, aún bloqueado. Pulsa el botón nuevo de la barra superior y aparece un pedido en blanco, con la serie y sin número.",
    _hace="En el registro de pedidos, pulsar Nuevo.")

add(id="ped-proveedor", tipo="pantalla", etiqueta="Crear el pedido · paso 4 de 7", titulo="Elige el proveedor", url="Pedidos compras · nuevo",
    clip=clip(V2, 3356, 3361.5), recorte=R,
    zooms=[{"clave": "pedir", "rect": {"x": 0, "y": 400, "w": 1680, "h": 120}, "dur": 1.4}],
    callouts=[
        {"clave": "pedir", "rect": {"x": 0, "y": 424, "w": 420, "h": 24}, "texto": "Proveedor P00001 · SEAT", "lado": "abajo"},
        {"clave": "recepcionar", "rect": {"x": 836, "y": 424, "w": 830, "h": 24}, "texto": "Recepcionar en: G00001", "lado": "abajo"},
    ],
    narracion="En pedir a, elige el proveedor SEAT. A la derecha, recepcionar en indica quién recibe la mercancía.",
    _hace="Informar el proveedor (Pedir a) y revisar Recepcionar en.")

add(id="ped-guardar", tipo="pantalla", etiqueta="Crear el pedido · paso 6 de 7", titulo="Guarda: el pedido recibe número", url="Pedidos compras · 151201PC000003",
    clip=clip(V2, 3474, 3496), recorte=R,
    callouts=[
        {"clave": "número", "rect": {"x": 1416, "y": 262, "w": 170, "h": 26}, "texto": "151201PC000003", "lado": "abajo"},
        {"clave": "bloqueado", "rect": {"x": 1008, "y": 366, "w": 200, "h": 24}, "texto": "Bloqueado 26000", "lado": "abajo"},
        {"clave": "botones", "rect": {"x": 0, "y": 962, "w": 1100, "h": 32}, "texto": "Botones del workflow", "lado": "arriba"},
    ],
    narracion="Pulsa insertar para guardar la cabecera. El pedido recibe su número: quince, doce, cero uno, PC, y el tres. Y fíjate: nace bloqueado, con el código 26000, por el workflow del tipo PC. Abajo aparecen sus botones.",
    _hace="Guardar la cabecera; comprobar número asignado y estado inicial.",
    _nota="El pedido ya está «Bloqueado 26000» tras guardar (fotograma ≈3488 s), antes de pulsar nada más.")

add(id="val-paso1", tipo="pantalla", etiqueta="Validar el pedido · paso 1 de 4", titulo="Pulsa >3000€ Autorizar", url="Pedidos compras · 151201PC000003",
    clip=clip(V2, 4084, 4097), recorte=R,
    callouts=[
        {"clave": "bloqueado", "rect": {"x": 1008, "y": 366, "w": 200, "h": 24}, "texto": "Bloqueado 26000", "lado": "abajo"},
        {"_vs": 4085, "rect": {"x": 390, "y": 962, "w": 130, "h": 30}, "texto": "Pulsa >3000€ Autorizar", "lado": "arriba"},
        {"_vs": 4093.4, "_vshasta": 4096, "rect": {"x": 616, "y": 386, "w": 444, "h": 318}, "texto": "Escribe el motivo y Ok", "lado": "derecha"},
    ],
    narracion="El pedido está bloqueado y supera los 3.000 euros, así que la barra ofrece el botón autorizar de más de 3.000 euros. Púlsalo, escribe el motivo y acepta.",
    _hace="Con el pedido bloqueado por el workflow, lanzar la autorización e indicar el motivo.")

add(id="val-paso2", tipo="pantalla", etiqueta="Validar el pedido · paso 2 de 4", titulo="Aprobaciones encadenadas", url="Pedidos compras · 151201PC000003",
    clip=clip(V2, 4100, 4124), recorte=R,
    callouts=[
        {"_vs": 4101, "rect": {"x": 210, "y": 962, "w": 175, "h": 30}, "texto": "Aprobar Jefe de Central", "lado": "arriba"},
        {"_vs": 4110, "rect": {"x": 210, "y": 962, "w": 180, "h": 30}, "texto": "Aprobar Director General", "lado": "arriba"},
        {"_vs": 4118, "rect": {"x": 210, "y": 962, "w": 148, "h": 30}, "texto": "Aprobación Comité", "lado": "arriba"},
    ],
    narracion="Después llega una cadena de aprobaciones, cada una como un botón en el mismo sitio de la barra: aprobar jefe de central, aprobar director general y aprobación del comité.",
    _hace="Ejecutar las aprobaciones sucesivas del workflow.")

add(id="val-paso3", tipo="pantalla", etiqueta="Validar el pedido · paso 3 de 4", titulo="Confirma el envío", url="Pedidos compras · 151201PC000003",
    clip=clip(V2, 4125, 4138), recorte=R,
    callouts=[
        {"clave": "confirmar", "rect": {"x": 210, "y": 962, "w": 155, "h": 30}, "texto": "Confirmar Envío mail", "lado": "arriba"},
    ],
    narracion="El último paso es confirmar el envío del pedido por correo al proveedor. En la grabación el correo no estaba configurado y se confirmó directamente.",
    _hace="Enviar el pedido al proveedor y confirmar el envío.",
    _nota="Se excluye 4140–4192 s (ventana de e-mail y dirección tecleada).")

# --- Cap 7: albarán
add(id="alb-menu", tipo="pantalla", etiqueta="Crear el albarán · paso 1 de 6", titulo="Abre Compras › Albaranes › Registro", url="erp/desktop · Compras › Albaranes",
    clip=clip(V2, 4712, 4715.5), recorte=RM,
    zooms=[{"clave": "registro", "rect": {"x": 0, "y": 280, "w": 420, "h": 200}, "dur": 1.2}],
    callouts=[
        {"clave": "albaranes", "rect": {"x": 28, "y": 330, "w": 200, "h": 24}, "texto": "Compras › Albaranes", "lado": "derecha"},
        {"clave": "registro", "rect": {"x": 60, "y": 353, "w": 140, "h": 24}, "texto": "Registro", "lado": "derecha"},
    ],
    narracion="Para recibir la mercancía, abre Compras, albaranes, registro.",
    _hace="Abrir Compras › Albaranes › Registro.")

add(id="alb-origen-obligatorio", tipo="pantalla", etiqueta="Crear el albarán · paso 3 de 6", titulo="El origen es obligatorio", url="Albaranes compras · nuevo",
    clip=clip(V2, 4806, 4820), recorte=R,
    zooms=[{"clave": "origen", "rect": {"x": 830, "y": 240, "w": 840, "h": 110}, "dur": 1.2}],
    callouts=[
        {"clave": "origen", "rect": {"x": 1180, "y": 282, "w": 440, "h": 30}, "texto": "Debe completar (Origen)", "lado": "abajo"},
    ],
    narracion="Si intentas seguir sin origen, el sistema lo marca en rojo: debes completarlo, porque el tipo RC exige un pedido.",
    _hace="Informar el campo Origen (obligatorio en el tipo RC).")

add(id="alb-heredados", tipo="pantalla", etiqueta="Crear el albarán · paso 4 de 6", titulo="Datos heredados del pedido", url="Albaranes compras · nuevo",
    clip=clip(V2, 4850, 4866), recorte=R,
    callouts=[
        {"clave": "origen", "rect": {"x": 1270, "y": 288, "w": 340, "h": 24}, "texto": "Origen 151201PC000003", "lado": "abajo"},
        {"clave": "proveedor", "rect": {"x": 0, "y": 426, "w": 420, "h": 24}, "texto": "Proveedor P00001 · SEAT", "lado": "abajo"},
        {"clave": "forma", "rect": {"x": 836, "y": 716, "w": 300, "h": 48}, "texto": "Tipo efecto TF · Forma pago 045", "lado": "arriba"},
    ],
    narracion="Con el origen elegido, el albarán hereda del pedido el proveedor, SEAT, la divisa, el tipo de efecto y la forma de pago.",
    _hace="Comprobar los datos heredados del pedido.")

add(id="alb-insertar", tipo="pantalla", etiqueta="Crear el albarán · paso 5 de 6", titulo="Inserta el albarán", url="Albaranes compras",
    clip=clip(V2, 4870, 4882), recorte=R,
    callouts=[
        {"clave": "insertar", "rect": {"x": 1200, "y": 112, "w": 50, "h": 50}, "texto": "Insertar (Shift + Enter)", "lado": "abajo"},
        {"clave": "validado", "rect": {"x": 1008, "y": 366, "w": 120, "h": 24}, "texto": "Validado", "lado": "abajo"},
    ],
    narracion="Pulsa insertar, o mayúsculas más intro. El albarán se graba y queda validado al momento.",
    _hace="Insertar (grabar) la cabecera del albarán.")

add(id="alb-contabilizar", tipo="pantalla", etiqueta="Contabilizar el albarán · paso 1 de 2", titulo="Pulsa Contabilizar", url="Albaranes compras · 201501RC-000002",
    clip=clip(V2, 5369, 5383), recorte=R,
    callouts=[
        {"_vs": 5369.5, "rect": {"x": 314, "y": 972, "w": 92, "h": 28}, "texto": "Pulsa Contabilizar", "lado": "arriba", "hasta": 3.5},
        {"_vs": 5377, "rect": {"x": 310, "y": 972, "w": 118, "h": 28}, "texto": "Ahora: Descontabilizar", "lado": "arriba"},
        {"_vs": 5378, "rect": {"x": 1003, "y": 340, "w": 80, "h": 24}, "texto": "Fecha contabilización", "lado": "abajo"},
        {"_vs": 5380, "rect": {"x": 400, "y": 180, "w": 78, "h": 26}, "texto": "Pestaña Apuntes", "lado": "abajo"},
    ],
    narracion="Pulsa contabilizar. Al terminar, el botón pasa a descontabilizar y se rellena la fecha de contabilización. Para ver el asiento, abre la pestaña apuntes.",
    _hace="Contabilizar el albarán y abrir la pestaña Apuntes.")

# --- Cap 8: factura
add(id="fac-menu", tipo="pantalla", etiqueta="Registrar la factura · paso 1 de 4", titulo="Abre Compras › Facturas › Registro", url="erp/desktop · Compras › Facturas",
    clip=clip(V2, 5724, 5726.5), recorte=RM,
    zooms=[{"clave": "registro", "rect": {"x": 0, "y": 220, "w": 420, "h": 220}, "dur": 1.2}],
    callouts=[
        {"clave": "facturas", "rect": {"x": 28, "y": 250, "w": 200, "h": 24}, "texto": "Compras › Facturas", "lado": "derecha"},
        {"clave": "registro", "rect": {"x": 60, "y": 273, "w": 140, "h": 24}, "texto": "Registro", "lado": "derecha"},
    ],
    narracion="Cuando llega la factura del proveedor, abre Compras, facturas, registro.",
    _hace="Abrir Compras › Facturas › Registro.")

add(id="fac-obligatorio", tipo="pantalla", etiqueta="Registrar la factura · paso 2 de 4", titulo="Nueva factura: falta el número del proveedor", url="Facturas compras · nueva",
    clip=clip(V2, 5756, 5776), recorte=R,
    zooms=[{"clave": "rojo", "rect": {"x": 830, "y": 240, "w": 840, "h": 120}, "dur": 1.4}],
    callouts=[
        {"clave": "FCA", "rect": {"x": 0, "y": 264, "w": 620, "h": 24}, "texto": "Tipo FCA", "lado": "abajo"},
        {"clave": "rojo", "rect": {"x": 1250, "y": 314, "w": 350, "h": 24}, "texto": "Factura proveedor: obligatorio", "lado": "abajo"},
        {"_vs": 5769, "rect": {"x": 1130, "y": 308, "w": 470, "h": 32}, "texto": "Debe completar (Factura proveedor)", "lado": "abajo"},
    ],
    narracion="Con nuevo se abre una factura de tipo FCA. El campo factura proveedor está en rojo: es obligatorio, y si lo dejas vacío el sistema te avisa.",
    _hace="Nueva factura de tipo FCA; el número de factura del proveedor es obligatorio.")

add(id="fac-numero", tipo="pantalla", etiqueta="Registrar la factura · paso 3 de 4", titulo="Teclea el número del proveedor", url="Facturas compras · nueva",
    clip=clip(V2, 5779, 5796), recorte=R,
    callouts=[
        {"clave": "FACT", "rect": {"x": 1250, "y": 314, "w": 350, "h": 24}, "texto": "FACT-1", "lado": "abajo"},
    ],
    narracion="Teclea el número que trae el papel, FACT uno. No se puede repetir para el mismo proveedor y fecha, así evitas registrar dos veces la misma factura.",
    _hace="Informar el número de factura del proveedor.")

add(id="err-validar", tipo="pantalla", etiqueta="Resolver el error 3000 · paso 2 de 3", titulo="Valida: factura bloqueada", url="Facturas compras · 1215FC-000001",
    clip=clip(V2, 6165, 6174), recorte=R,
    zooms=[{"clave": "bloqueada", "rect": {"x": 830, "y": 290, "w": 840, "h": 120}, "dur": 1.4}],
    callouts=[
        {"clave": "valida", "rect": {"x": 76, "y": 972, "w": 72, "h": 30}, "texto": "Pulsa Validar", "lado": "arriba"},
        {"clave": "bloqueada", "rect": {"x": 1005, "y": 318, "w": 460, "h": 76}, "texto": "Bloqueada 3000: IMPORTE PROVEEDOR != IMPORTE FACTURA", "lado": "abajo"},
    ],
    narracion="Pulsa validar. El workflow compara importes y la factura queda bloqueada con el código 3000. Pasa el ratón por la lupa: importe proveedor distinto de importe factura.",
    _hace="Validar la factura y leer el motivo del bloqueo (código 3000).",
    _nota="CORRECCIÓN: el informe de tramo 5 decía que el mensaje no aparece en ningún fotograma; sí se ve: Estado «Bloqueada 3000» con la descripción «IMPORTE PROVEEDOR != IMPORTE FACTURA» (≈6172 s).")

add(id="err-corregir", tipo="pantalla", etiqueta="Resolver el error 3000 · paso 3 de 3", titulo="Corrige el importe", url="Facturas compras · 1215FC-000001",
    clip=clip(V2, 6214, 6232), recorte=R,
    callouts=[
        {"clave": "importe", "rect": {"x": 1250, "y": 570, "w": 410, "h": 140}, "texto": "Importe factura → 10.890", "lado": "izquierda"},
    ],
    narracion="La solución es revisar el papel y los albaranes. Aquí el error era a propósito, así que corrige el importe de la factura a 10.890, el que de verdad corresponde, y vuelve a validar.",
    _hace="Corregir el importe de la factura y validar de nuevo.",
    _nota="Antes de corregir el importe se ve cómo el formador repasa base y cuota (≈6185–6200 s). Verificar al renderizar la posición del campo, porque la página está desplazada.")

add(id="fac-contabilizar", tipo="pantalla", etiqueta="Contabilizar la factura · paso 1 de 2", titulo="Contabiliza con fecha", url="Facturas compras · 1215FC-000001",
    clip=clip(V2, 6324, 6336.5), recorte=R,
    callouts=[
        {"_vs": 6325.5, "rect": {"x": 650, "y": 428, "w": 380, "h": 232}, "texto": "Fecha de contabilización · Ok", "lado": "derecha", "hasta": 4.5},
        {"_vs": 6332, "rect": {"x": 1008, "y": 342, "w": 130, "h": 24}, "texto": "Contabilizada", "lado": "abajo"},
        {"_vs": 6333, "rect": {"x": 88, "y": 972, "w": 106, "h": 30}, "texto": "Descontabilizar", "lado": "arriba"},
    ],
    narracion="Pulsa contabilizar. El sistema pide la fecha de contabilización, por defecto la del documento; acepta. La factura pasa a contabilizada.",
    _hace="Contabilizar la factura indicando la fecha de contabilización.")

sinpantalla("sp-workflow-fca", "Añadir el workflow al tipo FCA",
    "El formador añadió un tipo de workflow a la tipología FCA con la factura abierta; ese cambio no se ve en pantalla.",
    "Antes de validar, el formador asignó un workflow al tipo de factura FCA. Ese cambio no se ve en la grabación, pero tuvo una consecuencia que sí verás.",
    "En la tipología de facturas FCA, informar Tipo workflow (control importe proveedor = importe calculado).")

# ═════════════ AJUSTES A ESCENAS EXISTENTES ═════════════
MOD = {
    "menu-tarifas": {"etiqueta": "Consultar una tarifa · paso 1 de 5", "titulo": "Abre Precios › Registro"},
    "cabecera-compra": {"etiqueta": "Consultar una tarifa · paso 2 de 5"},
    "lineas-compra": {"etiqueta": "Consultar una tarifa · paso 3 de 5"},
    "linea-a6": {"etiqueta": "Consultar una tarifa · paso 4 de 5"},
    "descuentos-generales": {"etiqueta": "Consultar una tarifa · paso 5 de 5"},
    "delegacion": {"etiqueta": "Ventas · la delegación"},
    "proveedor-tarifa": {"etiqueta": "Asignar tarifa · paso 4 de 4", "titulo": "Graba: el proveedor ya tiene su tarifa",
                         "clip": clip(V2, 469, 482),
                         "zooms": [{"clave": "tarifa", "rect": {"x": 0, "y": 690, "w": 1300, "h": 210}, "dur": 1.4}],
                         "callouts": [
                             {"clave": "tarifa", "rect": {"x": 836, "y": 730, "w": 326, "h": 26}, "texto": "Tarifa precios: G00003", "lado": "arriba"},
                             {"clave": "descuentos", "rect": {"x": 836, "y": 752, "w": 326, "h": 50}, "texto": "Tarifa descuentos · por familia", "lado": "arriba"},
                             {"clave": "fecha", "rect": {"x": 1290, "y": 862, "w": 380, "h": 26}, "texto": "Modificado 11-12-2015 11:22:16", "lado": "arriba"},
                         ],
                         "narracion": "Ya está: tarifa precios queda con la G cero cero cero cero tres. Junto a ella puedes asignar también una tarifa de descuentos y otra de descuentos por familia. Al grabar cambia la fecha de modificación.",
                         "_hace": "Grabar el proveedor con la nueva tarifa de precios.",
                         "_nota": "No se ve el clic en «Validar»; el cambio queda acreditado por la fecha de modificación (11-12-2015 11:22:16)."},
    "menu-documentos": {"etiqueta": "Definir la serie · paso 1 de 3", "titulo": "Abre Maestros › Documentos › Pedidos"},
    "tipos-pedido-lista": {"etiqueta": "Definir la serie · paso 1 de 3"},
    "ficha-pc": {"etiqueta": "Definir la serie · paso 2 de 3"},
    "serie-ficha": {"etiqueta": "Definir la serie · paso 3 de 3"},
    "documento-origen": {"etiqueta": "Configurar el tipo · 1 de 6"},
    "valoracion": {"etiqueta": "Configurar el tipo · 2 de 6"},
    "tipos-pedido": {"etiqueta": "Configurar el tipo · 3 de 6"},
    "validar-catalogo": {"etiqueta": "Configurar el tipo · 4 de 6"},
    "impresion": {"etiqueta": "Configurar el tipo · 5 de 6"},
    "campos-ocultar": {"etiqueta": "Configurar el tipo · 6 de 6"},
    "menu-pedidos": {"etiqueta": "Crear el pedido · paso 1 de 7", "titulo": "Abre Compras › Pedidos › Registro"},
    "alta-cabecera": {"etiqueta": "Crear el pedido · paso 3 de 7", "titulo": "Rellena la unidad de negocio y las fechas"},
    "proveedor-direccion": {"etiqueta": "Crear el pedido · paso 5 de 7", "titulo": "Elige la dirección del proveedor"},
    "lineas-a6": {"etiqueta": "Crear el pedido · paso 7 de 7", "titulo": "Añade la línea del COCHE A6",
                  "narracion": "Pulsa líneas y crea la primera. Las fechas de entrega se heredan de la cabecera. Elige el artículo, COCHE A6, y una cantidad de tres. Al grabar, el precio aparece solo: 2.000 euros, de la tarifa del proveedor. Importe neto, 6.000, y la línea validada."},
    "lineas-a4": {"etiqueta": "Crear el pedido · paso 7 de 7", "titulo": "Añade el COCHE A4, sin tarifa"},
    "pedido-validado": {"etiqueta": "Validar el pedido · paso 4 de 4"},
    "alta-albaran": {"etiqueta": "Crear el albarán · paso 2 de 6", "titulo": "Nuevo albarán de tipo RC"},
    "popup-pedidos": {"etiqueta": "Crear el albarán · paso 4 de 6", "titulo": "Elige el pedido de origen", "clip": clip(V2, 4826, 4840)},
    "albaran-guardado": {"etiqueta": "Crear el albarán · paso 6 de 6", "titulo": "Albarán creado: pulsa Agregar líneas pedido"},
    "agregar-lineas": {"etiqueta": "Agregar líneas del pedido · marcar, ajustar y agregar"},
    "albaran-lineas": {"etiqueta": "Resultado", "titulo": "Las líneas del albarán"},
    "pedido-parcial": {"etiqueta": "Resultado en el pedido"},
    "asiento-albaran-pantalla": {"etiqueta": "Contabilizar el albarán · paso 2 de 2", "titulo": "Consulta el asiento", "clip": clip(V2, 5395, 5415),
        "narracion": "En la pestaña apuntes ves el asiento 63 del diario de compras, con el albarán como documento. La cuenta 4009 es proveedores, facturas pendientes de recibir o de formalizar. En la vista, la 4009 al haber por 9.000 euros y la 6000 al debe por lo mismo."},
    "alta-factura": {"etiqueta": "Registrar la factura · paso 4 de 4", "titulo": "Elige el proveedor y teclea el importe",
        "narracion": "Elige el proveedor SEAT, que completa el resto de datos, y teclea el importe total que dice el papel: 8.750 euros. Al grabar, la factura recibe su número interno con la serie FC."},
    "conformar-menu": {"etiqueta": "Conformar albaranes · paso 1 de 3"},
    "conformar-rejilla": {"etiqueta": "Conformar albaranes · paso 2 de 3"},
    "factura-impuestos": {"etiqueta": "Conformar albaranes · paso 3 de 3", "titulo": "Resultado: líneas e impuestos copiados"},
    "forzar-actualizacion": {"etiqueta": "Resolver el error 3000 · paso 1 de 3", "titulo": "Si sale el CRC, recarga"},
    "correccion-importe": {"etiqueta": "Resultado", "clip": clip(V2, 6240, 6262),
        "narracion": "La factura queda en 10.890 y validada. Debajo, las líneas que vinieron del albarán, con los precios arrastrados desde el pedido. Y en albarán origen, el nuestro ya figura como facturado."},
    "asiento-factura-pantalla": {"etiqueta": "Contabilizar la factura · paso 2 de 2", "titulo": "Consulta el asiento de la factura",
        "narracion": "Y este es su asiento, el 64, con FACT uno como documento. Tres líneas: la cuenta del proveedor SEAT al haber por 10.890; la 4720, la del IVA, al debe por 1.890; y la 4009 al debe por 9.000."},
}
_by = {e["id"]: e for e in E}
for k, v in MOD.items():
    _by[k].update(v)
# callouts del alta del albarán en imperativo
_by["alta-albaran"]["narracion"] = "Pulsa nuevo y elige el tipo RC, con la misma empresa, delegación y almacén que el pedido. El número se completa al guardar. Ya ves las cuentas logísticas que heredará: de no disponible a disponible."
_by["alta-albaran"]["callouts"] = [
    {"clave": "tipo", "rect": {"x": 0, "y": 266, "w": 620, "h": 26}, "texto": "Tipo RC", "lado": "abajo"},
    {"clave": "guardar", "rect": {"x": 1250, "y": 264, "w": 350, "h": 24}, "texto": "201501RC- : número al guardar", "lado": "abajo"},
    {"clave": "cuentas", "rect": {"x": 0, "y": 688, "w": 420, "h": 50}, "texto": "NDIS → DISP", "lado": "arriba"},
]
_by["alta-albaran"]["zooms"] = [{"clave": "tipo", "rect": {"x": 0, "y": 250, "w": 840, "h": 150}, "dur": 1.4}]
_by["popup-pedidos"]["narracion"] = "Abre la lista del campo origen. Solo salen pedidos de la misma empresa y delegación: es el error típico de las pruebas, si no coinciden no encontrarás el pedido. Elige el nuestro, el de 10.000 euros."

ORDER = """portada mapa ejemplo
cap1 ciclo antes menu-compras repaso-cap1
cap2 tarifa-concepto articulo-sin-precio anatomia menu-tarifas cabecera-compra lineas-compra linea-a6 a6-dos-precios descuentos-generales sp-alta-tarifa tip-vigencia repaso-cap2
cap3 reglas-aplicacion correccion-delegacion delegacion lookup-ventas tarifa-proveedores sp-terceros prov-paso1 prov-paso2 prov-paso3 proveedor-tarifa flujo-precio politica-precios permisos-precios cuidado-public repaso-cap3
cap4 menu-documentos tipos-pedido-lista tip-clasificacion ficha-pc abrir-serie serie-ficha numero-documento series-mascara control-cronologico cuidado-desbordamiento sp-alta-serie repaso-cap4
cap5 documento-origen actualizar-origen valoracion rappel anticipos interempresa tipos-pedido reposicion validar-catalogo impresion campos-ocultar repaso-cap5
cap6 menu-pedidos ped-nuevo alta-cabecera ped-proveedor proveedor-direccion ped-guardar lineas-a6 lineas-a4 cuidado-precio-cero calculo-pedido val-paso1 val-paso2 val-paso3 pedido-validado repaso-cap6
cap7 tipologia-rc reglas-rc alb-menu alta-albaran alb-origen-obligatorio popup-pedidos alb-heredados alb-insertar albaran-guardado agregar-lineas albaran-lineas calculo-albaran pedido-parcial opciones-parcial alb-contabilizar asiento-albaran-pantalla por-que-4009 valorar-sin-pedido repaso-cap7
cap8 tipologia-fca fac-menu fac-obligatorio fac-numero alta-factura conformar-menu conformar-rejilla factura-impuestos calculo-iva sp-workflow-fca crc forzar-actualizacion err-validar error-3000 err-corregir correccion-importe fac-contabilizar asiento-factura-pantalla vida-4009 repaso-cap8
cap9 ciclo-completo errores-tipicos checklist cierre""".split()
_missing = [i for i in ORDER if i not in _by]
assert not _missing, _missing
E[:] = [_by[i] for i in ORDER]
