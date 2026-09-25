import Skeleton from "@/components/ui/Skeleton/Skeleton";

function TariffDetailSkeleton() {
    return (
        <main className="tariff-detail-page">
            <div className="container">

                <Skeleton className="detail-skeleton-back" />

                <section className="tariff-detail-card tariff-detail-skeleton">

                    <div className="tariff-detail-header">

                        <div className="detail-skeleton-info">
                            <Skeleton className="detail-skeleton-title" />
                            <Skeleton className="detail-skeleton-description" />
                            <Skeleton className="detail-skeleton-description short" />
                        </div>

                        <div className="detail-skeleton-price">
                            <Skeleton />
                            <Skeleton className="short" />
                        </div>

                    </div>

                    <div className="tariff-detail-specs">

                        <Skeleton className="detail-skeleton-row" />
                        <Skeleton className="detail-skeleton-row" />
                        <Skeleton className="detail-skeleton-row" />
                        <Skeleton className="detail-skeleton-row" />
                        <Skeleton className="detail-skeleton-row" />

                    </div>

                    <section className="tariff-features-section">

                        <Skeleton className="detail-skeleton-section-title" />

                        <div className="tariff-features">

                            <Skeleton className="detail-skeleton-feature" />
                            <Skeleton className="detail-skeleton-feature" />

                        </div>

                    </section>

                    <div className="tariff-detail-actions">
                        <Skeleton className="detail-skeleton-button" />
                    </div>

                </section>
            </div>
        </main>
    );
}

export default TariffDetailSkeleton;