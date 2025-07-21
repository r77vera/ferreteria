const { MarcaProducto: Marca } = require('../models');

// Obtener todas las marcas
exports.getAllMarcas = async (req, res) => {
  try {
    const marcas = await Marca.findAll();
    res.json(marcas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las marcas' });
  }
};

// Obtener una marca por ID
exports.getMarcaById = async (req, res) => {
  try {
    const marca = await Marca.findByPk(req.params.id);
    if (!marca) {
      return res.status(404).json({ error: 'Marca no encontrada' });
    }
    res.json(marca);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la marca' });
  }
};

// Crear una nueva marca
exports.createMarca = async (req, res) => {
  const { nombreMarca } = req.body;
  try {
    if (!nombreMarca) {
      return res.status(400).json({ error: 'El nombre de la marca es requerido.' });
    }
    const nuevaMarca = await Marca.create({ nombreMarca });
    res.status(201).json(nuevaMarca);
  } catch (error) {
    console.error('Error creating brand:', error);
    res.status(400).json({ error: 'Error al crear la marca', details: error.message });
  }
};

// Actualizar una marca
exports.updateMarca = async (req, res) => {
  const { id } = req.params;
  const { nombreMarca } = req.body;
  try {
    if (!nombreMarca) {
      return res.status(400).json({ error: 'El nombre de la marca es requerido.' });
    }
    const marca = await Marca.findByPk(id);
    if (!marca) {
      return res.status(404).json({ error: 'Marca no encontrada' });
    }
    marca.nombreMarca = nombreMarca;
    await marca.save();
    res.json(marca);
  } catch (error) {
    console.error('Error updating brand:', error);
    res.status(400).json({ error: 'Error al actualizar la marca', details: error.message });
  }
};

// Eliminar una marca
exports.deleteMarca = async (req, res) => {
  try {
    const deleted = await Marca.destroy({
      where: { idMarca: req.params.id }
    });
    if (!deleted) {
      return res.status(404).json({ error: 'Marca no encontrada' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la marca' });
  }
};
