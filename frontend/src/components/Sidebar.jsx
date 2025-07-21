// Mejorado Sidebar + Dashboard UI completo
// Sidebar.js
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import {
  Home,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  LogOut,
  User as UserIcon,
  Shield,
  Layers,
  Tag,
  ClipboardList,
  UserCircle,
  FileText,
  X
} from 'lucide-react';
import './Dashboard.css';

const MENU_STRUCTURE = [
  {
    id: 'perfil',
    label: 'Perfil',
    icon: UserIcon,
    roles: ['Super Admin', 'Administrador', 'Vendedor'],
    children: [
      { id: 'perfil', label: 'Perfil', icon: UserCircle, roles: ['Super Admin', 'Administrador', 'Vendedor'] }
    ]
  },
  {
    id: 'admin',
    label: 'Administración',
    icon: Shield,
    roles: ['Super Admin', 'Administrador'],
    children: [
      { id: 'admin', label: 'Administración', icon: Shield, roles: ['Super Admin', 'Administrador'] }
    ]
  },
  {
    id: 'tablas',
    label: 'Tablas',
    icon: Layers,
    roles: ['Super Admin', 'Administrador'],
    children: [
      { id: 'usuarios', label: 'Usuarios', icon: Users, roles: ['Super Admin', 'Administrador'] },
      { id: 'tipoproducto', label: 'Tipo de Producto', icon: ClipboardList, roles: ['Super Admin', 'Administrador'] },
      { id: 'marcas', label: 'Marcas', icon: Tag, roles: ['Super Admin', 'Administrador'] },
      { id: 'productos', label: 'Productos', icon: Package, roles: ['Super Admin', 'Administrador'] }
    ]
  },
  {
    id: 'orden',
    label: 'Orden',
    icon: ShoppingCart,
    roles: ['Super Admin', 'Administrador', 'Vendedor'],
    children: [
      { id: 'ventas', label: 'Ordenes', icon: ShoppingCart, roles: ['Super Admin', 'Administrador', 'Vendedor'] }
    ]
  },
  {
    id: 'reportes',
    label: 'Reportes',
    icon: BarChart3,
    roles: ['Super Admin', 'Administrador'],
    children: [
      { id: 'reportes', label: 'Reportes', icon: FileText, roles: ['Super Admin', 'Administrador'] }
    ]
  },
  {
    id: 'settings',
    label: 'Configuración',
    icon: Settings,
    roles: ['Super Admin', 'Administrador'],
    children: [
      { id: 'settings', label: 'Configuración', icon: Settings, roles: ['Super Admin', 'Administrador'] }
    ]
  }
];

function Sidebar({ user, activeView, setActiveView, sidebarOpen, setSidebarOpen, onLogout }) {
  const role = user?.user?.tipoEmpleado;
  const [openMenuId, setOpenMenuId] = useState(null);
  console.log(user)
    const handleToggleMenu = (menuId) => {
    setOpenMenuId(openMenuId === menuId ? null : menuId);
  };

  const handleLogout = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Estás a punto de cerrar la sesión.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        onLogout();
      }
    });
  };

  const renderMenu = () => {
    return MENU_STRUCTURE.filter(menu => menu.roles.includes(role)).map(menu => (
      <div key={menu.id} className="sidebar-menu-group">
        <button
          className={`nav-item nav-parent${openMenuId === menu.id ? ' open' : ''}`}
          type="button"
          onClick={() => handleToggleMenu(menu.id)}
        >
          <menu.icon size={20} />
          <span>{menu.label}</span>
          <span className="submenu-arrow" style={{ marginLeft: 'auto' }}>{menu.children ? (openMenuId === menu.id ? '▼' : '►') : null}</span>
        </button>
        {menu.children && openMenuId === menu.id && (
          <div className="sidebar-submenu">
            {menu.children.filter(child => child.roles.includes(role)).map(child => (
              <button
                key={child.id}
                className={`nav-item sidebar-subitem ${activeView === child.id ? 'active' : ''}`}
                onClick={() => {
                  setActiveView(child.id);
                  setSidebarOpen(false);
                }}
              >
                <child.icon size={18} />
                <span>{child.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    ));
  };

  return (
    <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
  <h2>FERRETERIA</h2>
  <button className="sidebar-toggle" onClick={() => setSidebarOpen(false)}>
    <X size={24} />
  </button>
</div>
      <nav className="sidebar-nav">
        {renderMenu()}
      </nav>
      <div className="sidebar-footer">
        <div className="user-info">
  <div className="user-details">
    <span className="user-name">{user?.user.nombre}</span>
    <span className="user-lastname">{user?.user.apellido}</span>
  </div>
</div>
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
