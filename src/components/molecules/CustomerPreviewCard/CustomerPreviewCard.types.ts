export type CustomerPreviewCardProps = {
  companyName: string
  taxId: string
  address: string
  isEditing: boolean
  isSaving: boolean
  onStartEdit: () => void
  onTaxIdChange: (value: string) => void
  onAddressChange: (value: string) => void
  onSave: () => void
  onClear: () => void
}
