/**
 * Composable for managing modal states
 * Makes it easy to create and control modals throughout the application
 */

export interface ConfirmModalOptions {
  title: string
  message: string
  type?: 'info' | 'success' | 'warning' | 'danger'
  confirmText?: string
  cancelText?: string
  showCancel?: boolean
}

export interface AlertModalOptions {
  title?: string
  message: string
  type?: 'info' | 'success' | 'warning' | 'error'
  buttonText?: string
}

export const useModal = () => {
  const confirmModal = reactive({
    isOpen: false,
    title: '',
    message: '',
    type: 'info' as 'info' | 'success' | 'warning' | 'danger',
    confirmText: 'Konfirmasi',
    cancelText: 'Batal',
    showCancel: true,
    loading: false,
    onConfirm: null as (() => void | Promise<void>) | null,
    onCancel: null as (() => void) | null
  })

  const alertModal = reactive({
    isOpen: false,
    title: '',
    message: '',
    type: 'info' as 'info' | 'success' | 'warning' | 'error',
    buttonText: 'OK',
    onClose: null as (() => void) | null
  })

  /**
   * Show a confirmation modal
   * @param options Modal configuration
   * @returns Promise that resolves to true if confirmed, false if cancelled
   */
  const showConfirm = (options: ConfirmModalOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      confirmModal.title = options.title
      confirmModal.message = options.message
      confirmModal.type = options.type || 'info'
      confirmModal.confirmText = options.confirmText || 'Konfirmasi'
      confirmModal.cancelText = options.cancelText || 'Batal'
      confirmModal.showCancel = options.showCancel !== false
      confirmModal.loading = false

      confirmModal.onConfirm = async () => {
        confirmModal.loading = true
        try {
          resolve(true)
        } finally {
          confirmModal.loading = false
          confirmModal.isOpen = false
        }
      }

      confirmModal.onCancel = () => {
        confirmModal.isOpen = false
        resolve(false)
      }

      confirmModal.isOpen = true
    })
  }

  /**
   * Show an alert modal
   * @param options Modal configuration
   * @returns Promise that resolves when modal is closed
   */
  const showAlert = (options: AlertModalOptions): Promise<void> => {
    return new Promise((resolve) => {
      alertModal.title = options.title || ''
      alertModal.message = options.message
      alertModal.type = options.type || 'info'
      alertModal.buttonText = options.buttonText || 'OK'

      alertModal.onClose = () => {
        alertModal.isOpen = false
        resolve()
      }

      alertModal.isOpen = true
    })
  }

  /**
   * Close all modals
   */
  const closeAll = () => {
    confirmModal.isOpen = false
    alertModal.isOpen = false
  }

  return {
    confirmModal,
    alertModal,
    showConfirm,
    showAlert,
    closeAll
  }
}
