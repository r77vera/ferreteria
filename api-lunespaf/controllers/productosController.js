const { Producto, MarcaProducto, TipoProducto } = require('../models');
const { Op } = require('sequelize');

// Obtener todos los productos
exports.getAllProductos = async (req, res) => {
  try {
    const { search, page = 1, limit = 10, marcaId, tipoId } = req.query;
    const offset = (page - 1) * limit;

    let where = {};
    if (search) {
      where[Op.or] = [
        { nombreProducto: { [Op.like]: `%${search}%` } },
        { descripciónProducto: { [Op.like]: `%${search}%` } }
      ];
    }

    if (marcaId) {
      where.idMarca = marcaId;
    }

    if (tipoId) {
      where.idTipoProducto = tipoId;
    }

    const { count, rows } = await Producto.findAndCountAll({
      where,
      include: [
        { model: MarcaProducto, as: 'marca' },
        { model: TipoProducto, as: 'tipoProducto' }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['idProducto', 'ASC']]
    });

    res.json({ total: count, productos: rows });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
};

// Obtener un producto por ID
exports.getProductoById = async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id, {
      include: [
        { model: MarcaProducto, as: 'marca' },
        { model: TipoProducto, as: 'tipoProducto' }
      ]
    });
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
    const {
      idMarca,
      idTipoProducto,
      nombreProducto,
      descripciónProducto,
      precioCompra,
      stock,
      precioNormal,
      precioMinimo,
      precioPaquete
    } = req.body;

    const productData = {
      idMarca,
      idTipoProducto,
      nombreProducto,
      descripciónProducto,
      precioCompra,
      stock,
      precioNormal,
      precioMinimo: precioMinimo === null ? undefined : precioMinimo,
      precioPaquete: precioPaquete === null ? undefined : precioPaquete
    };

    const nuevoProducto = await Producto.create(productData);
    res.status(201).json(nuevoProducto);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(400).json({ error: 'Error al crear el producto', details: error.message });
  }
};

// Actualizar un producto
exports.updateProducto = async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const {
      idMarca,
      idTipoProducto,
      nombreProducto,
      descripciónProducto,
      precioCompra,
      stock,
      precioNormal,
      precioMinimo,
      precioPaquete
    } = req.body;

    const productData = {
      idMarca,
      idTipoProducto,
      nombreProducto,
      descripciónProducto,
      precioCompra,
      stock,
      precioNormal,
      precioMinimo: precioMinimo === null ? undefined : precioMinimo,
      precioPaquete: precioPaquete === null ? undefined : precioPaquete
    };

    await producto.update(productData);

    res.json(producto);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(400).json({ error: 'Error al actualizar el producto', details: error.message });
  }
};

// Actualizar solo el stock de un producto
exports.addStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { cantidad } = req.body;

    if (typeof cantidad !== 'number' || !Number.isInteger(cantidad)) {
        return res.status(400).json({ error: 'La cantidad debe ser un número entero.' });
    }

    const producto = await Producto.findByPk(id);
    if (!producto) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }

    producto.stock += cantidad;
    await producto.save();

    res.json({ message: 'Stock actualizado correctamente', producto });
  } catch (error) {
    console.error('Error adding stock:', error);
    res.status(500).json({ error: 'Error al actualizar el stock', details: error.message });
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
