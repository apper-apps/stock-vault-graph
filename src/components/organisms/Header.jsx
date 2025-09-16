import React, { useContext, useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import { AuthContext } from '@/App'
import { notificationService } from '@/services/api/notificationService'
import { 
  setNotifications, 
  setLoading, 
  updateNotificationStatus, 
  selectUnreadCount, 
  selectNotifications,
  selectReadNotifications,
  selectUnreadNotifications
} from '@/store/notificationSlice'

const Header = ({ onMenuClick }) => {
  const dispatch = useDispatch()
  const { logout } = useContext(AuthContext)
  const { user } = useSelector((state) => state.user)
  const unreadCount = useSelector(selectUnreadCount)
const notifications = useSelector(selectNotifications)
  const readNotifications = useSelector(selectReadNotifications)
  const unreadNotifications = useSelector(selectUnreadNotifications)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notificationLoading, setNotificationLoading] = useState(false)
  const [notificationFilter, setNotificationFilter] = useState('All')
  const dropdownRef = useRef(null)
  
  // Load notifications on component mount
  useEffect(() => {
    if (user?.userId) {
      loadNotifications()
    }
  }, [user?.userId])

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const loadNotifications = async () => {
    if (!user?.userId) return
    
    try {
      dispatch(setLoading(true))
      const notificationsData = await notificationService.getUserNotifications(user.userId)
      dispatch(setNotifications(notificationsData))
    } catch (error) {
      console.error('Failed to load notifications:', error)
      toast.error('Failed to load notifications')
    } finally {
      dispatch(setLoading(false))
    }
  }

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications)
  }

  const handleMarkAsRead = async (notificationId) => {
    try {
      setNotificationLoading(true)
      const success = await notificationService.markAsRead(notificationId)
      
      if (success) {
        dispatch(updateNotificationStatus({ notificationId, status: 'Read' }))
        toast.success('Notification marked as read')
      } else {
        toast.error('Failed to mark notification as read')
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
      toast.error('Failed to mark notification as read')
    } finally {
      setNotificationLoading(false)
    }
  }
  
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
          
          {/* Notifications */}
          <div className="relative" ref={dropdownRef}>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNotificationClick}
              className="relative text-slate-600 hover:text-slate-900 p-2"
            >
              <ApperIcon name="Bell" className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-error-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center min-w-[20px] text-[11px] font-medium">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </Button>

            {/* Notifications Dropdown */}
{showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-slate-200 max-h-96 overflow-y-auto z-50">
                <div className="p-4 border-b border-slate-200">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-slate-900">Notifications</h3>
                    {unreadCount > 0 && (
                      <p className="text-sm text-slate-600">{unreadCount} unread</p>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setNotificationFilter('All')}
                      className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${
                        notificationFilter === 'All'
                          ? 'bg-primary-500 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setNotificationFilter('Unread')}
                      className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${
                        notificationFilter === 'Unread'
                          ? 'bg-primary-500 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Unread
                    </button>
                    <button
                      onClick={() => setNotificationFilter('Read')}
                      className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${
                        notificationFilter === 'Read'
                          ? 'bg-primary-500 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Read
                    </button>
                  </div>
                </div>
                
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-slate-500">
                    <ApperIcon name="Bell" className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No notifications</p>
                  </div>
                ) : (
<div className="max-h-80 overflow-y-auto">
                  {(() => {
                    const filteredNotifications = 
                      notificationFilter === 'All' ? notifications :
                      notificationFilter === 'Unread' ? unreadNotifications :
                      readNotifications;

                    if (filteredNotifications.length === 0) {
                      return (
                        <div className="p-4 text-center text-slate-500 text-sm">
                          No {notificationFilter.toLowerCase()} notifications
                        </div>
                      );
                    }

                    return filteredNotifications.map((notification) => (
                      <div
                        key={notification.Id}
                        className={`p-4 border-b border-slate-100 hover:bg-slate-50 ${
                          notification.status_c === 'Unread' ? 'bg-primary-50' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            {notification.productId_c?.Name ? (
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium text-slate-900">
                                  {notification.productId_c.Name}
                                </p>
                                <span className="px-2 py-0.5 text-xs bg-amber-100 text-amber-800 rounded-full font-medium">
                                  Low stock
                                </span>
                              </div>
                            ) : (
                              <p className="text-sm font-medium text-slate-900">
                                {notification.Name}
                              </p>
                            )}
                            <p className="text-xs text-slate-400 mt-1">
                              {notification.timestamp_c && new Date(notification.timestamp_c).toLocaleString()}
                            </p>
                          </div>
                          {notification.status_c === 'Unread' && (
                            <button
                              onClick={() => handleMarkAsRead(notification.Id)}
                              disabled={notificationLoading}
                              className="ml-2 text-xs text-primary-600 hover:text-primary-700 font-medium"
                            >
                              Mark as read
                            </button>
                          )}
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              )}
              </div>
            )}
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