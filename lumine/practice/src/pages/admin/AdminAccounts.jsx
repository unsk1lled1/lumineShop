import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import Loader from '../../components/Loader';
import { FolderOpen, Package, Plus, Gem, Sparkles, Pencil, Trash2 } from 'lucide-react';

const formatNum = (n) => n?.toLocaleString('ru-RU') ?? '0';
const formatPrice = (p) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(p);

const STATUS_LABELS = { active: 'Активен', sold: 'Продан', hidden: 'Скрыт' };

const AdminAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusChanging, setStatusChanging] = useState(null);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/accounts?limit=100');
      setAccounts(data.accounts);
    } catch {
      toast.error('Ошибка загрузки лотов');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAccounts(); }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Удалить лот "${title}"?`)) return;
    try {
      await api.delete(`/accounts/${id}`);
      setAccounts((prev) => prev.filter((a) => a._id !== id));
      toast.success('Лот удалён');
    } catch {
      toast.error('Ошибка удаления');
    }
  };

  const handleStatusChange = async (id, status) => {
    setStatusChanging(id);
    try {
      const { data } = await api.patch(`/accounts/${id}/status`, { status });
      setAccounts((prev) => prev.map((a) => (a._id === id ? data : a)));
      toast.success('Статус обновлён');
    } catch {
      toast.error('Ошибка обновления статуса');
    } finally {
      setStatusChanging(null);
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="table-header">
        <h1 className="admin-page-title" style={{display: 'flex', alignItems: 'center', gap: '8px'}}><FolderOpen size={28} /> Лоты</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/admin/stock" className="btn btn-outline btn-sm" style={{display: 'flex', alignItems: 'center', gap: '6px'}}><Package size={16} /> Управление стоком</Link>
          <Link to="/admin/accounts/create" className="btn btn-primary btn-sm" style={{display: 'flex', alignItems: 'center', gap: '6px'}}><Plus size={16} /> Добавить лот</Link>
        </div>
      </div>

      <div className="data-table-wrap">
        {accounts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}><FolderOpen size={48} /></div>
            <div className="empty-state-title">Лотов нет</div>
            <Link to="/admin/accounts/create" className="btn btn-primary" style={{ marginTop: '16px' }}>
              Добавить первый
            </Link>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Название</th>
                <th>Номинал</th>
                <th>Примогемы</th>
                <th>Круток</th>
                <th>Цена</th>
                <th>Сервер</th>
                <th>Сток</th>
                <th>Статус</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((acc) => (
                <tr key={acc._id}>
                  <td style={{ maxWidth: '200px' }}>
                    <div style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '13px' }}>
                      {acc.title}
                    </div>
                  </td>
                  <td>
                    <span style={{ color: 'var(--color-primary-light)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Gem size={14} /> {formatNum(acc.denomination)}
                    </span>
                  </td>
                  <td style={{ color: 'var(--color-gold)', fontWeight: 700 }}>{formatNum(acc.primogems)}</td>
                  <td style={{ display: 'flex', alignItems: 'center', gap: '4px', height: '100%' }}><Sparkles size={14} /> {acc.wishes}</td>
                  <td style={{ fontWeight: 700 }}>{formatPrice(acc.price)}</td>
                  <td>{acc.server}</td>
                  <td>
                    <span style={{
                      color: acc.stock === 0 ? 'var(--color-danger)' : acc.stock <= 3 ? 'var(--color-warning)' : 'var(--color-success)',
                      fontWeight: 700,
                    }}>
                      {acc.stock} шт.
                    </span>
                  </td>
                  <td>
                    <select
                      className="input"
                      style={{ padding: '4px 8px', fontSize: '12px', width: 'auto' }}
                      value={acc.status}
                      onChange={(e) => handleStatusChange(acc._id, e.target.value)}
                      disabled={statusChanging === acc._id}
                    >
                      {Object.entries(STATUS_LABELS).map(([val, label]) => (
                        <option key={val} value={val}>{label}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <div className="table-actions">
                      <Link to={`/admin/accounts/${acc._id}/edit`} className="btn btn-ghost btn-sm" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Pencil size={16} /></Link>
                      <button className="btn btn-danger btn-sm" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}} onClick={() => handleDelete(acc._id, acc.title)}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminAccounts;
