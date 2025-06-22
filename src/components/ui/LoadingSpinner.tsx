'use client';
import * as React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface LoadingSpinnerProps extends React.HTMLAttributes<SVGSVGElement> {
  size?: number;
  className?: string;
}

const LoadingSpinner = React.forwardRef<SVGSVGElement, LoadingSpinnerProps>(
  ({ className, size = 40, ...props }, ref) => {
    return (
      <Loader2
        ref={ref}
        width={size}
        height={size}
        color='#1E3A5F'
        className={cn('animate-spin text-primary', className)}
        {...props}
      />
    );
  }
);

LoadingSpinner.displayName = 'LoadingSpinner';

export { LoadingSpinner }; 