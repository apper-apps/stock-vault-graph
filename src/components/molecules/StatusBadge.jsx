import React from 'react'
import Badge from '@/components/atoms/Badge'

const StatusBadge = ({ quantity, reorderPoint }) => {
  const getStatus = () => {
    if (quantity === 0) {
      return {
        variant: 'danger',
        text: 'Out of Stock',
        icon: 'X'
      }
    } else if (quantity <= reorderPoint) {
      return {
        variant: 'warning',
        text: 'Low Stock',
        icon: 'AlertTriangle'
      }
    } else {
      return {
        variant: 'success',
        text: 'In Stock',
        icon: 'Check'
      }
    }
  }
  
  const status = getStatus()
  
  return (
    <Badge 
      variant={status.variant} 
      icon={status.icon}
    >
      {status.text}
    </Badge>
  )
}

export default StatusBadge