import { useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import api from '../../api/axios';
import { LayoutDashboard, FolderOpen, Plus, Users } from 'lucide-react';

const AdminLayout = () => {
  const [stats, setStats] = useState({ accounts: 0, users: 0, requests: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [accRes, usersRes] = await Promise.all([
          api.get('/accounts?limit=1'),
          api.get('/users'),
        ]);
        setStats({
          accounts: accRes.data.total,
          users: usersRes.data.length,
        });
      } catch { /* ignore */ }
    };
    fetchStats();
  }, []);

  return (
    <div className="admin-layout">
      {/* Сайдбар */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-title">Навигация</div>
        <ul className="admin-nav">
          <li>
            <NavLink to="/admin" end>
              <span style={{display: 'flex', alignItems: 'center'}}><LayoutDashboard size={18} /></span> Дашборд
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/accounts">
              <span style={{display: 'flex', alignItems: 'center'}}><FolderOpen size={18} /></span> Лоты
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/accounts/create">
              <span style={{display: 'flex', alignItems: 'center'}}><Plus size={18} /></span> Добавить лот
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/users">
              <span style={{display: 'flex', alignItems: 'center'}}><Users size={18} /></span> Пользователи
            </NavLink>
          </li>
        </ul>
      </aside>

      {/* Основной контент */}
      <main className="admin-main">
        <Outlet context={{ stats }} />
      </main>
    </div>
  );
};

export default AdminLayout;
