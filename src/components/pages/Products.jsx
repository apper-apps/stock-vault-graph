import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AddProductModal from "@/components/organisms/AddProductModal";
import Categories from "@/components/pages/Categories";
import ProductTable from "@/components/organisms/ProductTable";
import StockAdjustmentModal from "@/components/organisms/StockAdjustmentModal";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import { categoryService } from "@/services/api/categoryService";
import { productService } from "@/services/api/productService";

const Products = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
// Modals and filters
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [adjustmentModalOpen, setAdjustmentModalOpen] = useState(false)
  const [addProductModalOpen, setAddProductModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const loadData = async () => {
    try {
      setError('')
      setLoading(true)
      
      const [productsData, categoriesData] = await Promise.all([
        productService.getAll(),
        categoryService.getAll()
      ])
      
      // Add category names to products
      const productsWithCategories = productsData.map(product => {
        const category = categoriesData.find(c => c.Id === product.categoryId)
        return {
          ...product,
          category: category?.name || 'Uncategorized'
        }
      })
      
      setProducts(productsWithCategories)
      setCategories(categoriesData)
      setFilteredProducts(productsWithCategories)
    } catch (err) {
      setError('Failed to load products')
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadData()
  }, [])
  
  // Filter products based on search and filters
  useEffect(() => {
    let filtered = products
    
    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(product => {
        if (statusFilter === 'in-stock') return product.quantity > product.reorderPoint
        if (statusFilter === 'low-stock') return product.quantity <= product.reorderPoint && product.quantity > 0
        if (statusFilter === 'out-of-stock') return product.quantity === 0
        return true
      })
    }
    
    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(product => product.categoryId === parseInt(categoryFilter))
    }
    
    setFilteredProducts(filtered)
  }, [products, searchQuery, statusFilter, categoryFilter])
  
  const handleEdit = (product) => {
    // TODO: Implement edit product modal
    toast.info('Edit functionality coming soon')
  }
  
  const handleAdjustStock = (product) => {
    setSelectedProduct(product)
    setAdjustmentModalOpen(true)
  }
  
  const handleDelete = async (product) => {
    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      try {
        await productService.delete(product.Id)
        toast.success('Product deleted successfully')
        loadData()
      } catch (error) {
        toast.error('Failed to delete product')
      }
    }
  }
  
const handleStockAdjustmentSuccess = () => {
    loadData()
  }

  const handleAddProduct = () => {
    setAddProductModalOpen(true)
  }
  
  const handleAddProductSuccess = () => {
    loadData()
  }
  if (loading) return <Loading type="table" />
  if (error) return <Error message={error} onRetry={loadData} />
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Products</h1>
          <p className="text-slate-600">Manage your product inventory</p>
</div>
        <Button
          icon="Plus"
          onClick={handleAddProduct}
          className="mt-4 sm:mt-0"
        >
          Add Product
        </Button>
      </div>
      
      {/* Filters */}
      <div className="card p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <SearchBar
            placeholder="Search products..."
            onSearch={setSearchQuery}
            className="md:col-span-2"
          />
          
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Status</option>
              <option value="in-stock">In Stock</option>
              <option value="low-stock">Low Stock</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>
          </div>
          
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.Id} value={category.Id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Products Table */}
      {filteredProducts.length === 0 ? (
        <Empty
          title="No products found"
description="No products match your current filters. Try adjusting your search or filters."
          actionLabel="Add Product"
          onAction={handleAddProduct}
          icon="Package"
        />
      ) : (
        <ProductTable
          products={filteredProducts}
          onEdit={handleEdit}
          onAdjustStock={handleAdjustStock}
          onDelete={handleDelete}
        />
      )}
)}
      
      {/* Stock Adjustment Modal */}
        isOpen={adjustmentModalOpen}
        onClose={() => setAdjustmentModalOpen(false)}
        product={selectedProduct}
        onSuccess={handleStockAdjustmentSuccess}
      />
      
      {/* Add Product Modal */}
      <AddProductModal
        isOpen={addProductModalOpen}
        onClose={() => setAddProductModalOpen(false)}
        categories={categories}
        onSuccess={handleAddProductSuccess}
      />
    </div>
  )
}

export default Products