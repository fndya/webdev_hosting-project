import { useAuth } from "@/context/AuthContext";

import type { Tariff } from "@/types/tariff";
import "./TariffCard.css";
import region from "@/assets/icons/region.svg";
import cpu from "@/assets/icons/cpu.svg";
import ram from "@/assets/icons/ram.svg";
import storage from "@/assets/icons/storage.svg";
import traffic from "@/assets/icons/traffic.svg";
import price from "@/assets/icons/pricetag.svg";
import { Link, useNavigate } from "react-router-dom";
import TariffParameter from "./TariffParameter";
import { useState } from "react";
import { addToCart } from "@/api/cart";
import { getCoreWord } from "@/utils/formatTariff";

interface TariffCardProps {
  tariff: Tariff;
}

function TariffCard({ tariff }: TariffCardProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [isAddingToCart, setIsAddingToCart] = useState(false);

    const handleBuy = async () => {
        setIsAddingToCart(true);

        try {
            await addToCart(tariff.id);

            navigate("/cart");
        } catch (error) {
            console.error(error);
        } finally {
            setIsAddingToCart(false);
        }
    };
  return (
    <article className="pricing-card">
      <h2>{tariff.title}</h2>

      <p>{tariff.description}</p>

      <TariffParameter
        icon={region}
        label="Регион"
        value="Россия"
      />
      <TariffParameter
        icon={cpu}
        label="ЦП"
        value={`${tariff.cpu_cores}` + ` ${getCoreWord(tariff.cpu_cores)}` }
      />
      <TariffParameter
        icon={ram}
        label="ОЗУ"
        value={`${tariff.ram_gb}`+ " ГБ" }
      />
      <TariffParameter
        icon={storage}
        label="Диск"
        value={`${tariff.storage_gb}`+ " ГБ" }
      />
      <TariffParameter
        icon={traffic}
        label="Трафик"
        value={`${tariff.traffic}`}
      />
      <TariffParameter
        icon={price}
        label="Цена"
        value={`${tariff.price_monthly}`+ " ₽/мес" }
      />
      <Link className="card-details-btn" to={`/tariffs/${tariff.id}/`}>
        Подробнее
      </Link>
      <button
          type="button"
          className="card-buy-btn"
          onClick={handleBuy}
          disabled={isAddingToCart}
      >
          {isAddingToCart ? "Добавление..." : "Купить"}
      </button>
      {isAdmin && (
        <div className="tariff-admin-actions">
          <Link
            to={`/tariffs/${tariff.id}/edit`}
            className="tariff-edit-btn"
          >
            Редактировать
          </Link>
        </div>
      )}

      {tariff.is_recommended && (
        <span className="pricing-badge">Рекомендуем</span>
      )}
    </article>
  );
}

export default TariffCard;