const { Producto } = require('../models');

// Obtener todos los productos
exports.getAllProductos = async (req, res) => {
  try {
    const productos = await Producto.findAll();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
};

// Obtener un producto por ID
exports.getProductoById = async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(producto);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
};

// Crear un nuevo producto
exports.createProducto = async (req, res) => {
  try {
    const nuevoProducto = await Producto.create(req.body);
    res.status(201).json(nuevoProducto);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear el producto' });
  }
};

// Actualizar un producto
exports.updateProducto = async (req, res) => {
  try {
    const [updated] = await Producto.update(req.body, {
      where: { idProducto: req.params.id }
    });
    if (!updated) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    const productoActualizado = await Producto.findByPk(req.params.id);
    res.json(productoActualizado);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar el producto' });
  }
};

// Eliminar un producto
exports.deleteProducto = async (req, res) => {
  try {
    const deleted = await Producto.destroy({
      where: { idProducto: req.params.id }
    });
    if (!deleted) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
};
