'use client';

import * as React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  hint?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, hint, id, disabled, ...props }, ref) => {
    const generatedId = React.useId();
    const checkboxId = id || generatedId;

    return (
      <div className="w-full">
        <div className="flex items-start gap-3">
          <div className="relative flex-shrink-0">
            <input
              type="checkbox"
              id={checkboxId}
              className="peer sr-only"
              disabled={disabled}
              ref={ref}
              aria-invalid={error ? 'true' : 'false'}
              aria-describedby={
                error
                  ? `${checkboxId}-error`
                  : hint
                  ? `${checkboxId}-hint`
                  : undefined
              }
              {...props}
            />
            <label
              htmlFor={checkboxId}
              className={cn(
                'flex h-5 w-5 cursor-pointer items-center justify-center rounded border border-neutral-300 bg-white transition-colors',
                'peer-checked:border-primary-600 peer-checked:bg-primary-600',
                'peer-focus-visible:ring-2 peer-focus-visible:ring-primary-500 peer-focus-visible:ring-offset-2',
                'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
                error && 'border-red-500',
                disabled && 'cursor-not-allowed opacity-50'
              )}
            >
              <Check className="h-3 w-3 text-white opacity-0 peer-checked:opacity-100" />
            </label>
          </div>
          {label && (
            <label
              htmlFor={checkboxId}
              className={cn(
                'text-sm text-neutral-700',
                disabled && 'cursor-not-allowed opacity-50'
              )}
            >
              {label}
            </label>
          )}
        </div>
        {hint && !error && (
          <p id={`${checkboxId}-hint`} className="mt-1.5 text-xs text-neutral-500">
            {hint}
          </p>
        )}
        {error && (
          <p id={`${checkboxId}-error`} className="mt-1.5 text-xs text-red-600">
            {error}
          </p>
        )}
      </div>
    );
  }
);
Checkbox.displayName = 'Checkbox';

export { Checkbox };
