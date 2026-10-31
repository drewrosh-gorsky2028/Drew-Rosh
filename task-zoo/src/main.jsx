import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/nunito';
import './styles.css';
import { App } from './App.jsx';
import { ZooProvider } from './state/ZooContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ZooProvider>
      <App />
    </ZooProvider>
  </StrictMode>,
);
