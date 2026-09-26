
import { useEffect, useMemo, useState } from "react";

import { getServers } from "@/api/account";
import type { Server } from "@/types/server";

import "./ServersPage.css";

const PAGE_SIZE = 10;

function ServersPage() {
    const [servers, setServers] = useState<Server[]>([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        getServers()
            .then(setServers)
            .catch((err: Error) => setError(err.message))
            .finally(() => setIsLoading(false));
    }, []);

    const filteredServers = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) return servers;

        return servers.filter((server) =>
            [
                server.tariff_title,
                server.ip_address,
                server.login,
                server.status_name,
            ].some((value) =>
                value.toLowerCase().includes(query)
            )
        );
    }, [servers, search]);

    const totalPages = Math.max(
        1,
        Math.ceil(filteredServers.length / PAGE_SIZE)
    );

    const paginatedServers = filteredServers.slice(
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
        return <p>Загрузка серверов...</p>;
    }

    return (
        <div className="servers-page">
            <header className="servers-header">
                <h2>Мои серверы</h2>
                <p>Список подключённых серверов и их состояние.</p>
            </header>

            {error && <p role="alert">{error}</p>}

            <section className="servers-panel">
                <div className="servers-toolbar">
                    <label htmlFor="server-search">
                        Поиск по тарифу, IP-адресу, логину или статусу
                    </label>

                    <div className="servers-search">
                        <input
                            id="server-search"
                            type="search"
                            value={search}
                            onChange={(event) =>
                                handleSearch(event.target.value)
                            }
                            placeholder="Введите данные сервера"
                        />

                        <button
                            type="button"
                            onClick={resetSearch}
                            disabled={!search}
                        >
                            Сбросить
                        </button>
                    </div>

                    <span className="servers-count">
                        Найдено серверов: {filteredServers.length}
                    </span>
                </div>

                {paginatedServers.length === 0 ? (
                    <div className="empty-state">
                        {servers.length === 0
                            ? "У вас пока нет серверов."
                            : "Серверы по заданному запросу не найдены."}
                    </div>
                ) : (
                    <div className="servers-table-wrap">
                        <table className="servers-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
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
                                        <td>{server.id}</td>
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

                {filteredServers.length > PAGE_SIZE && (
                    <div className="account-pagination">
                        <button
                            type="button"
                            disabled={page === 1}
                            onClick={() =>
                                setPage((current) => current - 1)
                            }
                        >
                            Назад
                        </button>

                        <span>
                            Страница {page} из {totalPages}
                        </span>

                        <button
                            type="button"
                            disabled={page >= totalPages}
                            onClick={() =>
                                setPage((current) => current + 1)
                            }
                        >
                            Далее
                        </button>
                    </div>
                )}
            </section>
        </div>
    );
}

export default ServersPage;
