import Skeleton from "@/components/ui/Skeleton/Skeleton";

import "./TariffCard.css";

function TariffCardSkeleton() {
    return (
        <article className="pricing-card tariff-card-skeleton">
            <Skeleton className="tariff-skeleton-title" />

            <Skeleton className="tariff-skeleton-description" />
            <Skeleton className="tariff-skeleton-description short" />

            <div className="tariff-skeleton-parameters">
                <Skeleton />
                <Skeleton />
                <Skeleton />
                <Skeleton />
                <Skeleton />
                <Skeleton />
            </div>

            <Skeleton className="tariff-skeleton-button" />
            <Skeleton className="tariff-skeleton-button buy" />
        </article>
    );
}

export default TariffCardSkeleton;