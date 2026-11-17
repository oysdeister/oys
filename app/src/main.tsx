import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/bricolage-grotesque';
import '@fontsource-variable/instrument-sans';
import './styles.css';
import App from './App';
import { Acceso } from './auth/Acceso';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Acceso>
      <App />
    </Acceso>
  </StrictMode>,
);
