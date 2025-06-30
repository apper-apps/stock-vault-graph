import React, { useContext } from 'react'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import { AuthContext } from '@/App'
const Header = ({ onMenuClick }) => {
  const { logout } = useContext(AuthContext);
  
  return (
    <header className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8">
      <div className="flex h-16 items-center justify-between">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="sm"
          icon="Menu"
          onClick={onMenuClick}
          className="lg:hidden p-2"
        />
        
{/* Search and actions would go here */}
        <div className="flex items-center space-x-4 ml-auto">
          <div className="hidden sm:flex items-center space-x-2 text-sm text-slate-600">
            <ApperIcon name="Clock" className="h-4 w-4" />
            <span>Last updated: {new Date().toLocaleString()}</span>
          </div>
          
          {/* Logout Button */}
          <Button
            variant="ghost"
            size="sm"
            icon="LogOut"
            onClick={logout}
            className="text-slate-600 hover:text-slate-900"
          >
            Logout
          </Button>
        </div>
      </div>
    </header>
  )
}

export default Header