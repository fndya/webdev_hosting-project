import { getRecommendedTariffs, getTariffs } from "@/api/tariffs";
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




function HomePage() {    
    const [tariffs, setTariffs] = useState<Tariff[]>([]);
    const [error, setError] = useState("");

    useEffect(() => {
        getRecommendedTariffs()
            .then((data) => {
            setTariffs(data.results);
            })
            .catch((error: Error) => {
            console.error(error);
            setError(error.message);
            });
        }, []);

    return (
        <><section className="hero">
            <div className="container">

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
                        title="Защита данных"
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
                        <Link to="/tariffs">Все тарифы</Link>
                    </div>
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
                
            </div>
        </section>
        <section className="feature-section">
            <div className="container">
                
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