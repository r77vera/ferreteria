const jwt = require('jsonwebtoken');
const db = require('../models');
require('dotenv').config();

/**
 * Middleware de autenticación JWT
 * Verifica que el token JWT sea válido y extrae la información del usuario
 */
const authenticateToken = async (req, res, next) => {
  try {
    // Obtener token del header Authorization
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        error: 'Token de acceso requerido',
        message: 'No se proporcionó token de autenticación'
      });
    }

    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Buscar el usuario en la base de datos para verificar que aún existe y está activo
    const usuario = await db.Usuario.findOne({
      where: { Usuario: decoded.usuario },
      include: [{
        model: db.Empleado,
        as: 'empleado',
        include: [{
          model: db.TipoEmpleado,
          as: 'tipoEmpleado'
        }]
      }]
    });

    if (!usuario || !usuario.empleado) {
      return res.status(401).json({ 
        error: 'Usuario no válido',
        message: 'El usuario asociado al token no existe o está inactivo'
      });
    }

    // Verificar que el empleado esté activo
    if (usuario.empleado.estado !== 1) {
      return res.status(401).json({ 
        error: 'Usuario inhabilitado',
        message: 'El usuario está deshabilitado'
      });
    }

    // Agregar información del usuario a la request
    req.user = {
      idUsuario: decoded.idUsuario,
      usuario: decoded.usuario,
      empleado: {
        idEmpleado: usuario.empleado.idEmpleado,
        nombreEmpleado: usuario.empleado.nombreEmpleado,
        apellidoEmpleado: usuario.empleado.apellidoEmpleado,
        idTipoEmpleado: usuario.empleado.idTipoEmpleado,
        tipoEmpleado: usuario.empleado.tipoEmpleado?.nombreTipoEmpleado,
        estado: usuario.empleado.estado
      }
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: 'Token inválido',
        message: 'El token proporcionado no es válido'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Token expirado',
        message: 'El token ha expirado, por favor inicia sesión nuevamente'
      });
    }

    console.error('Error en autenticación:', error);
    return res.status(500).json({ 
      error: 'Error interno del servidor',
      message: 'Error al verificar la autenticación'
    });
  }
};

/**
 * Middleware de autorización por roles
 * Verifica que el usuario tenga uno de los roles permitidos
 * @param {Array} allowedRoles - Array de IDs de tipos de empleado permitidos
 */
const authorizeRoles = (allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ 
          error: 'No autenticado',
          message: 'Debe estar autenticado para acceder a este recurso'
        });
      }

      const userRole = req.user.empleado.idTipoEmpleado;
      
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({ 
          error: 'Acceso denegado',
          message: `No tiene permisos para acceder a este recurso. Rol requerido: ${allowedRoles.join(', ')}`
        });
      }

      next();
    } catch (error) {
      console.error('Error en autorización:', error);
      return res.status(500).json({ 
        error: 'Error interno del servidor',
        message: 'Error al verificar los permisos'
      });
    }
  };
};

/**
 * Middleware opcional de autenticación
 * Extrae información del usuario si hay token, pero no requiere autenticación
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const usuario = await db.Usuario.findOne({
          where: { Usuario: decoded.usuario },
          include: [{
            model: db.Empleado,
            as: 'empleado',
            include: [{
              model: db.TipoEmpleado,
              as: 'tipoEmpleado'
            }]
          }]
        });

        if (usuario && usuario.empleado && usuario.empleado.estado === 1) {
          req.user = {
            idUsuario: decoded.idUsuario,
            usuario: decoded.usuario,
            empleado: {
              idEmpleado: usuario.empleado.idEmpleado,
              nombreEmpleado: usuario.empleado.nombreEmpleado,
              apellidoEmpleado: usuario.empleado.apellidoEmpleado,
              idTipoEmpleado: usuario.empleado.idTipoEmpleado,
              tipoEmpleado: usuario.empleado.tipoEmpleado?.nombreTipoEmpleado,
              estado: usuario.empleado.estado
            }
          };
        }
      } catch (error) {
        // Si hay error con el token, simplemente continúa sin usuario
        console.log('Token opcional inválido:', error.message);
      }
    }

    next();
  } catch (error) {
    console.error('Error en autenticación opcional:', error);
    next(); // Continúa sin usuario en caso de error
  }
};

module.exports = {
  authenticateToken,
  authorizeRoles,
  optionalAuth
};
