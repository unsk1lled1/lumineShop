import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="not-found" style={{ paddingTop: 'var(--navbar-height)' }}>
      <div className="not-found-code">404</div>
      <h1 className="not-found-title">Страница не найдена</h1>
      <p className="not-found-text">
        Похоже, ты попал не туда. Эта страница не существует.
      </p>
      <Link to="/" className="btn btn-primary btn-lg">
        На главную
      </Link>
    </div>
  );
};

export default NotFound;
