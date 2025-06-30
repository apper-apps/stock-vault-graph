import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { productService } from '@/services/api/productService'
import { stockMovementService } from '@/services/api/stockMovementService'

const Dashboard = () => {
  const [products, setProducts] = useState([])
  const [movements, setMovements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  const loadData = async () => {
    try {
      setError('')
      setLoading(true)
      
      const [productsData, movementsData] = await Promise.all([
        productService.getAll(),
        stockMovementService.getAll()
      ])
      
      setProducts(productsData)
      setMovements(movementsData.slice(0, 10)) // Latest 10 movements
    } catch (err) {
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadData()
  }, [])
  
  if (loading) return <Loading type="cards" />
  if (error) return <Error message={error} onRetry={loadData} />
  
  // Calculate stats
  const totalProducts = products.length
const totalValue = products.reduce((sum, p) => sum + (p.quantity * p.unitPrice), 0)
  const lowStockItems = products.filter(p => p.quantity <= p.reorderPoint && p.quantity > 0)
  const outOfStockItems = products.filter(p => p.quantity === 0)
  
  const statCards = [
    {
      title: 'Total Products',
      value: totalProducts,
      icon: 'Package',
      color: 'primary',
      change: '+5%'
    },
    {
      title: 'Total Value',
      value: `$${totalValue.toLocaleString()}`,
      icon: 'DollarSign',
      color: 'success',
      change: '+12%'
    },
    {
      title: 'Low Stock Items',
      value: lowStockItems.length,
      icon: 'AlertTriangle',
      color: 'warning',
      change: '-2%'
    },
    {
      title: 'Out of Stock',
      value: outOfStockItems.length,
      icon: 'XCircle',
      color: 'error',
      change: '0%'
    }
  ]
  
  const colorClasses = {
    primary: 'bg-primary-500',
    success: 'bg-success-500',
    warning: 'bg-amber-500',
    error: 'bg-error-500'
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600">Overview of your inventory status</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="card p-6 card-hover"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg ${colorClasses[stat.color]}`}>
                <ApperIcon name={stat.icon} className="h-6 w-6 text-white" />
              </div>
              <span className={`text-sm font-medium ${
                stat.change.startsWith('+') ? 'text-success-600' : 
                stat.change.startsWith('-') ? 'text-error-600' : 'text-slate-500'
              }`}>
                {stat.change}
              </span>
            </div>
            <div className="text-2xl font-bold text-slate-900 mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-slate-600">
              {stat.title}
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Low Stock Alerts</h3>
            <ApperIcon name="AlertTriangle" className="h-5 w-5 text-amber-500" />
          </div>
          
          {lowStockItems.length === 0 ? (
            <p className="text-slate-500 text-center py-8">No low stock items</p>
          ) : (
            <div className="space-y-3">
{lowStockItems.slice(0, 5).map((product) => (
                <div key={product.Id} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                  <div>
                    <div className="font-medium text-slate-900">{product.Name}</div>
                    <div className="text-sm text-slate-600">SKU: {product.sku}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-amber-700">{product.quantity}</div>
                    <div className="text-xs text-slate-500">Reorder: {product.reorderPoint}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
        
        {/* Recent Stock Movements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Recent Movements</h3>
            <ApperIcon name="TrendingUp" className="h-5 w-5 text-primary-500" />
          </div>
          
          {movements.length === 0 ? (
            <p className="text-slate-500 text-center py-8">No recent movements</p>
          ) : (
            <div className="space-y-3">
              {movements.map((movement) => {
                const product = products.find(p => p.Id === movement.productId)
                return (
                  <div key={movement.Id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg">
                    <div className="flex items-center">
                      <div className={`p-1 rounded-full mr-3 ${
                        movement.type === 'IN' ? 'bg-success-100' : 'bg-error-100'
                      }`}>
                        <ApperIcon 
                          name={movement.type === 'IN' ? 'ArrowUp' : 'ArrowDown'} 
                          className={`h-3 w-3 ${
                            movement.type === 'IN' ? 'text-success-600' : 'text-error-600'
                          }`} 
                        />
                      </div>
<div>
                        <div className="font-medium text-slate-900">
                          {product?.Name || 'Unknown Product'}
                        </div>
                        <div className="text-sm text-slate-600">{movement.reason}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-medium ${
                        movement.type === 'IN' ? 'text-success-600' : 'text-error-600'
                      }`}>
                        {movement.type === 'IN' ? '+' : '-'}{movement.quantity}
                      </div>
                      <div className="text-xs text-slate-500">
                        {format(new Date(movement.timestamp), 'MMM d, HH:mm')}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard