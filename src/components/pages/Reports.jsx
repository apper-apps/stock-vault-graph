import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { format, subDays, startOfDay, endOfDay } from 'date-fns'
import Button from '@/components/atoms/Button'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import ApperIcon from '@/components/ApperIcon'
import { productService } from '@/services/api/productService'
import { stockMovementService } from '@/services/api/stockMovementService'
import { categoryService } from '@/services/api/categoryService'

const Reports = () => {
  const [products, setProducts] = useState([])
  const [movements, setMovements] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  const loadData = async () => {
    try {
      setError('')
      setLoading(true)
      
      const [productsData, movementsData, categoriesData] = await Promise.all([
        productService.getAll(),
        stockMovementService.getAll(),
        categoryService.getAll()
      ])
      
      setProducts(productsData)
      setMovements(movementsData)
      setCategories(categoriesData)
    } catch (err) {
      setError('Failed to load report data')
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadData()
  }, [])
  
  if (loading) return <Loading type="cards" />
  if (error) return <Error message={error} onRetry={loadData} />
  
  // Calculate report data
  const totalProducts = products.length
  const totalValue = products.reduce((sum, p) => sum + (p.quantity * p.unitPrice), 0)
  const lowStockItems = products.filter(p => p.quantity <= p.reorderPoint && p.quantity > 0)
  const outOfStockItems = products.filter(p => p.quantity === 0)
  
  // Recent movements (last 7 days)
  const sevenDaysAgo = subDays(new Date(), 7)
  const recentMovements = movements.filter(m => new Date(m.timestamp) >= sevenDaysAgo)
  const recentStockIn = recentMovements.filter(m => m.type === 'IN').reduce((sum, m) => sum + m.quantity, 0)
  const recentStockOut = recentMovements.filter(m => m.type === 'OUT').reduce((sum, m) => sum + m.quantity, 0)
  
  // Category breakdown
const categoryBreakdown = categories.map(category => {
    const categoryProducts = products.filter(p => p.categoryId === category.Id)
    const totalQuantity = categoryProducts.reduce((sum, p) => sum + p.quantity, 0)
    const totalValue = categoryProducts.reduce((sum, p) => sum + (p.quantity * p.unitPrice), 0)
    
    return {
      name: category.Name,
      productCount: categoryProducts.length,
      totalQuantity,
      totalValue
    }
  }).filter(c => c.productCount > 0)
  
  // Top products by value
  const topProductsByValue = products
    .map(p => ({
      ...p,
      totalValue: p.quantity * p.unitPrice
    }))
    .sort((a, b) => b.totalValue - a.totalValue)
    .slice(0, 10)
  
  const reportCards = [
    {
      title: 'Inventory Summary',
      icon: 'BarChart3',
      color: 'primary',
      data: [
        { label: 'Total Products', value: totalProducts },
        { label: 'Total Inventory Value', value: `$${totalValue.toLocaleString()}` },
        { label: 'Low Stock Items', value: lowStockItems.length },
        { label: 'Out of Stock Items', value: outOfStockItems.length }
      ]
    },
    {
      title: 'Stock Activity (7 Days)',
      icon: 'TrendingUp',
      color: 'success',
      data: [
        { label: 'Stock Received', value: recentStockIn },
        { label: 'Stock Issued', value: recentStockOut },
        { label: 'Net Change', value: recentStockIn - recentStockOut },
        { label: 'Total Transactions', value: recentMovements.length }
      ]
    }
  ]
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
          <p className="text-slate-600">Analyze your inventory performance and trends</p>
        </div>
        <Button
          icon="Download"
          variant="secondary"
          className="mt-4 sm:mt-0"
        >
          Export Report
        </Button>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {reportCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="card p-6"
          >
            <div className="flex items-center mb-4">
              <div className={`p-2 rounded-lg mr-3 ${
                card.color === 'primary' ? 'bg-primary-100' : 'bg-success-100'
              }`}>
                <ApperIcon 
                  name={card.icon} 
                  className={`h-5 w-5 ${
                    card.color === 'primary' ? 'text-primary-600' : 'text-success-600'
                  }`} 
                />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">
                {card.title}
              </h3>
            </div>
            
            <div className="space-y-3">
              {card.data.map((item, itemIndex) => (
                <div key={itemIndex} className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">{item.label}</span>
                  <span className="text-sm font-medium text-slate-900">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Category Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="card p-6"
      >
        <div className="flex items-center mb-4">
          <div className="p-2 bg-amber-100 rounded-lg mr-3">
            <ApperIcon name="PieChart" className="h-5 w-5 text-amber-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">
            Category Breakdown
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-2 text-sm font-medium text-slate-700">Category</th>
                <th className="text-right py-2 text-sm font-medium text-slate-700">Products</th>
                <th className="text-right py-2 text-sm font-medium text-slate-700">Total Qty</th>
                <th className="text-right py-2 text-sm font-medium text-slate-700">Total Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {categoryBreakdown.map((category, index) => (
                <tr key={index}>
<td className="py-3 text-sm font-medium text-slate-900">
                    {category.name}
                  </td>
                  <td className="py-3 text-sm text-slate-600 text-right">
                    {category.productCount}
                  </td>
                  <td className="py-3 text-sm text-slate-600 text-right">
                    {category.totalQuantity}
                  </td>
                  <td className="py-3 text-sm font-medium text-slate-900 text-right">
                    ${category.totalValue.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
      
      {/* Top Products by Value */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="card p-6"
      >
        <div className="flex items-center mb-4">
          <div className="p-2 bg-purple-100 rounded-lg mr-3">
            <ApperIcon name="Award" className="h-5 w-5 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">
            Top Products by Value
          </h3>
        </div>
        
        <div className="space-y-3">
          {topProductsByValue.slice(0, 8).map((product, index) => (
            <div key={product.Id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-8 h-8 bg-slate-200 rounded-full mr-3 text-sm font-medium text-slate-600">
                  {index + 1}
                </div>
<div>
                  <div className="font-medium text-slate-900">{product.Name}</div>
                  <div className="text-sm text-slate-500">SKU: {product.sku}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium text-slate-900">
                  ${product.totalValue.toLocaleString()}
                </div>
                <div className="text-sm text-slate-500">
                  {product.quantity} × ${product.unitPrice}
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default Reports