import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getOrders, getServers } from "@/api/account";
import { useAuth } from "@/context/AuthContext";

import type { Order } from "@/types/order";
import type { Server } from "@/types/server";

import "./AccountPage.css";

function AccountPage() {
    const { user, isLoading: isAuthLoading } = useAuth();

    const [orders, setOrders] = useState<Order[]>([]);
    const [servers, setServers] = useState<Server[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const PAGE_SIZE = 5;

    const [ordersPage, setOrdersPage] = useState(1);
    const [serversPage, setServersPage] = useState(1);

    const ordersTotalPages = Math.max(
        1,
        Math.ceil(orders.length / PAGE_SIZE)
    );

    const serversTotalPages = Math.max(
        1,
        Math.ceil(servers.length / PAGE_SIZE)
    );

    const paginatedOrders = orders.slice(
        (ordersPage - 1) * PAGE_SIZE,
        ordersPage * PAGE_SIZE
    );

    const paginatedServers = servers.slice(
        (serversPage - 1) * PAGE_SIZE,
        serversPage * PAGE_SIZE
    );

    useEffect(() => {
        if (isAuthLoading || !user) return;

        Promise.all([getOrders(), getServers()])
            .then(([ordersData, serversData]) => {
                setOrders(ordersData);
                setServers(serversData);
            })
            .catch((err: Error) => {
                setError(err.message);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [isAuthLoading, user]);

    if (isAuthLoading || isLoading) {
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
                    <Link to="/login">Войти</Link>
                </div>
            </main>
        );
    }
    return (
        <main className="account-page">
            <div className="container">
                {!user ? (
                    <section className="account-section account-empty">
                        <h2>Личный кабинет</h2>
                        <p>Для просмотра необходимо войти в аккаунт.</p>
                        <Link to="/login" className="account-action">
                            Войти
                        </Link>
                    </section>
                ) : (
                    <>
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

                        <nav className="account-sidebar">
                            <Link
                                to="/account"
                                className="account-sidebar-link"
                            >
                                Обзор
                            </Link>
                            <Link
                                to="/tariffs"
                                className="account-sidebar-link"
                            >
                                Тарифы
                            </Link>
                            <Link
                                to="/cart"
                                className="account-sidebar-link"
                            >
                                Корзина
                            </Link>
                        </nav>

                        {error && (
                            <section className="account-section">
                                <p role="alert">{error}</p>
                            </section>
                        )}

                        {isLoading ? (
                            <section className="account-section">
                                <p>Загрузка данных...</p>
                            </section>
                        ) : (
                            <>
                                <section className="account-stats">
                                    <article className="account-stat-card">
                                        <span className="stat-label">
                                            Заказы
                                        </span>
                                        <strong>{orders.length}</strong>
                                        <small>Всего оформлено</small>
                                    </article>

                                    <article className="account-stat-card">
                                        <span className="stat-label">
                                            Серверы
                                        </span>
                                        <strong>{servers.length}</strong>
                                        <small>Всего подключено</small>
                                    </article>

                                    <article className="account-stat-card">
                                        <span className="stat-label">
                                            Аккаунт
                                        </span>
                                        <strong>{user.role}</strong>
                                        <small>Роль пользователя</small>
                                    </article>

                                    <article className="account-stat-card">
                                        <span className="stat-label">
                                            Регистрация
                                        </span>
                                        <strong>
                                            {new Date(user.created_at)
                                                .toLocaleDateString("ru-RU")}
                                        </strong>
                                        <small>Дата создания аккаунта</small>
                                    </article>
                                </section>

                                <div className="account-layout">
                                    <section className="dashboard-panel">
                                        <div className="panel-heading">
                                            <h2>Последние заказы</h2>
                                            <span className="account-order-count">
                                                Всего: <strong>{orders.length}</strong>
                                            </span>
                                        </div>

                                        {orders.length === 0 ? (
                                            <div className="empty-state">
                                                Заказов пока нет
                                            </div>
                                        ) : (
                                            <div className="dashboard-list">
                                                {paginatedOrders.map((order) => (
                                                    <article
                                                        className="dashboard-list-item"
                                                        key={order.id}
                                                    >
                                                        <div className="list-main">
                                                            <strong>
                                                                Заказ №{order.id}
                                                            </strong>
                                                            <span>
                                                                {order.tariff_title}
                                                            </span>
                                                            <small>
                                                                {new Date(
                                                                    order.created_at
                                                                ).toLocaleString(
                                                                    "ru-RU"
                                                                )}
                                                            </small>
                                                        </div>

                                                        <div className="item-side">
                                                            <strong>
                                                                {order.total_price} ₽
                                                            </strong>
                                                            <span className="status-badge">
                                                                {order.status}
                                                            </span>
                                                        </div>
                                                    </article>
                                                ))}
                                            </div>
                                            
                                        )}
                                        {orders.length > PAGE_SIZE && (
                                            <div className="account-pagination">
                                                <button
                                                    type="button"
                                                    disabled={ordersPage === 1}
                                                    onClick={() =>
                                                        setOrdersPage((page) => page - 1)
                                                    }
                                                >
                                                    Назад
                                                </button>

                                                <span>
                                                    Страница {ordersPage} из {ordersTotalPages}
                                                </span>

                                                <button
                                                    type="button"
                                                    disabled={ordersPage >= ordersTotalPages}
                                                    onClick={() =>
                                                        setOrdersPage((page) => page + 1)
                                                    }
                                                >
                                                    Далее
                                                </button>
                                            </div>
                                        )}
                                    </section>

                                    <aside className="dashboard-panel">
                                        <div className="panel-heading">
                                            <h2>Быстрые действия</h2>
                                        </div>

                                        <div className="quick-actions">
                                            <Link to="/tariffs">
                                                Выбрать тариф <b>→</b>
                                            </Link>
                                            <Link to="/cart">
                                                Перейти в корзину <b>→</b>
                                            </Link>
                                        </div>
                                    </aside>
                                </div>

                                <section className="dashboard-panel servers-panel">
                                    <div className="panel-heading">
                                        <h2>Мои серверы</h2>
                                    </div>

                                    {servers.length === 0 ? (
                                        <div className="empty-state">
                                            <p>У вас пока нет серверов.</p>
                                            <Link
                                                to="/tariffs"
                                                className="account-action"
                                            >
                                                Выбрать тариф
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="servers-table-wrap">
                                            <table className="servers-table">
                                                <thead>
                                                    <tr>
                                                        <th>Тариф</th>
                                                        <th>IP-адрес</th>
                                                        <th>Статус</th>
                                                        <th>Логин</th>
                                                        <th>Срок действия</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {paginatedServers.map((server) => (
                                                        <tr key={server.id}>
                                                            <td>
                                                                <strong>
                                                                    {server.tariff_title}
                                                                </strong>
                                                            </td>
                                                            <td>
                                                                {server.ip_address ||
                                                                    "Не назначен"}
                                                            </td>
                                                            <td>
                                                                <span className="status-badge">
                                                                    {server.status_name}
                                                                </span>
                                                            </td>
                                                            <td>{server.login}</td>
                                                            <td>
                                                                {server.expires_at
                                                                    ? new Date(
                                                                        server.expires_at
                                                                    ).toLocaleDateString(
                                                                        "ru-RU"
                                                                    )
                                                                    : "Не указан"}
                                                                {server.is_expired &&
                                                                    " (истёк)"}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                    {servers.length > PAGE_SIZE && (
                                        <div className="account-pagination">
                                            <button
                                                type="button"
                                                disabled={serversPage === 1}
                                                onClick={() =>
                                                    setServersPage((page) => page - 1)
                                                }
                                            >
                                                Назад
                                            </button>

                                            <span>
                                                Страница {serversPage} из {serversTotalPages}
                                            </span>

                                            <button
                                                type="button"
                                                disabled={serversPage >= serversTotalPages}
                                                onClick={() =>
                                                    setServersPage((page) => page + 1)
                                                }
                                            >
                                                Далее
                                            </button>
                                        </div>
                                    )}
                                </section>
                            </>
                        )}
                    </>
                )}
            </div>
        </main>
    );
    
}

export default AccountPage;