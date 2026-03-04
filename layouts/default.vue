<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
          <div class="flex items-center space-x-8">
            <NuxtLink to="/" class="text-xl font-bold text-blue-600">
              PPh21 Tax Manager
            </NuxtLink>
            <div class="hidden md:flex space-x-4">
              <NuxtLink
                to="/"
                class="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100"
                active-class="bg-blue-50 text-blue-600"
              >
                Dashboard
              </NuxtLink>
              <NuxtLink
                to="/payslips"
                class="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100"
                active-class="bg-blue-50 text-blue-600"
              >
                Payslips
              </NuxtLink>
              <NuxtLink
                to="/settings"
                class="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100"
                active-class="bg-blue-50 text-blue-600"
              >
                Settings
              </NuxtLink>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <div class="text-sm text-gray-500">
              Tax Year: {{ currentYear }}
            </div>
            <button
              @click="handleLogout"
              class="text-sm text-red-600 hover:text-red-800 font-medium flex items-center gap-1"
              title="Logout"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <slot />
    </main>

    <footer class="bg-white border-t mt-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <p class="text-center text-sm text-gray-500">
          PPh21 Tax Manager - Indonesian Tax Management System &copy; {{ currentYear }}
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
const currentYear = new Date().getFullYear()

const handleLogout = async () => {
  try {
    await $fetch('/api/auth/logout', { method: 'POST' })
    await navigateTo('/login')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}
</script>
