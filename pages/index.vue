<template>
  <NuxtLayout name="default">
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-3xl font-bold text-gray-900">Dashboard PPh21</h1>
        <div class="flex gap-3 items-center">
          <select v-model="selectedYear" class="input max-w-xs">
            <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
          </select>
          <NuxtLink to="/payslips" class="btn btn-primary">
            Tambah Payslip
          </NuxtLink>
        </div>
      </div>

      <!-- Tax Summary -->
      <TaxSummaryCard
        ref="taxSummary"
        :year="selectedYear"
        :ptkp-status="ptkpStatus"
      />

      <!-- Chart -->
      <TaxChart v-if="payslips.length > 0" :payslips="payslips" />

      <!-- Payslip List -->
      <PayslipList
        :payslips="payslips"
        :year="selectedYear"
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

const years = computed(() => {
  const currentYear = new Date().getFullYear()
  return Array.from({ length: 5 }, (_, i) => currentYear - 2 + i)
})

const fetchData = async () => {
  try {
    const timestamp = Date.now()
    const [payslipsData, settings] = await Promise.all([
      $fetch(`/api/payslips?year=${selectedYear.value}&_=${timestamp}`, {
        cache: 'no-cache'
      }),
      $fetch(`/api/tax-settings?_=${timestamp}`, {
        cache: 'no-cache'
      })
    ])

    payslips.value = payslipsData
    ptkpStatus.value = settings.ptkpStatus

    // Refresh tax summary
    if (taxSummary.value) {
      await nextTick()
      taxSummary.value.refresh()
    }
  } catch (e) {
    console.error('Failed to fetch data:', e)
  }
}

const handleEdit = (payslip) => {
  navigateTo(`/payslips?edit=${payslip.id}`)
}

watch(selectedYear, fetchData)

onMounted(fetchData)

useHead({
  title: 'Dashboard - PPh21 Tax Manager'
})
</script>
