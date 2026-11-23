---
name: erp-nuevo-compras
description: Conocimiento funcional del circuito de compras de la versión nueva del ERP Deister/Axional (demo nextdemo.geasa.eu, base tutorial) - numerador gsernumh, tipologías gcompedd/gcommovd/gcomfacd, listas y grupos de precios gcom_pricelist/gcom_pricegroup, Docflow, Generar albaranes y Generar factura, Conformar solo en algunas tipologías de factura (FCCL), sin CRC, limitaciones de la demo - y cómo sacar capturas 4K autenticadas con Chrome y puppeteer. Úsala al documentar, grabar o explicar compras (u otro módulo) en el ERP nuevo, o al capturar pantallas del ERP para un vídeo.
---

# Compras en el ERP nuevo (Axional, nextdemo)

## Circuito
Lista de precios + grupo de precios → proveedor con **Grupo precio** → tipo de documento con numerador → **pedido PC** (`gcompedh`, líneas `gcompedl`) → **Generación de albaranes desde pedidos** (`gcompedh_gen_gcomalbh`) → **albarán ACPC/AC** (`gcomalbh`) → validar y contabilizar → en el albarán, **Acciones › Generar factura** → **factura FCOA** (`gcomfach`) → validar → contabilizar. Trazabilidad con **Docflow** (`gdocflowh`, menú ⌄ junto a la estrella).

## Puntos clave
- **Numeración**: Gestión › Maestros › Auxiliares › Numerador de documentos (`gsernumh`), rotura `#e#s`, máscara `#e#s#6n` (DISPC000001), sin año; numeración fiscal aparte en `cdocnumh`.
- **Tipologías**: pedidos `gcompedd`, albaranes `gcommovd`, facturas `gcomfacd` (tolerancias albarán-factura). Docflow gráfico y «Campos a ocultar» por tipo.
- **Tarifas**: modelo nuevo `gcom_pricelist` (fechas por línea, escalados por cantidad mínima, dto 1-3) + `gcom_pricegroup` (orden, condición, divisa, lista) + `gcom_pricelist_cond`; descuentos `gcom_discgroup`/`gcom_disclist`. El proveedor (`gproveed`, pestaña Tarifas) apunta a un grupo, no a una tarifa. El modelo clásico sigue en el menú pero sus tablas no existen en la demo.
- **Conformar depende de la tipología de factura** (`gcomfacd`), no es general. En la base tutorial (comprobado el 17-11-2026) la factura de tipo **FCCL «Factura Claude»** sí trae en el desplegable ⌄ del título las opciones de Conformar: diálogo con los albaranes pendientes del proveedor, se marcan, «Conformar» → toast Éxito y el albarán pasa a «Albaranes conformados» (Facturado). Las facturas **FC/FCOA** no traen esas opciones: ahí el circuito es albarán › Acciones › **Generar factura**. Explica Conformar solo cuando la tipología lo tenga; si no, Generar factura.
- **No hay CRC**: el control albarán-factura lo hacen Datos de control, bloqueos/validaciones de workflow, la comparación importe declarado/calculado y el informe `gcomfach_dif_albaran`. La factura generada sale validada si el importe coincide.
- **Workflow**: Gestionar (`*_vtabsel_workflow`), Autorizar (`*_awk`), Retroceder (`*_rwk`).
- **Contabilización** (ejemplo creado): albarán 60000 D / 40090 H; factura 40000 H, IVA D, 40090 D.

## Limitaciones de la demo (base tutorial)
Ficha de pedido genérica sin numerador ni botón de líneas; «Generar albaranes» no devuelve pedidos (`gcompedd.comalb` vacío); la empresa DIS no puede hacer albaranes (almacén de otra empresa); el precio no se rellena desde la tarifa en la línea; artículos de tipo contable VEN sin cuenta (error 24709); IVA a cuenta 00000. Detalle en `references/circuito_creado.md`.

## Capturas 4K autenticadas
El navegador integrado se limita a unos 800 px de ancho: no sirve para vídeo. Método:
1. Lanza un Chrome aparte: `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --remote-debugging-port=9333 --user-data-dir=$HOME/.chrome-erp`.
2. **El usuario inicia sesión él mismo** en ese Chrome. Claude nunca teclea contraseñas.
3. `cd scripts && npm install` (puppeteer-core) y usa `node erp.mjs goto|shot|click|clickrow|tab|eval` (viewport 1920×1080 @2x = 3840×2160) o `erp2.mjs` (eventos reales: clickxy, clicktext, type, pick, fields, buttons, menu, msgs, rect).
4. La pestaña debe estar al frente: oculta, Vuetify no pinta desplegables ni diálogos.
5. Anota en un INDICE.md cada captura con ruta, objeto y rects para los callouts (`references/indice_capturas_hd.md`).
Ajusta en los scripts la URL base (`/view/app/<base>/dispatch/<objeto>`) y la carpeta de salida. Trabaja solo en la base de pruebas autorizada y no toques maestros.

## References
`mapa_erp_nuevo.md` (rutas y objetos), `notas_tarifas.md`, `notas_tipos_documento.md`, `notas_circuito.md`, `circuito_creado.md` (documentos, asientos y diferencias con lo esperado), `indice_capturas_hd.md`.

## Circuito real conseguido en `tutorial` (16-11-2026, vídeo v2)
- **Líneas de pedido**: la ficha de `gcompedh` es genérica y no tiene líneas; se cargan con Gestión › Compras › Pedidos › «Líneas de pedidos» (`gcompedl`) › ⋮ › Importar: CSV con «;», cabecera con nombres físicos (`cabid;linrel;orden;codart;varlog;numlot;canped;udmcom;canpre;udmpre;precio;impnet;canser;dtoimp`), `cabid` = Identificador del pedido, unidad `UNI`, `dtoimp` 0 (si no, error 26865). El número del pedido se teclea (no aplica el numerador).
- **Config hecha**: PC → Tipo de albarán ACPC; ACPC → Copiar líneas «Validar», Actualizar origen «Sumando» (el pedido pasa a Servido), Tipo factura FCOA; IVA 21 % (ctax_type ESG) → cuenta 47200 (rótulo del plan «HP, IVA exento»).
- **Proveedor nuevo**: tercero (NIF, dirección, condición de pago, validar) + proveedor (GENERAL, EUR, grupo precio 00001). Pon **descuentos 1/2/3 y pronto pago a 0**: si quedan vacíos, la factura no contabiliza («Cannot invoke Object.toString() because n is null», gcomfach_Account1) y no se arregla en sitio.
- Circuito del vídeo: 00010 Rodamientos del Norte → 0PC000003 → 0AC000011 (asiento 60000 D / 40090 H) → 0FC000009 (40000.00010 H 48,40 · 47200 D 8,40 · 60000 D 40 · 40090 D 40 · 60000 H 40). En Docflow la factura contabilizada sigue mostrando «Validado».
- Ventana de asiento tras Contabilizar solo carga la primera vez; la lista de albaranes queda en caché (recargar). La casilla «Prevista» se marca con el input, no con el texto.
