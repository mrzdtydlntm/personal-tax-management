<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4 sm:p-6">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 sm:p-10">
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-gray-900 mb-1">Lupa Password</h1>
        <p class="text-gray-500 text-sm">Masukkan email Anda untuk menerima link reset password</p>
      </div>

      <!-- Success State -->
      <div v-if="submitted" class="text-center">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 class="text-xl font-semibold text-gray-900 mb-2">Email Terkirim!</h2>
        <p class="text-gray-500 text-sm mb-6">
          Jika email <strong>{{ form.email }}</strong> terdaftar, link reset password telah dikirim.
          Periksa inbox atau folder spam Anda.
        </p>
        <NuxtLink to="/login" class="btn btn-primary w-full py-3 text-base font-semibold block text-center">
          Kembali ke Login
        </NuxtLink>
      </div>

      <!-- Form -->
      <form v-else @submit.prevent="handleSubmit" class="space-y-5">
        <div>
          <label class="label">Alamat Email</label>
          <input
            ref="emailInput"
            v-model="form.email"
            type="email"
            class="input"
            placeholder="email@contoh.com"
            required
            :disabled="loading"
          />
        </div>

        <div v-if="error" class="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <svg class="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-sm text-red-800">{{ error }}</p>
        </div>

        <button type="submit" class="w-full btn btn-primary py-3 text-base font-semibold" :disabled="loading">
          <span v-if="loading" class="flex items-center justify-center gap-2">
            <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Mengirim...
          </span>
          <span v-else>Kirim Link Reset Password</span>
        </button>

        <p class="text-center text-sm text-gray-500">
          Ingat password Anda?
          <NuxtLink to="/login" class="text-blue-600 hover:text-blue-800 font-medium">Masuk sekarang</NuxtLink>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: false })

const form = reactive({ email: '' })
const loading = ref(false)
const error = ref('')
const submitted = ref(false)
const emailInput = ref(null)

onMounted(() => {
  emailInput.value?.focus()
})

const handleSubmit = async () => {
  loading.value = true
  error.value = ''

  try {
    await $fetch('/api/auth/forgot-password', {
      method: 'POST',
      body: { email: form.email }
    })
    submitted.value = true
  } catch (e) {
    error.value = e.data?.message || 'Terjadi kesalahan. Silakan coba lagi.'
  } finally {
    loading.value = false
  }
}

useHead({ title: 'Lupa Password - PPh21 Tax Manager' })
</script>
