import React, { useState, useEffect, useCallback } from "react";
import { getPedidos, getPedidoPDF } from "../../services/pedidosService";
import Spinner from "../common/Spinner";
import DetallePedidoModal from "./DetallePedidoModal"; // Crearemos este componente después
import { FaFilePdf } from "react-icons/fa";
import "./PedidosView.css"; // Importamos los estilos dedicados para la vista de pedidos

const PedidosView = () => {
  const [pedidos, setPedidos] = useState([]);
  // Obtener info de usuario almacenada tras login
  const users = JSON.parse(localStorage.getItem("lunespaf_user") || "{}"); 

  console.log('xx',users)
  const idUsuario = users.user?.idEmpleado;
  const idTipoEmpleado = users.user?.idTipoEmpleado;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPedidos, setTotalPedidos] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pedidosPerPage] = useState(10);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const fetchPedidos = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getPedidos(
        currentPage,
        pedidosPerPage,
        fechaInicio || null,
        fechaFin || null,
        idTipoEmpleado === "002" ? idUsuario : undefined
      );
      setPedidos(data.pedidos);
      setTotalPedidos(data.total);
    } catch (err) {
      console.error("Error fetching pedidos:", err);
      setError("No se pudieron cargar los pedidos.");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pedidosPerPage, fechaInicio, fechaFin]);

  useEffect(() => {
    fetchPedidos();
  }, [fetchPedidos]);

  const handleVerDetalle = (pedido) => {
    setSelectedPedido(pedido);
    setIsModalOpen(true);
  };

  const handleDownloadPDF = async (idPedido) => {
    try {
      const pdfBlob = await getPedidoPDF(idPedido);
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `pedido-${idPedido}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Error downloading PDF:", err);
      setError("No se pudo descargar el PDF.");
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchPedidos();
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="users-view-container">
      <div className="toolbar">
        <div className="date-filters">
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
          />
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
          />
          <button onClick={handleSearch} className="btn-search">
            Buscar
          </button>
        </div>
      </div>

      {isLoading ? (
        <Spinner />
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <>
          {pedidos.length === 0 ? (
            <p className="no-results-message">
              No se encontraron pedidos para el rango de fechas seleccionado.
            </p>
          ) : (
            <>
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Nro Boleta</th>
                    <th>Fecha</th>
                    <th>Cliente</th>
                    <th>Total</th>
                    <th>Método de Pago</th>
                    <th>Ver Detalle</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidos.map((pedido) => (
                    <tr key={pedido.idPedido}>
                      <td>{pedido.Correlativo}</td>
                      <td>{new Date(pedido.Fecha).toLocaleDateString()}</td>
                      <td>{`${pedido.cliente.nombreCliente} ${pedido.cliente.apellidoCliente}`}</td>
                      <td>S/ {parseFloat(pedido.Total).toFixed(2)}</td>
                      <td>{pedido.metodoPago}</td>
                      <td className="actions-cell">
                        <button
                          onClick={() => handleVerDetalle(pedido)}
                          className="btn-view"
                        >
                          Ver Detalle
                        </button>
                        <button
                          onClick={() => handleDownloadPDF(pedido.idPedido)}
                          className="btn-icon"
                        >
                          <FaFilePdf size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="pagination-controls">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Anterior
                </button>
                <span>
                  Página {currentPage} de{" "}
                  {Math.ceil(totalPedidos / pedidosPerPage)}
                </span>
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={
                    currentPage === Math.ceil(totalPedidos / pedidosPerPage)
                  }
                >
                  Siguiente
                </button>
              </div>
            </>
          )}
        </>
      )}

      {isModalOpen && (
        <DetallePedidoModal
          pedido={selectedPedido}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default PedidosView;
