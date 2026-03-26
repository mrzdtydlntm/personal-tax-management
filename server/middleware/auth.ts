import { isAuthenticated } from '~/server/utils/auth'

export default defineEventHandler((event) => {
  const url = getRequestURL(event)
  const path = url.pathname

  // Public paths that don't require authentication
  const publicPaths = ['/api/auth/login', '/api/auth/register', '/api/auth/check']

  // Check if the path is public
  const isPublicPath = publicPaths.some((publicPath) => path.startsWith(publicPath))

  // Skip auth check for public paths and static assets
  if (isPublicPath || path.startsWith('/_nuxt') || path.startsWith('/api/_')) {
    return
  }

  // Check if path is an API route (but not auth routes)
  if (path.startsWith('/api/')) {
    if (!isAuthenticated(event)) {
      throw createError({
        statusCode: 401,
        message: 'Authentication required'
      })
    }
  }
})
