import React, { useState, useEffect } from 'react'
import Input from '@/components/atoms/Input'
import ApperIcon from '@/components/ApperIcon'

const SearchBar = ({ 
  placeholder = "Search...", 
  onSearch, 
  debounceMs = 300, 
  className = '' 
}) => {
  const [query, setQuery] = useState('')
  
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query)
    }, debounceMs)
    
    return () => clearTimeout(timer)
  }, [query, onSearch, debounceMs])
  
  const handleClear = () => {
    setQuery('')
  }
  
  return (
    <div className={`relative ${className}`}>
      <Input
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        icon="Search"
        iconPosition="left"
        className="pr-8"
      />
      
      {query && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
        >
          <ApperIcon name="X" className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}

export default SearchBar