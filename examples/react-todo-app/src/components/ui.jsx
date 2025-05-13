import React from 'react';
import { cva } from 'class-variance-authority';
import { Slot } from '@radix-ui/react-slot';
import { clsx } from 'clsx';

// Button component
const buttonVariants = cva(
  'rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp className={clsx(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);

Button.displayName = 'Button';

// Toggle component
export const Toggle = ({ isActive, onToggle, activeText, inactiveText, style }) => (
  <button
    onClick={onToggle}
    style={{
      padding: '6px 12px',
      borderRadius: '4px',
      border: 'none',
      background: isActive ? '#6d28d9' : '#4a4a4a',
      color: 'white',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      ...style,
    }}
  >
    {isActive ? activeText : inactiveText}
  </button>
);

// ActionBar component
export const ActionBar = ({ children, style }) => (
  <div
    style={{
      position: 'fixed',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: 'rgba(30, 30, 30, 0.9)',
      padding: '12px 20px',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
      zIndex: 1000,
      display: 'flex',
      gap: '16px',
      alignItems: 'center',
      backdropFilter: 'blur(8px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      ...style,
    }}
  >
    {children}
  </div>
);

// ActionGroup component
export const ActionGroup = ({ children, label, style }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      ...style,
    }}
  >
    {label && <span style={{ fontSize: '14px', color: 'white' }}>{label}</span>}
    {children}
  </div>
);
