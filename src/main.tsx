import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { Auth0Wrapper } from './components/Auth0Wrapper.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Auth0Wrapper>
      <App />
    </Auth0Wrapper>
  </StrictMode>,
);

