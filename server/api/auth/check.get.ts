import { isAuthenticated } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const authenticated = isAuthenticated(event)

  return {
    authenticated
  }
})
