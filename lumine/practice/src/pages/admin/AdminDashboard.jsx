import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { LayoutDashboard, FolderOpen, CheckCircle, Tag, Users, Plus, Eye } from 'lucide-react';
const AdminDashboard = () => {
  const [stats, setStats] = useState({ accounts: 0, active: 0, sold: 0, users: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [accAll, usersRes] = await Promise.all([
          api.get('/accounts?limit=1000'),
          api.get('/users'),
        ]);
        const accounts = accAll.data.accounts;
        setStats({
          accounts: accAll.data.total,
          active: accounts.filter((a) => a.status === 'active').length,
          sold: accounts.filter((a) => a.status === 'sold').length,
          users: usersRes.data.length,
        });
      } catch { /* ignore */ }
      finally { setLoading(false); }
    };
    fetchStats();
  }, []);

  const cards = [
    { icon: <FolderOpen size={24} />, label: 'Всего лотов', value: stats.accounts, color: 'var(--color-primary-light)' },
    { icon: <CheckCircle size={24} />, label: 'Активных', value: stats.active, color: 'var(--color-success)' },
    { icon: <Tag size={24} />, label: 'Продано', value: stats.sold, color: 'var(--color-gold)' },
    { icon: <Users size={24} />, label: 'Пользователей', value: stats.users, color: 'var(--color-secondary)' },
  ];

  return (
    <div>
      <h1 className="admin-page-title" style={{display: 'flex', alignItems: 'center', gap: '8px'}}><LayoutDashboard size={28} /> Дашборд</h1>

      <div className="admin-stats">
        {cards.map((c) => (
          <div className="admin-stat-card" key={c.label}>
            <div className="admin-stat-icon">{c.icon}</div>
            <div className="admin-stat-value" style={{ color: c.color }}>
              {loading ? '...' : c.value}
            </div>
            <div className="admin-stat-label">{c.label}</div>
          </div>
        ))}
      </div>

      <div
        style={{
          background: 'rgba(139,92,246,0.06)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          marginTop: '8px',
        }}
      >
        <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px', color: 'var(--color-text)' }}>
          Быстрые действия
        </h2>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <a href="/admin/accounts/create" className="btn btn-primary btn-sm" style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
            <Plus size={16} /> Добавить аккаунт
          </a>
          <a href="/admin/accounts" className="btn btn-outline btn-sm" style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
            <FolderOpen size={16} /> Все аккаунты
          </a>
          <a href="/admin/users" className="btn btn-outline btn-sm" style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
            <Users size={16} /> Пользователи
          </a>
          <a href="/catalog" className="btn btn-ghost btn-sm" target="_blank" style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
            <Eye size={16} /> Открыть сайт
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
