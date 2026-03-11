export const MOCK_PROVEEDORES = [
  { id: 1, razonSocial: 'Madereras del Norte S.A.', cuit: '30-61234567-2', telefono: '03404-420100', email: 'ventas@maderasnorte.com.ar', direccion: 'Ruta 11 Km 30, Reconquista', condicionIva: 'Responsable Inscripto', estado: 'activo' },
  { id: 2, razonSocial: 'Aserradero San Jorge S.R.L.', cuit: '30-72345678-4', telefono: '03404-15345678', email: 'contacto@aserraderosjorge.com', direccion: 'Mitre 890, San Jorge', condicionIva: 'Responsable Inscripto', estado: 'activo' },
  { id: 3, razonSocial: 'Clavos y Tornillos del Litoral', cuit: '20-30123456-7', telefono: '03404-432200', email: 'info@clavosdellitoral.com.ar', direccion: 'Belgrano 455, Vera', condicionIva: 'Monotributista', estado: 'activo' },
]

export const MOCK_CLIENTES = [
  { id: 1, razonSocial: 'Agropecuaria Los Alamos S.A.', cuit: '30-71234567-8', telefono: '03464-430000', email: 'contacto@losalamos.com.ar', direccion: 'Ruta 14 Km 45, Esperanza', condicionIva: 'Responsable Inscripto', estado: 'activo' },
  { id: 2, razonSocial: 'Juan Carlos Martínez', cuit: '20-25678901-3', telefono: '03464-15234567', email: 'jcmartinez@gmail.com', direccion: 'San Martín 456, San Justo', condicionIva: 'Monotributista', estado: 'activo' },
  { id: 3, razonSocial: 'Semillas del Litoral S.R.L.', cuit: '30-68901234-5', telefono: '03498-422100', email: 'ventas@semillaslitoral.com', direccion: 'Av. Belgrano 1200, Reconquista', condicionIva: 'Responsable Inscripto', estado: 'activo' },
  { id: 4, razonSocial: 'María Elena Pérez', cuit: '27-31234567-9', telefono: '0342-15445566', email: 'mariaperez@hotmail.com', direccion: 'Urquiza 890, Santa Fe', condicionIva: 'Consumidor Final', estado: 'inactivo' },
  { id: 5, razonSocial: 'Cooperativa Agraria Santa Rosa', cuit: '30-55432100-1', telefono: '03492-420500', email: 'admin@coop-santarosa.com.ar', direccion: 'Pellegrini 300, Rafaela', condicionIva: 'Exento', estado: 'activo' },
]

export const MOCK_PRODUCTOS = [
  { id: 1, nombre: 'Pallet de tirantes fresado', sku: 'PAL-TIR-FRE', categoria: 'Tirantes Fresados', costo: 0, precio: 0, stock: 0, stockMinimo: 10, estado: 'activo', tipoCarga: 'bolsas, big bag, cajas', uso: 'rack, estanco', tipoMadera: 'Pino eliotis / Eucaliptus Saligna', dimensiones: 'Según requerimiento', entrada: '4 lados' },
  { id: 2, nombre: 'Pallet de base perimetral (UK)', sku: 'PAL-BASE-UK', categoria: 'Base Perimetral', costo: 0, precio: 0, stock: 0, stockMinimo: 10, estado: 'activo', tipoCarga: 'bolsas, big bag, cajas, cajones', uso: 'rack, estanco, apilable', tipoMadera: 'Pino eliotis / Eucaliptus Saligna', dimensiones: 'Según requerimiento', entrada: '4 lados' },
  { id: 3, nombre: 'Pallet normalizado ARLOG', sku: 'PAL-ARLOG', categoria: 'ARLOG', costo: 0, precio: 0, stock: 0, stockMinimo: 10, estado: 'activo', tipoCarga: 'Múltiple con valor de recambio en el mercado', uso: 'rack, estanco', tipoMadera: 'Pino eliotis / Eucaliptus Saligna', dimensiones: '1000 x 1200', entrada: '4 lados' },
  { id: 4, nombre: 'Pallet de tirantes', sku: 'PAL-TIRANTES', categoria: 'Tirantes', costo: 0, precio: 0, stock: 0, stockMinimo: 10, estado: 'activo', tipoCarga: 'bolsas, big bag, cajas, cajones', uso: 'rack, estanco, apilable', tipoMadera: 'Pino eliotis / Eucaliptus Saligna', dimensiones: 'Según requerimiento', entrada: '2 lados' },
  { id: 5, nombre: 'Pallet descartable', sku: 'PAL-DESC', categoria: 'Descartable', costo: 0, precio: 0, stock: 0, stockMinimo: 10, estado: 'activo', tipoCarga: 'Livianas', uso: 'rack, estanco, apilable', tipoMadera: 'Pino eliotis / Eucaliptus Saligna', dimensiones: 'Según requerimiento', entrada: '4 lados' },
  { id: 6, nombre: 'Pallet de pino para exportación leche en polvo', sku: 'PAL-EXP-LECHE', categoria: 'Exportación', costo: 0, precio: 0, stock: 0, stockMinimo: 10, estado: 'activo', tipoCarga: 'bolsas, big bag, cajas', uso: 'rack, estanco, apilable', tipoMadera: 'Pino eliotis seco de horno 24% humedad', dimensiones: 'Según requerimiento', entrada: '2 lados' },
]

export const MOCK_REMITOS_COMPRA = [
  { id: 1, numero: 'RC-2025-001', proveedor: 'Madereras del Norte S.A.', fecha: '2025-01-10', items: [{ productoId: 1, producto: 'Pallet de tirantes fresado', cantidad: 200, precioUnitario: 3500 }, { productoId: 3, producto: 'Pallet normalizado ARLOG', cantidad: 100, precioUnitario: 4200 }], total: 1120000, estado: 'recibido' },
  { id: 2, numero: 'RC-2025-002', proveedor: 'Aserradero San Jorge S.R.L.', fecha: '2025-01-15', items: [{ productoId: 2, producto: 'Pallet de base perimetral (UK)', cantidad: 150, precioUnitario: 3800 }], total: 570000, estado: 'recibido' },
  { id: 3, numero: 'RC-2025-003', proveedor: 'Madereras del Norte S.A.', fecha: '2025-02-01', items: [{ productoId: 4, producto: 'Pallet de tirantes', cantidad: 300, precioUnitario: 2900 }, { productoId: 5, producto: 'Pallet descartable', cantidad: 200, precioUnitario: 1800 }], total: 1230000, estado: 'recibido' },
]

export const MOCK_REMITOS_VENTA = [
  { id: 1, numero: 'RV-2025-001', clienteId: 1, cliente: 'Agropecuaria Los Alamos S.A.', fecha: '2025-01-20', items: [{ productoId: 1, producto: 'Pallet de tirantes fresado', cantidad: 100, precioUnitario: 4800 }, { productoId: 3, producto: 'Pallet normalizado ARLOG', cantidad: 50, precioUnitario: 5500 }], total: 755000, estado: 'entregado' },
  { id: 2, numero: 'RV-2025-002', clienteId: 3, cliente: 'Semillas del Litoral S.R.L.', fecha: '2025-02-05', items: [{ productoId: 6, producto: 'Pallet de pino para exportación leche en polvo', cantidad: 80, precioUnitario: 6200 }], total: 496000, estado: 'entregado' },
]

export const MOCK_FACTURAS = [
  { id: 1, numero: 'FAC-A-0001-00000001', clienteId: 1, cliente: 'Agropecuaria Los Alamos S.A.', fecha: '2025-01-20', tipo: 'A', items: [{ productoId: 1, producto: 'Pallet de tirantes fresado', cantidad: 100, precioUnitario: 4800 }], subtotal: 480000, iva: 100800, total: 580800, estado: 'emitida', remitoId: 1 },
  { id: 2, numero: 'FAC-A-0001-00000002', clienteId: 3, cliente: 'Semillas del Litoral S.R.L.', fecha: '2025-02-05', tipo: 'A', items: [{ productoId: 6, producto: 'Pallet de pino para exportación leche en polvo', cantidad: 80, precioUnitario: 6200 }], subtotal: 496000, iva: 104160, total: 600160, estado: 'emitida', remitoId: 2 },
  { id: 3, numero: 'FAC-B-0001-00000001', clienteId: 2, cliente: 'Juan Carlos Martínez', fecha: '2025-02-10', tipo: 'B', items: [{ productoId: 4, producto: 'Pallet de tirantes', cantidad: 50, precioUnitario: 3800 }], subtotal: 190000, iva: 0, total: 190000, estado: 'pendiente', remitoId: null },
]

export const MOCK_RECIBOS = [
  { id: 1, numero: 'REC-2025-001', clienteId: 1, cliente: 'Agropecuaria Los Alamos S.A.', fecha: '2025-01-25', monto: 70180, concepto: 'Pago Factura FAC-A-0001-00000001', formaPago: 'Transferencia', facturaId: 1 },
  { id: 2, numero: 'REC-2025-002', clienteId: 3, cliente: 'Semillas del Litoral S.R.L.', fecha: '2025-02-10', monto: 50000, concepto: 'Pago parcial Factura FAC-A-0001-00000002', formaPago: 'Cheque', facturaId: 2 },
]

export const MOCK_CUENTAS = [
  { id: 1, nombre: 'Caja Principal', tipo: 'Caja', saldo: 125000, estado: 'activa' },
  { id: 2, nombre: 'Banco Nación - CTA CTE', tipo: 'Banco', saldo: 850000, estado: 'activa' },
  { id: 3, nombre: 'Banco Galicia - Caja de Ahorro', tipo: 'Banco', saldo: 320000, estado: 'activa' },
  { id: 4, nombre: 'Cuenta Proveedores', tipo: 'Proveedores', saldo: -248000, estado: 'activa' },
]

export const MOCK_MOVIMIENTOS_CUENTAS = [
  { id: 1, cuentaId: 1, fecha: '2025-02-05', descripcion: 'Cobro cliente Semillas del Litoral', tipo: 'ingreso', monto: 50000 },
  { id: 2, cuentaId: 2, fecha: '2025-02-01', descripcion: 'Pago proveedor AgriMax', tipo: 'egreso', monto: 361000 },
  { id: 3, cuentaId: 1, fecha: '2025-01-25', descripcion: 'Pago Agropecuaria Los Alamos', tipo: 'ingreso', monto: 70180 },
  { id: 4, cuentaId: 3, fecha: '2025-01-15', descripcion: 'Compra semillas del Norte', tipo: 'egreso', monto: 128000 },
]

export const CONDICIONES_IVA = ['Responsable Inscripto', 'Monotributista', 'Exento', 'Consumidor Final', 'No Responsable']
export const TIPOS_CUENTA = ['Caja', 'Banco', 'Proveedores', 'Clientes']
export const FORMAS_PAGO = ['Efectivo', 'Transferencia', 'Cheque', 'Tarjeta de Débito', 'Tarjeta de Crédito']
export const CATEGORIAS_PRODUCTO = ['Tirantes Fresados', 'Base Perimetral', 'ARLOG', 'Tirantes', 'Descartable', 'Exportación', 'Otros']
