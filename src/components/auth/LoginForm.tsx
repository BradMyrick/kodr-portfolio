import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { LoginForm as LoginFormType } from '@/types';
import { isValidEmail } from '@/utils';

// Validation schema with security measures
const loginSchema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(254, 'Email is too long') // RFC 5321 limit
    .refine((email) => isValidEmail(email), 'Invalid email format'),
  password: z.string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password is too long') // Reasonable security limit
});

interface LoginFormProps {
  onSubmit: (data: LoginFormType) => Promise<void>;
  loading?: boolean;
  error?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  loading = false,
  error,
}) => {
  const [attemptCount, setAttemptCount] = useState(0);
  const [lastAttempt, setLastAttempt] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  });

  // Rate limiting: max 5 attempts per 15 minutes
  const isRateLimited = useCallback(() => {
    const now = Date.now();
    const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
    const MAX_ATTEMPTS = 5;

    if (lastAttempt && now - lastAttempt < RATE_LIMIT_WINDOW) {
      return attemptCount >= MAX_ATTEMPTS;
    }
    
    // Reset counter if window expired
    if (lastAttempt && now - lastAttempt >= RATE_LIMIT_WINDOW) {
      setAttemptCount(0);
    }
    
    return false;
  }, [attemptCount, lastAttempt]);

  const handleFormSubmit = async (data: LoginFormType) => {
    // Check rate limiting
    if (isRateLimited()) {
      setError('root', {
        message: 'Too many failed attempts. Please try again in 15 minutes.',
      });
      return;
    }

    clearErrors();
    
    try {
      await onSubmit(data);
    } catch {
      // Increment attempt count on failure
      setAttemptCount(prev => prev + 1);
      setLastAttempt(Date.now());
      
      // Generic error message for security
      setError('root', {
        message: 'Invalid email or password. Please try again.',
      });
    }
  };

  const remainingAttempts = Math.max(0, 5 - attemptCount);
  const showRateLimit = attemptCount > 0 && !isRateLimited();

  return (
    <form 
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-6"
      noValidate
    >
      <div>
        <label 
          htmlFor="email" 
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Email Address
        </label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          autoComplete="email"
          required
          disabled={loading || isSubmitting || isRateLimited()}
          error={errors.email?.message}
          {...register('email')}
        />
      </div>

      <div>
        <label 
          htmlFor="password" 
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Password
        </label>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          autoComplete="current-password"
          required
          disabled={loading || isSubmitting || isRateLimited()}
          error={errors.password?.message}
          {...register('password')}
        />
      </div>

      {/* Rate limiting warning */}
      {showRateLimit && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-3">
          <div className="flex">
            <svg className="h-5 w-5 text-yellow-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              {remainingAttempts} attempt{remainingAttempts !== 1 ? 's' : ''} remaining before temporary lockout.
            </p>
          </div>
        </div>
      )}

      {/* Error display */}
      {(error || errors.root) && (
        <div 
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3"
          role="alert"
        >
          <div className="flex">
            <svg className="h-5 w-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <p className="text-sm text-red-800 dark:text-red-200">
              {error || errors.root?.message}
            </p>
          </div>
        </div>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={loading || isSubmitting || isRateLimited()}
        loading={loading || isSubmitting}
      >
        {loading || isSubmitting ? 'Signing In...' : 'Sign In'}
      </Button>

      {/* Security notice */}
      <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
        <p>
          Your connection is secured with end-to-end encryption.
          <br />
          We never store your password in plain text.
        </p>
      </div>
    </form>
  );
};

export default LoginForm;
