'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  hideCloseButton?: boolean;
  // New: flat variant with no rounded corners, no shadows, and no backdrop blur
  variant?: 'default' | 'flat';
  // Enhanced: prevent close on backdrop click
  preventBackdropClose?: boolean;
  // Enhanced: custom z-index
  zIndex?: number;
}

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-7xl'
};

export function Modal({ 
  isOpen, 
  onClose, 
  children, 
  className, 
  size = 'lg', 
  hideCloseButton = false, 
  variant = 'default',
  preventBackdropClose = false,
  zIndex = 50
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Enhanced keyboard and focus management
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement?.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement?.focus();
            e.preventDefault();
          }
        }
      }
    };

    if (isOpen) {
      // Store the currently focused element
      previousActiveElement.current = document.activeElement as HTMLElement;
      
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('keydown', handleTabKey);
      document.body.style.overflow = 'hidden';
      
      // Focus the modal after a brief delay to ensure it's rendered
      setTimeout(() => {
        const firstFocusable = modalRef.current?.querySelector(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ) as HTMLElement;
        firstFocusable?.focus();
      }, 100);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('keydown', handleTabKey);
      document.body.style.overflow = 'unset';
      
      // Restore focus to the previously focused element
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = () => {
    if (!preventBackdropClose) {
      onClose();
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Enhanced Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={cn(
              'fixed inset-0',
              variant === 'flat' 
                ? 'bg-black/50' 
                : 'bg-black/70 backdrop-blur-md'
            )}
            style={{ zIndex: zIndex }}
            onClick={handleBackdropClick}
          />
          
          {/* Enhanced Modal */}
          <div 
            className="fixed inset-0 flex items-center justify-center p-4 sm:p-6 lg:p-8" 
            style={{ zIndex: zIndex + 1 }}
            onClick={handleBackdropClick}
          >
            <motion.div
              ref={modalRef}
              initial={{ 
                opacity: 0, 
                scale: 0.9, 
                y: 50,
                rotateX: -15
              }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                y: 0,
                rotateX: 0
              }}
              exit={{ 
                opacity: 0, 
                scale: 0.95, 
                y: 20,
                rotateX: 5
              }}
              transition={{ 
                duration: 0.4, 
                ease: [0.16, 1, 0.3, 1],
                scale: { duration: 0.3 },
                rotateX: { duration: 0.3 }
              }}
              className={cn(
                'relative bg-white dark:bg-gray-900 w-full',
                variant === 'flat' 
                  ? 'rounded-none shadow-2xl border border-gray-200 dark:border-gray-700' 
                  : 'rounded-xl shadow-2xl border border-gray-100 dark:border-gray-800',
                sizeClasses[size],
                'max-h-[90vh] overflow-hidden',
                'transform-gpu', // Enable hardware acceleration
                className
              )}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
            >
              {/* Enhanced Close button */}
              {!hideCloseButton && (
                <button
                  onClick={onClose}
                  className={cn(
                    'absolute top-4 right-4 z-20 transition-all duration-200',
                    variant === 'flat'
                      ? 'p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                      : 'p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:scale-110'
                  )}
                  aria-label="Close modal"
                  type="button"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
              
              {/* Enhanced Content with better scrolling */}
              <div className="overflow-y-auto max-h-[90vh] scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

// Enhanced hook for modal state management
export function useModal(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState);
  
  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);
  const toggleModal = useCallback(() => setIsOpen(prev => !prev), []);
  
  return {
    isOpen,
    openModal,
    closeModal,
    toggleModal
  };
}