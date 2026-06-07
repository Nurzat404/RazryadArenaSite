import { mockRatings } from '~/data/mock/ratings'

export const ratingService = {
  async leaderboard() {
    return mockRatings
  }
}
