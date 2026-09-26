
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getOrders, getServers } from "@/api/account";

import type { Order } from "@/types/order";
import type { Server } from "@/types/server";

import "./AccountPage.css";
import { useAuth } from "@/context/AuthContext";

function AccountPage() {
    const { user } = useAuth();

    const [orders, setOrders] = useState<Order[]>([]);
    const [servers, setServers] = useState<Server[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
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
    }, []);

    const recentOrders = [...orders]
        .sort(
            (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
        )
        .slice(0, 5);

    const recentServers = [...servers].slice(0, 5);

    if (isLoading) {
        return <p>Загрузка данных...</p>;
    }

    return (
        <div className="account-overview">
            <h2>Обзор аккаунта</h2>

            {error && <p role="alert">{error}</p>}

            <section className="account-stats">
                <article className="account-stat-card">
                    <span className="stat-label">Заказы</span>
                    <strong>{orders.length}</strong>
                    <small>Всего оформлено</small>
                </article>

                <article className="account-stat-card">
                    <span className="stat-label">Серверы</span>
                    <strong>{servers.length}</strong>
                    <small>Всего подключено</small>
                </article>

                <article className="account-stat-card">
                    <span className="stat-label">Аккаунт</span>
                    <strong>{user?.role}</strong>
                    <small>Роль пользователя</small>
                </article>

                <article className="account-stat-card">
                    <span className="stat-label">Регистрация</span>
                    <strong>
                        {user?.created_at
                            ? new Date(user.created_at).toLocaleDateString(
                                  "ru-RU"
                              )
                            : "—"}
                    </strong>
                    <small>Дата создания аккаунта</small>
                </article>
            </section>

            <section className="dashboard-panel">
                <div className="panel-heading">
                    <h2>Последние заказы</h2>
                    <Link to="/account/orders">Все заказы →</Link>
                </div>

                {recentOrders.length === 0 ? (
                    <div className="empty-state">
                        Заказов пока нет
                    </div>
                ) : (
                    <div className="dashboard-list">
                        {recentOrders.map((order) => (
                            <article
                                className="dashboard-list-item"
                                key={order.id}
                            >
                                <div className="list-main">
                                    <strong>Заказ №{order.id}</strong>
                                    <span>{order.tariff_title}</span>
                                    <small>
                                        {new Date(
                                            order.created_at
                                        ).toLocaleString("ru-RU")}
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
            </section>

            <section className="dashboard-panel servers-panel">
                <div className="panel-heading">
                    <h2>Мои серверы</h2>
                    <Link to="/account/servers">Все серверы →</Link>
                </div>

                {recentServers.length === 0 ? (
                    <div className="empty-state">
                        <p>У вас пока нет серверов.</p>
                        <Link to="/tariffs" className="account-action">
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
                                {recentServers.map((server) => (
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
            </section>

            <section className="dashboard-panel">
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
            </section>
        </div>
    );
}

export default AccountPage;
