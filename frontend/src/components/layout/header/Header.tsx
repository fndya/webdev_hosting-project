import { useState } from "react";
import { NavLink } from "react-router-dom";

import "./Header.css";

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <header className="header">
            <div className="container">
                <div className="header-inner">
                    <NavLink
                        to="/"
                        className="logo"
                        onClick={closeMenu}
                    >
                        ТУРБОСЕРВЕР
                    </NavLink>

                    <nav
                        className="nav"
                        aria-label="Основная навигация"
                    >
                        <NavLink to="/">Главная</NavLink>
                        <NavLink to="/tariffs">Тарифы</NavLink>
                        <NavLink to="/support">Поддержка</NavLink>
                        <NavLink to="/about">О нас</NavLink>
                    </nav>

                    <div className="header-actions">
                        <NavLink
                            to="/cart"
                            className="small-btn"
                        >
                            Корзина
                        </NavLink>

                        <NavLink
                            to="/login"
                            className="small-btn login-prompt"
                        >
                            Войти
                        </NavLink>
                        <NavLink
                            to="/register"
                            className="small-btn"
                        >
                            Регистрация
                        </NavLink>
                    </div>

                    <button
                        type="button"
                        className={`menu-toggle ${
                            isMenuOpen ? "is-open" : ""
                        }`}
                        onClick={() => setIsMenuOpen((open) => !open)}
                        aria-expanded={isMenuOpen}
                        aria-controls="mobile-menu"
                        aria-label={
                            isMenuOpen
                                ? "Закрыть меню"
                                : "Открыть меню"
                        }
                    >
                        <span />
                        <span />
                        <span />
                    </button>
                </div>

                <div
                    id="mobile-menu"
                    className={`mobile-menu ${
                        isMenuOpen ? "is-open" : ""
                    }`}
                >
                    <nav
                        className="mobile-nav"
                        aria-label="Мобильная навигация"
                    >
                        <NavLink to="/" onClick={closeMenu}>
                            Главная
                        </NavLink>

                        <NavLink
                            to="/tariffs"
                            onClick={closeMenu}
                        >
                            Тарифы
                        </NavLink>

                        <NavLink
                            to="/support"
                            onClick={closeMenu}
                        >
                            Поддержка
                        </NavLink>

                        <NavLink
                            to="/about"
                            onClick={closeMenu}
                        >
                            О нас
                        </NavLink>

                        <NavLink
                            to="/account"
                            onClick={closeMenu}
                        >
                            Личный кабинет
                        </NavLink>
                    </nav>

                    <div className="mobile-actions">
                        <NavLink
                            to="/cart"
                            className="small-btn"
                            onClick={closeMenu}
                        >
                            Корзина
                        </NavLink>

                        <NavLink
                            to="/login"
                            className="small-btn login-prompt"
                            onClick={closeMenu}
                        >
                            Вход
                        </NavLink>

                        <NavLink
                            to="/register"
                            className="small-btn"
                            onClick={closeMenu}
                        >
                            Регистрация
                        </NavLink>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;