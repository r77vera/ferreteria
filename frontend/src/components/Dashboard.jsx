import React, { useState } from 'react';
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
  Search
} from 'lucide-react';
import './Dashboard.css';
import ProductsView from './views/ProductsView';
import SalesView from './views/SalesView';
import UsersView from './views/UsersView';
import UserProfileView from './views/UserProfileView';
import ReportsView from './views/ReportsView';
import SettingsView from './views/SettingsView';
import Sidebar from './Sidebar';

const Dashboard = ({ user, onLogout }) => {
  const [activeView, setActiveView] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Solo para el header, no para el sidebar
  const menuItems = [
    { id: 'perfil', label: 'Perfil' },
    { id: 'admin', label: 'Administración' },
    { id: 'usuarios', label: 'Usuarios' },
    { id: 'tipoproducto', label: 'Tipo de Producto' },
    { id: 'marcas', label: 'Marcas' },
    { id: 'productos', label: 'Productos' },
    { id: 'ventas', label: 'Ordenes' },
    { id: 'reportes', label: 'Reportes' },
    { id: 'settings', label: 'Configuración' }
  ];

  const renderActiveView = () => {
    switch (activeView) {
      case 'perfil':
        return <UserProfileView user={user} />;
      case 'admin':
        return <div>Administración</div>;
      case 'usuarios':
        return <UsersView />;
      case 'tipoproducto':
        return <div>Tipo de Producto</div>;
      case 'marcas':
        return <div>Marcas</div>;
      case 'productos':
        return <ProductsView />;
      case 'ventas':
        return <SalesView />;
      case 'reportes':
        return <ReportsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <HomeView user={user} />;
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

          <div className="header-right">
            <div className="search-box">
              <Search size={20} />
              <input type="text" placeholder="Buscar..." />
            </div>
            <button className="notification-btn">
              <Bell size={20} />
              <span className="notification-badge">3</span>
            </button>
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
const HomeView = ({ user }) => {
  const stats = [
    { label: 'Productos', value: '1,234', change: '+12%', color: 'blue' },
    { label: 'Ventas Hoy', value: '$2,456', change: '+8%', color: 'green' },
    { label: 'Clientes', value: '567', change: '+5%', color: 'purple' },
    { label: 'Pedidos', value: '89', change: '+15%', color: 'orange' },
  ];

  return (
    <div className="home-view">
      <div className="welcome-section">
        <h2>¡Bienvenido, {user.usuario}!</h2>
        <p>Aquí tienes un resumen de tu ferretería</p>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className={`stat-card ${stat.color}`}>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
            <div className="stat-change">{stat.change}</div>
          </div>
        ))}
      </div>

      <div className="dashboard-widgets">
        <div className="widget">
          <h3>Ventas Recientes</h3>
          <div className="recent-sales">
            <div className="sale-item">
              <span>Martillo Stanley</span>
              <span>$25.99</span>
            </div>
            <div className="sale-item">
              <span>Tornillos x100</span>
              <span>$12.50</span>
            </div>
            <div className="sale-item">
              <span>Taladro Bosch</span>
              <span>$89.99</span>
            </div>
          </div>
        </div>

        <div className="widget">
          <h3>Productos con Poco Stock</h3>
          <div className="low-stock">
            <div className="stock-item">
              <span>Clavos 2"</span>
              <span className="stock-level low">5 unidades</span>
            </div>
            <div className="stock-item">
              <span>Pintura Blanca</span>
              <span className="stock-level low">3 galones</span>
            </div>
            <div className="stock-item">
              <span>Cable Eléctrico</span>
              <span className="stock-level low">2 rollos</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
