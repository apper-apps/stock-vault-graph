import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import ApperIcon from '@/components/ApperIcon'
import { productService } from '@/services/api/productService'

const AddProductModal = ({ isOpen, onClose, categories, onSuccess }) => {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    categoryId: '',
    quantity: '',
    reorderPoint: '',
    costPrice: '',
    sellingPrice: ''
  })
  const [errors, setErrors] = useState({})

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required'
    }

    if (!formData.sku.trim()) {
      newErrors.sku = 'SKU is required'
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Category is required'
    }

    if (!formData.quantity || formData.quantity < 0) {
      newErrors.quantity = 'Valid quantity is required'
    }

    if (!formData.reorderPoint || formData.reorderPoint < 0) {
      newErrors.reorderPoint = 'Valid reorder point is required'
    }

    if (!formData.costPrice || formData.costPrice <= 0) {
      newErrors.costPrice = 'Valid cost price is required'
    }

    if (!formData.sellingPrice || formData.sellingPrice <= 0) {
      newErrors.sellingPrice = 'Valid selling price is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
try {
      const productData = {
        name: formData.name.trim(),
        sku: formData.sku.trim(),
        description: formData.description.trim(),
        categoryId: parseInt(formData.categoryId),
        quantity: parseInt(formData.quantity),
        reorderPoint: parseInt(formData.reorderPoint),
        unitPrice: parseFloat(formData.sellingPrice)
      }

      await productService.create(productData)
      toast.success('Product created successfully')
      onSuccess()
      handleClose()
    } catch (error) {
      toast.error('Failed to create product')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({
      name: '',
      sku: '',
      description: '',
      categoryId: '',
      quantity: '',
      reorderPoint: '',
      costPrice: '',
      sellingPrice: ''
    })
    setErrors({})
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <ApperIcon name="Plus" className="h-5 w-5 text-primary-600" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900">Add New Product</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            icon="X"
            onClick={handleClose}
            className="h-8 w-8 p-0"
          />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Input
                label="Product Name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                error={errors.name}
                placeholder="Enter product name"
                required
              />
            </div>

            <div>
              <Input
                label="SKU"
                value={formData.sku}
                onChange={(e) => handleInputChange('sku', e.target.value)}
                error={errors.sku}
                placeholder="Enter SKU"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Category *
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => handleInputChange('categoryId', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.categoryId ? 'border-error-300' : 'border-slate-300'
                }`}
                required
              >
                <option value="">Select category</option>
{categories.map(category => (
                  <option key={category.Id} value={category.Id}>
                    {category.Name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="mt-1 text-sm text-error-600">{errors.categoryId}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter product description"
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <Input
                label="Initial Quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => handleInputChange('quantity', e.target.value)}
                error={errors.quantity}
                placeholder="0"
                min="0"
                required
              />
            </div>

            <div>
              <Input
                label="Reorder Point"
                type="number"
                value={formData.reorderPoint}
                onChange={(e) => handleInputChange('reorderPoint', e.target.value)}
                error={errors.reorderPoint}
                placeholder="0"
                min="0"
                required
              />
            </div>

            <div>
              <Input
                label="Cost Price"
                type="number"
                step="0.01"
                value={formData.costPrice}
                onChange={(e) => handleInputChange('costPrice', e.target.value)}
                error={errors.costPrice}
                placeholder="0.00"
                min="0"
                required
              />
            </div>

            <div>
              <Input
                label="Selling Price"
                type="number"
                step="0.01"
                value={formData.sellingPrice}
                onChange={(e) => handleInputChange('sellingPrice', e.target.value)}
                error={errors.sellingPrice}
                placeholder="0.00"
                min="0"
                required
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-slate-200">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
              icon="Plus"
            >
              Create Product
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default AddProductModal