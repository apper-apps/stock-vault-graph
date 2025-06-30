import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import ApperIcon from '@/components/ApperIcon'
import { stockMovementService } from '@/services/api/stockMovementService'

const StockAdjustmentModal = ({ 
  isOpen, 
  onClose, 
  product, 
  onSuccess 
}) => {
  const [adjustmentType, setAdjustmentType] = useState('add')
  const [quantity, setQuantity] = useState('')
  const [reason, setReason] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  
  const reasons = {
    add: ['Restock', 'Purchase', 'Return', 'Adjustment', 'Other'],
    remove: ['Sale', 'Damage', 'Loss', 'Transfer', 'Adjustment', 'Other']
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!quantity || !reason) {
      toast.error('Please fill in all required fields')
      return
    }
    
    const adjustmentQuantity = adjustmentType === 'add' 
      ? parseInt(quantity) 
      : -parseInt(quantity)
    
    setLoading(true)
    
    try {
      await stockMovementService.create({
        productId: product.Id,
        type: adjustmentType === 'add' ? 'IN' : 'OUT',
        quantity: Math.abs(adjustmentQuantity),
        reason,
        notes: notes || ''
      })
      
      toast.success(
        `Stock ${adjustmentType === 'add' ? 'added' : 'removed'} successfully`
      )
      
      onSuccess()
      handleClose()
    } catch (error) {
      toast.error('Failed to adjust stock')
    } finally {
      setLoading(false)
    }
  }
  
  const handleClose = () => {
    setAdjustmentType('add')
    setQuantity('')
    setReason('')
    setNotes('')
    onClose()
  }
  
  if (!product) return null
  
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={handleClose}
            />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900">
                  Adjust Stock
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  icon="X"
                  onClick={handleClose}
                  className="h-8 w-8 p-0"
                />
              </div>
              
<div className="mb-6">
                <h4 className="font-medium text-slate-900">{product.Name}</h4>
                <p className="text-sm text-slate-500">
                  Current Stock: <span className="font-medium">{product.quantity}</span>
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Adjustment Type */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Adjustment Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setAdjustmentType('add')}
                      className={`p-3 rounded-md border-2 transition-all duration-150 ${
                        adjustmentType === 'add'
                          ? 'border-success-500 bg-success-50 text-success-700'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <ApperIcon name="Plus" className="h-5 w-5 mx-auto mb-1" />
                      <div className="text-sm font-medium">Add Stock</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdjustmentType('remove')}
                      className={`p-3 rounded-md border-2 transition-all duration-150 ${
                        adjustmentType === 'remove'
                          ? 'border-error-500 bg-error-50 text-error-700'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <ApperIcon name="Minus" className="h-5 w-5 mx-auto mb-1" />
                      <div className="text-sm font-medium">Remove Stock</div>
                    </button>
                  </div>
                </div>
                
                {/* Quantity */}
                <Input
                  label="Quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Enter quantity"
                  required
                />
                
                {/* Reason */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Reason
                  </label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  >
                    <option value="">Select reason</option>
                    {reasons[adjustmentType].map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
                
                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Additional notes..."
                  />
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleClose}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    loading={loading}
                    className="flex-1"
                  >
                    {adjustmentType === 'add' ? 'Add Stock' : 'Remove Stock'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default StockAdjustmentModal