import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Sparkles, AlertTriangle } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email.trim()) return setError('Введите email');
    if (!form.password) return setError('Введите пароль');

    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);

      login(data.token, data.user);

      toast.success(`Добро пожаловать, ${data.user.username}!`);
      navigate(data.user.role === 'admin' ? '/admin' : '/catalog');
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка входа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Sparkles size={32} /></div>
          <h1 className="auth-title">Вход в аккаунт</h1>
          <p className="auth-subtitle">Введи свои данные</p>
        </div>

        <form id="login-form" className="auth-form" onSubmit={handleSubmit} noValidate>
          {error && (
            <div className="error-message">
              <span style={{display: 'flex', alignItems: 'center'}}><AlertTriangle size={16} /></span> {error}
            </div>
          )}

          <div className="field-group">
            <label className="input-label" htmlFor="login-email">Email</label>
            <input
              id="login-email"
              className="input"
              type="email"
              name="email"
              placeholder="example@mail.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
            />
          </div>

          <div className="field-group">
            <label className="input-label" htmlFor="login-password">Пароль</label>
            <input
              id="login-password"
              className="input"
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
          </div>

          <button
            id="login-submit"
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', marginTop: '4px' }}
          >
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>

        <div className="auth-footer">
          Нет аккаунта?{' '}
          <Link to="/register">Зарегистрироваться</Link>
        </div>
        <div
          style={{
            marginTop: '20px',
            padding: '12px 16px',
            background: 'rgba(139,92,246,0.06)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            fontSize: '12px',
            color: 'var(--color-text-faint)',
          }}
        >
        </div>
      </div>
    </div>
  );
};

export default Login;
