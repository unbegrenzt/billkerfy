import type { CSSProperties } from 'react'

export const customersPageBodyStyle: CSSProperties = {
  width: 'min(1200px, 100%)',
  margin: '0 auto',
  padding: '32px 24px',
  display: 'flex',
  flexDirection: 'column',
  gap: 20,
}

export const customersToolbarStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 16,
  flexWrap: 'wrap',
}

export const customersSearchStyle: CSSProperties = {
  width: 280,
}

export const customersStatsGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: 12,
}

export const customerCellStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
}

export const customerAvatarStyle: CSSProperties = {
  width: 36,
  height: 36,
  borderRadius: 999,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 700,
  fontSize: 12,
}

