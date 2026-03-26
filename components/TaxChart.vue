<template>
  <div class="card">
    <h3 class="text-lg font-semibold mb-4">Grafik PPh21 Bulanan</h3>
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup>
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const props = defineProps({
  payslips: {
    type: Array,
    required: true
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
