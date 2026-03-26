<template>
  <div class="card relative overflow-hidden">
    <!-- Loading Overlay -->
    <div v-if="isLoadingData" class="absolute inset-0 bg-white/70 z-10 flex flex-col items-center justify-center backdrop-blur-[1px] transition-all duration-300 rounded-xl">
      <svg class="animate-spin h-8 w-8 text-blue-600 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span class="text-sm font-medium text-gray-600">Menyiapkan data form...</span>
    </div>

    <h3 class="text-lg font-semibold mb-4">{{ title }}</h3>
    <form @submit.prevent="handleSubmit">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label class="label">Bulan</label>
          <select v-model="form.month" class="input" required>
            <option value="">Pilih Bulan</option>
            <option v-for="m in months" :key="m.value" :value="m.value">
              {{ m.label }}
            </option>
          </select>
        </div>

        <div>
          <label class="label">Tahun</label>
          <input v-model.number="form.year" type="number" class="input" :min="2020" :max="2030" required />
        </div>

        <div>
          <label class="label">Gaji Bruto (Gross Salary)</label>
          <input
            v-model.number="form.grossSalary"
            type="number"
            step="0.01"
            class="input"
            placeholder="10000000"
            required
          />
        </div>

        <div>
          <label class="label">Gaji Bersih (Take Home Pay)</label>
          <input
            :value="calculateTakeHomePay"
            type="text"
            class="input bg-gray-100 cursor-not-allowed"
            :placeholder="formatCurrency(calculateTakeHomePay)"
            readonly
            disabled
          />
          <p class="text-xs text-gray-500 mt-1">Auto-calculated: Gaji Bruto - (PPh21 + Potongan Lain)</p>
        </div>

        <div>
          <label class="label">PPh21 yang Dipotong</label>
          <input
            v-model.number="form.pph21Deducted"
            type="number"
            step="0.01"
            class="input"
            placeholder="500000"
            required
          />
        </div>

        <div>
          <label class="label">Potongan Lain (BPJS, dll)</label>
          <input v-model.number="form.otherDeductions" type="number" step="0.01" class="input" placeholder="1000000" />
        </div>

        <div class="md:col-span-2">
          <label class="label">Link File Payslip (Opsional)</label>
          <input
            v-model="form.fileUrl"
            type="url"
            class="input"
            placeholder="https://drive.google.com/file/... atau https://..."
          />
          <p class="text-xs text-gray-500 mt-1">Link ke file payslip (PDF, gambar, Google Drive, Dropbox, dll)</p>
        </div>
      </div>

      <div v-if="error" class="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
        {{ error }}
      </div>

      <div v-if="success" class="mb-4 p-3 bg-green-50 text-green-700 rounded-lg">
        {{ success }}
      </div>

      <div class="flex gap-3">
        <button type="submit" class="btn btn-primary" :disabled="loading">
          {{ loading ? 'Menyimpan...' : 'Simpan' }}
        </button>
        <button v-if="showCancel" type="button" class="btn btn-secondary" @click="$emit('cancel')">Batal</button>
      </div>
    </form>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: 'Tambah Payslip'
  },
  initialData: {
    type: Object,
    default: null
  },
  showCancel: {
    type: Boolean,
    default: false
  },
  isLoadingData: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['success', 'cancel'])

const months = [
  { value: 1, label: 'Januari' },
  { value: 2, label: 'Februari' },
  { value: 3, label: 'Maret' },
  { value: 4, label: 'April' },
  { value: 5, label: 'Mei' },
  { value: 6, label: 'Juni' },
  { value: 7, label: 'Juli' },
  { value: 8, label: 'Agustus' },
  { value: 9, label: 'September' },
  { value: 10, label: 'Oktober' },
  { value: 11, label: 'November' },
  { value: 12, label: 'Desember' }
]

const form = reactive({
  month: props.initialData?.month || '',
  year: props.initialData?.year || new Date().getFullYear(),
  grossSalary: props.initialData?.grossSalary || 0,
  pph21Deducted: props.initialData?.pph21Deducted || 0,
  otherDeductions: props.initialData?.otherDeductions || 0,
  fileUrl: props.initialData?.fileUrl || ''
})

const loading = ref(false)
const error = ref('')
const success = ref('')

// Calculate take home pay automatically
const calculateTakeHomePay = computed(() => {
  const gross = form.grossSalary || 0
  const pph21 = form.pph21Deducted || 0
  const other = form.otherDeductions || 0
  return Math.max(0, gross - pph21 - other)
})

// Format currency for display
const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value)
}

// Watch for changes in initialData and update form
watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      form.month = newData.month || ''
      form.year = newData.year || new Date().getFullYear()
      form.grossSalary = newData.grossSalary || 0
      form.pph21Deducted = newData.pph21Deducted || 0
      form.otherDeductions = newData.otherDeductions || 0
      form.fileUrl = newData.fileUrl || ''
    } else {
      // Reset form when initialData is null (adding new)
      form.month = ''
      form.year = new Date().getFullYear()
      form.grossSalary = 0
      form.pph21Deducted = 0
      form.otherDeductions = 0
      form.fileUrl = ''
    }
    // Clear any messages when switching between add/edit
    error.value = ''
    success.value = ''
  },
  { immediate: true }
)

const resetForm = () => {
  form.month = ''
  form.year = new Date().getFullYear()
  form.grossSalary = 0
  form.pph21Deducted = 0
  form.otherDeductions = 0
  form.fileUrl = ''
  error.value = ''
  success.value = ''
}

const handleSubmit = async () => {
  loading.value = true
  error.value = ''
  success.value = ''

  try {
    // Prepare data with calculated take home pay
    const payslipData = {
      ...form,
      takeHomePay: calculateTakeHomePay.value
    }

    const isEditing = !!props.initialData

    if (isEditing) {
      await $fetch(`/api/payslips/${props.initialData.id}`, {
        method: 'PUT',
        body: payslipData
      })
      success.value = 'Payslip berhasil diupdate!'
    } else {
      await $fetch('/api/payslips', {
        method: 'POST',
        body: payslipData
      })
      success.value = 'Payslip berhasil ditambahkan!'
    }

    emit('success')

    // Reset form only when adding new (not editing)
    if (!isEditing) {
      // Clear success message after 3 seconds
      setTimeout(() => {
        success.value = ''
      }, 3000)

      // Reset form after showing success message
      setTimeout(() => {
        resetForm()
      }, 100)
    }
  } catch (e) {
    error.value = e.data?.message || 'Terjadi kesalahan'
  } finally {
    loading.value = false
  }
}
</script>
