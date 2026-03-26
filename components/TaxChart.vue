<template>
  <div class="card">
    <h3 class="text-lg font-semibold mb-4">Grafik PPh21 Bulanan</h3>
    <!-- Skeleton -->
    <div v-if="loading" class="animate-pulse">
      <div class="flex items-end gap-2 h-48 px-4">
        <div v-for="i in 8" :key="i" class="flex-1 bg-gray-200 rounded-t"
          :style="{ height: (30 + Math.sin(i) * 20 + i * 5) + '%' }"></div>
      </div>
      <div class="flex justify-center gap-6 mt-4">
        <div class="flex items-center gap-2"><div class="w-4 h-3 bg-gray-200 rounded"></div><div class="h-3 bg-gray-200 rounded w-16"></div></div>
        <div class="flex items-center gap-2"><div class="w-4 h-3 bg-gray-200 rounded"></div><div class="h-3 bg-gray-200 rounded w-10"></div></div>
        <div class="flex items-center gap-2"><div class="w-4 h-3 bg-gray-200 rounded"></div><div class="h-3 bg-gray-200 rounded w-20"></div></div>
      </div>
    </div>
    <canvas v-else ref="chartCanvas"></canvas>
  </div>
</template>

<script setup>
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const props = defineProps({
  payslips: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const chartCanvas = ref(null)
let chartInstance = null

const initChart = () => {
  if (!chartCanvas.value || props.payslips.length === 0) return

  const ctx = chartCanvas.value.getContext('2d')

  // Sort payslips by month
  const sortedPayslips = [...props.payslips].sort((a, b) => a.month - b.month)

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']

  const labels = sortedPayslips.map((p) => months[p.month - 1])
  const grossData = sortedPayslips.map((p) => p.grossSalary)
  const pph21Data = sortedPayslips.map((p) => p.pph21Deducted)
  const takeHomeData = sortedPayslips.map((p) => p.takeHomePay)

  if (chartInstance) {
    chartInstance.destroy()
  }

  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Gaji Bruto',
          data: grossData,
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          borderColor: 'rgb(59, 130, 246)',
          borderWidth: 1
        },
        {
          label: 'PPh21',
          data: pph21Data,
          backgroundColor: 'rgba(239, 68, 68, 0.5)',
          borderColor: 'rgb(239, 68, 68)',
          borderWidth: 1
        },
        {
          label: 'Take Home Pay',
          data: takeHomeData,
          backgroundColor: 'rgba(34, 197, 94, 0.5)',
          borderColor: 'rgb(34, 197, 94)',
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'top'
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              let label = context.dataset.label || ''
              if (label) {
                label += ': '
              }
              label += new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0
              }).format(context.parsed.y)
              return label
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function (value) {
              return new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
                notation: 'compact'
              }).format(value)
            }
          }
        }
      }
    }
  })
}

watch(
  () => props.payslips,
  () => {
    nextTick(() => initChart())
  },
  { deep: true }
)

onMounted(() => {
  nextTick(() => initChart())
})

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy()
  }
})
</script>
