const { Cliente } = require('../models');
const { Op } = require('sequelize');

// Obtener clientes. Si se pasa ?dni=XXXX devuelve uno, sino lista paginada/opcional
exports.getClientes = async (req, res) => {
  try {
    const { dni, page = 1, limit = 10, search = '' } = req.query;

    // Buscar por DNI directo
    if (dni) {
      let cliente = await Cliente.findByPk(dni);
      // Si no existe en BD intentar API externa
      if (!cliente) {
        try {
          const token = process.env.API_PERU_TOKEN || '8aec577ec41f90a15ac61417ade5c76da96603b94916cd7b65215afdd9612d36';
          const { data: apiRes } = await require('axios').get(`https://apiperu.dev/api/dni/${dni}?api_token=${token}`);
          if (apiRes?.success && apiRes.data) {
            cliente = {
              id_Cliente: dni,
              nombreCliente: apiRes.data.nombres,
              apellidoCliente: `${apiRes.data.apellido_paterno} ${apiRes.data.apellido_materno}`,
            };
          }
        } catch (err) {
          console.error('Error llamando API externa DNI:', err.message);
        }
      }
      return res.json(cliente || null);
    }

    // Filtro opcional por nombre/apellido
    const offset = (page - 1) * limit;
    const where = search
      ? {
          [Op.or]: [
            { nombreCliente: { [Op.like]: `%${search}%` } },
            { apellidoCliente: { [Op.like]: `%${search}%` } },
          ],
        }
      : {};

    const { rows, count } = await Cliente.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['id_Cliente', 'ASC']],
    });

    return res.json({ total: count, clientes: rows });
  } catch (error) {
    console.error('Error obteniendo clientes:', error);
    return res.status(500).json({ error: 'Error al obtener clientes' });
  }
};
