import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/App';
import { HtmlLangSync } from './app/HtmlLangSync';
import { LanguageProvider } from './i18n';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import './styles/global.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <LanguageProvider>
        <HtmlLangSync>
          <App />
        </HtmlLangSync>
      </LanguageProvider>
    </ErrorBoundary>
  </StrictMode>,
);
