import { NavLink } from "react-router-dom";

import "./Header.css";

function Header() {
  return (
    <header className="header">
      <div className="container">
        <div className="header-inner">
            <NavLink to="/" className="logo">
                ТУРБОСЕРВЕР
            </NavLink>

            <nav className="nav" aria-label="Основная навигация">
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                    isActive ? "active" : ""
                    }
                >
                    Главная
                </NavLink>

                <NavLink
                    to="/tariffs"
                    className={({ isActive }) =>
                    isActive ? "active" : ""
                    }
                >
                    Тарифы
                </NavLink>
            </nav>
            
        

          <div className="header-actions">
            <NavLink to="/cart" className="small-btn">
              Корзина
            </NavLink>

            <NavLink to="/login" className="small-btn login-prompt">
              Войти
            </NavLink>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;