import React, { useState } from 'react';
import { BarChart3, TrendingUp, Download, Calendar } from 'lucide-react';
import './ViewsStyles.css';

const ReportsView = () => {
  const [dateRange, setDateRange] = useState({
    start: '2024-01-01',
    end: '2024-01-31'
  });

  const reportData = {
    totalSales: 15420.50,
    totalOrders: 156,
    topProducts: [
      { name: 'Martillo Stanley', sales: 45, revenue: 1169.55 },
      { name: 'Tornillos Phillips', sales: 200, revenue: 30.00 },
      { name: 'Taladro Inalámbrico', sales: 12, revenue: 1079.88 }
    ],
    dailySales: [
      { date: '2024-01-15', sales: 850.00 },
      { date: '2024-01-16', sales: 1200.00 },
      { date: '2024-01-17', sales: 950.00 }
    ]
  };

  return (
    <div className="reports-view">
      <div className="reports-header">
        <div className="date-range">
          <Calendar size={20} />
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
          />
          <span>hasta</span>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
          />
        </div>
        <button className="export-btn">
          <Download size={20} />
          Exportar Reporte
        </button>
      </div>

      <div className="reports-grid">
        <div className="report-card">
          <div className="card-header">
            <h3>Ventas Totales</h3>
            <TrendingUp size={24} />
          </div>
          <div className="card-value">${reportData.totalSales.toFixed(2)}</div>
          <div className="card-change">+12% vs mes anterior</div>
        </div>

        <div className="report-card">
          <div className="card-header">
            <h3>Órdenes Totales</h3>
            <BarChart3 size={24} />
          </div>
          <div className="card-value">{reportData.totalOrders}</div>
          <div className="card-change">+8% vs mes anterior</div>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-card">
          <h3>Productos Más Vendidos</h3>
          <div className="products-list">
            {reportData.topProducts.map((product, index) => (
              <div key={index} className="product-item">
                <span className="product-name">{product.name}</span>
                <span className="product-sales">{product.sales} unidades</span>
                <span className="product-revenue">${product.revenue.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsView;
