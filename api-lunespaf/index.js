require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Rutas JWT (autenticación tradicional)
const productosRouter = require('./routes/productos');
const marcasRouter = require('./routes/marcas');
const tiposProductoRouter = require('./routes/tiposProducto');
// const usuariosRouter = require('./routes/usuarios');
const authRouter = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const userRoutes = require('./routes/usuarios');
const pedidosRoutes = require('./routes/pedidosRoutes');

const app = express();

// Configuración CORS para aplicaciones Vite
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:8080'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas JWT (autenticación tradicional)
app.use('/api/productos', productosRouter);
app.use('/api/marcas', marcasRouter);
app.use('/api/tipos-producto', tiposProductoRouter);
// app.use('/api/usuarios', usuariosRouter);
app.use('/api/auth', authRouter);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/users', userRoutes);
app.use('/api/pedidos', pedidosRoutes);
// app.use('/api/ventas', require('./routes/ventas'));
// app.use('/api/tickets', require('./routes/tickets'));
// app.use('/api/detalles-venta', require('./routes/detallesVenta'));
// app.use('/api/perfiles', require('./routes/perfiles'));
// app.use('/api/reportes', require('./routes/reportes'));

// Swagger docs
app.use('/api-docs', (req, res) => {
  res.sendFile(__dirname + '/swagger.json');
});

// Manejo básico de errores
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: 'Error interno del servidor',
    message: err.message || 'Algo salió mal'
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API LUNESPAF corriendo en puerto ${PORT}`);
});
