# Modal System Documentation

## Overview

The application uses custom modal components instead of native JavaScript `confirm()`, `alert()`, and `prompt()` functions for a better user experience.

## Available Modals

### 1. ConfirmModal
Used for confirmation dialogs that require user action (Yes/No, Confirm/Cancel).

**Features:**
- Custom title and message
- 4 types: `info`, `success`, `warning`, `danger`
- Customizable button text
- Loading state support
- Keyboard support (Escape to cancel)
- Click outside to cancel
- Smooth animations

### 2. AlertModal
Used for simple notifications that only need acknowledgment.

**Features:**
- Custom title and message
- 4 types: `info`, `success`, `warning`, `error`
- Customizable button text
- Keyboard support (Escape to close)
- Click outside to close
- Smooth animations

## Usage

### Method 1: Direct Component Usage

Import and use the modal components directly in your template.

```vue
<template>
  <div>
    <button @click="showDeleteModal = true">Delete</button>

    <ConfirmModal
      :is-open="showDeleteModal"
      title="Delete Item?"
      message="Are you sure you want to delete this item? This action cannot be undone."
      type="danger"
      confirm-text="Delete"
      cancel-text="Cancel"
      :loading="isDeleting"
      @confirm="handleConfirm"
      @cancel="showDeleteModal = false"
    />
  </div>
</template>

<script setup>
const showDeleteModal = ref(false)
const isDeleting = ref(false)

const handleConfirm = async () => {
  isDeleting.value = true
  try {
    await deleteItem()
    showDeleteModal.value = false
  } catch (e) {
    // Handle error
  } finally {
    isDeleting.value = false
  }
}
</script>
```

### Method 2: Using the Composable (Recommended)

Use the `useModal()` composable for easier modal management.

```vue
<script setup>
const { showConfirm, showAlert } = useModal()

const handleDelete = async () => {
  const confirmed = await showConfirm({
    title: 'Delete Item?',
    message: 'Are you sure you want to delete this item?',
    type: 'danger',
    confirmText: 'Delete',
    cancelText: 'Cancel'
  })

  if (confirmed) {
    try {
      await deleteItem()
      await showAlert({
        title: 'Success',
        message: 'Item deleted successfully',
        type: 'success'
      })
    } catch (e) {
      await showAlert({
        title: 'Error',
        message: 'Failed to delete item',
        type: 'error'
      })
    }
  }
}
</script>
```

## ConfirmModal Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | Boolean | `false` | Controls modal visibility |
| `title` | String | Required | Modal title |
| `message` | String | Required | Modal message/description |
| `type` | String | `'info'` | Modal type: `info`, `success`, `warning`, `danger` |
| `confirmText` | String | `'Konfirmasi'` | Confirm button text |
| `cancelText` | String | `'Batal'` | Cancel button text |
| `showCancel` | Boolean | `true` | Show/hide cancel button |
| `loading` | Boolean | `false` | Show loading state on confirm button |

## ConfirmModal Events

| Event | Payload | Description |
|-------|---------|-------------|
| `@confirm` | None | Emitted when confirm button is clicked |
| `@cancel` | None | Emitted when cancel button is clicked |
| `@close` | None | Emitted when modal is closed (same as cancel) |

## AlertModal Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | Boolean | `false` | Controls modal visibility |
| `title` | String | `''` | Modal title (optional) |
| `message` | String | Required | Modal message/description |
| `type` | String | `'info'` | Modal type: `info`, `success`, `warning`, `error` |
| `buttonText` | String | `'OK'` | Button text |

## AlertModal Events

| Event | Payload | Description |
|-------|---------|-------------|
| `@close` | None | Emitted when modal is closed |

## Modal Types

### Confirmation Modal Types

| Type | Icon | Color | Use Case |
|------|------|-------|----------|
| `info` | Info circle | Blue | General information confirmations |
| `success` | Checkmark | Green | Successful action confirmations |
| `warning` | Warning triangle | Yellow | Warning confirmations |
| `danger` | Alert triangle | Red | Destructive action confirmations (delete, etc.) |

### Alert Modal Types

| Type | Icon | Color | Use Case |
|------|------|-------|----------|
| `info` | Info circle | Blue | General information alerts |
| `success` | Checkmark | Green | Success notifications |
| `warning` | Warning triangle | Yellow | Warning messages |
| `error` | X mark | Red | Error messages |

## Examples

### Delete Confirmation (Current Implementation)

```vue
<template>
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
</template>

<script setup>
const deleteModal = reactive({
  isOpen: false,
  title: '',
  message: '',
  loading: false,
  itemToDelete: null
})

const handleDelete = (item) => {
  deleteModal.itemToDelete = item
  deleteModal.title = 'Hapus Item?'
  deleteModal.message = 'Apakah Anda yakin ingin menghapus item ini?'
  deleteModal.isOpen = true
}

const confirmDelete = async () => {
  deleteModal.loading = true
  try {
    await $fetch(`/api/items/${deleteModal.itemToDelete.id}`, {
      method: 'DELETE'
    })
    deleteModal.isOpen = false
    // Refresh list
  } catch (e) {
    // Show error
  } finally {
    deleteModal.loading = false
  }
}

const cancelDelete = () => {
  deleteModal.isOpen = false
  deleteModal.itemToDelete = null
}
</script>
```

### Success Alert

```vue
<template>
  <AlertModal
    :is-open="successAlert.isOpen"
    title="Berhasil!"
    :message="successAlert.message"
    type="success"
    @close="successAlert.isOpen = false"
  />
</template>

<script setup>
const successAlert = reactive({
  isOpen: false,
  message: ''
})

const showSuccess = (message) => {
  successAlert.message = message
  successAlert.isOpen = true
}
</script>
```

### Error Alert

```vue
<template>
  <AlertModal
    :is-open="errorAlert.isOpen"
    title="Terjadi Kesalahan"
    :message="errorAlert.message"
    type="error"
    @close="errorAlert.isOpen = false"
  />
</template>

<script setup>
const errorAlert = reactive({
  isOpen: false,
  message: ''
})

const showError = (message) => {
  errorAlert.message = message
  errorAlert.isOpen = true
}
</script>
```

### Warning Confirmation

```vue
<ConfirmModal
  :is-open="warningModal"
  title="Perhatian!"
  message="Tindakan ini akan mengubah data. Lanjutkan?"
  type="warning"
  confirm-text="Lanjutkan"
  cancel-text="Batal"
  @confirm="handleConfirm"
  @cancel="warningModal = false"
/>
```

## Best Practices

### 1. Use Appropriate Types
- Use `danger` for destructive actions (delete, remove, etc.)
- Use `warning` for actions that might have consequences
- Use `info` for general confirmations
- Use `success` for positive confirmations

### 2. Clear Messaging
- Title should be a question for confirmations
- Message should explain the consequence
- Use clear, action-oriented button text

**Good:**
```javascript
{
  title: 'Hapus Payslip?',
  message: 'Apakah Anda yakin ingin menghapus payslip Januari 2024? Tindakan ini tidak dapat dibatalkan.',
  confirmText: 'Hapus',
  cancelText: 'Batal'
}
```

**Bad:**
```javascript
{
  title: 'Konfirmasi',
  message: 'Yakin?',
  confirmText: 'Ya',
  cancelText: 'Tidak'
}
```

### 3. Loading States
Always show loading state for async operations:

```javascript
const confirmDelete = async () => {
  modal.loading = true
  try {
    await deleteItem()
  } finally {
    modal.loading = false
  }
}
```

### 4. Error Handling
Show error alerts when operations fail:

```javascript
try {
  await deleteItem()
} catch (e) {
  showError(e.data?.message || 'Terjadi kesalahan')
}
```

### 5. Reactive State
Use `reactive()` for modal state to keep all properties together:

```javascript
const modal = reactive({
  isOpen: false,
  title: '',
  message: '',
  loading: false,
  data: null
})
```

## Migration Guide

### From JavaScript Prompts to Modals

**Before (JavaScript confirm):**
```javascript
const handleDelete = async (item) => {
  if (!confirm('Delete this item?')) {
    return
  }
  await deleteItem(item.id)
}
```

**After (Modal):**
```javascript
const deleteModal = reactive({
  isOpen: false,
  title: '',
  message: '',
  loading: false,
  item: null
})

const handleDelete = (item) => {
  deleteModal.item = item
  deleteModal.title = 'Delete Item?'
  deleteModal.message = 'Are you sure you want to delete this item?'
  deleteModal.isOpen = true
}

const confirmDelete = async () => {
  deleteModal.loading = true
  try {
    await deleteItem(deleteModal.item.id)
    deleteModal.isOpen = false
  } finally {
    deleteModal.loading = false
  }
}
```

**Before (JavaScript alert):**
```javascript
try {
  await saveData()
} catch (e) {
  alert('Failed to save')
}
```

**After (Modal):**
```javascript
const errorModal = reactive({
  isOpen: false,
  message: ''
})

try {
  await saveData()
} catch (e) {
  errorModal.message = 'Failed to save data'
  errorModal.isOpen = true
}
```

## Accessibility

The modals include built-in accessibility features:

- ✅ Keyboard navigation (Escape to close)
- ✅ Click outside to close
- ✅ Focus management
- ✅ ARIA attributes (can be added)
- ✅ Smooth animations with transitions

## Future Enhancements

Potential improvements:
- Form modals (input prompts)
- Multi-step modals
- Draggable modals
- Full-screen modals
- Custom slot content
- Sound effects
- Animation customization

---

**Questions or issues?** Check the component files:
- `/components/ConfirmModal.vue`
- `/components/AlertModal.vue`
- `/composables/useModal.ts`
