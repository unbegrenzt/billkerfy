import type { CSSProperties } from 'react'

export const dashboardPageLayoutStyle: CSSProperties = {
  minHeight: '100vh',
}

export const dashboardSiderStyle: CSSProperties = {
  borderRight: '1px solid #e2e8f0',
  position: 'sticky',
  top: 0,
  height: '100vh',
}

export const dashboardSiderBodyStyle: CSSProperties = {
  height: '100%',
  padding: 16,
}

export const dashboardSiderBrandStyle: CSSProperties = {
  marginBottom: 16,
}

export const dashboardMainContentStyle: CSSProperties = {
  padding: '24px 32px',
  maxWidth: 1400,
  width: '100%',
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  gap: 24,
}

export const dashboardHeaderStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: 12,
}

export const dashboardMetricsGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
  gap: 14,
}

export const dashboardLowerGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '2fr 1fr',
  gap: 16,
}

export const dashboardRecentListStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  maxHeight: 340,
  overflowY: 'auto',
}

export const dashboardProfileCardStyle: CSSProperties = {
  borderRadius: 12,
  background: '#f8fafc',
  border: '1px solid #e2e8f0',
  padding: 12,
}
