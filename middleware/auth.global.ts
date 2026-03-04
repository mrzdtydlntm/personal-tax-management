export default defineNuxtRouteMiddleware(async (to, from) => {
  // Skip middleware on server
  if (process.server) return

  // Public routes that don't require authentication
  const publicRoutes = ['/login']

  // Check if the route is public
  if (publicRoutes.includes(to.path)) {
    return
  }

  // Check authentication status
  try {
    const { authenticated } = await $fetch('/api/auth/check')

    if (!authenticated) {
      // Not authenticated, redirect to login
      return navigateTo('/login')
    }
  } catch (error) {
    // Error checking auth, redirect to login
    return navigateTo('/login')
  }

  // If on login page and authenticated, redirect to dashboard
  if (to.path === '/login') {
    return navigateTo('/')
  }
})
