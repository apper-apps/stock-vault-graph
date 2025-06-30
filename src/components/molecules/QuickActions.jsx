import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const QuickActions = ({ onEdit, onAdjustStock, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        icon="MoreVertical"
        onClick={() => setIsOpen(!isOpen)}
        className="h-8 w-8 p-0"
      />
      
      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute right-0 top-8 z-20 w-48 bg-white rounded-md shadow-lg border border-slate-200 py-1"
            >
              <button
                onClick={() => {
                  onEdit()
                  setIsOpen(false)
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                <ApperIcon name="Edit" className="mr-3 h-4 w-4" />
                Edit Product
              </button>
              
              <button
                onClick={() => {
                  onAdjustStock()
                  setIsOpen(false)
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                <ApperIcon name="Package" className="mr-3 h-4 w-4" />
                Adjust Stock
              </button>
              
              <hr className="my-1 border-slate-200" />
              
              <button
                onClick={() => {
                  onDelete()
                  setIsOpen(false)
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-error-600 hover:bg-error-50"
              >
                <ApperIcon name="Trash2" className="mr-3 h-4 w-4" />
                Delete Product
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default QuickActions