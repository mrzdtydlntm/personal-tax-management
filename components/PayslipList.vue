<template>
  <div class="card">
    <h3 class="text-lg font-semibold mb-4">Daftar Payslip {{ year }}</h3>

    <!-- Skeleton loading -->
    <div v-if="loading" class="animate-pulse overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3"><div class="h-3 bg-gray-200 rounded w-12"></div></th>
            <th class="px-6 py-3"><div class="h-3 bg-gray-200 rounded w-20 ml-auto"></div></th>
            <th class="px-6 py-3"><div class="h-3 bg-gray-200 rounded w-12 ml-auto"></div></th>
            <th class="px-6 py-3"><div class="h-3 bg-gray-200 rounded w-24 ml-auto"></div></th>
            <th class="px-6 py-3"><div class="h-3 bg-gray-200 rounded w-20 ml-auto"></div></th>
            <th class="px-6 py-3"><div class="h-3 bg-gray-200 rounded w-8 mx-auto"></div></th>
            <th class="px-6 py-3"><div class="h-3 bg-gray-200 rounded w-10 ml-auto"></div></th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="i in 5" :key="i">
            <td class="px-6 py-4"><div class="h-4 bg-gray-200 rounded w-20"></div></td>
            <td class="px-6 py-4"><div class="h-4 bg-gray-200 rounded w-28 ml-auto"></div></td>
            <td class="px-6 py-4"><div class="h-4 bg-gray-200 rounded w-24 ml-auto"></div></td>
            <td class="px-6 py-4"><div class="h-4 bg-gray-200 rounded w-24 ml-auto"></div></td>
            <td class="px-6 py-4"><div class="h-4 bg-gray-200 rounded w-28 ml-auto"></div></td>
            <td class="px-6 py-4"><div class="h-4 bg-gray-200 rounded w-8 mx-auto"></div></td>
            <td class="px-6 py-4"><div class="h-4 bg-gray-200 rounded w-16 ml-auto"></div></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else-if="payslips.length === 0" class="text-center py-8 text-gray-500">
      Belum ada data payslip untuk tahun ini
    </div>

    <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bulan</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Gaji Bruto</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">PPh21</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Potongan Lain
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Take Home</th>
            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">File</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="payslip in sortedPayslips" :key="payslip.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ getMonthName(payslip.month) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
              {{ formatCurrency(payslip.grossSalary) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-red-600 text-right">
              {{ formatCurrency(payslip.pph21Deducted) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
              {{ formatCurrency(payslip.otherDeductions) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600 text-right">
              {{ formatCurrency(payslip.takeHomePay) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-center text-sm">
              <a
                v-if="payslip.fileUrl"
                :href="payslip.fileUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Lihat
              </a>
              <span v-else class="text-gray-400 text-xs">-</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button 
                @click="$emit('edit', payslip)" 
                class="text-blue-600 hover:text-blue-900 mr-3 disabled:opacity-50 inline-flex items-center"
                :disabled="loadingEditId === payslip.id"
              >
                <svg v-if="loadingEditId === payslip.id" class="animate-spin -ml-1 mr-1 h-3 w-3 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{{ loadingEditId === payslip.id ? 'Memuat...' : 'Edit' }}</span>
              </button>
              <button @click="handleDelete(payslip)" class="text-red-600 hover:text-red-900">Hapus</button>
            </td>
          </tr>
        </tbody>
        <tfoot class="bg-gray-50 font-semibold">
          <tr>
            <td class="px-6 py-4 text-sm text-gray-900">Total</td>
            <td class="px-6 py-4 text-sm text-gray-900 text-right">
              {{ formatCurrency(totals.grossSalary) }}
            </td>
            <td class="px-6 py-4 text-sm text-red-600 text-right">
              {{ formatCurrency(totals.pph21Deducted) }}
            </td>
            <td class="px-6 py-4 text-sm text-gray-900 text-right">
              {{ formatCurrency(totals.otherDeductions) }}
            </td>
            <td class="px-6 py-4 text-sm text-green-600 text-right">
              {{ formatCurrency(totals.takeHomePay) }}
            </td>
            <td></td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </div>

    <!-- Delete Confirmation Modal -->
    <ConfirmModal
      :is-open="deleteModal.isOpen"
      :title="deleteModal.title"
      :message="deleteModal.message"
      type="danger"
      confirm-text="Hapus"
      cancel-text="Batal"
      :loading="deleteModal.loading"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />

    <!-- Error Alert Modal -->
    <AlertModal
      :is-open="errorModal.isOpen"
      title="Gagal Menghapus"
      :message="errorModal.message"
      type="error"
      @close="errorModal.isOpen = false"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  payslips: {
    type: Array,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  loadingEditId: {
    type: [String, Number],
    default: null
  }
})

const emit = defineEmits(['edit', 'delete', 'refresh'])

const months = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember'
]

// Modal states
const deleteModal = reactive({
  isOpen: false,
  title: '',
  message: '',
  loading: false,
  payslipToDelete: null
})

const errorModal = reactive({
  isOpen: false,
  message: ''
})

const sortedPayslips = computed(() => {
  return [...props.payslips].sort((a, b) => a.month - b.month)
})

const totals = computed(() => {
  return props.payslips.reduce(
    (acc, p) => ({
      grossSalary: acc.grossSalary + p.grossSalary,
      pph21Deducted: acc.pph21Deducted + p.pph21Deducted,
      otherDeductions: acc.otherDeductions + p.otherDeductions,
      takeHomePay: acc.takeHomePay + p.takeHomePay
    }),
    { grossSalary: 0, pph21Deducted: 0, otherDeductions: 0, takeHomePay: 0 }
  )
})

const getMonthName = (month) => months[month - 1]

const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value)
}

const handleDelete = (payslip) => {
  deleteModal.payslipToDelete = payslip
  deleteModal.title = 'Hapus Payslip?'
  deleteModal.message = `Apakah Anda yakin ingin menghapus payslip ${getMonthName(payslip.month)} ${payslip.year}? Tindakan ini tidak dapat dibatalkan.`
  deleteModal.isOpen = true
}

const confirmDelete = async () => {
  deleteModal.loading = true

  try {
    await $fetch(`/api/payslips/${deleteModal.payslipToDelete.id}`, {
      method: 'DELETE'
    })

    deleteModal.isOpen = false
    deleteModal.payslipToDelete = null
    emit('refresh')
  } catch (e) {
    deleteModal.isOpen = false
    errorModal.message = e.data?.message || 'Terjadi kesalahan saat menghapus payslip. Silakan coba lagi.'
    errorModal.isOpen = true
  } finally {
    deleteModal.loading = false
  }
}

const cancelDelete = () => {
  deleteModal.isOpen = false
  deleteModal.payslipToDelete = null
  deleteModal.loading = false
}
</script>
