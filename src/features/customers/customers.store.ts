import { create } from 'zustand'
import {
  createCustomer,
  deleteCustomer,
  fetchCustomersByOrganization,
  updateCustomer,
} from '@/features/customers/customers.service'
import type { Customer } from '@/features/customers/customers.types'

type CustomersState = {
  customers: Customer[]
  isLoading: boolean
  error: string | null
  loadCustomersByOrganization: (organizationId: string) => Promise<void>
  addCustomer: (
    organizationId: string,
    companyName: string,
    details?: {
      taxId?: string
      address?: string
      email?: string
      phone?: string
    },
  ) => Promise<Customer | null>
  saveCustomerDetails: (customerId: string, taxId: string, address: string) => Promise<Customer | null>
  saveCustomerProfile: (
    customerId: string,
    payload: {
      companyName: string
      taxId: string
      address: string
      email: string
      phone: string
    },
  ) => Promise<Customer | null>
  removeCustomer: (customerId: string) => Promise<boolean>
}

export const useCustomersStore = create<CustomersState>((set) => ({
  customers: [],
  isLoading: false,
  error: null,
  loadCustomersByOrganization: async (organizationId: string) => {
    set({ isLoading: true, error: null })

    try {
      const customers = await fetchCustomersByOrganization(organizationId)
      set({ customers, isLoading: false })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load customers'
      set({ isLoading: false, error: errorMessage })
    }
  },
  addCustomer: async (organizationId: string, companyName: string, details) => {
    try {
      const customer = await createCustomer({ organizationId, companyName, ...details })
      set((state) => ({ customers: [customer, ...state.customers] }))
      return customer
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create customer'
      set({ error: errorMessage })
      return null
    }
  },
  saveCustomerDetails: async (customerId: string, taxId: string, address: string) => {
    set({ error: null })

    try {
      const customer = await updateCustomer({ customerId, taxId, address })
      set((state) => ({
        customers: state.customers.map((item) => (item.$id === customer.$id ? customer : item)),
        error: null,
      }))
      return customer
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save customer details'
      set({ error: errorMessage })
      return null
    }
  },
  saveCustomerProfile: async (customerId, payload) => {
    set({ error: null })

    try {
      const customer = await updateCustomer({
        customerId,
        companyName: payload.companyName,
        taxId: payload.taxId,
        address: payload.address,
        email: payload.email,
        phone: payload.phone,
      })
      set((state) => ({
        customers: state.customers.map((item) => (item.$id === customer.$id ? customer : item)),
        error: null,
      }))
      return customer
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save customer profile'
      set({ error: errorMessage })
      return null
    }
  },
  removeCustomer: async (customerId: string) => {
    set({ error: null })

    try {
      await deleteCustomer(customerId)
      set((state) => ({
        customers: state.customers.filter((item) => item.$id !== customerId),
      }))
      return true
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete customer'
      set({ error: errorMessage })
      return false
    }
  },
}))
