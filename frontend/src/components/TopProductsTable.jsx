import React from 'react';

const TopProductsTable = ({ data }) => {
  if (!data || data.length === 0) {
    return <p>No hay datos de productos para mostrar.</p>;
  }

  return (
    <div className="top-products-table-container">
      <table className="top-products-table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Ventas</th>
          </tr>
        </thead>
        <tbody>
          {data.map((product, index) => (
            <tr key={index}>
                            <td>{product.producto.nombreProducto}</td>
              <td>{product.totalQuantity}</td>
              <td>S/. {parseFloat(product.totalRevenue).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TopProductsTable;
