'use client';

import { useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

export default function FaviconSwitcher() {
  const { theme } = useTheme();

  useEffect(() => {
    const link = document.querySelector<HTMLLinkElement>('link#favicon');
    if (!link) return;
    const href = theme === 'dark' ? '/favicon-dark.svg' : '/favicon-light.svg';
    if (link.getAttribute('href') !== href) {
      link.setAttribute('href', href);
    }
  }, [theme]);

  return null;
}