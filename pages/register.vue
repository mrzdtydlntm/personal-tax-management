<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center py-8 px-4 sm:px-6"
  >
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 sm:p-10">
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
            />
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-gray-900 mb-1">Buat Akun</h1>
        <p class="text-gray-500 text-sm">Daftar untuk mulai mengelola pajak Anda</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleRegister" class="space-y-5">
        <div>
          <label class="label">Username</label>
          <input
            ref="usernameInput"
            v-model="form.username"
            type="text"
            class="input"
            placeholder="johndoe"
            required
            :disabled="loading"
            minlength="3"
          />
        </div>

        <div>
          <label class="label">Email</label>
          <input
            v-model="form.email"
            type="email"
            class="input"
            placeholder="email@contoh.com"
            required
            :disabled="loading"
          />
        </div>

        <div>
          <label class="label">Password</label>
          <div class="relative">
            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              class="input pr-12"
              placeholder="Minimal 8 karakter"
              required
              minlength="8"
              :disabled="loading"
            />
            <button
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              @click="showPassword = !showPassword"
              tabindex="-1"
            >
              <svg v-if="showPassword" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </button>
          </div>
          <!-- Password strength indicator -->
          <div v-if="form.password" class="mt-2">
            <div class="flex gap-1">
              <div
                v-for="i in 4"
                :key="i"
                :class="[
                  'h-1 flex-1 rounded-full transition-colors',
                  i <= passwordStrength.score ? passwordStrength.color : 'bg-gray-200'
                ]"
              />
            </div>
            <p class="text-xs mt-1" :class="passwordStrength.textColor">{{ passwordStrength.label }}</p>
          </div>
        </div>

        <div>
          <label class="label">Konfirmasi Password</label>
          <input
            v-model="form.confirmPassword"
            :type="showPassword ? 'text' : 'password'"
            class="input"
            :class="{ 'border-red-400': form.confirmPassword && !passwordsMatch }"
            placeholder="Ulangi password"
            required
            :disabled="loading"
          />
          <p v-if="form.confirmPassword && !passwordsMatch" class="text-xs text-red-500 mt-1">Password tidak cocok</p>
        </div>

        <!-- Error -->
        <div v-if="error" class="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <svg class="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p class="text-sm text-red-800">{{ error }}</p>
        </div>

        <button
          type="submit"
          class="w-full btn btn-primary py-3 text-base font-semibold"
          :disabled="loading || !passwordsMatch"
        >
          <span v-if="loading" class="flex items-center justify-center gap-2">
            <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Mendaftar...
          </span>
          <span v-else>Daftar</span>
        </button>
      </form>

      <!-- Login link -->
      <p class="mt-6 text-center text-sm text-gray-500">
        Sudah punya akun?
        <NuxtLink to="/login" class="text-blue-600 hover:text-blue-800 font-medium">Masuk di sini</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: false })

const form = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')
const usernameInput = ref(null)

onMounted(() => {
  usernameInput.value?.focus()
})

const passwordsMatch = computed(() => !form.confirmPassword || form.password === form.confirmPassword)

const passwordStrength = computed(() => {
  const p = form.password
  let score = 0
  if (p.length >= 8) score++
  if (/[A-Z]/.test(p)) score++
  if (/[0-9]/.test(p)) score++
  if (/[^A-Za-z0-9]/.test(p)) score++

  const levels = [
    { score: 1, label: 'Lemah', color: 'bg-red-400', textColor: 'text-red-500' },
    { score: 2, label: 'Cukup', color: 'bg-yellow-400', textColor: 'text-yellow-600' },
    { score: 3, label: 'Baik', color: 'bg-blue-400', textColor: 'text-blue-600' },
    { score: 4, label: 'Kuat', color: 'bg-green-500', textColor: 'text-green-600' }
  ]

  return { score, ...levels[Math.max(0, score - 1)] }
})

const handleRegister = async () => {
  if (!passwordsMatch.value) return

  loading.value = true
  error.value = ''

  try {
    await $fetch('/api/auth/register', {
      method: 'POST',
      body: {
        username: form.username,
        email: form.email,
        password: form.password
      }
    })
    await navigateTo('/')
  } catch (e) {
    error.value = e.data?.message || 'Terjadi kesalahan saat mendaftar.'
  } finally {
    loading.value = false
  }
}

useHead({ title: 'Daftar - PPh21 Tax Manager' })
</script>
