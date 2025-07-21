const { TipoProducto, sequelize } = require('../models');

// Get all product types
exports.getAllTiposProducto = async (req, res) => {
  try {
    const tiposProducto = await TipoProducto.findAll();
    res.json(tiposProducto);
  } catch (error) {
    console.error('Error fetching product types:', error);
    res.status(500).json({ error: 'Error fetching product types' });
  }
};

// Get a single product type by ID
exports.getTipoProductoById = async (req, res) => {
  try {
    const { id } = req.params;
    const tipoProducto = await TipoProducto.findByPk(id);
    if (!tipoProducto) {
      return res.status(404).json({ error: 'Product type not found' });
    }
    res.json(tipoProducto);
  } catch (error) {
    console.error('Error fetching product type:', error);
    res.status(500).json({ error: 'Error fetching product type' });
  }
};

// Create a new product type
exports.createTipoProducto = async (req, res) => {
  const { nombretipoProducto } = req.body;
  try {
    if (!nombretipoProducto) {
      return res.status(400).json({ error: 'El nombre del tipo de producto es requerido.' });
    }

    // Find the highest current ID and increment it
    const lastTipo = await TipoProducto.findOne({
      order: [['idTipoProducto', 'DESC']]
    });
    let newId = 1;
    if (lastTipo && !isNaN(parseInt(lastTipo.idTipoProducto, 10))) {
      newId = parseInt(lastTipo.idTipoProducto, 10) + 1;
    }

    const newTipoProducto = await TipoProducto.create({
      idTipoProducto: newId,
      nombretipoProducto
    });
    res.status(201).json(newTipoProducto);
  } catch (error) {
    console.error('Error creating product type:', error);
    res.status(400).json({ error: 'Error al crear el tipo de producto', details: error.message });
  }
};

// Update a product type
exports.updateTipoProducto = async (req, res) => {
  const { id } = req.params;
  const { nombretipoProducto } = req.body;
  try {
    if (!nombretipoProducto) {
      return res.status(400).json({ error: 'El nombre del tipo de producto es requerido.' });
    }
    const tipoProducto = await TipoProducto.findByPk(id);
    if (!tipoProducto) {
      return res.status(404).json({ error: 'Product type not found' });
    }
    tipoProducto.nombretipoProducto = nombretipoProducto;
    await tipoProducto.save();
    res.json(tipoProducto);
  } catch (error) {
    console.error('Error updating product type:', error);
    res.status(400).json({ error: 'Error al actualizar el tipo de producto', details: error.message });
  }
};

// Delete a product type
exports.deleteTipoProducto = async (req, res) => {
  const { id } = req.params;
  try {
    const tipoProducto = await TipoProducto.findByPk(id);
    if (!tipoProducto) {
      return res.status(404).json({ error: 'Product type not found' });
    }
    await tipoProducto.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting product type:', error);
    res.status(500).json({ error: 'Error deleting product type' });
  }
};
