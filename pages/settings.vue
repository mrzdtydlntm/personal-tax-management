<template>
  <NuxtLayout name="default">
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-3xl font-bold text-gray-900">Pengaturan Pajak</h1>
        <NuxtLink to="/" class="btn btn-secondary">Kembali ke Dashboard</NuxtLink>
      </div>

      <!-- PTKP Settings -->
      <div class="card">
        <h3 class="text-lg font-semibold mb-4">Status PTKP</h3>
        <p class="text-sm text-gray-600 mb-4">
          Penghasilan Tidak Kena Pajak (PTKP) adalah jumlah penghasilan yang tidak dikenakan pajak. Pilih status sesuai
          kondisi Anda.
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

          <div v-if="success" class="mb-4 p-3 bg-green-50 text-green-700 rounded-lg">Pengaturan berhasil disimpan!</div>

          <div v-if="error" class="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
            {{ error }}
          </div>

          <button type="submit" class="btn btn-primary" :disabled="loading">
            {{ loading ? 'Menyimpan...' : 'Simpan Pengaturan' }}
          </button>
        </form>
      </div>

      <!-- PTKP Info -->
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
              <tr>
                <td class="px-4 py-2 font-semibold">TK/0</td>
                <td class="px-4 py-2">Tidak Kawin, 0 Tanggungan</td>
                <td class="px-4 py-2 text-right">Rp 54.000.000</td>
              </tr>
              <tr>
                <td class="px-4 py-2 font-semibold">TK/1</td>
                <td class="px-4 py-2">Tidak Kawin, 1 Tanggungan</td>
                <td class="px-4 py-2 text-right">Rp 58.500.000</td>
              </tr>
              <tr>
                <td class="px-4 py-2 font-semibold">TK/2</td>
                <td class="px-4 py-2">Tidak Kawin, 2 Tanggungan</td>
                <td class="px-4 py-2 text-right">Rp 63.000.000</td>
              </tr>
              <tr>
                <td class="px-4 py-2 font-semibold">TK/3</td>
                <td class="px-4 py-2">Tidak Kawin, 3 Tanggungan</td>
                <td class="px-4 py-2 text-right">Rp 67.500.000</td>
              </tr>
              <tr>
                <td class="px-4 py-2 font-semibold">K/0</td>
                <td class="px-4 py-2">Kawin, 0 Tanggungan</td>
                <td class="px-4 py-2 text-right">Rp 58.500.000</td>
              </tr>
              <tr>
                <td class="px-4 py-2 font-semibold">K/1</td>
                <td class="px-4 py-2">Kawin, 1 Tanggungan</td>
                <td class="px-4 py-2 text-right">Rp 63.000.000</td>
              </tr>
              <tr>
                <td class="px-4 py-2 font-semibold">K/2</td>
                <td class="px-4 py-2">Kawin, 2 Tanggungan</td>
                <td class="px-4 py-2 text-right">Rp 67.500.000</td>
              </tr>
              <tr>
                <td class="px-4 py-2 font-semibold">K/3</td>
                <td class="px-4 py-2">Kawin, 3 Tanggungan</td>
                <td class="px-4 py-2 text-right">Rp 72.000.000</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="mt-4 p-4 bg-blue-50 rounded-lg">
          <p class="text-sm text-blue-800">
            <strong>Catatan:</strong>
            PTKP adalah penghasilan yang tidak dikenakan pajak. Semakin tinggi PTKP Anda, semakin rendah pajak yang
            harus dibayar. Pastikan memilih status yang sesuai dengan kondisi Anda saat ini.
          </p>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
const selectedPtkp = ref('TK/0')
const loading = ref(false)
const success = ref(false)
const error = ref('')

const fetchSettings = async () => {
  try {
    const settings = await $fetch('/api/tax-settings')
    selectedPtkp.value = settings.ptkpStatus
  } catch (e) {
    console.error('Failed to fetch settings:', e)
  }
}

const savePtkp = async () => {
  loading.value = true
  success.value = false
  error.value = ''

  try {
    await $fetch('/api/tax-settings', {
      method: 'PUT',
      body: { ptkpStatus: selectedPtkp.value }
    })
    success.value = true
    setTimeout(() => {
      success.value = false
    }, 3000)
  } catch (e) {
    error.value = 'Gagal menyimpan pengaturan'
  } finally {
    loading.value = false
  }
}

onMounted(fetchSettings)

useHead({
  title: 'Pengaturan - PPh21 Tax Manager'
})
</script>
