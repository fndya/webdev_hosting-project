import { getTariff } from "@/api/tariffs";
import FeatureCard from "@/components/feature/FeatureCard";
import type { TariffFeature } from "@/types/feature";
import type { Tariff } from "@/types/tariff";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function TariffDetailPage() {
    const [tariff, setTariff] = useState<Tariff | null>(null);
    const [error, setError] = useState("");
    const { id } = useParams<{ id: string }>();    
    useEffect( () => {
        if (!id) {
            return;
        }
        getTariff(Number(id))
            .then(setTariff)
            .catch((error : Error) => {
                console.error(error);
                setError(error.message);
            });
    }, [id]);

    useEffect(() => {
        if (!tariff) {
            return;
        }

        document.title = `${tariff.title} | Турбосервер`;
    }, [tariff]);
    return (
        
        <div>
            {tariff?.features.map((feature: TariffFeature) => (
            <FeatureCard
                key={feature.id}
                feature={feature}
            />
        ))}
        </div>
        

    );
}

export default TariffDetailPage;
