class ProductService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'product';
  }
  
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "sku" } },
          { field: { Name: "description" } },
          { field: { Name: "quantity" } },
          { field: { Name: "reorderPoint" } },
          { field: { Name: "unitPrice" } },
          { field: { Name: "lastUpdated" } },
          { field: { Name: "categoryId" } }
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  }
  
  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "sku" } },
          { field: { Name: "description" } },
          { field: { Name: "quantity" } },
          { field: { Name: "reorderPoint" } },
          { field: { Name: "unitPrice" } },
          { field: { Name: "lastUpdated" } },
          { field: { Name: "categoryId" } }
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching product with ID ${id}:`, error);
      throw error;
    }
  }
  
  async create(productData) {
    try {
      const params = {
        records: [{
          Name: productData.name,
          Tags: productData.Tags || '',
          Owner: productData.Owner || null,
          sku: productData.sku,
          description: productData.description || '',
          quantity: parseInt(productData.quantity),
          reorderPoint: parseInt(productData.reorderPoint),
          unitPrice: parseFloat(productData.unitPrice || productData.sellingPrice),
          lastUpdated: new Date().toISOString(),
          categoryId: parseInt(productData.categoryId)
        }]
      };
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} products:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message);
        }
        
        return successfulRecords[0].data;
      }
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  }
  
  async update(id, productData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          Name: productData.name,
          Tags: productData.Tags || '',
          Owner: productData.Owner || null,
          sku: productData.sku,
          description: productData.description || '',
          quantity: parseInt(productData.quantity),
          reorderPoint: parseInt(productData.reorderPoint),
          unitPrice: parseFloat(productData.unitPrice || productData.sellingPrice),
          lastUpdated: new Date().toISOString(),
          categoryId: parseInt(productData.categoryId)
        }]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} products:${JSON.stringify(failedUpdates)}`);
          throw new Error(failedUpdates[0].message);
        }
        
        return successfulUpdates[0].data;
      }
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  }
  
  async updateQuantity(id, newQuantity) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          quantity: parseInt(newQuantity),
          lastUpdated: new Date().toISOString()
        }]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update product quantity:${JSON.stringify(failedUpdates)}`);
          throw new Error(failedUpdates[0].message);
        }
        
        return successfulUpdates[0].data;
      }
    } catch (error) {
      console.error("Error updating product quantity:", error);
      throw error;
    }
  }
  
  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete product:${JSON.stringify(failedDeletions)}`);
          throw new Error(failedDeletions[0].message);
        }
        
        return true;
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  }
}

export const productService = new ProductService()