import type { ReactNode } from 'react';
import { useLanguage } from '../i18n';

/** Keeps <html lang="..."> in sync with the current language, for accessibility and SEO. */
export function HtmlLangSync({ children }: { children: ReactNode }) {
  const { language } = useLanguage();
  document.documentElement.lang = language;
  return <>{children}</>;
}
