import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Package, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  Archive // Icon for Tipos de Producto
} from 'lucide-react';
import './Dashboard.css';
import ProductosView from './views/ProductosView';
import SalesView from './views/SalesView';
import UsersView from './views/UsersView';
import UserProfileView from './views/UserProfileView';
import ReportsView from './views/ReportsView';
import MarcasView from './views/MarcasView';
import SettingsView from './views/SettingsView';
import TiposProductoView from './views/TiposProductoView'; // Import the new view
import PedidosView from './views/PedidosView';
import Sidebar from './Sidebar';
import { getDashboardStats } from '../services/dashboardService';
import SalesChart from './SalesChart';
import TopProductsTable from './TopProductsTable';
import LowStockTable from './LowStockTable';
import TopClientsTable from './TopClientsTable';

const Dashboard = ({ user, onLogout }) => {
  const [activeView, setActiveView] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [errorStats, setErrorStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoadingStats(true);
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        setErrorStats('Error al cargar las estadísticas');
        console.error(error);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, []);

  // Solo para el header, no para el sidebar
  const menuItems = [
    { id: 'perfil', label: 'Perfil' },
    { id: 'admin', label: 'Administración' },
    { id: 'usuarios', label: 'Usuarios' },
    { id: 'tipoproducto', label: 'Tipo de Producto' },
    { id: 'marcas', label: 'Marcas' },
    { id: 'productos', label: 'Productos' },
    { id: 'pedidos', label: 'Órdenes' },
    { id: 'reportes', label: 'Reportes' },
    { id: 'settings', label: 'Configuración' }
  ];

  const renderActiveView = () => {
    switch (activeView) {
      case 'perfil':
        return <UserProfileView user={user} />;
      case 'admin':
        return <HomeView user={user} stats={stats} loading={loadingStats} error={errorStats} />;
      case 'usuarios':
        return <UsersView />;
      case 'tipoproducto':
        return <TiposProductoView />;
      case 'marcas':
        return <MarcasView/>;
      case 'productos':
        return <ProductosView />;
      case 'pedidos':
        return <PedidosView />;
      case 'reportes':
        return <ReportsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <HomeView user={user} stats={stats} loading={loadingStats} error={errorStats} />;
    }
  };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <Sidebar
        user={user}
        activeView={activeView}
        setActiveView={setActiveView}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onLogout={onLogout}
      />

      {/* Main Content */}
      <main className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        {/* Header */}
        <header className="main-header">
          <div className="header-left">
            <button 
              className="sidebar-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu size={24} />
            </button>
            <h1 className="page-title">
              {menuItems.find(item => item.id === activeView)?.label || 'Dashboard'}
            </h1>
          </div>


        </header>

        {/* Content Area */}
        <div className="content-area">
          {renderActiveView()}
        </div>
      </main>

      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

// Home View Component
const HomeView = ({ user, stats, loading, error }) => {
    if (loading) {
    return <div>Cargando estadísticas...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  const displayStats = [
    { label: 'Productos', value: stats?.totalProducts || 0, color: 'blue' },
    { label: 'Total Ventas', value: `S/. ${(stats?.totalSales || 0).toFixed(2)}`, color: 'green' },
    { label: 'Clientes', value: stats?.totalClients || 0, color: 'purple' },
    { label: 'Pedidos', value: stats?.totalOrders || 0, color: 'orange' },
  ];

  return (
    <div className="home-view">
      <div className="welcome-section">
        <h2>¡Bienvenido, {user.user.nombre}!</h2>
        <p>Aquí tienes un resumen de tu ferretería</p>
      </div>

            <div className="stats-grid">
        {displayStats.map((stat, index) => (
          <div key={index} className={`stat-card ${stat.color}`}>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
            
          </div>
        ))}
      </div>

      <div className="dashboard-widgets">
        <div className="widget full-width-widget">
          <h3>Resumen de Ventas (Últimos 12 Meses)</h3>
          {stats?.monthlySales && stats.monthlySales.length > 0 ? (
            <SalesChart data={stats.monthlySales} />
          ) : (
            <p>No hay datos de ventas para mostrar en el gráfico.</p>
          )}
        </div>
        <div className="widget full-width-widget">
          <h3>Los 10 productos más vendidos</h3>
          <TopProductsTable data={stats?.topProducts} />
        </div>
        <div className="widget">
          <h3>Productos con Poco Stock</h3>
          <LowStockTable data={stats?.lowStockProducts} />
        </div>
        <div className="widget">
          <h3>Los 10 Clientes más recurrentes</h3>
          <TopClientsTable data={stats?.topClients} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
