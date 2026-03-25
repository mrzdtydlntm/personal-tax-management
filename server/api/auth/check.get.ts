import { getAuthUser } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const user = getAuthUser(event)

  if (!user) {
    return { authenticated: false, user: null }
  }

  return {
    authenticated: true,
    user: {
      userId: user.userId,
      username: user.username,
      email: user.email
    }
  }
})
