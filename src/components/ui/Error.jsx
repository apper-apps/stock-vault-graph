import React from 'react'
import ApperIcon from '@/components/ApperIcon'

const Error = ({ 
  message = "Something went wrong. Please try again.", 
  onRetry,
  showRetry = true 
}) => {
  return (
    <div className="animate-fade-in">
      <div className="card p-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-error-100 rounded-full mb-4">
          <ApperIcon name="AlertTriangle" className="h-8 w-8 text-error-600" />
        </div>
        
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          Oops! Something went wrong
        </h3>
        
        <p className="text-slate-600 mb-6 max-w-sm mx-auto">
          {message}
        </p>
        
        {showRetry && onRetry && (
          <button
            onClick={onRetry}
            className="btn-primary inline-flex items-center"
          >
            <ApperIcon name="RefreshCw" className="h-4 w-4 mr-2" />
            Try Again
          </button>
        )}
      </div>
    </div>
  )
}

export default Error