import React, { useState } from 'react';
import { Settings, User, Lock, Bell, Database } from 'lucide-react';
import './ViewsStyles.css';

const SettingsView = () => {
  const [settings, setSettings] = useState({
    companyName: 'LUNESPAF',
    email: 'admin@lunespaf.com',
    notifications: true,
    autoBackup: true,
    theme: 'light'
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="settings-view">
      <div className="settings-sections">
        <div className="settings-card">
          <div className="card-header">
            <User size={24} />
            <h3>Información de la Empresa</h3>
          </div>
          <div className="settings-form">
            <div className="form-group">
              <label>Nombre de la Empresa</label>
              <input
                type="text"
                value={settings.companyName}
                onChange={(e) => handleSettingChange('companyName', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => handleSettingChange('email', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="settings-card">
          <div className="card-header">
            <Bell size={24} />
            <h3>Notificaciones</h3>
          </div>
          <div className="settings-form">
            <div className="toggle-group">
              <label>Notificaciones Push</label>
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => handleSettingChange('notifications', e.target.checked)}
              />
            </div>
          </div>
        </div>

        <div className="settings-card">
          <div className="card-header">
            <Database size={24} />
            <h3>Sistema</h3>
          </div>
          <div className="settings-form">
            <div className="toggle-group">
              <label>Respaldo Automático</label>
              <input
                type="checkbox"
                checked={settings.autoBackup}
                onChange={(e) => handleSettingChange('autoBackup', e.target.checked)}
              />
            </div>
            <div className="form-group">
              <label>Tema</label>
              <select
                value={settings.theme}
                onChange={(e) => handleSettingChange('theme', e.target.value)}
              >
                <option value="light">Claro</option>
                <option value="dark">Oscuro</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="settings-actions">
        <button className="save-settings-btn">
          Guardar Configuración
        </button>
      </div>
    </div>
  );
};

export default SettingsView;
