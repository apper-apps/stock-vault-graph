import React, { forwardRef } from 'react'
import ApperIcon from '@/components/ApperIcon'

const Input = forwardRef(({
  label,
  error,
  helper,
  icon,
  iconPosition = 'left',
  className = '',
  ...props
}, ref) => {
  const hasError = !!error
  
  const inputClasses = `
    w-full px-3 py-2 text-sm border rounded-md transition-colors duration-150
    placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-0
    ${hasError 
      ? 'border-error-300 focus:border-error-500 focus:ring-error-500' 
      : 'border-slate-300 focus:border-primary-500 focus:ring-primary-500'
    }
    ${icon && iconPosition === 'left' ? 'pl-10' : ''}
    ${icon && iconPosition === 'right' ? 'pr-10' : ''}
    ${className}
  `
  
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-1">
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <ApperIcon name={icon} className="h-4 w-4 text-slate-400" />
          </div>
        )}
        
        <input
          ref={ref}
          className={inputClasses}
          {...props}
        />
        
        {icon && iconPosition === 'right' && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ApperIcon name={icon} className="h-4 w-4 text-slate-400" />
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-error-600">{error}</p>
      )}
      
      {helper && !error && (
        <p className="mt-1 text-sm text-slate-500">{helper}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input