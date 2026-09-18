import { useEffect, useState } from "react";
import { getTariffs } from "./api/tariffs";
import type { Tariff } from "./types/tariff";

function App() {
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
    <main>
      <h1>Тарифы</h1>

      {error && <p>{error}</p>}

      {tariffs.map((tariff) => (
        <div key={tariff.id}>
          <h2>{tariff.title}</h2>
          <p>{tariff.description}</p>
          <p>{tariff.price_monthly} ₽/месяц</p>
        </div>
      ))}
    </main>
  );
}

export default App;