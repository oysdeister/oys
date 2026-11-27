import { Config } from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(92);
Config.setOverwriteOutput(true);
Config.setCodec('h264');
Config.setCrf(18);
Config.setPixelFormat('yuv420p');
Config.setConcurrency(8);
// GPU (ANGLE/Metal): 3-4 veces más rápido que el software por defecto con 3D, desenfoques y vídeo
Config.setChromiumOpenGlRenderer('angle');
