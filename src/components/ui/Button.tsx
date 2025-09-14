import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'default',
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  const variantClasses = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary',
    outline: 'border border-border bg-background hover:bg-accent hover:text-accent-foreground focus:ring-primary',
    ghost: 'hover:bg-accent hover:text-accent-foreground focus:ring-primary'
  };

  const sizeClasses = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4',
    lg: 'h-12 px-6 text-lg'
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};