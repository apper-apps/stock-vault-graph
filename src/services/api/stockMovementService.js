import stockMovementsData from '@/services/mockData/stockMovements.json'
import { productService } from '@/services/api/productService'

class StockMovementService {
  constructor() {
    this.movements = [...stockMovementsData]
  }
  
  async getAll() {
    await this.delay(300)
    return [...this.movements].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  }
  
  async getById(id) {
    await this.delay(200)
    const movement = this.movements.find(m => m.Id === parseInt(id))
    if (!movement) {
      throw new Error('Stock movement not found')
    }
    return { ...movement }
  }
  
  async getByProductId(productId) {
    await this.delay(250)
    return this.movements
      .filter(m => m.productId === parseInt(productId))
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  }
  
  async create(movementData) {
    await this.delay(400)
    const newId = Math.max(...this.movements.map(m => m.Id), 0) + 1
    const newMovement = {
      Id: newId,
      ...movementData,
      timestamp: new Date().toISOString()
    }
    
    this.movements.push(newMovement)
    
    // Update product quantity
    try {
      const product = await productService.getById(movementData.productId)
      const quantityChange = movementData.type === 'IN' 
        ? movementData.quantity 
        : -movementData.quantity
      
      const newQuantity = Math.max(0, product.quantity + quantityChange)
      await productService.updateQuantity(movementData.productId, newQuantity)
    } catch (error) {
      console.error('Failed to update product quantity:', error)
    }
    
    return { ...newMovement }
  }
  
  async delete(id) {
    await this.delay(300)
    const index = this.movements.findIndex(m => m.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Stock movement not found')
    }
    
    const deletedMovement = this.movements.splice(index, 1)[0]
    return { ...deletedMovement }
  }
  
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export const stockMovementService = new StockMovementService()