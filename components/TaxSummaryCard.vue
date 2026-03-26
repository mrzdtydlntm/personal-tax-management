<template>
  <div class="card">
    <h3 class="text-lg font-semibold mb-4">Ringkasan Pajak {{ year }}</h3>

    <div v-if="loading" class="text-center py-8 text-gray-500">Memuat data...</div>

    <div v-else-if="error" class="text-center py-8 text-red-500">
      {{ error }}
    </div>

    <div v-else-if="taxData" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-blue-50 p-4 rounded-lg">
          <div class="text-sm text-blue-600 font-medium">Penghasilan Bruto Tahunan</div>
          <div class="text-2xl font-bold text-blue-900 mt-1">
            {{ formatCurrency(taxData.annualGrossIncome) }}
          </div>
        </div>

        <div class="bg-gray-50 p-4 rounded-lg">
          <div class="text-sm text-gray-600 font-medium">PTKP ({{ taxData.ptkpStatus }})</div>
          <div class="text-2xl font-bold text-gray-900 mt-1">
            {{ formatCurrency(taxData.ptkpAmount) }}
          </div>
        </div>

        <div class="bg-purple-50 p-4 rounded-lg">
          <div class="text-sm text-purple-600 font-medium">Penghasilan Kena Pajak</div>
          <div class="text-2xl font-bold text-purple-900 mt-1">
            {{ formatCurrency(taxData.taxableIncome) }}
          </div>
        </div>

        <div class="bg-orange-50 p-4 rounded-lg">
          <div class="text-sm text-orange-600 font-medium">Pajak yang Seharusnya</div>
          <div class="text-2xl font-bold text-orange-900 mt-1">
            {{ formatCurrency(taxData.actualTaxLiability) }}
          </div>
        </div>

        <div class="bg-yellow-50 p-4 rounded-lg">
          <div class="text-sm text-yellow-600 font-medium">Total PPh21 Dipotong</div>
          <div class="text-2xl font-bold text-yellow-900 mt-1">
            {{ formatCurrency(taxData.totalPph21Deducted) }}
          </div>
        </div>

        <div :class="['p-4 rounded-lg', taxData.status === 'REFUND' ? 'bg-green-50' : 'bg-red-50']">
          <div :class="['text-sm font-medium', taxData.status === 'REFUND' ? 'text-green-600' : 'text-red-600']">
            {{ taxData.status === 'REFUND' ? 'Lebih Bayar (Refund)' : 'Kurang Bayar' }}
          </div>
          <div :class="['text-2xl font-bold mt-1', taxData.status === 'REFUND' ? 'text-green-900' : 'text-red-900']">
            {{ formatCurrency(Math.abs(taxData.difference)) }}
          </div>
        </div>
      </div>

      <div class="border-t pt-4">
        <div class="flex justify-between items-center text-sm">
          <span class="text-gray-600">Effective Tax Rate:</span>
          <span class="font-semibold text-gray-900">{{ taxData.effectiveTaxRate.toFixed(2) }}%</span>
        </div>
        <div class="flex justify-between items-center text-sm mt-2">
          <span class="text-gray-600">Data dari:</span>
          <span class="font-semibold text-gray-900">{{ taxData.payslipsCount }} bulan payslip</span>
        </div>
      </div>

      <!-- Projection if available -->
      <div v-if="taxData.projection" class="border-t pt-4">
        <h4 class="text-sm font-semibold text-gray-700 mb-3">Proyeksi Akhir Tahun</h4>
        <div class="bg-indigo-50 p-4 rounded-lg space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-indigo-700">Proyeksi Penghasilan Tahunan:</span>
            <span class="font-semibold text-indigo-900">
              {{ formatCurrency(taxData.projection.projectedAnnualGross) }}
            </span>
          </div>
          <div class="flex justify-between">
            <span class="text-indigo-700">Proyeksi PPh21 Tahunan:</span>
            <span class="font-semibold text-indigo-900">
              {{ formatCurrency(taxData.projection.projectedAnnualPph21) }}
            </span>
          </div>
          <div class="text-xs text-indigo-600 mt-2">* Berdasarkan rata-rata {{ taxData.payslipsCount }} bulan data</div>
        </div>
      </div>

      <div v-if="taxData.status === 'REFUND'" class="bg-green-50 border border-green-200 p-4 rounded-lg">
        <p class="text-sm text-green-800">
          <strong>Selamat!</strong>
          Anda berpotensi mendapatkan refund pajak sebesar
          <strong>{{ formatCurrency(Math.abs(taxData.difference)) }}</strong>
          dari SPT Tahunan Anda.
        </p>
      </div>

      <div v-else-if="taxData.status === 'ADDITIONAL_PAYMENT'" class="bg-red-50 border border-red-200 p-4 rounded-lg">
        <p class="text-sm text-red-800">
          <strong>Perhatian!</strong>
          Anda perlu membayar pajak tambahan sebesar
          <strong>{{ formatCurrency(Math.abs(taxData.difference)) }}</strong>
          saat pelaporan SPT Tahunan.
        </p>
      </div>

      <div v-else class="bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <p class="text-sm text-blue-800">Pembayaran pajak Anda sudah sesuai dengan kewajiban pajak tahunan.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  year: {
    type: Number,
    required: true
  },
  ptkpStatus: {
    type: String,
    default: 'TK/0'
  }
})

const taxData = ref(null)
const loading = ref(false)
const error = ref('')

const fetchTaxData = async () => {
  loading.value = true
  error.value = ''

  try {
    const data = await $fetch('/api/tax/calculate', {
      method: 'POST',
      body: {
        year: props.year,
        ptkpStatus: props.ptkpStatus
      }
    })
    taxData.value = data
  } catch (e) {
    error.value = e.data?.message || 'Gagal memuat data pajak'
  } finally {
    loading.value = false
  }
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value)
}

// Fetch on mount and when props change
watch(() => [props.year, props.ptkpStatus], fetchTaxData, { immediate: true })

// Expose refresh method
defineExpose({ refresh: fetchTaxData })
</script>
