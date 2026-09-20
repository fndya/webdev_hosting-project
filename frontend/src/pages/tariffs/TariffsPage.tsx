import { useEffect, useState } from "react";
import "./TariffsPage.css";
import { getTariffs } from "@/api/tariffs";
import type { Tariff } from "@/types/tariff";
import TariffCard from "@/components/tariff/TariffCard";

function TariffsPage() {
  const [tariffs, setTariffs] = useState<Tariff[]>([]);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    document.title = "Тарифы | Турбосервер";
    getTariffs(currentPage)
      .then((data) => {
        setTariffs(data.results);
        setTotalPages(Math.ceil(data.count / 6));
      })
      .catch((error: Error) => {
        console.error(error);
        setError(error.message);
      });
  }, [currentPage]);

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
        <div className="pagination">
          <button
            type="button"
            className="pagination-arrow"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            aria-label="Предыдущая страница"
          >
            ←
          </button>

          {Array.from(
            { length: totalPages },
            (_, index) => index + 1
          ).map((page) => (
            <button
              key={page}
              type="button"
              className={`pagination-page ${
                currentPage === page ? "active" : ""
              }`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}

          <button
            type="button"
            className="pagination-arrow"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            aria-label="Следующая страница"
          >
            →
          </button>
        </div>
    </div>
      
    </main>
  );
}

export default TariffsPage;