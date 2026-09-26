
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

import "./AccountLayout.css";

function AccountLayout() {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <main className="account-page">
                <div className="container">
                    <p>Загрузка личного кабинета...</p>
                </div>
            </main>
        );
    }

    if (!user) {
        return (
            <main className="account-page">
                <div className="container">
                    <h1>Личный кабинет</h1>
                    <p>Для просмотра необходимо войти.</p>
                    <NavLink to="/login">Войти</NavLink>
                </div>
            </main>
        );
    }

    return (
        <main className="account-page">
            <div className="container">
                <header className="account-header">
                    <div className="account-header-content">
                        <span className="account-eyebrow">
                            Личный кабинет
                        </span>
                        <h1>Здравствуйте, {user.name}!</h1>
                        <p>
                            Управляйте заказами и следите за состоянием
                            своих серверов.
                        </p>
                    </div>

                    <div className="account-balance">
                        <span>Текущий баланс</span>
                        <strong>{user.balance} ₽</strong>
                    </div>
                </header>

                <div className="account-layout">
                    <nav className="account-sidebar">
                        <NavLink
                            to="/account"
                            end
                            className={({ isActive }) =>
                                `account-sidebar-link ${
                                    isActive ? "active" : ""
                                }`
                            }
                        >
                            Обзор
                        </NavLink>

                        <NavLink
                            to="/account/orders"
                            className={({ isActive }) =>
                                `account-sidebar-link ${
                                    isActive ? "active" : ""
                                }`
                            }
                        >
                            Заказы
                        </NavLink>

                        <NavLink
                            to="/account/servers"
                            className={({ isActive }) =>
                                `account-sidebar-link ${
                                    isActive ? "active" : ""
                                }`
                            }
                        >
                            Серверы
                        </NavLink>

                        <NavLink
                            to="/account/requests"
                            className={({ isActive }) =>
                                `account-sidebar-link ${
                                    isActive ? "active" : ""
                                }`
                            }
                        >
                            Обращения
                        </NavLink>

                        <NavLink
                            to="/tariffs"
                            className="account-sidebar-link"
                        >
                            Тарифы
                        </NavLink>

                        <NavLink
                            to="/cart"
                            className="account-sidebar-link"
                        >
                            Корзина
                        </NavLink>
                    </nav>

                    <section className="account-content">
                        <Outlet />
                    </section>
                </div>
            </div>
        </main>
    );
}

export default AccountLayout;
