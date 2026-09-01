'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, description, id, ...props }, ref) => {
    const generatedId = React.useId();
    const switchId = id || generatedId;

    return (
      <div className="flex items-center gap-3">
        <label
          htmlFor={switchId}
          className="flex items-center gap-3 cursor-pointer"
        >
          <input
            type="checkbox"
            id={switchId}
            ref={ref}
            className={cn(
              'h-5 w-5 rounded border-neutral-300 text-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors',
              props.disabled && 'opacity-50 cursor-not-allowed'
            )}
            {...props}
          />
          {label && (
            <span className="text-sm font-medium text-neutral-900">{label}</span>
          )}
        </label>
        {description && (
          <p className="text-xs text-neutral-500">{description}</p>
        )}
      </div>
    );
  }
);
Switch.displayName = 'Switch';