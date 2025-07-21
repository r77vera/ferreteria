const { Usuario, Empleado, TipoEmpleado, sequelize } = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const md5 = require('md5'); // Para hashear la contraseña con MD5

// Get all users with their employee and role details
exports.getAllUsers = async (req, res) => {
  try {
    const users = await Usuario.findAll({
      include: [{
        model: Empleado,
        as: 'empleado',
        include: [{
          model: TipoEmpleado,
          as: 'tipoEmpleado'
        }]
      }]
    });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Error fetching users' });
  }
};

// Create a new user and associated employee
exports.createUser = async (req, res) => {
  const { nombre, apellido, dni, contrasena, idTipoEmpleado } = req.body;
  const t = await sequelize.transaction();
  try {
    const hashedPassword = md5(contrasena);

    const newEmpleado = await Empleado.create({
      idEmpleado: dni, // Use DNI as employee ID
      nombreEmpleado: nombre,
      apellidoEmpleado: apellido,
      idTipoEmpleado,
      estado: 1, // Default to active
      fecha_registro: new Date(),
      fecha_edicion: new Date(),
    }, { transaction: t });

    const newUser = await Usuario.create({
      Usuario: newEmpleado.idEmpleado, // Correctly use the employee ID for the foreign key
      Contraseña: hashedPassword,
    }, { transaction: t });

    await t.commit();
    const createdUser = await Usuario.findByPk(newUser.id, {
        include: [{ model: Empleado, as: 'empleado', include: [{ model: TipoEmpleado, as: 'tipoEmpleado' }] }]
    });
    res.status(201).json(createdUser);
  } catch (error) {
    await t.rollback();
    if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({ error: 'El DNI o el nombre de usuario ya existen.' });
    }
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Error al crear el usuario.' });
  }
};

// Update a user's details
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, usuario, contrasena, idTipoEmpleado } = req.body;
  const t = await sequelize.transaction();
  try {
    const userToUpdate = await Usuario.findByPk(id, { include: [{ model: Empleado, as: 'empleado' }] });
    if (!userToUpdate) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updateData = {
      nombreEmpleado: nombre,
      apellidoEmpleado: apellido,
      idTipoEmpleado,
      fecha_edicion: new Date()
    };

    await userToUpdate.empleado.update(updateData, { transaction: t });

    const userUpdateData = { Usuario: usuario };
    if (contrasena) {
        userUpdateData.Contraseña = md5(contrasena);
    }

    await userToUpdate.update(userUpdateData, { transaction: t });

    await t.commit();
    const updatedUser = await Usuario.findByPk(id, {
        include: [{ model: Empleado, as: 'empleado', include: [{ model: TipoEmpleado, as: 'tipoEmpleado' }] }]
    });
    res.json(updatedUser);
  } catch (error) {
    await t.rollback();
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Error updating user' });
  }
};

// Toggle user status (activate/deactivate)
exports.toggleUserStatus = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await Usuario.findByPk(id, { include: [{ model: Empleado, as: 'empleado' }] });
    if (!user || !user.empleado) {
      return res.status(404).json({ error: 'User not found' });
    }
    const newStatus = user.empleado.estado === 1 ? 0 : 1;
    await user.empleado.update({ estado: newStatus, fecha_edicion: new Date() });
    res.json({ message: `User status updated to ${newStatus}` });
  } catch (error) {
    console.error('Error toggling user status:', error);
    res.status(500).json({ error: 'Error toggling user status' });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  const t = await sequelize.transaction();
  try {
    const user = await Usuario.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    // First delete the user, then the employee
    await user.destroy({ transaction: t });
    await Empleado.destroy({ where: { idEmpleado: user.id }, transaction: t });

    await t.commit();
    res.status(204).send();
  } catch (error) {
    await t.rollback();
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Error deleting user' });
  }
};
