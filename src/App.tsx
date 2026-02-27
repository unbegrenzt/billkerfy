import { Navigate, Route, Routes } from 'react-router-dom'
import { CreateInvoicePage } from '@/components/pages/CreateInvoicePage'
import { InvoicesListPage } from '@/components/pages/InvoicesListPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/invoices" replace />} />
      <Route path="/invoices" element={<InvoicesListPage />} />
      <Route path="/invoices/new" element={<CreateInvoicePage />} />
    </Routes>
  )
}

export default App
