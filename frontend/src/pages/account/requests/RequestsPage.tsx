
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "@/api/client";
import { usePagination } from "@/hooks/usePagination";

interface ContactRequest {
    id: number;
    name: string;
    email: string;
    phone: string;
    message: string;
    status: string;
    status_display: string;
    created_at: string;
    updated_at: string;
}


function RequestsPage() {
    const [requests, setRequests] = useState<ContactRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        apiFetch<ContactRequest[]>("/requests/")
            .then(setRequests)
            .catch((err: Error) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    const {
        setPage,
        pages,
        currentPage,
        visible,
    } = usePagination(requests);

    if (loading) return <p>Загрузка обращений...</p>;

    return (
        <>
            <header className="account-header">
                <span className="account-eyebrow">
                    Личный кабинет
                </span>
                <h1>Мои обращения</h1>
                <p>История обращений в службу поддержки.</p>
            </header>

            {error && <p role="alert">{error}</p>}

            <section className="account-section">
                {visible.length ? (
                    <div className="account-request-list">
                        {visible.map(item => (
                            <article
                                className="account-request-card"
                                key={item.id}
                            >
                                <div className="account-request-top">
                                    <div>
                                        <span className="account-card-label">
                                            Обращение №{item.id}
                                        </span>
                                        <h2>
                                            Обращение в поддержку
                                        </h2>
                                    </div>
                                    <span className="account-status">
                                        {item.status_display}
                                    </span>
                                </div>

                                <p className="account-request-message">
                                    {item.message}
                                </p>
                                <div className="account-request-date">
                                    Создано:{" "}
                                    {new Date(
                                        item.created_at
                                    ).toLocaleString("ru-RU")}
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="account-empty">
                        <h2>Обращений пока нет</h2>
                        <p>
                            Если возникнет вопрос, вы можете
                            обратиться в поддержку.
                        </p>
                        <Link
                            to="/support"
                            className="account-action"
                        >
                            Написать в поддержку
                        </Link>
                    </div>
                )}
            </section>

            {requests.length > 10 && (
                <nav
                    className="account-pagination"
                    aria-label="Страницы обращений"
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

export default RequestsPage;
