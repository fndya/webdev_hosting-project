
import { useEffect, useMemo, useState } from "react";

import { getOrders } from "@/api/account";
import type { Order } from "@/types/order";

import "./OrdersPage.css";

const PAGE_SIZE = 10;

function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        getOrders()
            .then(setOrders)
            .catch((err: Error) => setError(err.message))
            .finally(() => setIsLoading(false));
    }, []);

    const filteredOrders = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) return orders;

        return orders.filter((order) =>
            order.tariff_title.toLowerCase().includes(query)
        );
    }, [orders, search]);

    const totalPages = Math.max(
        1,
        Math.ceil(filteredOrders.length / PAGE_SIZE)
    );

    const paginatedOrders = filteredOrders.slice(
        (page - 1) * PAGE_SIZE,
        page * PAGE_SIZE
    );

    function handleSearch(value: string) {
        setSearch(value);
        setPage(1);
    }

    function resetSearch() {
        setSearch("");
        setPage(1);
    }

    if (isLoading) {
        return <p>Загрузка заказов...</p>;
    }

    return (
        <div className="orders-page">
            <header className="orders-header">
                <h2>История заказов</h2>
                <p>Все оформленные вами заказы.</p>
            </header>

            {error && <p role="alert">{error}</p>}

            <section className="orders-panel">
                <div className="orders-toolbar">
                    <label htmlFor="order-search">
                        Поиск по названию тарифа
                    </label>

                    <div className="orders-search">
                        <input
                            id="order-search"
                            type="search"
                            value={search}
                            onChange={(event) =>
                                handleSearch(event.target.value)
                            }
                            placeholder="Введите название тарифа"
                        />

                        <button
                            type="button"
                            onClick={resetSearch}
                            disabled={!search}
                        >
                            Сбросить
                        </button>
                    </div>

                    <span className="orders-count">
                        Найдено заказов: {filteredOrders.length}
                    </span>
                </div>

                {paginatedOrders.length === 0 ? (
                    <div className="empty-state">
                        {orders.length === 0
                            ? "Заказов пока нет"
                            : "Заказы по заданному запросу не найдены"}
                    </div>
                ) : (
                    <div className="orders-table-wrap">
                        <table className="orders-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Тариф</th>
                                    <th>Количество</th>
                                    <th>Сумма</th>
                                    <th>Статус</th>
                                    <th>Дата</th>
                                </tr>
                            </thead>

                            <tbody>
                                {paginatedOrders.map((order) => (
                                    <tr key={order.id}>
                                        <td>{order.id}</td>
                                        <td>
                                            <strong>
                                                {order.tariff_title}
                                            </strong>
                                        </td>
                                        <td>{order.quantity}</td>
                                        <td>{order.total_price} ₽</td>
                                        <td>
                                            <span className="status-badge">
                                                {order.status}
                                            </span>
                                        </td>
                                        <td>
                                            {new Date(
                                                order.created_at
                                            ).toLocaleString("ru-RU")}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {filteredOrders.length > PAGE_SIZE && (
                    <div className="account-pagination">
                        <button
                            type="button"
                            disabled={page === 1}
                            onClick={() => setPage((current) => current - 1)}
                        >
                            Назад
                        </button>

                        <span>
                            Страница {page} из {totalPages}
                        </span>

                        <button
                            type="button"
                            disabled={page >= totalPages}
                            onClick={() => setPage((current) => current + 1)}
                        >
                            Далее
                        </button>
                    </div>
                )}
            </section>
        </div>
    );
}

export default OrdersPage;
