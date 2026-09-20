import { getRecommendedTariffs} from "@/api/tariffs";
import TariffCard from "@/components/tariff/TariffCard";
import type { Tariff } from "@/types/tariff";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";
import AdvantageCard from "@/components/advantage/AdvantageCard";
import clock from "@/assets/icons/clock.svg";
import shield from "@/assets/icons/shield.svg";
import settings from "@/assets/icons/settings.svg";
import sliders from "@/assets/icons/sliders.svg";
import zap from "@/assets/icons/zap.svg";
import helpcircle from "@/assets/icons/help-circle.svg";
import { getPlatformStats } from "@/api/stats";
import type { PlatformStats } from "@/api/stats";
import { getFeatures } from "@/api/features";
import type { TariffFeature } from "@/types/feature";
import FeatureCard from "@/components/feature/FeatureCard";


function HomePage() {    
    const [tariffs, setTariffs] = useState<Tariff[]>([]);
    const [stats, setStats] = useState<PlatformStats | null>(null);
    const [error, setError] = useState("");
    const [features, setFeatures] = useState<TariffFeature[]>([]);

    useEffect(() => {
    getFeatures()
        .then(setFeatures)
        .catch((error: Error) => {
        console.error(error);
        });
    }, []);

    useEffect(() => {
        document.title = "Турбосервер";
        getRecommendedTariffs()
            .then((data) => {
            setTariffs(data.results);
            })
            .catch((error: Error) => {
            console.error(error);
            setError(error.message);
            });
        }, []);

    useEffect(() => {
        getPlatformStats()
            .then((data) => {
                setStats(data);
            })
            .catch((error: Error) => {
                console.error(error);
                setError(error.message);
            });
    }, []);

    return (
        <><section className="hero">
            <div className="container">
                <div className="hero-card">
                    <div className="hero-overlay">
                        <h1>Облачная платформа с широким выбором IT-сервисов</h1>
                        <Link to="/pricing/" className="hero-button">Перейти к тарифам</Link>
                    </div>
                </div>
                {error && <p>{error}</p>}
            </div>
        </section>
        <section className="advantages">
            <div className="container">
                <h2>Наши преимущества</h2>

                <div className="advantages-grid">
                    <AdvantageCard 
                        icon={clock}
                        title="Высокий аптайм"
                        description="Стабильная работа серверов 24/7 с минимальными простоями. Ваш сайт остаётся доступным для пользователей в любое время."
                    />
                    <AdvantageCard 
                        icon={helpcircle}
                        title="Быстрая поддержка"
                        description="Специалисты поддержки готовы помочь с настройкой услуг, переносом сайта и решением технических вопросов в кратчайшие сроки."
                    />
                    <AdvantageCard 
                        icon={settings}
                        title="Простое управление"
                        description="Удобная панель управления позволяет быстро настраивать тариф, домены, файлы и базы данных без лишних действий."
                    />
                    <AdvantageCard 
                        icon={shield}
                        title="Защита данных"
                        description="Используются современные меры безопасности, резервное копирование и защита серверной инфраструктуры для сохранности данных."
                    />
                    <AdvantageCard 
                        icon={sliders}
                        title="Гибкие конфигурации"
                        description="Можно выбрать подходящую конфигурацию под личный сайт, интернет-магазин или корпоративный проект без переплаты за лишние ресурсы."
                    />
                    <AdvantageCard 
                        icon={zap}
                        title="Быстрый запуск"
                        description="Подключение услуги и начало работы занимают минимум времени, что позволяет быстро запустить проект без долгой настройки."
                    />
                        
                </div>
            </div>
        </section>
        <section className="tariffs-section">
            <div className="container">
               <div className="section-title row-title">
                    <div>
                        <h2>Рекомендуемые тарифы</h2>
                        <p></p>
                    </div>
                    <Link to="/tariffs">Все тарифы</Link>
                </div>
                <div className="tariff-section-grid">
                    {tariffs
                        .map((tariff) => (
                            <TariffCard
                                key={tariff.id}
                                tariff={tariff}
                            />
                    ))}
                </div> 
            </div>
        </section>
        <section className="stats-section">
            <div className="container">
                <div className="section-title">
                    <h2>Платформа в цифрах</h2>
                    <p>Основные показатели нашей платформы.</p>
                </div>

                <div className="stats-grid">
                    <div className="stat-card">
                        <strong>{stats?.users_count ?? "—"}</strong>
                        <span>пользователей</span>
                    </div>

                    <div className="stat-card">
                        <strong>{stats?.servers_count ?? "—"}</strong>
                        <span>серверов создано</span>
                    </div>

                    <div className="stat-card">
                        <strong>{stats?.active_tariffs_count ?? "—"}</strong>
                        <span>активных тарифов</span>
                    </div>

                    <div className="stat-card">
                        <strong>
                            {stats
                                ? Math.round(
                                    Number(stats.average_tariff_price)
                                )
                                : "—"}
                        </strong>
                        <span>средняя цена, ₽</span>
                    </div>
                </div>
                
            </div>
        </section>
        <section className="feature-section">
            <div className="container">
                <div className="section-title">
                    <h2>Возможности</h2>
                    <p>Всё необходимое для стабильной работы ваших проектов.</p>
                </div>

                <div className="feature-grid">
                    {features.map((feature) => (
                        <FeatureCard
                            key={feature.id}
                            feature={feature}
                        />
                    ))}
                </div>
            </div>
        </section>
        <section className="contact-section">
            <div className="container">
                
            </div>
        </section>
        </>
    );
}

export default HomePage;