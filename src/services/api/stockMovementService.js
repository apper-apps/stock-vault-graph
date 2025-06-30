class StockMovementService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'stock_movement';
  }
  
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "productId" } },
          { field: { Name: "type" } },
          { field: { Name: "quantity" } },
          { field: { Name: "reason" } },
          { field: { Name: "notes" } },
          { field: { Name: "timestamp" } }
        ],
        orderBy: [{ fieldName: "timestamp", sorttype: "DESC" }]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching stock movements:", error);
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
          { field: { Name: "productId" } },
          { field: { Name: "type" } },
          { field: { Name: "quantity" } },
          { field: { Name: "reason" } },
          { field: { Name: "notes" } },
          { field: { Name: "timestamp" } }
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching stock movement with ID ${id}:`, error);
      throw error;
    }
  }
  
  async getByProductId(productId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "productId" } },
          { field: { Name: "type" } },
          { field: { Name: "quantity" } },
          { field: { Name: "reason" } },
          { field: { Name: "notes" } },
          { field: { Name: "timestamp" } }
        ],
        where: [{ FieldName: "productId", Operator: "EqualTo", Values: [parseInt(productId)] }],
        orderBy: [{ fieldName: "timestamp", sorttype: "DESC" }]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error(`Error fetching movements for product ${productId}:`, error);
      throw error;
    }
  }
  
  async create(movementData) {
    try {
      const params = {
        records: [{
          Name: movementData.Name || '',
          Tags: movementData.Tags || '',
          Owner: movementData.Owner || null,
          productId: parseInt(movementData.productId),
          type: movementData.type,
          quantity: parseInt(movementData.quantity),
          reason: movementData.reason,
          notes: movementData.notes || '',
          timestamp: new Date().toISOString()
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
          console.error(`Failed to create ${failedRecords.length} stock movements:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message);
        }
        
        return successfulRecords[0].data;
      }
    } catch (error) {
      console.error("Error creating stock movement:", error);
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
          console.error(`Failed to delete stock movement:${JSON.stringify(failedDeletions)}`);
          throw new Error(failedDeletions[0].message);
        }
        
        return true;
      }
    } catch (error) {
      console.error("Error deleting stock movement:", error);
      throw error;
    }
  }
}

export const stockMovementService = new StockMovementService()