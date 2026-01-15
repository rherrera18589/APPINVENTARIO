import React from 'react'
import { FiX, FiAlertCircle, FiCheckCircle, FiInfo } from 'react-icons/fi'
import { useUIStore } from '../store/store'
import { useEffect } from 'react'

export const Notification = () => {
  const { notification, clearNotification } = useUIStore()

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        clearNotification()
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [notification, clearNotification])

  if (!notification) return null

  const bgColor = {
    success: 'bg-success',
    error: 'bg-danger',
    warning: 'bg-warning',
    info: 'bg-primary',
  }[notification.type] || 'bg-primary'

  const Icon = {
    success: FiCheckCircle,
    error: FiAlertCircle,
    warning: FiAlertCircle,
    info: FiInfo,
  }[notification.type] || FiInfo

  return (
    <div className={`${bgColor} text-white p-4 rounded-lg shadow-lg fixed bottom-4 right-4 flex items-center space-x-3 z-50 animate-bounce`}>
      <Icon className="text-xl" />
      <span>{notification.message}</span>
      <button
        onClick={clearNotification}
        className="ml-auto hover:opacity-80"
      >
        <FiX />
      </button>
    </div>
  )
}
