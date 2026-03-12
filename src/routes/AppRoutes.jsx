import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import Layout from '../components/layout/Layout'
import Login from '../pages/Login/Login'
import Dashboard from '../pages/Dashboard/Dashboard'
import Clientes from '../pages/Clientes/Clientes'
import Proveedores from '../pages/Proveedores/Proveedores'
import Facturacion from '../pages/Facturacion/Facturacion'
import CompraStock from '../pages/CompraStock/CompraStock'
import Productos from '../pages/Productos/Productos'
import AdministracionCuentas from '../pages/AdministracionCuentas/AdministracionCuentas'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="clientes" element={<Clientes />} />
        <Route path="proveedores" element={<Proveedores />} />
        <Route path="facturacion" element={<Facturacion />} />
        <Route path="compra-stock" element={<CompraStock />} />
        <Route path="productos" element={<Productos />} />
        <Route path="administracion-cuentas" element={<AdministracionCuentas />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
