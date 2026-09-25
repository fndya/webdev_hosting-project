import { useEffect, useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";

import { addToCart } from "@/api/cart";
import { getTariff } from "@/api/tariffs";

import TariffParameter from "@/components/tariff/TariffParameter";
import FeatureCard from "@/components/feature/FeatureCard";

import type { Tariff } from "@/types/tariff";

import region from "@/assets/icons/region.svg";
import cpu from "@/assets/icons/cpu.svg";
import ram from "@/assets/icons/ram.svg";
import storage from "@/assets/icons/storage.svg";
import traffic from "@/assets/icons/traffic.svg";

import "./TariffDetailPage.css";
import TariffDetailSkeleton from "./TariffDetailSkeleton";

function getCoreWord(count: number) {
    if (count % 10 === 1 && count % 100 !== 11) {
        return "ядро";
    }

    if (
        count % 10 >= 2 &&
        count % 10 <= 4 &&
        (count % 100 < 10 || count % 100 >= 20)
    ) {
        return "ядра";
    }

    return "ядер";
}

function TariffDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [tariff, setTariff] = useState<Tariff | null>(null);
    const [error, setError] = useState("");
    const [isAddingToCart, setIsAddingToCart] = useState(false);

    useEffect(() => {
        if (!id) {
            return;
        }

        getTariff(Number(id))
            .then(setTariff)
            .catch((error: Error) => {
                console.error(error);
                setError(error.message);
            });
    }, [id]);

    useEffect(() => {
        if (!tariff) {
            return;
        }

        document.title = `Тариф "${tariff.title}"`;
    }, [tariff]);

    const handleAddToCart = async () => {
        if (!tariff) {
            return <TariffDetailSkeleton />;
        }

        setIsAddingToCart(true);
        setError("");

        try {
            await addToCart(tariff.id);
            navigate("/cart");
        } catch (error) {
            console.error(error);

            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("Не удалось добавить тариф в корзину.");
            }
        } finally {
            setIsAddingToCart(false);
        }
    };

    if (error && !tariff) {
        return <TariffDetailSkeleton />;
    }

    if (!tariff) {
        return <TariffDetailSkeleton />;
    }

    return (
        <main className="tariff-detail-page">
            <div className="container">

                <Link
                    to="/tariffs"
                    className="back-link"
                >
                    ← Вернуться к тарифам
                </Link>

                <section className="tariff-detail-card">

                    <div className="tariff-detail-header">

                        <div>
                            {tariff.is_recommended && (
                                <span className="pricing-badge">
                                    Рекомендуем
                                </span>
                            )}

                            <h1>{tariff.title}</h1>

                            {tariff.description && (
                                <p className="tariff-description">
                                    {tariff.description}
                                </p>
                            )}
                        </div>

                        <div className="tariff-detail-price">
                            <strong>
                                {tariff.price_monthly} ₽
                            </strong>

                            <span>в месяц</span>
                        </div>

                    </div>

                    {error && (
                        <div className="form-errors">
                            {error}
                        </div>
                    )}

                    <div className="tariff-detail-specs">

                        <TariffParameter
                            icon={region}
                            label="Регион"
                            value="Россия"
                        />

                        <TariffParameter
                            icon={cpu}
                            label="ЦП"
                            value={`${tariff.cpu_cores} ${getCoreWord(tariff.cpu_cores)}`}
                        />

                        <TariffParameter
                            icon={ram}
                            label="ОЗУ"
                            value={`${tariff.ram_gb} ГБ`}
                        />

                        <TariffParameter
                            icon={storage}
                            label="Диск"
                            value={`${tariff.storage_gb} ГБ`}
                        />

                        <TariffParameter
                            icon={traffic}
                            label="Трафик"
                            value={tariff.traffic}
                        />

                    </div>

                    <section className="tariff-features-section">

                        <h2>Дополнительные возможности</h2>

                        <div className="tariff-features">

                            {tariff.features.length > 0 ? (
                                tariff.features.map((feature) => (
                                    <FeatureCard
                                        key={feature.id}
                                        feature={feature}
                                    />
                                ))
                            ) : (
                                <p>
                                    Дополнительные характеристики отсутствуют.
                                </p>
                            )}

                        </div>

                    </section>

                    {tariff.image_urls.length > 0 && (
                        <section className="tariff-images">

                            {tariff.image_urls.map(
                                (imageUrl, index) => (
                                    <img
                                        key={imageUrl}
                                        src={imageUrl}
                                        alt={`${tariff.title} — изображение ${index + 1}`}
                                    />
                                )
                            )}

                        </section>
                    )}

                    <div className="tariff-detail-actions">

                        <button
                            type="button"
                            className="card-buy-btn"
                            onClick={handleAddToCart}
                            disabled={isAddingToCart}
                        >
                            {isAddingToCart
                                ? "Добавление..."
                                : "Купить тариф"}
                        </button>

                    </div>

                </section>

            </div>
        </main>
    );
}

export default TariffDetailPage;