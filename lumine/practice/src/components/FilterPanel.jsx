const DENOMINATIONS = [6000, 6400, 33500, 47000, 55000, 60000];
const SERVERS = ['Asia', 'Europe', 'America', 'TW/HK/MO'];

const formatNum = (n) => n.toLocaleString('ru-RU');

const FilterPanel = ({ filters, onChange, onReset }) => {
  const handleDenomToggle = (d) => {
    onChange({ denomination: filters.denomination === d ? '' : d });
  };

  return (
    <aside className="filter-panel">
      <div className="filter-panel-title">
        <span>🔍</span> Фильтры
      </div>

      {/* Поиск */}
      <div className="filter-section">
        <div className="filter-section-title">Поиск</div>
        <div className="search-bar">
          <span className="search-bar-icon">🔎</span>
          <input
            id="search-input"
            className="input"
            type="text"
            placeholder="Поиск по названию..."
            value={filters.search || ''}
            onChange={(e) => onChange({ search: e.target.value })}
          />
        </div>
      </div>

      {/* Номинал (примогемы) */}
      <div className="filter-section">
        <div className="filter-section-title">💎 Примогемы</div>
        <div className="filter-chips">
          {DENOMINATIONS.map((d) => (
            <button
              key={d}
              className={`filter-chip ${filters.denomination === d ? 'active' : ''}`}
              onClick={() => handleDenomToggle(d)}
              type="button"
            >
              {formatNum(d)}
            </button>
          ))}
        </div>
      </div>

      {/* Сервер */}
      <div className="filter-section">
        <div className="filter-section-title">Сервер</div>
        <div className="filter-chips">
          {SERVERS.map((s) => (
            <button
              key={s}
              className={`filter-chip ${filters.server === s ? 'active' : ''}`}
              onClick={() => onChange({ server: filters.server === s ? '' : s })}
              type="button"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Цена */}
      <div className="filter-section">
        <div className="filter-section-title">Цена ($)</div>
        <div className="filter-range">
          <input
            className="input"
            type="number"
            placeholder="От"
            value={filters.minPrice || ''}
            onChange={(e) => onChange({ minPrice: e.target.value })}
          />
          <span className="filter-range-divider">—</span>
          <input
            className="input"
            type="number"
            placeholder="До"
            value={filters.maxPrice || ''}
            onChange={(e) => onChange({ maxPrice: e.target.value })}
          />
        </div>
      </div>

      {/* Сброс */}
      <button className="btn btn-outline" onClick={onReset} type="button" style={{ marginTop: 'auto' }}>
        Сбросить фильтры
      </button>
    </aside>
  );
};

export default FilterPanel;
