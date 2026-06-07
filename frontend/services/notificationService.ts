import { mockNotifications } from '~/data/mock/notifications'

export const notificationService = {
  async listByUser(userId: string, unreadOnly = false) {
    return mockNotifications
      .filter((notification) => notification.userId === userId)
      .filter((notification) => (unreadOnly ? !notification.readAt : true))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  },

  async unreadCount(userId: string) {
    return mockNotifications.filter((notification) => notification.userId === userId && !notification.readAt).length
  },

  async markAsRead(id: string) {
    const notification = mockNotifications.find((item) => item.id === id)
    return notification ? { ...notification, readAt: new Date().toISOString() } : null
  }
}
