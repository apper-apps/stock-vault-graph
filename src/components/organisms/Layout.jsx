import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import Sidebar from '@/components/organisms/Sidebar'
import Header from '@/components/organisms/Header'

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Header */}
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        {/* Page Content */}
        <main className="py-6 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
      
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}

export default Layout