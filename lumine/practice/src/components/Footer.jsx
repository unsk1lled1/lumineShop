import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand-logo">Lumine<span>Store</span></div>
            <p className="footer-brand-desc">
              Каталог игровых аккаунтов Genshin Impact. Надёжные продавцы, проверенные аккаунты, лучшие цены.
            </p>
          </div>
          <div>
            <div className="footer-links-title">Навигация</div>
            <ul className="footer-links">
              <li><Link to="/">Главная</Link></li>
              <li><Link to="/catalog">Каталог</Link></li>
              <li><Link to="/register">Регистрация</Link></li>
              <li><Link to="/login">Войти</Link></li>
            </ul>
          </div>
          <div>
            <div className="footer-links-title">Серверы</div>
            <ul className="footer-links">
              <li><Link to="/catalog?server=Asia">Азия</Link></li>
              <li><Link to="/catalog?server=Europe">Европа</Link></li>
              <li><Link to="/catalog?server=America">Америка</Link></li>
              <li><Link to="/catalog?server=TW/HK/MO">TW/HK/MO</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 LumineStore. Все права защищены.</span>
          <span>Не является официальным сайтом miHoYo</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
