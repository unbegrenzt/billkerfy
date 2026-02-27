import type { CSSProperties } from 'react'

export const invoicesPageBodyStyle: CSSProperties = {
  maxWidth: 1100,
  width: '100%',
  margin: '0 auto',
  padding: 24,
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
}

export const invoicesToolbarStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 12,
  flexWrap: 'wrap',
}

export const invoicesSearchStyle: CSSProperties = {
  width: 320,
}

export const invoicesFiltersBarStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 12,
  flexWrap: 'wrap',
  padding: 12,
  border: '1px solid #f0f0f0',
  borderRadius: 12,
  background: '#ffffff',
}
