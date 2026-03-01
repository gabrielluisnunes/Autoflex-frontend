import { Navigate, Route, Routes } from 'react-router-dom'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { ProductsPage } from '../pages/ProductsPage'
import { RawMaterialsPage } from '../pages/RawMaterialsPage'
import { ProductionPage } from '../pages/ProductionPage'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Navigate to="/products" replace />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="raw-materials" element={<RawMaterialsPage />} />
        <Route path="production" element={<ProductionPage />} />
      </Route>
    </Routes>
  )
}

export default App
