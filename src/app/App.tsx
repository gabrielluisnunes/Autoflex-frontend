import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { useAppSelector } from '../hooks/reduxHooks'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { ProductsPage } from '../pages/ProductsPage'
import { RawMaterialsPage } from '../pages/RawMaterialsPage'
import { ProductionPage } from '../pages/ProductionPage'
import { LoginPage } from '../pages/LoginPage'

const getDefaultPath = (role: string | null) => {
  if (role === 'USER') {
    return '/production'
  }

  return '/products'
}

const ProtectedRoute = () => {
  const token = useAppSelector((state) => state.auth.token)

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

const AdminRoute = () => {
  const role = useAppSelector((state) => state.auth.role)

  if (role !== 'ADMIN') {
    return <Navigate to="/production" replace />
  }

  return <Outlet />
}

const App = () => {
  const token = useAppSelector((state) => state.auth.token)
  const role = useAppSelector((state) => state.auth.role)

  return (
    <Routes>
      <Route
        path="/login"
        element={token ? <Navigate to={getDefaultPath(role)} replace /> : <LoginPage />}
      />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Navigate to={getDefaultPath(role)} replace />} />

          <Route element={<AdminRoute />}>
            <Route path="products" element={<ProductsPage />} />
            <Route path="raw-materials" element={<RawMaterialsPage />} />
          </Route>

          <Route path="production" element={<ProductionPage />} />
        </Route>
      </Route>

      <Route
        path="*"
        element={<Navigate to={token ? getDefaultPath(role) : '/login'} replace />}
      />
    </Routes>
  )
}

export default App
