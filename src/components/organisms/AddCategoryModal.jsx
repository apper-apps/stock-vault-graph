import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import ApperIcon from '@/components/ApperIcon'
import { categoryService } from '@/services/api/categoryService'

const AddCategoryModal = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: ''
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
      newErrors.name = 'Category name is required'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Category description is required'
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
      const categoryData = {
        name: formData.name.trim(),
        description: formData.description.trim()
      }

      await categoryService.create(categoryData)
      toast.success('Category created successfully')
      onSuccess()
      handleClose()
    } catch (error) {
      toast.error('Failed to create category')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({
      name: '',
      description: ''
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
        className="bg-white rounded-lg shadow-xl w-full max-w-md"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <ApperIcon name="Plus" className="h-5 w-5 text-primary-600" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900">Add New Category</h2>
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
          <div className="space-y-4">
            <Input
              label="Category Name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              error={errors.name}
              placeholder="Enter category name"
              required
            />

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter category description"
                rows={3}
                className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.description ? 'border-error-300' : 'border-slate-300'
                }`}
                required
              />
              {errors.description && (
                <p className="mt-1 text-sm text-error-600">{errors.description}</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-slate-200">
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
              Create Category
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default AddCategoryModal