
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getOrders } from "@/api/account";
import AccountSectionHeader from "@/components/account/AccountSectionHeader";
import type { Order } from "@/types/order";
import { usePagination } from "@/hooks/usePagination";



function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        getOrders()
            .then(setOrders)
            .catch((err: Error) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return orders.filter(order =>
            order.tariff_title.toLowerCase().includes(q)
        );
    }, [orders, search]);

    const {
        setPage,
        pages,
        currentPage,
        visible,
    } = usePagination(filtered);

    if (loading) return <p>Загрузка заказов...</p>;

    return (
        <>
            <AccountSectionHeader
                title="Мои заказы"
                description="История заказов и их текущий статус."
            />

            {error && <p role="alert">{error}</p>}

            <div className="account-order-tools">
                <form
                    className="account-search-form"
                    onSubmit={e => e.preventDefault()}
                >
                    <input
                        type="search"
                        value={search}
                        onChange={e => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        placeholder="Поиск по названию тарифа"
                        aria-label="Поиск по названию тарифа"
                    />
                    <button className="account-action" type="submit">
                        Найти
                    </button>
                    {search && (
                        <button
                            type="button"
                            className="account-search-reset"
                            onClick={() => {
                                setSearch("");
                                setPage(1);
                            }}
                        >
                            Сбросить
                        </button>
                    )}
                </form>

                <div className="account-order-count">
                    Найдено заказов: <strong>{filtered.length}</strong>
                </div>
            </div>

            <section className="account-section">
                {visible.length ? (
                    <div className="account-table-wrapper">
                        <table className="account-table">
                            <thead>
                                <tr>
                                    <th>ID заказа</th>
                                    <th>Тариф</th>
                                    <th>Количество</th>
                                    <th>Сумма</th>
                                    <th>Статус</th>
                                    <th>Дата</th>
                                </tr>
                            </thead>
                            <tbody>
                                {visible.map(order => (
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
                                            <span 
                                                className="account-status"
                                                aria-label={`Статус заказа: ${order.status}`}
                                            >
                                                {order.status}
                                            </span>
                                        </td>
                                        <td>
                                            {new Date(
                                                order.created_at
                                            ).toLocaleDateString("ru-RU")}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : error ? (
                    <div className="account-empty">
                        <h2>Не удалось загрузить заказы</h2>
                        <p>{error}</p>
                    </div>
                ) : (
                    <div className="account-empty">
                        <h2>
                            {orders.length
                                ? "Заказы не найдены"
                                : "Заказов пока нет"}
                        </h2>
                        <p>
                            {orders.length
                                ? "Измените поисковый запрос."
                                : "Выберите тариф и оформите первый заказ."}
                        </p>
                        {!orders.length && (
                            <Link to="/tariffs" className="account-action">
                                Перейти к тарифам
                            </Link>
                        )}
                    </div>
                )}

                {filtered.length > 10 && ( 
                    <nav
                        className="account-pagination"
                        aria-label="Страницы заказов"
                    >
                        <button
                            disabled={currentPage <= 1}
                            onClick={() => setPage(p => p - 1)}
                        >
                            Назад
                        </button>
                        <span>
                            Страница {currentPage} из {pages}
                        </span>
                        <button
                            disabled={currentPage >= pages}
                            onClick={() => setPage(p => p + 1)}
                        >
                            Далее
                        </button>
                    </nav>
                )}
            </section>
        </>
    );
}

export default OrdersPage;
