# ERP Indupall

Sistema de Gestión Integral - Frontend React + Vite

## Instalación y ejecución

```bash
cd indupall-erp
npm install
npm run dev
```

La app corre en `http://localhost:5173`

## Credenciales de acceso

| Usuario | Contraseña |
|---------|------------|
| admin   | admin123   |

## Stack

- React 19 + Vite 6
- React Router DOM v6
- JavaScript (sin TypeScript)
- CSS puro con variables CSS
- localStorage para persistencia
- Google Material Symbols para iconos

## Estructura del proyecto

```
src/
  components/
    layout/       → Sidebar, Header, Layout
    ui/           → Card, Badge, Modal, EmptyState, Notification
    forms/        → FormField (componente reutilizable)
    tables/       → DataTable (componente reutilizable)
  pages/
    Login/        → Pantalla de acceso
    Dashboard/    → Resumen general + KPIs + alertas de stock
    Clientes/     → ABM completo de clientes
    Facturacion/  → Remito de Venta, Factura, Recibo
    CompraStock/  → Remito de Compra, Stock
    AdministracionCuentas/ → Cuentas y movimientos
  routes/
    AppRoutes.jsx       → Definición de rutas
    ProtectedRoute.jsx  → Guard de rutas privadas
  hooks/
    useAuth.js          → Autenticación mock con localStorage
    useLocalStorage.js  → Hook base de persistencia
    useNotification.js  → Sistema de notificaciones
    useClientes.js      → CRUD de clientes
    useStock.js         → CRUD de productos + aumentar/reducir stock
    useRemitos.js       → Remitos de compra y venta (con lógica de stock)
    useFacturacion.js   → Facturas y recibos
    useCuentas.js       → Cuentas y movimientos
  data/
    mockData.js         → Datos iniciales del sistema
  utils/
    storage.js          → Wrapper de localStorage
    formatters.js       → Formateo de fechas, monedas, generación de IDs
```

## Módulos disponibles

| Ruta | Módulo |
|------|--------|
| `/` | Dashboard |
| `/clientes` | ABM Clientes |
| `/facturacion` | Remito de Venta / Factura / Recibo |
| `/compra-stock` | Remito de Compra / Stock |
| `/administracion-cuentas` | Cuentas y movimientos |

## Flujo ERP principal

```
Remito de Compra  →  aumenta Stock
       ↓
     Stock  (refleja existencias actualizadas)
       ↓
Remito de Venta  →  reduce Stock
       ↓
    Factura  →  Recibo de cobro
```

## Paleta de colores

| Variable | Color | Uso |
|----------|-------|-----|
| `--color-sidebar` | `#343a40` | Fondo sidebar |
| `--color-bg` | `#f8f9fa` | Fondo general |
| `--color-surface` | `#ffffff` | Cards y contenido |
| `--color-warning` | `#ffc107` | Ítem activo sidebar, alertas |
| `--color-danger` | `#dc3545` | Errores, sin stock |
| `--color-success` | `#28a745` | Confirmaciones, stock ok |

## Persistencia

Todos los datos se guardan en `localStorage` con el prefijo `erp_indupall_`. Para resetear los datos a los valores iniciales, limpiar el localStorage del navegador.

## Agregar nuevos módulos

1. Crear carpeta en `src/pages/NuevoModulo/`
2. Crear hook en `src/hooks/useNuevoModulo.js` usando `useLocalStorage`
3. Agregar ruta en `src/routes/AppRoutes.jsx`
4. Agregar ítem al array `navItems` en `src/components/layout/Sidebar.jsx`
