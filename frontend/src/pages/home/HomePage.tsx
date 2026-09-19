import { getRecommendedTariffs, getTariffs } from "@/api/tariffs";
import TariffCard from "@/components/tariff/TariffCard";
import type { Tariff } from "@/types/tariff";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";


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