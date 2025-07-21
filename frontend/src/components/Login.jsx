import React, { useState } from 'react';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import './Login.css';
import avatarSvg from '../assets/avatar.svg'; // tu logo o imagen
import { login as loginService } from '../services/authService';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({ usuario: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      if (formData.usuario && formData.password) {
        const data = await loginService(formData.usuario, formData.password);
        // Guarda el token y los datos de usuario según tu lógica
        localStorage.setItem('token', data.token);
        onLogin({ usuario: formData.usuario, role: data.role, ...data });
      } else {
        setError('Por favor, complete todos los campos');
      }
    } catch (err) {
      setError(err?.error || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="logo-container">
          <img src={avatarSvg} alt="Logo empresa" />
        </div>

        <h1 className="login-title">Ferreteria</h1>
        <p className="login-subtitle">Gestión de Ferretería</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-block">
            <label>Usuario</label>
            <input
              type="text"
              name="usuario"
              value={formData.usuario}
              onChange={handleChange}
              placeholder="Ingrese su usuario"
              autoComplete="username"
              required
            />
          </div>

          <div className="input-block">
            <label>Contraseña</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="eye-button"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && <div className="login-error">{error}</div>}

          <button className="login-submit" type="submit" disabled={isLoading}>
            {isLoading ? 'Cargando...' : <><LogIn size={18} /> Iniciar sesión</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
