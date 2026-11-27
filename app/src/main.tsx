import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/bricolage-grotesque';
import '@fontsource-variable/instrument-sans';
import './styles.css';
import App from './App';
import './sistema.css';
import './app-ux.css';
import './tema/guia.css';
import './tema/shell.css';
import './tema/inicio-modulo.css';
import './tema/bloque.css';
import './tema/examenes.css';
import './tema/consulta.css';
import './tema/ancho.css';
import { Acceso } from './auth/Acceso';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Acceso>
      <App />
    </Acceso>
  </StrictMode>,
);
