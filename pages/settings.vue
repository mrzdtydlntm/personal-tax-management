<template>
  <NuxtLayout name="default">
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-3xl font-bold text-gray-900">Pengaturan</h1>
        <NuxtLink to="/" class="btn btn-secondary">Kembali ke Dashboard</NuxtLink>
      </div>

      <!-- ─── Account Info ─── -->
      <div class="card">
        <h3 class="text-lg font-semibold mb-1">Informasi Akun</h3>
        <p class="text-sm text-gray-500 mb-5">Ubah username dan email yang terdaftar.</p>

        <!-- Skeleton while loading -->
        <div v-if="profileLoading" class="animate-pulse space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><div class="h-3 bg-gray-200 rounded w-20 mb-2"></div><div class="h-10 bg-gray-100 rounded"></div></div>
            <div><div class="h-3 bg-gray-200 rounded w-16 mb-2"></div><div class="h-10 bg-gray-100 rounded"></div></div>
          </div>
          <div class="h-9 bg-gray-200 rounded w-36"></div>
        </div>

        <form v-else @submit.prevent="saveProfile" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="label">Username</label>
              <input v-model="profile.username" type="text" class="input" placeholder="username" required :disabled="profileSaving" />
            </div>
            <div>
              <label class="label">Email</label>
              <input v-model="profile.email" type="email" class="input" placeholder="email@contoh.com" required :disabled="profileSaving" />
            </div>
          </div>

          <Transition name="fade">
            <div v-if="profileSuccess" class="p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
              {{ profileSuccess }}
            </div>
          </Transition>
          <Transition name="fade">
            <div v-if="profileError" class="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {{ profileError }}
            </div>
          </Transition>

          <button type="submit" class="btn btn-primary" :disabled="profileSaving">
            <span v-if="profileSaving" class="flex items-center gap-2">
              <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Menyimpan...
            </span>
            <span v-else>Simpan Perubahan</span>
          </button>
        </form>
      </div>

      <!-- ─── Change Password ─── -->
      <div class="card">
        <h3 class="text-lg font-semibold mb-1">Ubah Password</h3>
        <p class="text-sm text-gray-500 mb-5">Pastikan password baru minimal 8 karakter.</p>

        <form @submit.prevent="savePassword" class="space-y-4">
          <!-- Current password -->
          <div>
            <label class="label">Password Saat Ini</label>
            <div class="relative">
              <input
                v-model="passwordForm.current"
                :type="showCurrent ? 'text' : 'password'"
                class="input pr-12"
                placeholder="Masukkan password saat ini"
                required
                :disabled="passwordSaving"
              />
              <button type="button" tabindex="-1" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" @click="showCurrent = !showCurrent">
                <svg v-if="showCurrent" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- New password -->
            <div>
              <label class="label">Password Baru</label>
              <div class="relative">
                <input
                  v-model="passwordForm.new"
                  :type="showNew ? 'text' : 'password'"
                  class="input pr-12"
                  placeholder="Minimal 8 karakter"
                  required
                  :disabled="passwordSaving"
                />
                <button type="button" tabindex="-1" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" @click="showNew = !showNew">
                  <svg v-if="showNew" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                  <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                </button>
              </div>
              <!-- Strength bar -->
              <div v-if="passwordForm.new" class="mt-2">
                <div class="flex gap-1 mb-1">
                  <div v-for="i in 4" :key="i" class="h-1 flex-1 rounded-full transition-colors duration-200"
                    :class="i <= passwordStrength.score ? passwordStrength.color : 'bg-gray-200'" />
                </div>
                <p class="text-xs" :class="passwordStrength.textColor">{{ passwordStrength.label }}</p>
              </div>
            </div>

            <!-- Confirm password -->
            <div>
              <label class="label">Konfirmasi Password Baru</label>
              <div class="relative">
                <input
                  v-model="passwordForm.confirm"
                  :type="showConfirm ? 'text' : 'password'"
                  class="input pr-12"
                  :class="{ 'border-red-400': passwordForm.confirm && passwordForm.new !== passwordForm.confirm }"
                  placeholder="Ulangi password baru"
                  required
                  :disabled="passwordSaving"
                />
                <button type="button" tabindex="-1" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" @click="showConfirm = !showConfirm">
                  <svg v-if="showConfirm" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                  <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                </button>
              </div>
              <p v-if="passwordForm.confirm && passwordForm.new !== passwordForm.confirm" class="mt-1 text-xs text-red-500">Password tidak cocok</p>
            </div>
          </div>

          <Transition name="fade">
            <div v-if="passwordSuccess" class="p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
              {{ passwordSuccess }}
            </div>
          </Transition>
          <Transition name="fade">
            <div v-if="passwordError" class="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {{ passwordError }}
            </div>
          </Transition>

          <button
            type="submit"
            class="btn btn-primary"
            :disabled="passwordSaving || (!!passwordForm.confirm && passwordForm.new !== passwordForm.confirm)"
          >
            <span v-if="passwordSaving" class="flex items-center gap-2">
              <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Menyimpan...
            </span>
            <span v-else>Ubah Password</span>
          </button>
        </form>
      </div>

      <!-- ─── PTKP Settings ─── -->
      <div class="card">
        <h3 class="text-lg font-semibold mb-1">Status PTKP</h3>
        <p class="text-sm text-gray-500 mb-5">
          Penghasilan Tidak Kena Pajak (PTKP) — pilih status sesuai kondisi Anda.
        </p>

        <form @submit.prevent="savePtkp">
          <div class="mb-4">
            <label class="label">Status PTKP</label>
            <select v-model="selectedPtkp" class="input" required>
              <option value="TK/0">TK/0 - Tidak Kawin, 0 Tanggungan (Rp 54.000.000)</option>
              <option value="TK/1">TK/1 - Tidak Kawin, 1 Tanggungan (Rp 58.500.000)</option>
              <option value="TK/2">TK/2 - Tidak Kawin, 2 Tanggungan (Rp 63.000.000)</option>
              <option value="TK/3">TK/3 - Tidak Kawin, 3 Tanggungan (Rp 67.500.000)</option>
              <option value="K/0">K/0 - Kawin, 0 Tanggungan (Rp 58.500.000)</option>
              <option value="K/1">K/1 - Kawin, 1 Tanggungan (Rp 63.000.000)</option>
              <option value="K/2">K/2 - Kawin, 2 Tanggungan (Rp 67.500.000)</option>
              <option value="K/3">K/3 - Kawin, 3 Tanggungan (Rp 72.000.000)</option>
            </select>
          </div>

          <Transition name="fade">
            <div v-if="ptkpSuccess" class="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
              Pengaturan PTKP berhasil disimpan!
            </div>
          </Transition>
          <Transition name="fade">
            <div v-if="ptkpError" class="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {{ ptkpError }}
            </div>
          </Transition>

          <button type="submit" class="btn btn-primary" :disabled="ptkpSaving">
            <span v-if="ptkpSaving" class="flex items-center gap-2">
              <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Menyimpan...
            </span>
            <span v-else>Simpan PTKP</span>
          </button>
        </form>
      </div>

      <!-- ─── PTKP Info Table ─── -->
      <div class="card">
        <h3 class="text-lg font-semibold mb-4">Informasi PTKP 2024</h3>
        <div class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-2 text-left">Status</th>
                <th class="px-4 py-2 text-left">Keterangan</th>
                <th class="px-4 py-2 text-right">Nilai PTKP (Tahunan)</th>
              </tr>
            </thead>
            <tbody class="divide-y">
              <tr v-for="row in ptkpTable" :key="row.status" :class="{ 'bg-blue-50': selectedPtkp === row.status }">
                <td class="px-4 py-2 font-semibold">{{ row.status }}</td>
                <td class="px-4 py-2">{{ row.desc }}</td>
                <td class="px-4 py-2 text-right">{{ row.amount }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="mt-4 p-4 bg-blue-50 rounded-lg">
          <p class="text-sm text-blue-800">
            <strong>Catatan:</strong> PTKP adalah penghasilan yang tidak dikenakan pajak. Semakin tinggi PTKP Anda,
            semakin rendah pajak yang harus dibayar.
          </p>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
// ─── Profile ───────────────────────────────────────────────
const profile = reactive({ username: '', email: '' })
const profileLoading = ref(true)
const profileSaving = ref(false)
const profileSuccess = ref('')
const profileError = ref('')

const fetchProfile = async () => {
  profileLoading.value = true
  try {
    const { user } = await $fetch('/api/auth/check')
    profile.username = user.username
    profile.email = user.email
  } catch (e) {
    console.error('Failed to load profile:', e)
  } finally {
    profileLoading.value = false
  }
}

const saveProfile = async () => {
  profileSaving.value = true
  profileSuccess.value = ''
  profileError.value = ''
  try {
    await $fetch('/api/auth/profile', {
      method: 'PUT',
      body: { username: profile.username, email: profile.email }
    })
    profileSuccess.value = 'Informasi akun berhasil diperbarui!'
    setTimeout(() => { profileSuccess.value = '' }, 4000)
  } catch (e) {
    profileError.value = e.data?.message || 'Gagal menyimpan perubahan'
    setTimeout(() => { profileError.value = '' }, 4000)
  } finally {
    profileSaving.value = false
  }
}

// ─── Password ──────────────────────────────────────────────
const passwordForm = reactive({ current: '', new: '', confirm: '' })
const passwordSaving = ref(false)
const passwordSuccess = ref('')
const passwordError = ref('')
const showCurrent = ref(false)
const showNew = ref(false)
const showConfirm = ref(false)

const passwordStrength = computed(() => {
  const p = passwordForm.new
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

const savePassword = async () => {
  passwordSaving.value = true
  passwordSuccess.value = ''
  passwordError.value = ''
  try {
    await $fetch('/api/auth/change-password', {
      method: 'PUT',
      body: { currentPassword: passwordForm.current, newPassword: passwordForm.new, confirmPassword: passwordForm.confirm }
    })
    passwordSuccess.value = 'Password berhasil diubah!'
    passwordForm.current = ''
    passwordForm.new = ''
    passwordForm.confirm = ''
    setTimeout(() => { passwordSuccess.value = '' }, 4000)
  } catch (e) {
    passwordError.value = e.data?.message || 'Gagal mengubah password'
    setTimeout(() => { passwordError.value = '' }, 4000)
  } finally {
    passwordSaving.value = false
  }
}

// ─── PTKP ──────────────────────────────────────────────────
const selectedPtkp = ref('TK/0')
const ptkpSaving = ref(false)
const ptkpSuccess = ref(false)
const ptkpError = ref('')

const ptkpTable = [
  { status: 'TK/0', desc: 'Tidak Kawin, 0 Tanggungan', amount: 'Rp 54.000.000' },
  { status: 'TK/1', desc: 'Tidak Kawin, 1 Tanggungan', amount: 'Rp 58.500.000' },
  { status: 'TK/2', desc: 'Tidak Kawin, 2 Tanggungan', amount: 'Rp 63.000.000' },
  { status: 'TK/3', desc: 'Tidak Kawin, 3 Tanggungan', amount: 'Rp 67.500.000' },
  { status: 'K/0',  desc: 'Kawin, 0 Tanggungan',       amount: 'Rp 58.500.000' },
  { status: 'K/1',  desc: 'Kawin, 1 Tanggungan',       amount: 'Rp 63.000.000' },
  { status: 'K/2',  desc: 'Kawin, 2 Tanggungan',       amount: 'Rp 67.500.000' },
  { status: 'K/3',  desc: 'Kawin, 3 Tanggungan',       amount: 'Rp 72.000.000' },
]

const fetchPtkp = async () => {
  try {
    const settings = await $fetch('/api/tax-settings')
    selectedPtkp.value = settings.ptkpStatus
  } catch (e) {
    console.error('Failed to fetch PTKP settings:', e)
  }
}

const savePtkp = async () => {
  ptkpSaving.value = true
  ptkpSuccess.value = false
  ptkpError.value = ''
  try {
    await $fetch('/api/tax-settings', { method: 'PUT', body: { ptkpStatus: selectedPtkp.value } })
    ptkpSuccess.value = true
    setTimeout(() => { ptkpSuccess.value = false }, 3000)
  } catch (e) {
    ptkpError.value = 'Gagal menyimpan pengaturan PTKP'
    setTimeout(() => { ptkpError.value = '' }, 3000)
  } finally {
    ptkpSaving.value = false
  }
}

onMounted(() => {
  fetchProfile()
  fetchPtkp()
})

useHead({ title: 'Pengaturan - PPh21 Tax Manager' })
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
