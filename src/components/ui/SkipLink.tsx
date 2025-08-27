'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
}

export function SkipLink({ href, children }: SkipLinkProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <AnimatePresence>
      {isFocused && (
        <motion.a
          href={href}
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 bg-blue-600 text-white px-4 py-2 rounded-md font-medium shadow-lg"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.a>
      )}
    </AnimatePresence>
  );
}

// Screen reader only text component
export function ScreenReaderOnly({ children }: { children: React.ReactNode }) {
  return <span className="sr-only">{children}</span>;
}

// Focus trap component for modals and dropdowns
export function FocusTrap({ children, isActive }: { children: React.ReactNode; isActive: boolean }) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isActive) return;
    
    if (e.key === 'Tab') {
      const focusableElements = document.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
      
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
    
    if (e.key === 'Escape') {
      // Let parent components handle escape
      e.stopPropagation();
    }
  };

  return (
    <div onKeyDown={handleKeyDown}>
      {children}
    </div>
  );
}

export default SkipLink;