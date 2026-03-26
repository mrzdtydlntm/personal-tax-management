<template>
  <NuxtLayout name="default">
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Kelola Payslip</h1>
        <NuxtLink to="/" class="btn btn-secondary w-full sm:w-auto text-center">Kembali ke Dashboard</NuxtLink>
      </div>

      <!-- Add/Edit Form -->
      <PayslipForm
        :title="editingPayslip ? 'Edit Payslip' : 'Tambah Payslip Baru'"
        :initial-data="editingPayslip"
        :show-cancel="!!editingPayslip"
        :is-loading-data="changingMode"
        @success="handleSuccess"
        @cancel="cancelEdit"
      />

      <!-- Year Filter -->
      <div class="card">
        <div class="flex items-center gap-3">
          <label class="text-sm font-medium text-gray-700">Filter Tahun:</label>
          <select v-model="selectedYear" class="input w-32 flex-shrink-0">
            <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
          </select>
        </div>
      </div>

      <!-- Payslip List -->
      <PayslipList
        :payslips="payslips"
        :year="selectedYear"
        :loading="loading"
        :loading-edit-id="loadingEditId"
        @refresh="fetchPayslips"
        @edit="handleEdit"
      />
    </div>
  </NuxtLayout>
</template>

<script setup>
const route = useRoute()
const router = useRouter()

const selectedYear = ref(route.query.year ? Number(route.query.year) : new Date().getFullYear())
const payslips = ref([])
const editingPayslip = ref(null)
const loading = ref(false)
const changingMode = ref(false)
const loadingEditId = ref(null)

const years = computed(() => {
  const currentYear = new Date().getFullYear()
  return Array.from({ length: 8 }, (_, i) => currentYear - 7 + i)
})

const fetchPayslips = async () => {
  loading.value = true
  try {
    const data = await $fetch(`/api/payslips?year=${selectedYear.value}&_=${Date.now()}`, {
      cache: 'no-cache'
    })
    payslips.value = data
  } catch (e) {
    console.error('Failed to fetch payslips:', e)
  } finally {
    loading.value = false
  }
}

const handleEdit = async (payslip) => {
  loadingEditId.value = payslip.id
  changingMode.value = true

  window.scrollTo({ top: 0, behavior: 'smooth' })

  try {
    await new Promise((resolve) => setTimeout(resolve, 600)) // Artificial delay to ensure loader is visible
    await router.push({ query: { edit: payslip.id, year: selectedYear.value } })
    editingPayslip.value = payslip
  } finally {
    loadingEditId.value = null
    changingMode.value = false
  }
}

const cancelEdit = () => {
  editingPayslip.value = null
  router.push({ query: {} })
}

const handleSuccess = async () => {
  // Wait a bit to ensure database has been updated
  await new Promise((resolve) => setTimeout(resolve, 100))

  // Fetch fresh data from the server
  await fetchPayslips()

  // Clear editing state
  editingPayslip.value = null
  router.push({ query: {} })
}

watch(selectedYear, fetchPayslips)

onMounted(async () => {
  await fetchPayslips()

  // Handle edit from query param
  if (route.query.edit) {
    const payslip = payslips.value.find((p) => p.id === route.query.edit)
    if (payslip) {
      editingPayslip.value = payslip
    }
  }
})

useHead({
  title: 'Kelola Payslip - PPh21 Tax Manager'
})
</script>
