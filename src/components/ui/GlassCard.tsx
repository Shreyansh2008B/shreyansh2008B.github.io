import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  hover?: boolean;
  glow?: boolean;
  className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  hover = false,
  glow = false,
  className = '',
  ...props
}) => {
  const baseClasses = 'glass-card';
  const hoverClasses = hover ? 'hover:shadow-glow hover:-translate-y-1 hover:scale-[1.02]' : '';
  const glowClasses = glow ? 'shadow-glow' : '';

  return (
    <motion.div
      className={`${baseClasses} ${hoverClasses} ${glowClasses} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

interface GlassButtonProps extends HTMLMotionProps<'button'> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => {
  const variantClasses = {
    primary: 'bg-gradient-to-r from-primary-sky to-primary-lavender text-white shadow-lg hover:shadow-glow',
    secondary: 'glass hover:bg-white/90 dark:hover:bg-slate-700/90',
    ghost: 'bg-transparent hover:bg-white/20 dark:hover:bg-slate-700/30',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm rounded-xl',
    md: 'px-6 py-3 rounded-2xl',
    lg: 'px-8 py-4 text-lg rounded-2xl',
  };

  return (
    <motion.button
      className={`font-medium font-poppins transition-all duration-300 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      {children}
    </motion.button>
  );
};
