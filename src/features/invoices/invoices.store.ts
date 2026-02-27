import { create } from 'zustand'
import { fetchInvoicesByOrganization } from '@/features/invoices/invoices.service'
import type { Invoice } from '@/features/invoices/invoices.types'

type InvoicesState = {
  invoices: Invoice[]
  isLoading: boolean
  error: string | null
  loadInvoicesByOrganization: (organizationId: string) => Promise<void>
}

export const useInvoicesStore = create<InvoicesState>((set) => ({
  invoices: [],
  isLoading: false,
  error: null,
  loadInvoicesByOrganization: async (organizationId: string) => {
    set({ isLoading: true, error: null })

    try {
      const invoices = await fetchInvoicesByOrganization(organizationId)
      set({ invoices, isLoading: false, error: null })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load invoices'
      set({ isLoading: false, error: errorMessage })
    }
  },
}))
