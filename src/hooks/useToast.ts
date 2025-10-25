'use client'

export interface Toast {
  id: string
  title: string
  description?: string
  variant?: 'default' | 'destructive' | 'success'
}

export function useToast() {
  const toast = ({ title, description }: { title: string; description?: string }) => {
    console.log(`Toast: ${title} - ${description || ''}`)
    // Simple alert for now
    alert(`${title}\n${description || ''}`)
  }

  const dismiss = (toastId: string) => {
    // No-op for now
  }

  return {
    toast,
    dismiss,
    toasts: []
  }
}

export function ToastContainer({ toasts, dismiss }: { toasts: Toast[]; dismiss: (id: string) => void }) {
  return null
}