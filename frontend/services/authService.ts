import { mockUsers } from '~/data/mock/users'

export const authService = {
  async login(email: string, _password: string) {
    return mockUsers.find((user) => user.email === email) ?? mockUsers[0]
  },

  async currentUser() {
    return mockUsers[0]
  }
}
