import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import { LOT_IMAGES } from '../utils/lotImages';
import { Gem, Sparkles, Globe, Package, XCircle, ShoppingCart } from 'lucide-react';

const formatPrice = (price) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);

const formatNum = (n) => n?.toLocaleString('ru-RU') ?? '0';

const AccountDetail = () => {
  const { id } = useParams();
  const { user, setUser } = useAuth();

  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImg, setSelectedImg] = useState(0);
  const [buying, setBuying] = useState(false);

  useEffect(() => {
    if (account?.title) {
      document.title = `${account.title} | LumineStore`;
    } else {
      document.title = 'Детали лота | LumineStore';
    }
  }, [account]);

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const { data } = await api.get(`/accounts/${id}`);
        setAccount(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Лот не найден');
      } finally {
        setLoading(false);
      }
    };
    fetchAccount();
  }, [id]);

  const handleBuy = async () => {
    if (!user) {
      toast.error('Войдите в систему, чтобы купить лот');
      return;
    }
    if (user.balance < account.price) {
      toast.error('Недостаточно средств. Пополните баланс в профиле.');
      return;
    }

    setBuying(true);
    try {
      const res = await api.post(`/accounts/${id}/buy`);

      setUser({
        ...user,
        balance: res.data.balance,
        purchases: [...(user.purchases || []), res.data.purchase],
      });

      toast.success('Успешная покупка! Данные отправлены в Профиль.');

      setAccount({ ...account, stock: account.stock - 1 });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Ошибка покупки');
    } finally {
      setBuying(false);
    }
  };

  if (loading) return <Loader fullPage />;

  if (error || !account) {
    return (
      <div className="account-detail">
        <div className="container">
          <div className="empty-state">
            <div className="empty-state-icon" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}><XCircle size={48} /></div>
            <div className="empty-state-title">{error || 'Лот не найден'}</div>
            <Link to="/catalog" className="btn btn-primary" style={{ marginTop: '20px' }}>
              Вернуться в каталог
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const imageList = account.images || [];

  const imgUrl = (url) => (url.startsWith('http') ? url : `http://localhost:5000${url}`);

  const stockLeft = account.stock ?? 0;

  const stockColor =
    stockLeft === 0 ? 'var(--color-danger)' :
      stockLeft <= 3 ? 'var(--color-warning)' :
        'var(--color-success)';
  const fallbackImage = LOT_IMAGES[account.denomination];

  return (
    <div className="account-detail">
      <div className="container">
        <Link
          to="/catalog"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-muted)', marginBottom: '24px', fontSize: '14px' }}
        >
          ← Назад в каталог
        </Link>

        <div className="account-detail-layout">
          <div>
            <div className="account-gallery">
              <div className="gallery-main">
                {imageList.length > 0 ? (
                  <img src={imgUrl(imageList[selectedImg])} alt={account.title} />
                ) : fallbackImage ? (
                  <img src={fallbackImage} alt={account.title} />
                ) : (
                  <div style={{ color: 'var(--color-text-faint)', textAlign: 'center' }}>
                    <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'center', color: 'var(--color-primary-light)' }}><Gem size={72} /></div>
                    <p style={{ fontSize: '16px' }}>{formatNum(account.primogems)} примогемов</p>
                    <p style={{ fontSize: '13px', color: 'var(--color-text-faint)', marginTop: '4px' }}>
                      {account.wishes} круток
                    </p>
                  </div>
                )}
              </div>

              {imageList.length > 1 && (
                <div className="gallery-thumbs">
                  {imageList.map((img, i) => (
                    <div
                      key={i}
                      className={`gallery-thumb ${i === selectedImg ? 'active' : ''}`}
                      onClick={() => setSelectedImg(i)}
                    >
                      <img src={imgUrl(img)} alt={`Screenshot ${i + 1}`} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {account.description && (
              <div style={{ marginTop: '28px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px', color: 'var(--color-text)' }}>
                  Описание
                </h3>
                <p className="account-detail-desc">{account.description}</p>
              </div>
            )}
          </div>

          <div className="account-info">
            <div className="account-info-card">
              <h1 className="account-detail-title">{account.title}</h1>
              <div className="account-price-big">{formatPrice(account.price)}</div>
              <div className="account-price-sub">Финальная цена</div>

              <div className="account-divider" />

              <div className="neroll-detail-stats">
                <div className="neroll-detail-stat primary">
                  <span className="icon" style={{display: 'flex', alignItems: 'center'}}><Gem size={20} /></span>
                  <span className="value">{formatNum(account.primogems)}</span>
                  <span className="label">Примогемов</span>
                </div>
                <div className="neroll-detail-stat">
                  <span className="icon" style={{display: 'flex', alignItems: 'center'}}><Sparkles size={20} /></span>
                  <span className="value">{account.wishes}</span>
                  <span className="label">Круток</span>
                </div>
                <div className="neroll-detail-stat">
                  <span className="icon" style={{display: 'flex', alignItems: 'center'}}><Globe size={20} /></span>
                  <span className="value">{account.server}</span>
                  <span className="label">Сервер</span>
                </div>
                <div className="neroll-detail-stat">
                  <span className="icon" style={{display: 'flex', alignItems: 'center'}}><Package size={20} /></span>
                  <span className="value" style={{ color: stockColor }}>{stockLeft}</span>
                  <span className="label">В наличии</span>
                </div>
              </div>

              <div className="account-divider" />

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <span className={`badge badge-${account.status}`}>
                  {account.status === 'active' && '● Активен'}
                  {account.status === 'sold' && '● Продан'}
                  {account.status === 'hidden' && '● Скрыт'}
                </span>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '999px',
                  background: 'rgba(139,92,246,0.12)',
                  border: '1px solid rgba(139,92,246,0.25)',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: 'var(--color-primary-light)',
                }}>
                  <span style={{display: 'flex', alignItems: 'center', gap: '4px'}}><Gem size={14} /> {formatNum(account.denomination)} номинал</span>
                </span>
              </div>
            </div>

            {account.status === 'active' && stockLeft > 0 && (
              <div className="request-form">
                {!user ? (
                  <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                    <Link to="/login" style={{ color: 'var(--color-primary-light)' }}>Войдите</Link> чтобы купить аккаунт
                  </p>
                ) : (
                  <button
                    onClick={handleBuy}
                    className="btn btn-primary"
                    disabled={buying || user.balance < account.price}
                    style={{ width: '100%' }}
                  >
                    {buying ? 'Обработка...' : <span style={{display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center'}}><ShoppingCart size={18} /> Купить за {formatPrice(account.price)}</span>}
                  </button>
                )}

                {user && user.balance < account.price && (
                  <div style={{ marginTop: '10px', fontSize: '13px', color: 'var(--color-warning)', textAlign: 'center' }}>
                    Недостаточно средств на балансе.{' '}
                    <Link to="/profile" style={{ textDecoration: 'underline' }}>Пополнить</Link>
                  </div>
                )}
              </div>
            )}

            {account.status === 'active' && stockLeft === 0 && (
              <div className="request-form">
                <div style={{ textAlign: 'center', color: 'var(--color-danger)', fontSize: '15px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <XCircle size={18} /> Нет в наличии
                </div>
                <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '8px' }}>
                  Данный номинал временно отсутствует. Следите за обновлениями.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDetail;
