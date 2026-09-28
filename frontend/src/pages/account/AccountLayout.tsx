
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import "./AccountLayout.css";

function AccountLayout() {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <main className="account-page">
            <div className="container">
                <p>Загрузка личного кабинета...</p>
            </div>
        </main>;
    }

    if (!user) {
        return <main className="account-page">
            <div className="container">
                <h1>Личный кабинет</h1>
                <p>Для просмотра необходимо войти.</p>
                <NavLink to="/login">Войти</NavLink>
            </div>
        </main>;
    }

    const links = [
        { to: "/account", label: "Обзор", end: true },
        { to: "/account/orders", label: "Мои заказы" },
        { to: "/account/servers", label: "Мои серверы" },
        { to: "/account/requests", label: "Мои обращения" },
    ];

    return (
        <main className="account-page">
            <div className="container">
                <header className="account-header">
                    <div>
                        <span className="account-eyebrow">
                            Личный кабинет
                        </span>
                        <h1>Добро пожаловать, {user.name}!</h1>
                        <p>
                            Управляйте заказами, серверами и
                            обращениями в одном месте.
                        </p>
                    </div>
                    <div className="account-balance">
                        <span>Баланс</span>
                        <strong>{user.balance} ₽</strong>
                    </div>
                </header>

                <nav
                    className="account-sidebar"
                    aria-label="Навигация личного кабинета"
                >
                    {links.map(({ to, label, end }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={end}
                            className={({ isActive }) =>
                                `account-sidebar-link ${
                                    isActive ? "is-active" : ""
                                }`
                            }
                        >
                            {label}
                        </NavLink>
                    ))}
                </nav>

                <section className="account-content">
                    <Outlet />
                </section>
            </div>
        </main>
    );
}

export default AccountLayout;
