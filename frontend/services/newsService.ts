import { mockNews } from '~/data/mock/news'

export const newsService = {
  async list(limit = 4) {
    return [...mockNews]
      .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
      .slice(0, limit)
  },

  async getById(id: string) {
    return mockNews.find((item) => item.id === id) ?? null
  }
}
