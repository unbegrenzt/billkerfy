import type { CSSProperties } from 'react'

export const settingsPageLayoutStyle: CSSProperties = {
  minHeight: '100vh',
}

export const settingsSiderStyle: CSSProperties = {
  borderRight: '1px solid #e2e8f0',
  background: '#ffffff',
}

export const settingsMainStyle: CSSProperties = {
  padding: '32px 40px',
  maxWidth: 1240,
  margin: '0 auto',
  width: '100%',
}

export const settingsHeaderStyle: CSSProperties = {
  borderBottom: '1px solid #e2e8f0',
  paddingBottom: 20,
}

export const settingsBodyGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '240px minmax(0, 1fr)',
  gap: 24,
  alignItems: 'start',
}

export const settingsSectionMenuStyle: CSSProperties = {
  position: 'sticky',
  top: 24,
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
}

export const settingsCardsStackStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 24,
}

export const settingsFormGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: 16,
}

export const settingsFullColumnStyle: CSSProperties = {
  gridColumn: '1 / -1',
}

export const settingsLogoBoxStyle: CSSProperties = {
  width: 88,
  height: 88,
  border: '1px solid #e2e8f0',
  borderRadius: 12,
  background: '#f8fafc',
  display: 'grid',
  placeItems: 'center',
  color: '#94a3b8',
}
