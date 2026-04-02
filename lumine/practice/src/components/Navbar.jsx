import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const formatUSD = (n) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n ?? 0);

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="navbar">
            <div className="container">
                <Link to="/" className="navbar-logo">
                    <div className="navbar-logo-icon">✦</div>
                    Lumine<span>Store</span>
                </Link>

                <ul className="navbar-nav">
                    <li><NavLink to="/" end>Главная</NavLink></li>
                    <li><NavLink to="/catalog">Каталог</NavLink></li>
                    {user?.role === 'admin' && (
                        <li><NavLink to="/admin">Админ</NavLink></li>
                    )}
                </ul>

                <div className="navbar-actions">
                    {user ? (
                        <div className="navbar-user">
                            <Link to="/profile" className="navbar-balance-chip">
                                <span className="navbar-balance-icon">💎</span>
                                <span className="navbar-balance-amount">{formatUSD(user.balance)}</span>
                            </Link>

                            <Link to="/profile" className="navbar-profile-link">
                                <div className="navbar-avatar">{user.username[0].toUpperCase()}</div>
                                <span className="navbar-user-name">{user.username}</span>
                            </Link>

                            <button className="btn btn-outline btn-sm" onClick={logout}>Выйти</button>
                        </div>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-ghost btn-sm">Войти</Link>
                            <Link to="/register" className="btn btn-primary btn-sm">Регистрация</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
