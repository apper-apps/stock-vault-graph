import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  onClick,
  className = '',
  type = 'button',
  ...props 
}) => {
const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-150 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500 shadow-sm',
    secondary: 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 focus:ring-primary-500 shadow-sm',
    ghost: 'text-slate-600 hover:bg-slate-100 focus:ring-primary-500',
    danger: 'bg-error-500 text-white hover:bg-error-600 focus:ring-error-500 shadow-sm',
    success: 'bg-success-500 text-white hover:bg-success-600 focus:ring-success-500 shadow-sm',
    warning: 'bg-amber-500 text-white hover:bg-amber-600 focus:ring-amber-500 shadow-sm'
  }
  
  const sizes = {
    sm: 'px-2.5 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  }
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`
  
  const iconSize = size === 'sm' ? 14 : size === 'lg' ? 18 : 16
  
  return (
    <motion.button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      {...props}
    >
      {loading && (
        <ApperIcon name="Loader2" className={`animate-spin mr-2 h-${iconSize/4} w-${iconSize/4}`} />
      )}
      
      {!loading && icon && iconPosition === 'left' && (
        <ApperIcon name={icon} className={`mr-2 h-${iconSize/4} w-${iconSize/4}`} />
      )}
      
      {children}
      
      {!loading && icon && iconPosition === 'right' && (
        <ApperIcon name={icon} className={`ml-2 h-${iconSize/4} w-${iconSize/4}`} />
      )}
    </motion.button>
  )
}

export default Button