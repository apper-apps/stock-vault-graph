import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import StatusBadge from '@/components/molecules/StatusBadge'
import QuickActions from '@/components/molecules/QuickActions'
import ApperIcon from '@/components/ApperIcon'

const ProductTable = ({ 
  products, 
  onEdit, 
  onAdjustStock, 
  onDelete,
  loading = false 
}) => {
  const [sortField, setSortField] = useState('name')
  const [sortDirection, setSortDirection] = useState('asc')
  
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }
  
  const sortedProducts = [...products].sort((a, b) => {
    let aValue = a[sortField]
    let bValue = b[sortField]
    
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase()
      bValue = bValue.toLowerCase()
    }
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })
  
  const SortableHeader = ({ field, children }) => (
    <th
      className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-50 transition-colors duration-150"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        {sortField === field && (
          <ApperIcon
            name={sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown'}
            className="h-3 w-3"
          />
        )}
      </div>
    </th>
  )
  
  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <SortableHeader field="sku">SKU</SortableHeader>
              <SortableHeader field="name">Product Name</SortableHeader>
              <SortableHeader field="category">Category</SortableHeader>
              <SortableHeader field="quantity">Quantity</SortableHeader>
              <SortableHeader field="unitPrice">Unit Price</SortableHeader>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {sortedProducts.map((product, index) => (
              <motion.tr
                key={product.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="table-row-hover"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                  {product.sku}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-slate-900">
                      {product.name}
                    </div>
                    {product.description && (
                      <div className="text-sm text-slate-500 truncate max-w-xs">
                        {product.description}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {product.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                  {product.quantity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                  ${product.unitPrice?.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge 
                    quantity={product.quantity} 
                    reorderPoint={product.reorderPoint} 
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon="Plus"
                      onClick={() => onAdjustStock(product)}
                      className="h-8 w-8 p-0"
                    />
                    <QuickActions
                      onEdit={() => onEdit(product)}
                      onAdjustStock={() => onAdjustStock(product)}
                      onDelete={() => onDelete(product)}
                    />
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ProductTable