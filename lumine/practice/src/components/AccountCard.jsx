import { Link } from 'react-router-dom';
import { LOT_IMAGES } from '../utils/lotImages';
import { Gem, Globe, Sparkles, XCircle } from 'lucide-react';

const formatPrice = (price) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);

const formatNum = (n) => n?.toLocaleString('ru-RU') ?? '0';

const AccountCard = ({ account }) => {
  const { _id, price, server, denomination, primogems, wishes, stock } = account;

  const stockLeft = stock ?? 0;
  const stockColor =
    stockLeft === 0 ? 'var(--color-danger)' :
      stockLeft <= 3 ? 'var(--color-warning)' :
        'var(--color-success)';

  const cardImage = LOT_IMAGES[denomination];

  return (
    <Link to={`/accounts/${_id}`} className="account-card neroll-card" style={{ textDecoration: 'none' }}>

      <div className="neroll-card-img-wrapper" style={{ position: 'relative', overflow: 'hidden', aspectRatio: '16/9' }}>
        {cardImage ? (
          <img
            src={cardImage}
            alt={`Аккаунт с ${denomination} примогемами`}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
            className="neroll-card-img"
          />
        ) : (
          <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #1a0a2e 0%, #0f172a 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '32px', display: 'flex', alignItems: 'center', gap: '8px' }}><Gem size={32} /> {formatNum(denomination)}</span>
          </div>
        )}
        <div style={{ position: 'absolute', top: '12px', left: '12px', background: 'rgba(13,18,32,0.85)', backdropFilter: 'blur(6px)', padding: '5px 12px', borderRadius: 'var(--radius-full)', fontSize: '11px', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid rgba(255,255,255,0.08)', letterSpacing: '0.05em' }}>
          <span style={{ filter: 'brightness(1.5)', display: 'flex', alignItems: 'center' }}><Globe size={13} /></span> {server}
        </div>
      </div>

      <div className="neroll-card-info" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: 'var(--color-text-muted)', fontWeight: 500 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: 'var(--color-primary-light)', display: 'flex', alignItems: 'center' }}><Gem size={16} /></span>
            <strong style={{ color: 'var(--color-text)' }}>{formatNum(primogems)}</strong>
          </span>
          <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: 'var(--color-secondary)', display: 'flex', alignItems: 'center' }}><Sparkles size={16} /></span>
            <strong style={{ color: 'var(--color-text)' }}>{wishes}</strong>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="neroll-price" style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-gold)', textShadow: '0 0 20px rgba(245,158,11,0.25)', lineHeight: 1 }}>
            {formatPrice(price)}
          </div>
          <div style={{ fontSize: '12px', fontWeight: 600, color: stockColor, display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 8px', background: `color-mix(in srgb, ${stockColor} 12%, transparent)`, borderRadius: 'var(--radius-sm)' }}>
            {stockLeft === 0 ? <><XCircle size={12} /> Распродано</> : `● ${stockLeft} шт`}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default AccountCard;
