export default defineEventHandler(async (event) => {
  // Clear the auth token cookie
  setCookie(event, 'auth_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0, // Expire immediately
    path: '/'
  })

  return {
    success: true,
    message: 'Logged out successfully'
  }
})
