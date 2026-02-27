import { Navigate, Route, Routes } from 'react-router-dom'
import { CreateInvoicePage } from '@/components/pages/CreateInvoicePage'
import { CustomersPage } from '@/components/pages/CustomersPage'
import { DashboardPage } from '@/components/pages/DashboardPage'
import { InvoicesListPage } from '@/components/pages/InvoicesListPage'
import { SettingsPage } from '@/components/pages/SettingsPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/invoices" element={<InvoicesListPage />} />
      <Route path="/invoices/new" element={<CreateInvoicePage />} />
      <Route path="/customers" element={<CustomersPage />} />
      <Route path="/settings" element={<SettingsPage />} />
    </Routes>
  )
}

export default App
