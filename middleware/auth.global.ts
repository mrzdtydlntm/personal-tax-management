export default defineNuxtRouteMiddleware(async (to, from) => {
  const publicRoutes = ['/login', '/register']
  const isPublicRoute = publicRoutes.includes(to.path)

  let authenticated = false
  try {
    const headers = process.server ? useRequestHeaders(['cookie']) : undefined
    const response = await $fetch('/api/auth/check', { headers })
    authenticated = response.authenticated
  } catch (error) {
    authenticated = false
  }

  // Not authenticated and trying to access a protected route
  if (!authenticated && !isPublicRoute) {
    return navigateTo('/login')
  }

  // Authenticated and trying to access a public route
  if (authenticated && isPublicRoute) {
    return navigateTo('/')
  }
})
