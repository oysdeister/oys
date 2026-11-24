# Hecho: interfaz Configurar / Operar (fase 2, UI)

- Página de módulo (`ModulePage.tsx`): selector de fases en la cabecera (pestañas grandes con icono, frase, barra y «n de m bloques»): Configurar, Operar y «Para saber más» si hay ampliaciones. Solo se pinta el panel de la fase activa; la numeración de bloques sigue siendo la global. Sin selector en Maestros, Contabilidad avanzada y Fundamentos.
- Accesible: `tablist/tab/tabpanel`, flechas, Inicio y Fin, tabulador solo en la pestaña activa. Probado con teclado.
- Fase activa: `?fase=operar` en la URL > última recordada (localStorage `oys-fase:<módulo>`, con try/catch) > la del bloque que toca (si ya empezó) > Configurar. «Empieza por Operar» es un enlace a `?fase=operar`. Entrar en un bloque desde el menú recuerda su fase.
- Apartados sin bloques («Lo que ya tienes» de Ventas): tarjeta con la frase, la nota y botón al módulo.
- Menú lateral (`Sidebar.tsx`, también el cajón móvil): módulo → fase plegable (con n/m) → bloques; se abre la fase del bloque actual o de la pestaña; en la página del módulo, abrir una fase cambia la pestaña.
- Portada (`Home.tsx`): cada tarjeta lleva chips «Configurar · n bloques» y «Operar · n bloques» a `?fase=…` (tarjeta con enlace estirado en el título, sin enlaces anidados). Ventas: «Configurar · ya lo tienes».
- Numeración: «Módulo 2» (sin «de 9»), igual que la portada y el menú.
- Código nuevo en `lib/ruta.ts` (`fasesDe`, `faseActiva`, `FASE_UI`…); CSS al final de `pages/ruta.css` y `pages/inicio.css`. No se tocó `content/*.json`.
- Comprobado: `npm run build` bien; lint sin errores nuevos (solo los de `src/erp`). Navegador en #/modulo/icon-contabilidad, compras, ventas, maestros y portada, en escritorio y 375 px, sin desbordamiento horizontal visible (sin medir con JS).
- Aviso: las pestañas están arriba; al pulsarlas la página baja a los bloques, y para cambiar de fase hay que subir o usar el menú lateral.
