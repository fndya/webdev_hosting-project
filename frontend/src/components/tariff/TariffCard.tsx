import type { Tariff } from "@/types/tariff";
import "./TariffCard.css";
import region from "@/assets/icons/region.svg";
import cpu from "@/assets/icons/cpu.svg";
import ram from "@/assets/icons/ram.svg";
import storage from "@/assets/icons/storage.svg";
import traffic from "@/assets/icons/traffic.svg";
import price from "@/assets/icons/pricetag.svg";
import { Link } from "react-router-dom";
import TariffParameter from "./TariffParameter";

interface TariffCardProps {
  tariff: Tariff;
}

function getCoreWord(count: number) {
  if (count % 10 === 1 && count % 100 !== 11) {
    return "ядро";
  }

  if (
    count % 10 >= 2 &&
    count % 10 <= 4 &&
    (count % 100 < 10 || count % 100 >= 20)
  ) {
    return "ядра";
  }

  return "ядер";
}

function TariffCard({ tariff }: TariffCardProps) {
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
      <Link className="card-buy-btn" to={`/tariffs/${tariff.id}/`}>
          Купить
      </Link>
        
      {tariff.is_recommended && (
        <span className="pricing-badge">Рекомендуемый тариф</span>
      )}
    </article>
  );
}

export default TariffCard;