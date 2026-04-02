import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api/axios';
import AccountCard from '../components/AccountCard';
import Loader from '../components/Loader';
import heroBg from '../img/3.jpg';
import { Gem, Sparkles, Lock, Zap, Globe } from 'lucide-react';

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  size: Math.random() * 4 + 2,
  left: Math.random() * 100,
  top: Math.random() * 100,
  delay: Math.random() * 4,
  duration: Math.random() * 4 + 5,
}));

const formatNum = (n) => n?.toLocaleString('ru-RU') ?? '0';
const formatPrice = (price) =>
  price
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)
    : '—';

const DENOM_COLORS = {
  6000: { from: '#3b82f6', to: '#06b6d4', label: 'Старт' },
  6400: { from: '#8b5cf6', to: '#6366f1', label: 'Базовый' },
  33500: { from: '#a855f7', to: '#7c3aed', label: 'Средний' },
  47000: { from: '#f59e0b', to: '#d97706', label: 'Продвинутый' },
  55000: { from: '#f97316', to: '#ef4444', label: 'Премиум' },
  60000: { from: '#fbbf24', to: '#f59e0b', label: '⭐ Максимум' },
};

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [denominations, setDenominations] = useState([]);
  const [loadingDenoms, setLoadingDenoms] = useState(true);

  useEffect(() => {
    api.get('/accounts?limit=3').then(({ data }) => setFeatured(data.accounts)).catch(() => { }).finally(() => setLoadingFeatured(false));
    api.get('/accounts/denominations').then(({ data }) => setDenominations(data)).catch(() => { }).finally(() => setLoadingDenoms(false));
  }, []);

  return (
    <main>
      {/* ===== HERO ===== */}
      <section className="hero" style={{ minHeight: '100vh' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${heroBg})`, backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 0 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(8,11,20,0.95) 0%, rgba(8,11,20,0.75) 40%, rgba(8,11,20,0.2) 75%, rgba(8,11,20,0.05) 100%)', zIndex: 1 }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '35%', background: 'linear-gradient(0deg, rgba(8,11,20,1) 0%, transparent 100%)', zIndex: 1 }} />

        <div className="hero-particles" style={{ position: 'absolute', inset: 0, zIndex: 2 }}>
          {PARTICLES.map((p) => (
            <div key={p.id} className="hero-particle" style={{ width: p.size, height: p.size, left: `${p.left}%`, top: `${p.top}%`, '--delay': `${p.delay}s`, '--duration': `${p.duration}s` }} />
          ))}
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 3, width: '100%' }}>
          <div style={{ paddingTop: 'calc(var(--navbar-height) + 80px)', paddingBottom: '100px', maxWidth: '580px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <div className="hero-eyebrow" style={{ animation: 'fade-in-up 0.6s ease both' }}>
              <span className="hero-eyebrow-dot" />
              Стартовые неролл аккаунты Genshin Impact
            </div>
            <h1 className="hero-title" style={{ animation: 'fade-in-up 0.7s 0.1s ease both' }}>
              Аккаунт с<br />
              <span className="hero-title-accent">тысячами</span><br />
              примогемов
            </h1>
            <p className="hero-subtitle" style={{ animation: 'fade-in-up 0.7s 0.2s ease both', maxWidth: '460px' }}>
              Свежие аккаунты с большим количеством примогемов и круток. Выбирай нужный номинал и начинай крутить прямо сейчас.
            </p>
            <div className="hero-stats" style={{ animation: 'fade-in-up 0.7s 0.3s ease both' }}>
              <div className="hero-stat"><span className="hero-stat-value">8</span><span className="hero-stat-label">Номиналов</span></div>
              <div className="hero-stat"><span className="hero-stat-value">60K+</span><span className="hero-stat-label">Макс. примогемов</span></div>
              <div className="hero-stat"><span className="hero-stat-value">24/7</span><span className="hero-stat-label">Поддержка</span></div>
            </div>
            <div className="hero-actions" style={{ animation: 'fade-in-up 0.7s 0.4s ease both' }}>
              <Link to="/catalog" className="btn btn-primary btn-lg">Смотреть каталог →</Link>
              <Link to="/register" className="btn btn-outline btn-lg">Регистрация</Link>
            </div>
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.5), transparent)', zIndex: 4 }} />
      </section>

      {/* ===== НОМИНАЛЫ ===== */}
      <section className="section" style={{ background: 'linear-gradient(180deg, rgba(8,11,20,1) 0%, rgba(13,18,32,1) 100%)' }}>
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title" style={{display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center'}}>
                <Gem size={32} /> Выбери <span>номинал</span>
              </h2>
              <p className="section-subtitle">Кликни на нужное количество примогемов</p>
            </div>
          </div>

          {loadingDenoms ? (
            <Loader />
          ) : (
            <div className="denom-grid">
              {denominations.map((d) => {
                const color = DENOM_COLORS[d.denomination] || { from: '#8b5cf6', to: '#7c3aed', label: '' };
                const available = d.totalStock > 0;
                return (
                  <Link
                    key={d.denomination}
                    to={`/catalog?denomination=${d.denomination}`}
                    className={`denom-card ${!available ? 'denom-card-empty' : ''}`}
                    style={{ '--grad-from': color.from, '--grad-to': color.to }}
                  >
                    <div className="denom-card-label">{color.label}</div>
                    <div className="denom-card-value">
                      {formatNum(d.denomination)}
                    </div>
                    <div className="denom-card-unit">примогемов</div>
                    <div className="denom-card-meta">
                      {d.maxWishes > 0 && <span style={{display: 'flex', alignItems: 'center', gap: '4px'}}><Sparkles size={14}/> до {d.maxWishes} круток</span>}
                      {d.minPrice && <span>от {formatPrice(d.minPrice)}</span>}
                    </div>
                    <div className="denom-card-stock">
                      {available
                        ? `● ${d.totalStock} шт. в наличии`
                        : '● Нет в наличии'}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ===== НОВЫЕ ЛОТЫ ===== */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Свежие <span>лоты</span></h2>
              <p className="section-subtitle">Последние добавления</p>
            </div>
            <Link to="/catalog" className="btn btn-outline btn-sm">Смотреть все →</Link>
          </div>

          {loadingFeatured ? (
            <Loader />
          ) : (
            <div className="accounts-grid">
              {featured.map((acc) => (
                <AccountCard key={acc._id} account={acc} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== WHY US ===== */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div><h2 className="section-title">Почему <span>LumineStore</span>?</h2></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            {[
              { icon: <Lock size={40} strokeWidth={1.5} />, title: 'Новые аккаунты', desc: 'Все аккаунты свежие — никогда не крутились' },
              { icon: <Gem size={40} strokeWidth={1.5} />, title: 'Много примогемов', desc: 'От 7 000 до 60 000 примогемов на выбор' },
              { icon: <Zap size={40} strokeWidth={1.5} />, title: 'Быстрая передача', desc: 'Получи аккаунт в течение 24 часов' },
              { icon: <Globe size={40} strokeWidth={1.5} />, title: 'Все серверы', desc: 'Asia, Europe, America, TW/HK/MO' },
            ].map((item) => (
              <div key={item.title} className="glass-card" style={{ padding: '28px' }}>
                <div style={{ marginBottom: '14px', color: 'var(--color-primary-light)' }}>{item.icon}</div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px', color: 'var(--color-text)' }}>{item.title}</h3>
                <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="section">
        <div className="container">
          <div style={{ background: 'linear-gradient(135deg, rgba(109,40,217,0.2) 0%, rgba(91,33,182,0.1) 100%)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: '60px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 700, color: 'var(--color-text)', marginBottom: '16px' }}>
              Готов начать <span style={{ color: 'var(--color-primary-light)' }}>крутить</span>?
            </h2>
            <p style={{ fontSize: '16px', color: 'var(--color-text-muted)', maxWidth: '500px', margin: '0 auto 32px' }}>
              Зарегистрируйся и выбери аккаунт с нужным количеством примогемов
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/catalog" className="btn btn-primary btn-lg">Выбрать аккаунт</Link>
              <Link to="/register" className="btn btn-outline btn-lg">Создать аккаунт</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
