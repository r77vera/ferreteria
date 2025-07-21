const db = require('../models'); // Usando modelos de Sequelize
const jwt = require('jsonwebtoken');
const md5 = require('md5'); // Para hashear la contraseña con MD5
require('dotenv').config(); // Para cargar variables de entorno como JWT_SECRET

exports.login = async (req, res) => {
  const { usuario, password } = req.body;

  // Validar que los campos no estén vacíos
  if (!usuario || !password) {
    return res.status(400).json({ error: 'Campos vacíos' });
  }

  try {
    // Hashear la contraseña con MD5 (como en el PHP)
    const hashedPassword = md5(password);

    // Consultar el usuario con Sequelize incluyendo datos del empleado
    const usuarioEncontrado = await db.Usuario.findOne({
      where: {
        Usuario: usuario,
        Contraseña: hashedPassword
      },
      include: [{
        model: db.Empleado,
        as: 'empleado',
        include: [{
          model: db.TipoEmpleado,
          as: 'tipoEmpleado'
        }]
      }]
    });

    // Verificar si se encontró el usuario
    if (!usuarioEncontrado) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }

    // Verificar si se encontraron datos del empleado
    if (!usuarioEncontrado.empleado) {
      return res.status(401).json({ error: 'Acceso denegado' });
    }

    const empleado = usuarioEncontrado.empleado;
    const tipoEmpleado = empleado.tipoEmpleado?.nombreTipoEmpleado;
    const idTipoEmpleado = empleado.idTipoEmpleado;
    const estadoEmpleado = empleado.estado; // Estado del EMPLEADO
    console.log('empleado', empleado)
    // Verificar si el empleado está habilitado (debe ser '1')
    if (estadoEmpleado !== 1) {
      return res.status(403).json({ error: 'Empleado inhabilitado' });
    }

    // Generar el token JWT (solo con el id del usuario para mayor seguridad)
    const token = jwt.sign(
      { idUsuario: empleado.idEmpleado, usuario: usuario },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    // Preparar los datos del usuario para enviar en la respuesta
    const userData = {
      DNI: empleado.idEmpleado,
      nombre: empleado.nombreEmpleado,
      apellido: empleado.apellidoEmpleado,
      imagen: empleado.imagen,
      idEmpleado: empleado.idEmpleado,
      idTipoEmpleado: idTipoEmpleado,
      tipoEmpleado: tipoEmpleado,
      fechaIngreso: empleado.fecha_registro,
    };

    // Determinar la página de redirección basada en el tipo de empleado
    let redirectUrl;
    if (idTipoEmpleado === '001' || idTipoEmpleado === '000') {
      redirectUrl = '/views/administrador';
    } else if (idTipoEmpleado === '002') {
      redirectUrl = '/views/vendedor';
    } else if (idTipoEmpleado === '003') {
      redirectUrl = '/views/cajero';
    } else {
      redirectUrl = '/';
    }

    // Enviar la respuesta con el token, los datos del usuario y la URL de redirección
    res.json({
      token,
      user: userData,
      redirectUrl,
      message: 'Login exitoso',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en el servidor', details: err.message });
  }
};

/**
 * Logout - Invalidar token JWT
 * En una implementación completa, se mantendría una blacklist de tokens
 */
exports.logout = async (req, res) => {
  try {
    // En una implementación real, aquí se agregaría el token a una blacklist
    // Por ahora, simplemente confirmamos el logout
    res.json({
      message: 'Logout exitoso',
      note: 'Token invalidado del lado del cliente'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en el servidor', details: err.message });
  }
};

/**
 * Verificar token - Validar si un token JWT es válido
 */
exports.verifyToken = async (req, res) => {
  try {
    // El middleware authenticateToken ya validó el token
    // Si llegamos aquí, el token es válido
    res.json({
      valid: true,
      user: req.user,
      message: 'Token válido'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en el servidor', details: err.message });
  }
};

/**
 * Renovar token - Generar un nuevo token JWT
 */
exports.refreshToken = async (req, res) => {
  try {
    // El middleware authenticateToken ya validó el token actual
    const usuario = req.user.usuario;
    const idUsuario = req.user.empleado.idEmpleado;
    
    // Generar nuevo token con tiempo extendido
    const newToken = jwt.sign(
      { idUsuario: idUsuario, usuario: usuario },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );
    
    res.json({
      token: newToken,
      user: req.user,
      message: 'Token renovado exitosamente',
      expiresIn: '8h'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en el servidor', details: err.message });
  }
};

/**
 * Obtener perfil del usuario autenticado
 */
exports.getProfile = async (req, res) => {
  try {
    // Obtener información completa del usuario autenticado
    const usuario = await db.Usuario.findOne({
      where: { Usuario: req.user.usuario },
      include: [{
        model: db.Empleado,
        as: 'empleado',
        include: [{
          model: db.TipoEmpleado,
          as: 'tipoEmpleado'
        }]
      }]
    });
    
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    // Preparar datos del perfil (sin contraseña)
    const perfil = {
      usuario: usuario.Usuario,
      empleado: {
        idEmpleado: usuario.empleado.idEmpleado,
        nombreEmpleado: usuario.empleado.nombreEmpleado,
        apellidoEmpleado: usuario.empleado.apellidoEmpleado,
        imagen: usuario.empleado.imagen,
        estado: usuario.empleado.estado,
        fecha_registro: usuario.empleado.fecha_registro,
        fecha_edicion: usuario.empleado.fecha_edicion,
        tipoEmpleado: {
          idTipoEmpleado: usuario.empleado.tipoEmpleado.idTipoEmpleado,
          nombreTipoEmpleado: usuario.empleado.tipoEmpleado.nombreTipoEmpleado
        }
      }
    };
    
    res.json({
      profile: perfil,
      message: 'Perfil obtenido exitosamente'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en el servidor', details: err.message });
  }
};

/**
 * Cambiar contraseña del usuario autenticado
 */
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Contraseña actual y nueva son requeridas' });
    }
    
    // Verificar contraseña actual
    const hashedCurrentPassword = md5(currentPassword);
    const usuario = await db.Usuario.findOne({
      where: { 
        Usuario: req.user.usuario,
        Contraseña: hashedCurrentPassword
      }
    });
    
    if (!usuario) {
      return res.status(400).json({ error: 'Contraseña actual incorrecta' });
    }
    
    // Actualizar con nueva contraseña
    const hashedNewPassword = md5(newPassword);
    await db.Usuario.update(
      { Contraseña: hashedNewPassword },
      { where: { Usuario: req.user.usuario } }
    );
    
    res.json({
      message: 'Contraseña cambiada exitosamente'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en el servidor', details: err.message });
  }
};