import type { Tariff } from "@/types/tariff";
import "./TariffCard.css";
import region from "@/assets/icons/region.svg";
import cpu from "@/assets/icons/cpu.svg";
import ram from "@/assets/icons/ram.svg";
import storage from "@/assets/icons/storage.svg";
import traffic from "@/assets/icons/traffic.svg";
import price from "@/assets/icons/pricetag.svg";

interface TariffCardProps {
  tariff: Tariff;
}

function TariffCard({ tariff }: TariffCardProps) {
  return (
    <article className="pricing-card">
      <h2>{tariff.title}</h2>

      <p>{tariff.description}</p>

      <div className="tariff-row">
        <span className="tariff-icon">
          <img src={region} alt=""></img>
        </span>
        <strong>Регион</strong>
        <span>Россия</span>
      </div>
      <div className="tariff-row">
        <span className="tariff-icon">
          <img src={cpu} alt=""></img>
        </span>
        <strong>ЦП</strong>
        <span>{tariff.cpu_cores} ядра</span>
      </div>
      <div className="tariff-row">
        <span className="tariff-icon">
          <img src={ram} alt=""></img>
        </span>
        <strong>ОЗУ</strong>
        <span>{tariff.ram_gb} ГБ</span>
      </div>
      <div className="tariff-row">
        <span className="tariff-icon">
          <img src={storage} alt=""></img>
        </span>
        <strong>Диск</strong>
        <span>{tariff.storage_gb} ГБ</span>
      </div>
      <div className="tariff-row">
        <span className="tariff-icon">
          <img src={traffic} alt=""></img>
        </span>
        <strong>Трафик</strong>
        <span>{tariff.traffic}</span>
      </div>
      <div className="tariff-row">
        <span className="tariff-icon">
          <img src={price} alt=""></img>
        </span>
        <strong>Цена</strong>
        <span>{tariff.price_monthly}  ₽/мес</span>
      </div>
      <a className="card-details-btn" href="{{ tariff.get_absolute_url }}">
        Подробнее
      </a>
      <a className="card-buy-btn" href="{% url 'cart_add' tariff.id %}">
          Купить
      </a>
        
      {tariff.is_recommended && (
        <span className="pricing-badge">Рекомендуемый тариф</span>
      )}
    </article>
  );
}

export default TariffCard;