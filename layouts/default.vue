<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
          <div class="flex items-center space-x-8">
            <NuxtLink to="/" class="text-xl font-bold text-blue-600">PPh21 Tax Manager</NuxtLink>
            <div class="hidden md:flex space-x-4">
              <NuxtLink to="/" class="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100"
                active-class="bg-blue-50 text-blue-600">
                Dashboard
              </NuxtLink>
              <NuxtLink to="/payslips" class="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100"
                active-class="bg-blue-50 text-blue-600">
                Payslips
              </NuxtLink>
              <NuxtLink to="/settings" class="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100"
                active-class="bg-blue-50 text-blue-600">
                Settings
              </NuxtLink>
              <NuxtLink to="/about" class="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100"
                active-class="bg-blue-50 text-blue-600">
                About
              </NuxtLink>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <div class="hidden sm:block text-sm text-gray-500">Tax Year: {{ currentYear }}</div>
            <!-- User Info skeleton -->
            <div v-if="userLoading" class="flex items-center gap-2 animate-pulse">
              <div class="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div class="hidden sm:block h-3 bg-gray-200 rounded w-20"></div>
            </div>
            <!-- User Info -->
            <div v-else-if="user" class="flex items-center gap-2 text-sm text-gray-700">
              <div
                class="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-semibold text-xs uppercase">
                {{ user.username?.charAt(0) }}
              </div>
              <span class="hidden sm:inline font-medium">{{ user.username }}</span>
            </div>
            <button @click="handleLogout"
              class="hidden sm:flex text-sm text-red-600 hover:text-red-800 font-medium items-center gap-1"
              title="Logout">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
            <button @click="handleLogout" class="sm:hidden text-red-600 hover:text-red-800 focus:outline-none"
              title="Logout">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>

            <!-- Mobile menu button -->
            <button @click="isMobileMenuOpen = !isMobileMenuOpen"
              class="md:hidden text-gray-500 hover:text-gray-700 focus:outline-none ml-2">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path v-if="!isMobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16" />
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile menu -->
      <div v-show="isMobileMenuOpen" class="md:hidden border-t border-gray-100 bg-white">
        <div class="px-2 pt-2 pb-3 space-y-1">
          <NuxtLink to="/"
            class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            active-class="bg-blue-50 text-blue-600" @click="isMobileMenuOpen = false">
            Dashboard
          </NuxtLink>
          <NuxtLink to="/payslips"
            class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            active-class="bg-blue-50 text-blue-600" @click="isMobileMenuOpen = false">
            Payslips
          </NuxtLink>
          <NuxtLink to="/settings"
            class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            active-class="bg-blue-50 text-blue-600" @click="isMobileMenuOpen = false">
            Settings
          </NuxtLink>
          <NuxtLink to="/about"
            class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            active-class="bg-blue-50 text-blue-600" @click="isMobileMenuOpen = false">
            About
          </NuxtLink>
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
const user = ref(null)
const userLoading = ref(true)
const isMobileMenuOpen = ref(false)

onMounted(async () => {
  try {
    const { user: authUser } = await $fetch('/api/auth/check')
    user.value = authUser
  } catch { }
  finally {
    userLoading.value = false
  }
})

const handleLogout = async () => {
  try {
    await $fetch('/api/auth/logout', { method: 'POST' })
    await navigateTo('/login')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}
</script>
