<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4 sm:p-6">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 sm:p-10">

      <!-- Loading token validation -->
      <div v-if="validating" class="text-center py-8">
        <svg class="animate-spin h-10 w-10 text-blue-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <p class="text-gray-500">Memvalidasi link...</p>
      </div>

      <!-- Invalid token -->
      <div v-else-if="!tokenValid" class="text-center">
        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 class="text-xl font-semibold text-gray-900 mb-2">Link Tidak Valid</h2>
        <p class="text-gray-500 text-sm mb-6">{{ tokenError }}</p>
        <NuxtLink to="/forgot-password" class="btn btn-primary w-full py-3 text-base font-semibold block text-center">
          Minta Link Baru
        </NuxtLink>
      </div>

      <!-- Success -->
      <div v-else-if="success" class="text-center">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 class="text-xl font-semibold text-gray-900 mb-2">Password Berhasil Diubah!</h2>
        <p class="text-gray-500 text-sm mb-6">Silakan login dengan password baru Anda.</p>
        <NuxtLink to="/login" class="btn btn-primary w-full py-3 text-base font-semibold block text-center">
          Masuk Sekarang
        </NuxtLink>
      </div>

      <!-- Reset form -->
      <div v-else>
        <div class="text-center mb-8">
          <div class="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h1 class="text-3xl font-bold text-gray-900 mb-1">Reset Password</h1>
          <p class="text-gray-500 text-sm">Buat password baru untuk akun Anda</p>
        </div>

        <form @submit.prevent="handleReset" class="space-y-5">
          <!-- New Password -->
          <div>
            <label class="label">Password Baru</label>
            <div class="relative">
              <input
                v-model="form.newPassword"
                :type="showNew ? 'text' : 'password'"
                class="input pr-12"
                placeholder="Minimal 8 karakter"
                required
                :disabled="loading"
              />
              <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                @click="showNew = !showNew" tabindex="-1">
                <svg v-if="showNew" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
            <!-- Strength bar -->
            <div v-if="form.newPassword" class="mt-2">
              <div class="flex gap-1 mb-1">
                <div v-for="i in 4" :key="i"
                  class="h-1 flex-1 rounded-full transition-colors duration-200"
                  :class="i <= strength.score ? strength.color : 'bg-gray-200'" />
              </div>
              <p class="text-xs" :class="strength.textColor">{{ strength.label }}</p>
            </div>
          </div>

          <!-- Confirm Password -->
          <div>
            <label class="label">Konfirmasi Password Baru</label>
            <div class="relative">
              <input
                v-model="form.confirmPassword"
                :type="showConfirm ? 'text' : 'password'"
                class="input pr-12"
                :class="{ 'border-red-400': form.confirmPassword && form.newPassword !== form.confirmPassword }"
                placeholder="Ulangi password baru"
                required
                :disabled="loading"
              />
              <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                @click="showConfirm = !showConfirm" tabindex="-1">
                <svg v-if="showConfirm" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
            <p v-if="form.confirmPassword && form.newPassword !== form.confirmPassword"
              class="mt-1 text-xs text-red-500">Password tidak cocok</p>
          </div>

          <!-- Error -->
          <div v-if="error" class="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <svg class="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-sm text-red-800">{{ error }}</p>
          </div>

          <button type="submit" class="w-full btn btn-primary py-3 text-base font-semibold"
            :disabled="loading || form.newPassword !== form.confirmPassword">
            <span v-if="loading" class="flex items-center justify-center gap-2">
              <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Menyimpan...
            </span>
            <span v-else>Simpan Password Baru</span>
          </button>
        </form>
      </div>

    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: false })

const route = useRoute()
const token = computed(() => route.query.token)

const validating = ref(true)
const tokenValid = ref(false)
const tokenError = ref('')
const success = ref(false)
const loading = ref(false)
const error = ref('')
const showNew = ref(false)
const showConfirm = ref(false)

const form = reactive({ newPassword: '', confirmPassword: '' })

const strength = computed(() => {
  const p = form.newPassword
  let score = 0
  if (p.length >= 8) score++
  if (/[A-Z]/.test(p)) score++
  if (/[0-9]/.test(p)) score++
  if (/[^A-Za-z0-9]/.test(p)) score++

  const levels = [
    { label: 'Lemah', color: 'bg-red-500', textColor: 'text-red-500' },
    { label: 'Cukup', color: 'bg-orange-400', textColor: 'text-orange-400' },
    { label: 'Kuat', color: 'bg-yellow-400', textColor: 'text-yellow-500' },
    { label: 'Sangat Kuat', color: 'bg-green-500', textColor: 'text-green-600' },
  ]
  return { score, ...levels[Math.max(0, score - 1)] }
})

onMounted(async () => {
  if (!token.value) {
    tokenError.value = 'Token tidak ditemukan di URL'
    tokenValid.value = false
    validating.value = false
    return
  }

  try {
    const res = await $fetch(`/api/auth/validate-reset-token?token=${token.value}`)
    tokenValid.value = res.valid
    if (!res.valid) tokenError.value = res.message
  } catch {
    tokenValid.value = false
    tokenError.value = 'Terjadi kesalahan saat memvalidasi link'
  } finally {
    validating.value = false
  }
})

const handleReset = async () => {
  loading.value = true
  error.value = ''

  try {
    await $fetch('/api/auth/reset-password', {
      method: 'POST',
      body: {
        token: token.value,
        newPassword: form.newPassword,
        confirmPassword: form.confirmPassword
      }
    })
    success.value = true
  } catch (e) {
    error.value = e.data?.message || 'Terjadi kesalahan. Silakan coba lagi.'
  } finally {
    loading.value = false
  }
}

useHead({ title: 'Reset Password - PPh21 Tax Manager' })
</script>
