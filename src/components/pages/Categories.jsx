import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import AddCategoryModal from "@/components/organisms/AddCategoryModal";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import { categoryService } from "@/services/api/categoryService";
import { productService } from "@/services/api/productService";
const Categories = () => {
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [filteredCategories, setFilteredCategories] = useState([])
  const [loading, setLoading] = useState(true)
const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [addCategoryModalOpen, setAddCategoryModalOpen] = useState(false)
  
  const loadData = async () => {
    try {
      setError('')
      setLoading(true)
      
      const [categoriesData, productsData] = await Promise.all([
        categoryService.getAll(),
        productService.getAll()
      ])
      
      // Add product counts to categories
      const categoriesWithCounts = categoriesData.map(category => {
        const productCount = productsData.filter(p => p.categoryId === category.Id).length
        return {
          ...category,
          productCount
        }
      })
      
      setCategories(categoriesWithCounts)
      setProducts(productsData)
      setFilteredCategories(categoriesWithCounts)
    } catch (err) {
      setError('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadData()
  }, [])
  
  // Filter categories based on search
  useEffect(() => {
    if (searchQuery) {
      const filtered = categories.filter(category =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredCategories(filtered)
    } else {
      setFilteredCategories(categories)
    }
  }, [categories, searchQuery])
  
  const handleEdit = (category) => {
    toast.info('Edit category functionality coming soon')
  }
  
  const handleDelete = async (category) => {
    if (category.productCount > 0) {
      toast.error('Cannot delete category with products. Move products first.')
      return
    }
    
    if (window.confirm(`Are you sure you want to delete "${category.name}"?`)) {
      try {
        await categoryService.delete(category.Id)
        toast.success('Category deleted successfully')
        loadData()
      } catch (error) {
        toast.error('Failed to delete category')
}
    }
  }
  
  const handleAddCategory = () => {
    setAddCategoryModalOpen(true)
  }
  
  const handleAddCategorySuccess = () => {
    loadData()
  }
  
  if (loading) return <Loading type="grid" />
  if (error) return <Error message={error} onRetry={loadData} />
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Categories</h1>
          <p className="text-slate-600">Organize your products into categories</p>
        </div>
<Button
          icon="Plus"
          onClick={handleAddCategory}
          className="mt-4 sm:mt-0"
        >
          Add Category
        </Button>
      </div>
      
      {/* Search */}
      <div className="card p-4">
        <SearchBar
          placeholder="Search categories..."
          onSearch={setSearchQuery}
          className="max-w-md"
        />
      </div>
      
      {/* Categories Grid */}
      {filteredCategories.length === 0 ? (
        <Empty
<Empty
          title="No categories found"
          description="Get started by creating your first product category to organize your inventory."
          actionLabel="Add Category"
          onAction={handleAddCategory}
          icon="Tags"
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCategories.map((category, index) => (
            <motion.div
              key={category.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="card p-6 card-hover"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <ApperIcon name="Tag" className="h-6 w-6 text-primary-600" />
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="Edit"
                    onClick={() => handleEdit(category)}
                    className="h-8 w-8 p-0"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="Trash2"
                    onClick={() => handleDelete(category)}
                    className="h-8 w-8 p-0 text-error-600 hover:bg-error-50"
                  />
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {category.name}
              </h3>
              
              <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                {category.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-slate-500">
                  <ApperIcon name="Package" className="h-4 w-4 mr-1" />
                  <span>{category.productCount} products</span>
                </div>
                
                {category.productCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary-600 hover:text-primary-700"
                  >
                    View Products
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
</div>
      )}
      
      {/* Add Category Modal */}
      <AddCategoryModal
        isOpen={addCategoryModalOpen}
        onClose={() => setAddCategoryModalOpen(false)}
        onSuccess={handleAddCategorySuccess}
      />
    </div>
}

export default Categories