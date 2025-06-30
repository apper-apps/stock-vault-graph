import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import SearchBar from '@/components/molecules/SearchBar'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import { stockMovementService } from '@/services/api/stockMovementService'
import { productService } from '@/services/api/productService'

const StockMovements = () => {
  const [movements, setMovements] = useState([])
  const [products, setProducts] = useState([])
  const [filteredMovements, setFilteredMovements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')
  
  const loadData = async () => {
    try {
      setError('')
      setLoading(true)
      
      const [movementsData, productsData] = await Promise.all([
        stockMovementService.getAll(),
        productService.getAll()
      ])
      
      // Add product names to movements
const movementsWithProducts = movementsData.map(movement => {
        const product = productsData.find(p => p.Id === movement.productId)
        return {
          ...movement,
          productName: product?.Name || 'Unknown Product',
          productSku: product?.sku || 'N/A'
        }
      })
      
      // Sort by timestamp (newest first)
      movementsWithProducts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      
      setMovements(movementsWithProducts)
      setProducts(productsData)
      setFilteredMovements(movementsWithProducts)
    } catch (err) {
      setError('Failed to load stock movements')
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadData()
  }, [])
  
  // Filter movements
  useEffect(() => {
    let filtered = movements
    
    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(movement =>
        movement.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movement.productSku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movement.reason.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(movement => movement.type === typeFilter)
    }
    
// Date filter
    if (dateFilter !== 'all') {
      const now = new Date()
      let filterDate = new Date()
      
      switch (dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0)
          break
        case 'week':
          filterDate.setDate(now.getDate() - 7)
          break
        case 'month':
          filterDate.setMonth(now.getMonth() - 1)
          break
        default:
          filterDate = null
      }
      
      if (filterDate) {
        filtered = filtered.filter(movement => 
          new Date(movement.timestamp) >= filterDate
        )
      }
    }
    
    setFilteredMovements(filtered)
  }, [movements, searchQuery, typeFilter, dateFilter])
  
  if (loading) return <Loading type="table" />
  if (error) return <Error message={error} onRetry={loadData} />
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Stock Movements</h1>
        <p className="text-slate-600">Track all inventory changes and transactions</p>
      </div>
      
      {/* Filters */}
      <div className="card p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <SearchBar
            placeholder="Search movements..."
            onSearch={setSearchQuery}
            className="md:col-span-2"
          />
          
          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Types</option>
              <option value="IN">Stock In</option>
              <option value="OUT">Stock Out</option>
            </select>
          </div>
          
          <div>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Past Week</option>
              <option value="month">Past Month</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Movements List */}
      {filteredMovements.length === 0 ? (
        <Empty
          title="No stock movements found"
          description="No stock movements match your current filters. Stock movements will appear here as you adjust inventory."
          icon="TrendingUp"
        />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Reason
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredMovements.map((movement, index) => (
                  <motion.tr
                    key={movement.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.02 }}
                    className="hover:bg-slate-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-slate-900">
                          {movement.productName}
                        </div>
                        <div className="text-sm text-slate-500">
                          SKU: {movement.productSku}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`p-1 rounded-full mr-2 ${
                          movement.type === 'IN' ? 'bg-success-100' : 'bg-error-100'
                        }`}>
                          <ApperIcon
                            name={movement.type === 'IN' ? 'ArrowUp' : 'ArrowDown'}
                            className={`h-3 w-3 ${
                              movement.type === 'IN' ? 'text-success-600' : 'text-error-600'
                            }`}
                          />
                        </div>
                        <span className={`text-sm font-medium ${
                          movement.type === 'IN' ? 'text-success-700' : 'text-error-700'
                        }`}>
                          {movement.type === 'IN' ? 'Stock In' : 'Stock Out'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${
                        movement.type === 'IN' ? 'text-success-600' : 'text-error-600'
                      }`}>
                        {movement.type === 'IN' ? '+' : '-'}{movement.quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {movement.reason}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {format(new Date(movement.timestamp), 'MMM d, yyyy HH:mm')}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 max-w-xs truncate">
                      {movement.notes || '-'}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default StockMovements