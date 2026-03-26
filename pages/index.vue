<template>
  <NuxtLayout name="default">
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard PPh21</h1>
        <div class="flex gap-3 items-center w-full sm:w-auto">
          <select v-model="selectedYear" class="input w-32 flex-shrink-0">
            <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
          </select>
          <NuxtLink to="/payslips" class="btn btn-primary flex-1 text-center whitespace-nowrap">
            Tambah Payslip
          </NuxtLink>
        </div>
      </div>

      <!-- Tax Summary -->
      <TaxSummaryCard ref="taxSummary" :year="selectedYear" :ptkp-status="ptkpStatus" />

      <!-- Chart -->
      <TaxChart v-if="loading || payslips.length > 0" :payslips="payslips" :loading="loading" />

      <!-- Payslip List -->
      <PayslipList
        :payslips="payslips"
        :year="selectedYear"
        :loading="loading"
        @refresh="fetchData"
        @edit="handleEdit"
      />

      <!-- Tax Brackets Info -->
      <div class="card">
        <h3 class="text-lg font-semibold mb-4">Tarif Pajak Progresif PPh21 2024</h3>
        <div class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-2 text-left">Penghasilan Kena Pajak (Tahunan)</th>
                <th class="px-4 py-2 text-right">Tarif Pajak</th>
              </tr>
            </thead>
            <tbody class="divide-y">
              <tr>
                <td class="px-4 py-2">0 - Rp 60.000.000</td>
                <td class="px-4 py-2 text-right font-semibold">5%</td>
              </tr>
              <tr>
                <td class="px-4 py-2">Rp 60.000.000 - Rp 250.000.000</td>
                <td class="px-4 py-2 text-right font-semibold">15%</td>
              </tr>
              <tr>
                <td class="px-4 py-2">Rp 250.000.000 - Rp 500.000.000</td>
                <td class="px-4 py-2 text-right font-semibold">25%</td>
              </tr>
              <tr>
                <td class="px-4 py-2">Rp 500.000.000 - Rp 5.000.000.000</td>
                <td class="px-4 py-2 text-right font-semibold">30%</td>
              </tr>
              <tr>
                <td class="px-4 py-2">Di atas Rp 5.000.000.000</td>
                <td class="px-4 py-2 text-right font-semibold">35%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
const selectedYear = ref(new Date().getFullYear())
const payslips = ref([])
const ptkpStatus = ref('TK/0')
const taxSummary = ref(null)
const loading = ref(false)

const years = computed(() => {
  const currentYear = new Date().getFullYear()
  return Array.from({ length: 8 }, (_, i) => currentYear - 7 + i)
})

const fetchData = async () => {
  loading.value = true
  try {
    const timestamp = Date.now()
    const [payslipsData, settings] = await Promise.all([
      $fetch(`/api/payslips?year=${selectedYear.value}&_=${timestamp}`, { cache: 'no-cache' }),
      $fetch(`/api/tax-settings?_=${timestamp}`, { cache: 'no-cache' })
    ])

    payslips.value = payslipsData
    ptkpStatus.value = settings.ptkpStatus

    if (taxSummary.value) {
      await nextTick()
      taxSummary.value.refresh()
    }
  } catch (e) {
    console.error('Failed to fetch data:', e)
  } finally {
    loading.value = false
  }
}

const handleEdit = (payslip) => {
  navigateTo(`/payslips?edit=${payslip.id}&year=${payslip.year}`)
}

watch(selectedYear, fetchData)

onMounted(fetchData)

useHead({
  title: 'Dashboard - PPh21 Tax Manager'
})
</script>
