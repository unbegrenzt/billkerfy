import { create } from 'zustand'
import { fetchPrimaryOrganization } from '@/features/organizations/organizations.service'
import type { Organization } from '@/features/organizations/organizations.types'

type OrganizationsState = {
  organization: Organization | null
  isLoading: boolean
  error: string | null
  loadPrimaryOrganization: () => Promise<void>
}

export const useOrganizationsStore = create<OrganizationsState>((set) => ({
  organization: null,
  isLoading: false,
  error: null,
  loadPrimaryOrganization: async () => {
    set({ isLoading: true, error: null })

    try {
      const organization = await fetchPrimaryOrganization()
      set({ organization, isLoading: false })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load organization'
      set({ isLoading: false, error: errorMessage })
    }
  },
}))
