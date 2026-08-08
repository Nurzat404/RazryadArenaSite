import { useMockNotifications } from '~/data/mock/state'
import type { Notification } from '~/types/domain'

export const notificationService = {
  async listByUser(userId: string, unreadOnly = false) {
    return useMockNotifications().value
      .filter((notification) => notification.userId === userId)
      .filter((notification) => (unreadOnly ? !notification.readAt : true))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  },

  async unreadCount(userId: string) {
    return useMockNotifications().value.filter((notification) => notification.userId === userId && !notification.readAt).length
  },

  async markAsRead(id: string) {
    const notifications = useMockNotifications()
    const notification = notifications.value.find((item) => item.id === id)
    if (!notification) return null

    const updated = { ...notification, readAt: new Date().toISOString() }
    notifications.value = notifications.value.map((item) => item.id === id ? updated : item)
    return updated
  },

  async create(payload: Omit<Notification, 'id' | 'createdAt' | 'readAt'>) {
    const notifications = useMockNotifications()
    const notification: Notification = {
      id: `notification-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      createdAt: new Date().toISOString(),
      ...payload
    }
    notifications.value = [notification, ...notifications.value]
    return notification
  },

  async createOnce(key: string, payload: Omit<Notification, 'id' | 'createdAt' | 'readAt'>) {
    const notifications = useMockNotifications()
    const id = `notification-${key}`
    const existing = notifications.value.find((item) => item.id === id)
    if (existing) return existing

    const notification: Notification = {
      id,
      createdAt: new Date().toISOString(),
      ...payload
    }
    notifications.value = [notification, ...notifications.value]
    return notification
  },

  async removeByPrefixExcept(prefix: string, keepIds: string[]) {
    const notifications = useMockNotifications()
    const keep = new Set(keepIds)
    notifications.value = notifications.value.filter((notification) => !notification.id.startsWith(prefix) || keep.has(notification.id))
  }
}
