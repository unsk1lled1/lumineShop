import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import Loader from '../../components/Loader';
import { useAuth } from '../../context/AuthContext';
import { Users, User, Crown, Trash2 } from 'lucide-react';

const AdminUsers = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/users');
      setUsers(data);
    } catch {
      toast.error('Ошибка загрузки пользователей');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id, username) => {
    if (id === currentUser._id) {
      toast.error('Нельзя удалить себя');
      return;
    }
    if (!window.confirm(`Удалить пользователя "${username}"?`)) return;
    try {
      await api.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      toast.success('Пользователь удалён');
    } catch {
      toast.error('Ошибка удаления');
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="admin-page-title" style={{display: 'flex', alignItems: 'center', gap: '8px'}}><Users size={28}/> Пользователи</h1>

      <div className="data-table-wrap">
        {users.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}><User size={48}/></div>
            <div className="empty-state-title">Пользователей нет</div>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Имя</th>
                <th>Email</th>
                <th>Роль</th>
                <th>Дата регистрации</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td style={{ fontWeight: 600 }}>{u.username}</td>
                  <td style={{ color: 'var(--color-text-muted)' }}>{u.email}</td>
                  <td>
                    <span
                      style={{
                        padding: '3px 10px',
                        borderRadius: '999px',
                        fontSize: '12px',
                        fontWeight: 600,
                        background: u.role === 'admin' ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.05)',
                        color: u.role === 'admin' ? 'var(--color-primary-light)' : 'var(--color-text-muted)',
                        border: `1px solid ${u.role === 'admin' ? 'rgba(139,92,246,0.3)' : 'var(--color-border)'}`,
                        display: 'flex', alignItems: 'center', gap: '4px', width: 'fit-content'
                      }}
                    >
                      {u.role === 'admin' ? <><Crown size={14}/> Admin</> : <><User size={14}/> User</>}
                    </span>
                  </td>
                  <td style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>
                    {new Date(u.createdAt).toLocaleDateString('ru-RU')}
                  </td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(u._id, u.username)}
                      disabled={u._id === currentUser._id}
                      style={{display: 'flex', alignItems: 'center', gap: '4px'}}
                    >
                      <Trash2 size={14}/> Удалить
                    </button>
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

export default AdminUsers;
