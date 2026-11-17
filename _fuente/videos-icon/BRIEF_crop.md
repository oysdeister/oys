Privacidad (decisión de Sergi): el repo es público. Los clips de capítulo se recortarán a la pantalla del ERP, sin caras, sin tira de participantes, sin nombres de personas ni datos de clientes reales.
Escribe S/analisis/<id>.crop.json con el recorte EN PÍXELES DEL VÍDEO ORIGINAL (no de los fotogramas a 1280 px):
{"w":…,"h":…,"x":…,"y":…, "tapar":[{"desde":<s>,"hasta":<s>,"x":…,"y":…,"w":…,"h":…,"motivo":"…"}]}
- w,h,x,y: rectángulo de la ventana del ERP que sirva para todo el vídeo (si la disposición cambia, elige el que excluya siempre webcams/tira de participantes; usa `ffprobe` para el tamaño real y comprueba con 3-4 fotogramas recortados con ffmpeg crop que no queda ninguna cara ni nombre de participante).
- tapar: tramos donde dentro del recorte aparezcan datos personales (correo, teléfono, nombre de persona real) para taparlos con un recuadro (coordenadas relativas al recorte).
Revisa también que tus capturas en public/img no muestren nada de eso.
