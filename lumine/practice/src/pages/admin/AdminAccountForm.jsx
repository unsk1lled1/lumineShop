import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import Loader from '../../components/Loader';
import { Pencil, Plus, AlertTriangle, Gem, FileText, FileImage, Settings } from 'lucide-react';

const DENOMINATIONS = [6000, 6400, 33500, 47000, 55000, 60000];
const SERVERS = ['Asia', 'Europe', 'America', 'TW/HK/MO'];

const EMPTY_FORM = {
  denomination: 6000,
  title: '',
  primogems: '',
  wishes: '',
  price: '',
  server: 'Asia',
  credentials: '',
  description: '',
  images: '',
  status: 'active',
};

const makeSuggestedTitle = (primogems, wishes, server) => {
  if (!primogems || !wishes) return '';
  const p = Number(primogems).toLocaleString('ru-RU');
  return `${p} ПРИМОГЕМОВ | ${wishes} КРУТОК · ${server}`;
};

const AdminAccountForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;

    const fetchAccount = async () => {
      try {
        const { data } = await api.get(`/accounts/${id}`);
        setForm({
          denomination: data.denomination,
          title: data.title,
          primogems: data.primogems,
          wishes: data.wishes,
          price: data.price,
          server: data.server,
          credentials: data.credentials ? data.credentials.join('\n') : '',
          description: data.description,
          images: data.images.join('\n'),
          status: data.status,
        });
      } catch {
        toast.error('Лот не найден');
        navigate('/admin/accounts');
      } finally {
        setLoading(false);
      }
    };
    fetchAccount();
  }, [id, isEdit, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const updated = { ...prev, [name]: value };

      if (['primogems', 'wishes', 'server'].includes(name) && !isEdit) {
        const p = name === 'primogems' ? value : updated.primogems;
        const w = name === 'wishes' ? value : updated.wishes;
        const s = name === 'server' ? value : updated.server;
        updated.title = makeSuggestedTitle(p, w, s);
      }
      return updated;
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) return setError('Введите название');
    if (!form.primogems || Number(form.primogems) <= 0) return setError('Введите количество примогемов');
    if (!form.price || Number(form.price) <= 0) return setError('Введите корректную цену');
    if (!form.credentials || form.credentials.trim() === '') return setError('Введите хотя бы один логин:пароль');

    setSaving(true);
    try {
      const payload = {
        denomination: Number(form.denomination),
        title: form.title.trim(),
        primogems: Number(form.primogems),
        wishes: Number(form.wishes) || 0,
        price: Number(form.price),
        server: form.server,
        credentials: form.credentials.split('\n').map(c => c.trim()).filter(Boolean),
        description: form.description.trim(),
        images: form.images.split('\n').map((u) => u.trim()).filter(Boolean),
        status: form.status,
      };

      if (isEdit) {
        await api.put(`/accounts/${id}`, payload);
        toast.success('Лот обновлён');
      } else {
        await api.post('/accounts', payload);
        toast.success('Лот добавлен');
      }
      navigate('/admin/accounts');
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <Link to="/admin/accounts" style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>← Назад</Link>
        <h1 className="admin-page-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isEdit ? <><Pencil size={24}/> Редактировать лот</> : <><Plus size={24}/> Создать лот</>}
        </h1>
      </div>

      <form id="account-form" className="admin-form" onSubmit={handleSubmit} noValidate>
        {error && <div className="error-message"><span style={{display: 'flex', alignItems: 'center'}}><AlertTriangle size={16}/></span> {error}</div>}

        <div className="form-section-title" style={{display: 'flex', alignItems: 'center', gap: '6px'}}><Gem size={18}/> Номинал и примогемы</div>

        <div className="form-row">
          <div className="field-group">
            <label className="input-label" htmlFor="acc-denomination">Номинал *</label>
            <select id="acc-denomination" className="input" name="denomination" value={form.denomination} onChange={handleChange}>
              {DENOMINATIONS.map((d) => (
                <option key={d} value={d}>{d.toLocaleString('ru-RU')} примогемов</option>
              ))}
            </select>
          </div>
          <div className="field-group">
            <label className="input-label" htmlFor="acc-server">Сервер *</label>
            <select id="acc-server" className="input" name="server" value={form.server} onChange={handleChange}>
              {SERVERS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="field-group">
            <label className="input-label" htmlFor="acc-primogems">Точное кол-во примогемов *</label>
            <input id="acc-primogems" className="input" type="number" name="primogems" placeholder="56500" value={form.primogems} onChange={handleChange} min="0" />
          </div>
          <div className="field-group">
            <label className="input-label" htmlFor="acc-wishes">Количество круток</label>
            <input id="acc-wishes" className="input" type="number" name="wishes" placeholder="200" value={form.wishes} onChange={handleChange} min="0" />
          </div>
        </div>

        <div className="form-section-title" style={{display: 'flex', alignItems: 'center', gap: '6px'}}><FileText size={18}/> Основное</div>

        <div className="field-group">
          <label className="input-label" htmlFor="acc-title">
            Название лота *
            <span style={{ fontSize: '11px', color: 'var(--color-text-faint)', marginLeft: '8px' }}>
              (заполняется автоматически)
            </span>
          </label>
          <input
            id="acc-title"
            className="input"
            type="text"
            name="title"
            placeholder="56.500 ПРИМОГЕМОВ | 200 КРУТОК · Asia"
            value={form.title}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <div className="field-group">
            <label className="input-label" htmlFor="acc-price">Цена ($) *</label>
            <input id="acc-price" className="input" type="number" name="price" placeholder="20" value={form.price} onChange={handleChange} min="0" />
          </div>
        </div>

        <div className="field-group">
          <label className="input-label" htmlFor="acc-credentials">
            Пулы Логинов/Паролей (каждый с новой строки в формате login:pass) *
          </label>
          <textarea
            id="acc-credentials"
            className="input"
            name="credentials"
            placeholder={"user1@mail.com:pass123\nuser2@mail.com:pass456"}
            value={form.credentials}
            onChange={handleChange}
            rows={5}
            required
          />
          <span style={{ fontSize: '12px', color: 'var(--color-primary-light)' }}>
            Текущий сток (в наличии): {form.credentials ? form.credentials.split('\n').map(c => c.trim()).filter(Boolean).length : 0} шт.
          </span>
        </div>
        <div className="form-section-title" style={{display: 'flex', alignItems: 'center', gap: '6px'}}><FileImage size={18}/> Контент</div>

        <div className="field-group">
          <label className="input-label" htmlFor="acc-desc">Описание</label>
          <textarea id="acc-desc" className="input" name="description" placeholder="Описание лота..." value={form.description} onChange={handleChange} rows={3} />
        </div>

        <div className="field-group">
          <label className="input-label" htmlFor="acc-images">URL изображений (каждый с новой строки)</label>
          <textarea id="acc-images" className="input" name="images" placeholder="https://example.com/screenshot.jpg" value={form.images} onChange={handleChange} rows={3} />
        </div>

        <div className="form-section-title" style={{display: 'flex', alignItems: 'center', gap: '6px'}}><Settings size={18}/> Статус</div>

        <div className="field-group" style={{ maxWidth: '240px' }}>
          <label className="input-label" htmlFor="acc-status">Статус</label>
          <select id="acc-status" className="input" name="status" value={form.status} onChange={handleChange}>
            <option value="active">Активен</option>
            <option value="sold">Продан</option>
            <option value="hidden">Скрыт</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '12px', paddingTop: '8px' }}>
          <button id="account-form-submit" type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Сохранение...' : (isEdit ? 'Сохранить изменения' : 'Создать лот')}
          </button>
          <Link to="/admin/accounts" className="btn btn-ghost">Отмена</Link>
        </div>
      </form>
    </div>
  );
};

export default AdminAccountForm;
