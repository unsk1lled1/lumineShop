import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';
import { Crown, User, CreditCard, ShoppingCart, Gamepad2 } from 'lucide-react';

const formatUSD = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n ?? 0);

const QUICK_AMOUNTS = [10, 25, 50, 100];

const Profile = () => {
  const { user, setUser } = useAuth();

  const [amount, setAmount] = useState('');
  const [isPaying, setIsPaying] = useState(false);
  const handleDeposit = async (e) => {
    e.preventDefault();
    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      toast.error('Введите корректную сумму');
      return;
    }

    setIsPaying(true);
    try {
      const res = await axios.post('/users/add-balance', { amount: numAmount });

      setUser({ ...user, balance: res.data.balance });

      toast.success(`Баланс пополнен на ${formatUSD(numAmount)}!`);
      setAmount('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Ошибка при пополнении');
    } finally {
      setIsPaying(false);
    }
  };

  if (!user) return <Loader />;

  const purchases = user.purchases || [];

  return (
    <div className="profile-page">
      <div className="container">

        <div className="profile-header">
          <div className="profile-avatar-big">
            {user.username[0].toUpperCase()}
          </div>
          <div className="profile-header-info">
            <h1 className="profile-username">{user.username}</h1>
            <p className="profile-email">{user.email}</p>
            <span className="profile-role-badge" style={{display: 'flex', alignItems: 'center', gap: '6px', width: 'fit-content'}}>
              {user.role === 'admin' ? <><Crown size={14}/> Администратор</> : <><User size={14}/> Пользователь</>}
            </span>
          </div>
        </div>

        <div className="profile-grid">

          <div className="profile-balance-card">
            <div className="profile-balance-label">Текущий баланс</div>
            <div className="profile-balance-value">{formatUSD(user.balance)}</div>
            <div className="profile-balance-sub">Доступно для покупок</div>

            <div className="profile-divider" />

            <form onSubmit={handleDeposit} className="profile-deposit-form">
              <div className="profile-quick-amounts">
                {QUICK_AMOUNTS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    className={`profile-quick-btn ${Number(amount) === q ? 'active' : ''}`}
                    onClick={() => setAmount(String(q))}
                  >
                    ${q}
                  </button>
                ))}
              </div>

              <div className="field-group">
                <label className="input-label">Или введите сумму ($)</label>
                <input
                  type="number"
                  className="input"
                  placeholder="Например: 50"
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={isPaying}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={isPaying || !amount || Number(amount) <= 0}
                style={{ width: '100%' }}
              >
                {isPaying ? 'Обработка...' : <span style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}}><CreditCard size={18} /> Пополнить баланс</span>}
              </button>
            </form>
          </div>
          <div className="profile-purchases-card">
            <div className="profile-section-header">
              <h2 className="profile-section-title" style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                <ShoppingCart size={20} /> Мои покупки
                {purchases.length > 0 && (
                  <span className="profile-count-badge">{purchases.length}</span>
                )}
              </h2>
            </div>

            {purchases.length === 0 ? (
              <div className="profile-empty">
                <div className="profile-empty-icon" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Gamepad2 size={48} /></div>
                <p className="profile-empty-text">Вы ещё ничего не покупали</p>
                <a href="/catalog" className="btn btn-outline btn-sm" style={{ marginTop: '12px' }}>
                  Перейти в каталог
                </a>
              </div>
            ) : (
              <div className="profile-purchases-list">
                {[...purchases].reverse().map((p, idx) => (
                  <div key={idx} className="profile-purchase-item">
                    <div className="profile-purchase-header">
                      <strong className="profile-purchase-title">{p.title}</strong>
                      <div className="profile-purchase-meta">
                        <span className="profile-purchase-price">{formatUSD(p.price)}</span>
                        <span className="profile-purchase-date">
                          {new Date(p.date).toLocaleDateString('ru-RU', {
                            day: '2-digit', month: 'short', year: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="profile-credentials">
                      <div className="profile-cred-row">
                        <span className="profile-cred-label">Логин / Почта</span>
                        <span className="profile-cred-value selectable">{p.login}</span>
                      </div>
                      <div className="profile-cred-row">
                        <span className="profile-cred-label">Пароль</span>
                        <span className="profile-cred-value selectable">{p.pass}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
