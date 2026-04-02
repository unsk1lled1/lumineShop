import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Sparkles, AlertTriangle } from 'lucide-react';

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.username.trim()) return setError('Введите имя пользователя');
    if (form.username.length < 3) return setError('Имя пользователя минимум 3 символа');
    if (!form.email.trim()) return setError('Введите email');
    if (!/\S+@\S+\.\S+/.test(form.email)) return setError('Некорректный email');
    if (!form.password) return setError('Введите пароль');
    if (form.password.length < 6) return setError('Пароль минимум 6 символов');
    if (form.password !== form.confirm) return setError('Пароли не совпадают');

    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', {
        username: form.username,
        email: form.email,
        password: form.password,
      });

      login(data.token, data.user);
      toast.success('Аккаунт создан успешно!');
      navigate('/catalog');
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Sparkles size={32} /></div>
          <h1 className="auth-title">Регистрация</h1>
          <p className="auth-subtitle">Создай свой аккаунт LumineStore</p>
        </div>

        <form id="register-form" className="auth-form" onSubmit={handleSubmit} noValidate>
          {error && (
            <div className="error-message">
              <span style={{display: 'flex', alignItems: 'center'}}><AlertTriangle size={16} /></span> {error}
            </div>
          )}

          <div className="field-group">
            <label className="input-label" htmlFor="reg-username">Имя пользователя</label>
            <input
              id="reg-username"
              className="input"
              type="text"
              name="username"
              placeholder="GenshinPlayer"
              value={form.username}
              onChange={handleChange}
              autoComplete="username"
            />
          </div>

          <div className="field-group">
            <label className="input-label" htmlFor="reg-email">Email</label>
            <input
              id="reg-email"
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
            <label className="input-label" htmlFor="reg-password">Пароль</label>
            <input
              id="reg-password"
              className="input"
              type="password"
              name="password"
              placeholder="Минимум 6 символов"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
            />
          </div>
          <div className="field-group">
            <label className="input-label" htmlFor="reg-confirm">Подтвердить пароль</label>
            <input
              id="reg-confirm"
              className="input"
              type="password"
              name="confirm"
              placeholder="Повтори пароль"
              value={form.confirm}
              onChange={handleChange}
              autoComplete="new-password"
            />
          </div>

          <button
            id="register-submit"
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', marginTop: '4px' }}
          >
            {loading ? 'Создание...' : 'Создать аккаунт'}
          </button>
        </form>

        <div className="auth-footer">
          Уже есть аккаунт?{' '}
          <Link to="/login">Войти</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
