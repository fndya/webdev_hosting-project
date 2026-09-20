function TariffDetailPage() {
    

    return (
        <main className="tariff-detail-page">

            <div className="container">



                <section className="tariff-detail-card">

                    <div className="tariff-detail-header">

                        <div>
                            
                                <span className="pricing-badge">
                                    Рекомендуем
                                </span>


                            <h1></h1>

                            
                                <p className="tariff-description">
                                    
                                </p>

                        </div>

                        <div className="tariff-detail-price">
                            <strong>
₽
                            </strong>

                            <span>в месяц</span>
                        </div>

                    </div>


                    <div className="tariff-detail-specs">

                        <div className="tariff-detail-row">

                            <span className="tariff-icon">
                                <img
                                    src="{% static 'hosting/icons/region.svg' %}"
                                    alt="Регион"
                                ></img>
                            </span>

                            <strong>Регион</strong>

                            <span>Россия</span>

                        </div>


                        <div className="tariff-detail-row">

                            <span className="tariff-icon">
                                <img
                                    src="{% static 'hosting/icons/cpu.svg' %}"
                                    alt="CPU"
                                ></img>
                            </span>

                            <strong>ЦП</strong>

                            <span>
                                
                            </span>

                        </div>


                        <div className="tariff-detail-row">

                            <span className="tariff-icon">
                                <img
                                    src="{% static 'hosting/icons/ram.svg' %}"
                                    alt="RAM"
                                ></img>
                            </span>

                            <strong>ОЗУ</strong>

                            <span>
                                
                            </span>

                        </div>


                        <div className="tariff-detail-row">

                            <span className="tariff-icon">
                                <img
                                    src="{% static 'hosting/icons/storage.svg' %}"
                                    alt="Диск"
                                ></img>
                            </span>

                            <strong>Диск</strong>

                            <span>
                                ГБ
                            </span>

                        </div>


                        <div className="tariff-detail-row">

                            <span className="tariff-icon">
                                <img
                                    src="{% static 'hosting/icons/traffic.svg' %}"
                                    alt="Трафик"
                                ></img>
                            </span>

                            <strong>Трафик</strong>

                            <span>
                                
                            </span>

                        </div>

                    </div>


                    <section className="tariff-features-section">

                        <h2>Дополнительные возможности</h2>

                        <div className="tariff-features">

                            

                        </div>

                    </section>


                  

                        <section className="tariff-images">

                            
                        </section>




                    <div className="tariff-detail-actions">

                        <a
                            href="/cart/?tariff={{ tariff.id }}"
                            className="card-buy-btn"
                        >
                            Купить тариф
                        </a>

                    </div>

                </section>

            </div>

        </main>
        
    );
}
