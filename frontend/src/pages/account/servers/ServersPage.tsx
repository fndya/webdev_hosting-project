
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getServers } from "@/api/account";
import type { Server } from "@/types/server";
import { usePagination } from "@/hooks/usePagination";
import AccountSectionHeader from "@/components/account/AccountSectionHeader";


function ServersPage() {
    const [servers, setServers] = useState<Server[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        getServers()
            .then(setServers)
            .catch((err: Error) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return servers.filter(server =>
            [
                server.tariff_title,
                server.ip_address || "",
                server.login || "",
                server.status_name
            ].some(value => value.toLowerCase().includes(q))
        );
    }, [servers, search]);

    const {
        setPage,
        pages,
        currentPage,
        visible,
    } = usePagination(filtered);    

    if (loading) return <p>Загрузка серверов...</p>;

    return (
        <>
            <AccountSectionHeader
                title="Мои серверы"
                description="Список серверов, привязанных к вашему аккаунту."
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
                        placeholder="Поиск по тарифу, IP, логину или статусу"
                        aria-label="Поиск серверов"
                    />
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
                    Найдено серверов: <strong>{filtered.length}</strong>
                </div>
            </div>

            {visible.length ? (
                <div className="account-server-grid">
                    {visible.map(server => (
                        <article
                            className="account-server-card"
                            key={server.id}
                        >
                            <div className="account-server-top">
                                <div>
                                    <span className="account-card-label">
                                        Сервер №{server.id}
                                    </span>
                                    <h2>{server.tariff_title}</h2>
                                </div>
                                <span className="account-status">
                                    {server.status_name}
                                </span>
                            </div>

                            <div className="account-server-info">
                                <div>
                                    <span>IP-адрес</span>
                                    <strong>
                                        {server.ip_address || "Не назначен"}
                                    </strong>
                                </div>
                                <div>
                                    <span>Логин</span>
                                    <strong>
                                        {server.login || "Не указан"}
                                    </strong>
                                </div>
                                <div>
                                    <span>Создан</span>
                                    <strong>
                                        {server.created_at
                                            ? new Date(
                                                server.created_at
                                            ).toLocaleDateString("ru-RU")
                                            : "Не указан"}
                                    </strong>
                                </div>
                                <div>
                                    <span>Оплачен до</span>
                                    <strong>
                                        {server.expires_at
                                            ? new Date(
                                                server.expires_at
                                            ).toLocaleDateString("ru-RU")
                                            : "Не указан"}
                                        {server.is_expired && " (истёк)"}
                                    </strong>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            ) : (
                <section className="account-section account-empty">
                    <h2>
                        {servers.length
                            ? "Серверы не найдены"
                            : "Серверов пока нет"}
                    </h2>
                    <p>
                        {servers.length
                            ? "Измените поисковый запрос."
                            : "После оформления заказа серверы появятся здесь."}
                    </p>
                    {!servers.length && (
                        <Link to="/tariffs" className="account-action">
                            Выбрать тариф
                        </Link>
                    )}
                </section>
            )}

            {filtered.length > 10 && (
                <nav
                    className="account-pagination"
                    aria-label="Страницы серверов"
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
        </>
    );
}

export default ServersPage;
