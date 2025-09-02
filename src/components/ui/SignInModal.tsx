'use client';

import { useState, useEffect, useRef } from 'react';
import { signIn } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, EyeOff, Loader2, AlertCircle, Check } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useToast } from './Toast';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type FormState = 'idle' | 'loading' | 'success' | 'error';

interface FormErrors {
  username?: string;
  password?: string;
  general?: string;
}

export function SignInModal({ isOpen, onClose, onSuccess }: SignInModalProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formState, setFormState] = useState<FormState>('idle');
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ username: boolean; password: boolean }>({ username: false, password: false });
  const [isValidating, setIsValidating] = useState(false);
  const [loginProgress, setLoginProgress] = useState(0);
  
  const { showToast, ToastComponent } = useToast();
  
  const modalRef = useRef<HTMLDivElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.98,
      y: -10
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 35,
        stiffness: 300,
        duration: 0.15
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.98,
      y: -10,
      transition: {
        duration: 0.1
      }
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 5 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        delay: 0.02,
        duration: 0.1
      }
    }
  };

  const inputVariants = {
    focus: { 
      scale: 1.01,
      transition: { duration: 0.15 }
    },
    blur: { 
      scale: 1,
      transition: { duration: 0.15 }
    }
  };

  const buttonVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.02 },
    tap: { scale: 0.98 },
    loading: {
      scale: 1,
      transition: {
        repeat: Infinity,
        repeatType: "reverse" as const,
        duration: 0.8
      }
    }
  };



  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setUsername('');
      setPassword('');
      setShowPassword(false);
      setFormState('idle');
      setErrors({});
      // Focus username field when modal opens
      setTimeout(() => usernameRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Handle modal interactions (escape, click outside, tab trapping, body scroll)
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && formState !== 'loading') {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node) && formState !== 'loading') {
        onClose();
      }
    };

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'input, button, [href], select, textarea, [tabindex]:not([tabindex="-1"])'
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
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleTabKey);
      document.body.style.overflow = 'hidden';
      
      // Set focus to first focusable element
      setTimeout(() => {
        const firstFocusable = modalRef.current?.querySelector(
          'input, button, [href], select, textarea, [tabindex]:not([tabindex="-1"])'
        ) as HTMLElement;
        firstFocusable?.focus();
      }, 100);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleTabKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, formState]);

  const validateField = (field: 'username' | 'password', value: string): string | null => {
    switch (field) {
      case 'username':
        if (!value.trim()) {
          return 'Username is required';
        }
        if (value.length < 3) {
          return 'Username must be at least 3 characters';
        }
        if (value.length > 50) {
          return 'Username must be less than 50 characters';
        }
        if (!/^[a-zA-Z0-9_.-]+$/.test(value)) {
          return 'Username can only contain letters, numbers, dots, hyphens, and underscores';
        }
        return null;
      
      case 'password':
        if (!value) {
          return 'Password is required';
        }

        if (value.length > 128) {
          return 'Password must be less than 128 characters';
        }
        return null;
      
      default:
        return null;
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    const usernameError = validateField('username', username);
    const passwordError = validateField('password', password);
    
    if (usernameError) newErrors.username = usernameError;
    if (passwordError) newErrors.password = passwordError;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Real-time validation
  const handleFieldChange = (field: 'username' | 'password', value: string) => {
    if (field === 'username') {
      setUsername(value);
    } else {
      setPassword(value);
    }

    // Only validate if field has been touched
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors(prev => ({
        ...prev,
        [field]: error
      }));
    }
  };

  const handleFieldBlur = (field: 'username' | 'password') => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const value = field === 'username' ? username : password;
    const error = validateField(field, value);
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Shake animation for invalid form
      const form = e.currentTarget;
      form.classList.add('animate-shake');
      setTimeout(() => form.classList.remove('animate-shake'), 500);
      return;
    }
    
    setFormState('loading');
    setErrors({});
    setLoginProgress(0);

    // Simulate progress for better UX
    const progressInterval = setInterval(() => {
      setLoginProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 20;
      });
    }, 100);
    
    try {
      const result = await signIn('credentials', {
        redirect: false,
        username: username.trim(),
        password
      });
      
      clearInterval(progressInterval);
      setLoginProgress(100);
      
      if (result?.error) {
        setFormState('error');
        setErrors({ general: 'Invalid username or password. Please try again.' });
        setLoginProgress(0);
      } else {
        setFormState('success');
        showToast('🎉 Welcome back! You\'ve successfully signed in.', 'success');
        
        // Close modal immediately and call success callback
        setTimeout(() => {
          onSuccess?.();
          onClose();
        }, 500);
      }
    } catch (error) {
      clearInterval(progressInterval);
      setFormState('error');
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
      setLoginProgress(0);
    }
  };



  return (
    <>
      {ToastComponent}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={overlayVariants}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 min-h-screen"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="signin-title"
            aria-describedby="signin-description"
            aria-live="polite"
          >
          <motion.div
            ref={modalRef}
            variants={modalVariants}
            className="w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto transform"
            style={{ backgroundColor: 'var(--background)' }}
          >


            {/* Main Modal Content */}
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h2 
                    id="signin-title"
                    className="text-xl sm:text-2xl font-bold truncate"
                    style={{ color: 'var(--foreground)' }}
                    role="heading"
                    aria-level={1}
                  >
                    Sign In
                  </h2>
                  <p 
                    id="signin-description"
                    className="text-xs sm:text-sm mt-1"
                    style={{ color: 'var(--muted-foreground)' }}
                    role="text"
                  >
                    Enter your credentials to access your account
                  </p>
                </div>
                
                <button
                  onClick={onClose}
                  disabled={formState === 'loading'}
                  className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                  style={{ color: 'var(--muted-foreground)' }}
                  aria-label="Close sign in modal"
                  type="button"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
                </button>
              </div>

              {/* Error Message */}
              {errors.general && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-800 flex items-center space-x-2"
                  role="alert"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errors.general}</span>
                </motion.div>
              )}

              {/* Form */}
                <motion.form 
                  onSubmit={handleSubmit} 
                  className="space-y-3 sm:space-y-4"
                  variants={formVariants}
                  initial="hidden"
                  animate="visible"
                >
                {/* Username Field */}
                <div className="space-y-1.5 sm:space-y-2">
                  <label 
                    htmlFor="username"
                    className="block text-xs sm:text-sm font-medium"
                    style={{ color: 'var(--foreground)' }}
                  >
                    Username <span className="text-red-500" aria-label="required">*</span>
                  </label>
                  <div className="relative">
                    <motion.input
                      ref={usernameRef}
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => handleFieldChange('username', e.target.value)}
                      onBlur={() => handleFieldBlur('username')}
                      disabled={formState === 'loading'}
                      required
                      aria-required="true"
                      aria-invalid={!!errors.username}
                      aria-describedby={errors.username ? 'username-error' : 'username-help'}
                      className={cn(
                        'w-full px-3 py-2 sm:py-2.5 text-sm sm:text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                        touched.username ? 'pr-10' : '',
                        errors.username 
                          ? 'border-red-300 dark:border-red-600 focus:ring-red-500' 
                          : touched.username && !errors.username
                          ? 'border-green-300 dark:border-green-600 focus:ring-green-500'
                          : 'border-gray-300 dark:border-gray-600'
                      )}
                      style={{ 
                        backgroundColor: 'var(--background)',
                        color: 'var(--foreground)',
                        borderWidth: '1px',
                        borderStyle: 'solid'
                      }}
                      placeholder="Enter your username"
                      autoComplete="username"
                      variants={inputVariants}
                      whileFocus="focus"
                      animate="blur"
                    />
                    {/* Validation Icon */}
                    {touched.username && (
                      <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3" aria-hidden="true">
                        {errors.username ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          >
                            <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500" aria-label="Username validation error" />
                          </motion.div>
                        ) : (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          >
                            <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500" aria-label="Username validation success" />
                          </motion.div>
                        )}
                      </div>
                    )}
                  </div>
                  <div id="username-help" className="sr-only">
                    Username is required and must be at least 3 characters long
                  </div>
                  {errors.username && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      id="username-error"
                      className="text-xs text-red-600 dark:text-red-400 mt-1"
                      role="alert"
                      aria-live="polite"
                    >
                      {errors.username}
                    </motion.p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-1.5 sm:space-y-2">
                  <label 
                    htmlFor="password"
                    className="block text-xs sm:text-sm font-medium"
                    style={{ color: 'var(--foreground)' }}
                  >
                    Password <span className="text-red-500" aria-label="required">*</span>
                  </label>
                  <div className="relative">
                    <motion.input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => handleFieldChange('password', e.target.value)}
                      onBlur={() => handleFieldBlur('password')}
                      disabled={formState === 'loading'}
                      required
                      aria-required="true"
                      aria-invalid={!!errors.password}
                      aria-describedby={errors.password ? 'password-error' : 'password-help'}
                      className={cn(
                        'w-full px-3 py-2 sm:py-2.5 text-sm sm:text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                        touched.password ? 'pr-16 sm:pr-20' : 'pr-10',
                        errors.password 
                          ? 'border-red-300 dark:border-red-600 focus:ring-red-500' 
                          : touched.password && !errors.password
                          ? 'border-green-300 dark:border-green-600 focus:ring-green-500'
                          : 'border-gray-300 dark:border-gray-600'
                      )}
                      style={{ 
                        backgroundColor: 'var(--background)',
                        color: 'var(--foreground)',
                        borderWidth: '1px',
                        borderStyle: 'solid'
                      }}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      variants={inputVariants}
                      whileFocus="focus"
                      animate="blur"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center">
                      {/* Validation Icon */}
                      {touched.password && (
                        <div className="pr-1 sm:pr-2" aria-hidden="true">
                          {errors.password ? (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            >
                              <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500" aria-label="Password validation error" />
                            </motion.div>
                          ) : (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            >
                              <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500" aria-label="Password validation success" />
                            </motion.div>
                          )}
                        </div>
                      )}
                      {/* Show/Hide Password Button */}
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={formState === 'loading'}
                        className="pr-2 sm:pr-3 p-0.5 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                        style={{ color: 'var(--muted-foreground)' }}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        aria-pressed={showPassword}
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                      </button>
                    </div>
                  </div>
                  <div id="password-help" className="sr-only">
                    Password is required and must be at least 6 characters long
                  </div>
                  {errors.password && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      id="password-error"
                      className="text-xs text-red-600 dark:text-red-400 mt-1"
                      role="alert"
                      aria-live="polite"
                    >
                      {errors.password}
                    </motion.p>
                  )}
                </div>

                {/* Progress Bar */}
                {formState === 'loading' && (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                      <span>Authenticating...</span>
                      <span>{Math.round(loginProgress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${loginProgress}%` }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={formState === 'loading' || !username.trim() || !password || username.length < 4}
                  className={cn(
                    'w-full py-2.5 sm:py-3 px-4 text-sm sm:text-base font-medium text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 relative overflow-hidden',
                    formState === 'loading'
                      ? 'bg-blue-400'
                      : formState === 'error'
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-blue-600 hover:bg-blue-700'
                  )}
                  variants={buttonVariants}
                  initial="idle"
                  whileHover={formState !== 'loading' ? "hover" : "idle"}
                  whileTap={formState !== 'loading' ? "tap" : "idle"}
                  animate={formState === 'loading' ? "loading" : formState === 'error' ? { x: [-5, 5, -5, 5, 0], transition: { duration: 0.3 } } : "idle"}
                  aria-label={formState === 'loading' ? 'Signing in, please wait' : 'Sign in to your account'}
                  aria-describedby="signin-button-help"
                >
                  <div id="signin-button-help" className="sr-only">
                    {(!username.trim() || !password || username.length < 4) ? 'Please fill in all required fields with at least 4 characters for username to sign in' : 'Click to sign in to your account'}
                  </div>
                  {formState === 'loading' ? (
                    <motion.div 
                      className="flex items-center justify-center space-x-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Loader2 className="w-4 h-4" />
                      </motion.div>
                      <span>Signing in...</span>
                    </motion.div>
                  ) : formState === 'error' ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      Try Again
                    </motion.div>
                  ) : (
                    'Sign In'
                  )}
                  
                  {/* Ripple effect on click */}
                  {formState !== 'loading' && (
                    <motion.div
                      className="absolute inset-0 bg-white opacity-0"
                      whileTap={{
                        opacity: [0, 0.3, 0],
                        scale: [0, 1],
                        transition: { duration: 0.3 }
                      }}
                      style={{
                        borderRadius: '50%',
                        transformOrigin: 'center'
                      }}
                    />
                  )}
                </motion.button>
                </motion.form>

                {/* Footer */}
                <div className="text-center px-2">
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                    By signing in, you agree to our terms of service and privacy policy.
                  </p>

                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}