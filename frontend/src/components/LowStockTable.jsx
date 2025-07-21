import React from 'react';

const LowStockTable = ({ data }) => {
  if (!data || data.length === 0) {
    return <p>Todos los productos tienen stock suficiente.</p>;
  }

  return (
    <div className="custom-table-container">
      <table className="custom-table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Stock Actual</th>
            <th>Mín. Stock</th>
          </tr>
        </thead>
        <tbody>
          {data.map((product, index) => (
            <tr key={index}>
              <td>{product.nombreProducto}</td>
              <td>{product.stock}</td>
              <td>{product.precioMinimo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LowStockTable;
