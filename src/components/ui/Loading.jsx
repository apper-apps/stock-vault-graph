import React from 'react'

const Loading = ({ type = 'default' }) => {
  if (type === 'table') {
    return (
      <div className="animate-fade-in">
        <div className="bg-white rounded-lg shadow-card overflow-hidden">
          {/* Table Header */}
          <div className="px-6 py-4 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div className="h-6 bg-slate-200 rounded animate-shimmer w-32"></div>
              <div className="h-9 bg-slate-200 rounded animate-shimmer w-24"></div>
            </div>
          </div>
          
          {/* Table Rows */}
          <div className="divide-y divide-slate-200">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                  <div className="h-4 bg-slate-200 rounded animate-shimmer"></div>
                  <div className="h-4 bg-slate-200 rounded animate-shimmer"></div>
                  <div className="h-4 bg-slate-200 rounded animate-shimmer w-20"></div>
                  <div className="h-4 bg-slate-200 rounded animate-shimmer w-16"></div>
                  <div className="h-5 bg-slate-200 rounded-full animate-shimmer w-20"></div>
                  <div className="flex space-x-2">
                    <div className="h-7 w-7 bg-slate-200 rounded animate-shimmer"></div>
                    <div className="h-7 w-7 bg-slate-200 rounded animate-shimmer"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (type === 'cards') {
    return (
      <div className="animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-8 w-8 bg-slate-200 rounded-lg animate-shimmer"></div>
                <div className="h-4 bg-slate-200 rounded animate-shimmer w-16"></div>
              </div>
              <div className="h-8 bg-slate-200 rounded animate-shimmer w-20 mb-2"></div>
              <div className="h-3 bg-slate-200 rounded animate-shimmer w-32"></div>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, index) => (
            <div key={index} className="card p-6">
              <div className="h-6 bg-slate-200 rounded animate-shimmer w-40 mb-4"></div>
              <div className="space-y-3">
                {[...Array(5)].map((_, rowIndex) => (
                  <div key={rowIndex} className="flex items-center justify-between">
                    <div className="h-4 bg-slate-200 rounded animate-shimmer w-32"></div>
                    <div className="h-4 bg-slate-200 rounded animate-shimmer w-20"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (type === 'grid') {
    return (
      <div className="animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="card p-6">
              <div className="h-6 bg-slate-200 rounded animate-shimmer w-3/4 mb-3"></div>
              <div className="h-4 bg-slate-200 rounded animate-shimmer w-full mb-4"></div>
              <div className="flex items-center justify-between">
                <div className="h-5 bg-slate-200 rounded-full animate-shimmer w-20"></div>
                <div className="h-4 bg-slate-200 rounded animate-shimmer w-12"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <div className="card p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          <span className="ml-3 text-slate-600">Loading...</span>
        </div>
      </div>
    </div>
  )
}

export default Loading