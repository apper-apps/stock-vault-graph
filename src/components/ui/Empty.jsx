import React from 'react'
import ApperIcon from '@/components/ApperIcon'

const Empty = ({ 
  title = "No data found",
  description = "Get started by adding your first item.",
  actionLabel = "Add Item",
  onAction,
  icon = "Package"
}) => {
  return (
    <div className="animate-fade-in">
      <div className="card p-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
          <ApperIcon name={icon} className="h-8 w-8 text-slate-400" />
        </div>
        
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          {title}
        </h3>
        
        <p className="text-slate-600 mb-6 max-w-sm mx-auto">
          {description}
        </p>
        
        {onAction && (
          <button
            onClick={onAction}
            className="btn-primary inline-flex items-center"
          >
            <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  )
}

export default Empty