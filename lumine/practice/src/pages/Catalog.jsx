import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import AccountCard from '../components/AccountCard';
import FilterPanel from '../components/FilterPanel';
import Loader from '../components/Loader';
import { Gem } from 'lucide-react';

const DEFAULT_FILTERS = {
  search: '',
  server: '',
  denomination: '',
  minPrice: '',
  maxPrice: '',
};

const Catalog = () => {
  const [searchParams] = useSearchParams();

  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(() => ({
    ...DEFAULT_FILTERS,
    denomination: searchParams.get('denomination') ? Number(searchParams.get('denomination')) : '',
    server: searchParams.get('server') || '',
  }));
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 9, ...filters };
      Object.keys(params).forEach((k) => !params[k] && delete params[k]);

      const { data } = await api.get('/accounts', { params });
      setAccounts(data.accounts);
      setTotalPages(data.pages);
      setTotal(data.total);
    } catch {
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);
  const handleFilterChange = (updates) => {
    setFilters((prev) => ({ ...prev, ...updates }));
    setPage(1);
  };

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  };

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <h1 className="page-title">
            Стартовые <span>аккаунты</span>
          </h1>
          <p className="page-subtitle">
            Неролл аккаунты с примогемами — выбирай нужный номинал
          </p>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: '80px' }}>
        <div className="catalog-layout">
          <FilterPanel filters={filters} onChange={handleFilterChange} onReset={handleReset} />

          <div>
            <div className="results-header">
              <span className="results-count">
                Найдено: <strong>{total}</strong> лот(ов)
              </span>
            </div>

            {loading ? (
              <Loader />
            ) : accounts.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Gem size={48} /></div>
                <div className="empty-state-title">Лоты не найдены</div>
                <p className="empty-state-text">Попробуй изменить фильтры</p>
              </div>
            ) : (
              <div className="accounts-grid">
                {accounts.map((acc) => (
                  <AccountCard key={acc._id} account={acc} />
                ))}
              </div>
            )}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="pagination-btn"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  ‹
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    className={`pagination-btn ${page === p ? 'active' : ''}`}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </button>
                ))}

                <button
                  className="pagination-btn"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  ›
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Catalog;
