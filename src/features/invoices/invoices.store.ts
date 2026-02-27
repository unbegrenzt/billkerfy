import { create } from 'zustand'
import {
  createInvoice,
  fetchInvoicesByOrganization,
  updateInvoiceStatus,
} from '@/features/invoices/invoices.service'
import type { CreateInvoiceInput, Invoice } from '@/features/invoices/invoices.types'

type InvoicesState = {
  invoices: Invoice[]
  isLoading: boolean
  isSavingStatus: boolean
  isCreating: boolean
  error: string | null
  loadInvoicesByOrganization: (organizationId: string) => Promise<void>
  saveInvoiceStatus: (invoiceId: string, status: Invoice['status']) => Promise<void>
  createInvoiceEntry: (input: CreateInvoiceInput) => Promise<Invoice | null>
}

export const useInvoicesStore = create<InvoicesState>((set) => ({
  invoices: [],
  isLoading: false,
  isSavingStatus: false,
  isCreating: false,
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
  saveInvoiceStatus: async (invoiceId: string, status: Invoice['status']) => {
    set({ isSavingStatus: true, error: null })

    try {
      const updatedInvoice = await updateInvoiceStatus(invoiceId, status)
      set((state) => ({
        invoices: state.invoices.map((invoice) =>
          invoice.$id === updatedInvoice.$id ? updatedInvoice : invoice,
        ),
        isSavingStatus: false,
        error: null,
      }))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update invoice status'
      set({ isSavingStatus: false, error: errorMessage })
    }
  },
  createInvoiceEntry: async (input: CreateInvoiceInput) => {
    set({ isCreating: true, error: null })

    try {
      const createdInvoice = await createInvoice(input)
      set((state) => ({
        invoices: [createdInvoice, ...state.invoices],
        isCreating: false,
        error: null,
      }))
      return createdInvoice
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create invoice'
      set({ isCreating: false, error: errorMessage })
      return null
    }
  },
}))
