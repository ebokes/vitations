'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  hint?: string;
}

const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, error, hint, id, disabled, ...props }, ref) => {
    const generatedId = React.useId();
    const radioId = id || generatedId;

    return (
      <div className="w-full">
        <div className="flex items-start gap-3">
          <div className="relative flex-shrink-0">
            <input
              type="radio"
              id={radioId}
              className="peer sr-only"
              disabled={disabled}
              ref={ref}
              aria-describedby={
                error
                  ? `${radioId}-error`
                  : hint
                  ? `${radioId}-hint`
                  : undefined
              }
              {...props}
            />
            <label
              htmlFor={radioId}
              className={cn(
                'flex h-5 w-5 cursor-pointer items-center justify-center rounded-full border border-neutral-300 bg-white transition-colors',
                'peer-checked:border-primary-600 peer-checked:bg-primary-600',
                'peer-focus-visible:ring-2 peer-focus-visible:ring-primary-500 peer-focus-visible:ring-offset-2',
                'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
                error && 'border-red-500',
                disabled && 'cursor-not-allowed opacity-50'
              )}
            >
              <span className="h-2 w-2 rounded-full bg-white opacity-0 peer-checked:opacity-100" />
            </label>
          </div>
          {label && (
            <label
              htmlFor={radioId}
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
          <p id={`${radioId}-hint`} className="mt-1.5 text-xs text-neutral-500">
            {hint}
          </p>
        )}
        {error && (
          <p id={`${radioId}-error`} className="mt-1.5 text-xs text-red-600">
            {error}
          </p>
        )}
      </div>
    );
  }
);
Radio.displayName = 'Radio';

export interface RadioGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  options: Array<{
    value: string;
    label: string;
    disabled?: boolean;
  }>;
  value?: string;
  onChange?: (value: string) => void;
  name?: string;
  error?: string;
}

function RadioGroup({
  className,
  options,
  value,
  onChange,
  name,
  error,
  ...props
}: RadioGroupProps) {
  return (
    <div
      role="radiogroup"
      aria-invalid={error ? 'true' : undefined}
      className={cn('space-y-3', className)}
      {...props}
    >
      {options.map((option) => (
        <Radio
          key={option.value}
          name={name}
          value={option.value}
          label={option.label}
          disabled={option.disabled}
          checked={value === option.value}
          onChange={() => onChange?.(option.value)}
        />
      ))}
      {error && (
        <p className="text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export { Radio, RadioGroup };
