---
name: erp-diferencias-antiguo-nuevo
description: Diferencias entre la versión antigua del ERP Deister (2015) y la nueva (Axional) y cómo convertirlas en escenas «Antes vs Ahora» de un vídeo tutorial. Úsala al preparar un vídeo o documento de migración, al explicar qué cambia en un módulo (compras como ejemplo, o ventas, almacén…) o al revisar qué falta por verificar.
---

# Diferencias ERP antiguo → nuevo

## Método (cualquier módulo)
1. Parte del guion verificado de la versión antigua (procedimientos paso a paso) y del mapa del ERP nuevo (rutas, objetos, capturas).
2. Para cada paso, clasifica: **Igual · Cambio de ruta · Cambio de campos · Nuevo · Eliminado · No verificado**. Cita la fuente (segundo del vídeo antiguo, captura del nuevo).
3. Lo que no esté comprobado en pantalla queda «No verificado»; si se puede, ejecuta el circuito real en la base de pruebas y actualiza.
4. Una escena `comparativa` por bloque (máx. ~5 filas): `{aspecto, antes, ahora, marca}` con `marca` `igual`, `cambio`, `nuevo`, `eliminado` o `mejora`; sincroniza con `clave`. Pon cada comparativa justo tras la pantalla nueva del mismo paso, y un `cuidado` cuando algo ya no existe (p. ej. Conformar).

## Compras: lo esencial
- Tarifa única con fechas → lista de precios + grupo de precios (fechas por línea); el proveedor apunta a un grupo.
- Series de justificantes con máscara por año → numerador `gsernumh` `#e#s#6n` sin año.
- Pedido → albarán: de «Agregar líneas pedido» en el albarán RC → proceso «Generación de albaranes desde pedidos».
- Albarán → factura: de factura FCA + «Conformar albaranes» → «Acciones › Generar factura» en el albarán.
- CRC y Conformar desaparecen; control por importe declarado/calculado y tolerancias. Docflow nuevo.
- Contabilización equivalente (4009/6000 → 40090/60000).

Tabla completa, pendientes y referencias de capturas: `references/diferencias.md`. Fuentes: skills `erp-antiguo-compras` y `erp-next-compras`.
