import { useEffect, useState } from "react";

import { getTariffs } from "@/api/tariffs";
import type { Tariff } from "@/types/tariff";
import TariffCard from "@/components/tariff/TariffCard";

function TariffsPage() {
  const [tariffs, setTariffs] = useState<Tariff[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getTariffs()
      .then((data) => {
        setTariffs(data.results);
      })
      .catch((error: Error) => {
        console.error(error);
        setError(error.message);
      });
  }, []);

  return (
    <main className="pricing-page">
      <div className="container">
        <h1 className="page-title">Тарифы</h1>

        {error && <p>{error}</p>}

        <div className="pricing-grid">
          {tariffs.map((tariff) => (
            <TariffCard
              key={tariff.id}
              tariff={tariff}
            />
          ))}
        </div>
      </div>
      
    </main>
  );
}

export default TariffsPage;