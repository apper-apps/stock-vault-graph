import React from 'react'
import ApperIcon from '@/components/ApperIcon'

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'md', 
  icon,
  className = '' 
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full'
  
  const variants = {
    default: 'bg-slate-100 text-slate-800',
    primary: 'bg-primary-100 text-primary-800',
    success: 'bg-success-100 text-success-800',
    warning: 'bg-amber-100 text-amber-800',
    danger: 'bg-error-100 text-error-800',
    info: 'bg-blue-100 text-blue-800'
  }
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm'
  }
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`
  
  return (
    <span className={classes}>
      {icon && (
        <ApperIcon name={icon} className="mr-1 h-3 w-3" />
      )}
      {children}
    </span>
  )
}

export default Badge