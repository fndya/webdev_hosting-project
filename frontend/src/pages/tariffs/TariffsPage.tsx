import { useEffect, useState } from "react";
import "./TariffsPage.css";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { getTariffs } from "@/api/tariffs";
import type { Tariff } from "@/types/tariff";
import TariffCard from "@/components/tariff/TariffCard";
import TariffCardSkeleton from "@/components/tariff/TariffCardSkeleton";

function TariffsPage() {
  const [tariffs, setTariffs] = useState<Tariff[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

useEffect(() => {
    document.title = "Тарифы | Турбосервер";

    setIsLoading(true);

    getTariffs(currentPage)
        .then((data) => {
            setTariffs(data.results);
            setTotalPages(Math.ceil(data.count / 6));
        })
        .catch((error: Error) => {
            console.error(error);
            setError(error.message);
        })
        .finally(() => {
            setIsLoading(false);
        });
}, [currentPage]);

  return (
    <main className="pricing-page">
      <div className="container">
        <h1 className="page-title">Тарифы</h1>
        {isAdmin && (
          <Link to="/tariffs/create" className="admin-tariff-button">
            Создать тариф
          </Link>
        )}
        {error && <p>{error}</p>}

        <div className="pricing-grid">
          {isLoading
              ? Array.from({ length: 6 }).map((_, index) => (
                  <TariffCardSkeleton key={index} />
              ))
              : tariffs.map((tariff) => (
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