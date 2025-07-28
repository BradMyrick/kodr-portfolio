import React, { useState, useCallback } from 'react';
import { cn } from '@/utils';
import { InputProps } from '@/types';

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type = 'text',
    placeholder,
    value,
    onChange,
    error,
    disabled = false,
    required = false,
    ...props 
  }, ref) => {
    const [focused, setFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Sanitize input to prevent XSS
    const sanitizeInput = useCallback((input: string): string => {
      // Remove potentially dangerous characters
      return input
        .replace(/[<>]/g, '') // Remove < and >
        .replace(/javascript:/gi, '') // Remove javascript: protocol
        .replace(/on\w+=/gi, '') // Remove event handlers
        .trim();
    }, []);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const sanitizedValue = sanitizeInput(e.target.value);
      // Update the value with sanitized input
      e.target.value = sanitizedValue;
      if (onChange) {
        onChange(e);
      }
    }, [onChange, sanitizeInput]);

    const handleFocus = () => setFocused(true);
    const handleBlur = () => setFocused(false);

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    const baseStyles = `
      flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2
      text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium
      placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2
      focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed
      disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100
      dark:ring-offset-gray-800 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400
      transition-colors duration-200
    `;

    const errorStyles = error ? 'border-red-500 focus-visible:ring-red-500' : '';
    const focusStyles = focused ? 'ring-2 ring-blue-500 border-blue-500' : '';

    return (
      <div className="relative w-full">
        <input
          ref={ref}
          type={type === 'password' && showPassword ? 'text' : type}
          className={cn(
            baseStyles,
            errorStyles,
            focusStyles,
            type === 'password' ? 'pr-10' : '',
            className
          )}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          required={required}
          autoComplete={type === 'password' ? 'current-password' : 'off'}
          // Security attributes
          spellCheck={type === 'password' ? false : undefined}
          autoCorrect={type === 'password' ? 'off' : undefined}
          autoCapitalize={type === 'password' ? 'off' : undefined}
          {...props}
        />
        
        {/* Password visibility toggle */}
        {type === 'password' && (
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            onClick={togglePasswordVisibility}
            tabIndex={-1}
          >
            {showPassword ? (
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        )}
        
        {/* Error message */}
        {error && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
