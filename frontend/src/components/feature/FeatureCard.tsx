import type { TariffFeature } from "@/types/feature";
import "./FeatureCard.css";

interface FeatureCardProps {
    feature: TariffFeature;
}

function FeatureCard({ feature }: FeatureCardProps) {
    return (
        <article className="feature-card">
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
        </article>
    );
}

export default FeatureCard;