import React from 'react';

const TopClientsTable = ({ data }) => {
  if (!data || data.length === 0) {
    return <p>No hay datos de clientes para mostrar.</p>;
  }

  return (
    <div className="custom-table-container">
      <table className="custom-table">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>frecuencia</th>
          </tr>
        </thead>
        <tbody>
          {data.map((client, index) => (
            <tr key={index}>
              <td>{`${client.nombreCliente} ${client.apellidoCliente}`}</td>
              <td>{client.orderCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TopClientsTable;
