
import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  createTariff,
  getTariff,
  updateTariff,
  type TariffPayload,
} from "@/api/tariffs";
import { getFeatures } from "@/api/features";
import { useAuth } from "@/context/AuthContext";

import type { Tariff } from "@/types/tariff";
import type { TariffFeature } from "@/types/feature";

import "./TariffFormPage.css";

const emptyForm: TariffPayload = {
  title: "",
  description: "",
  cpu_cores: 1,
  ram_gb: 1,
  storage_gb: 1,
  traffic: "",
  price_monthly: "0.00",
  is_recommended: false,
  is_active: true,
  feature_ids: [],
  image_ids: [],
  new_image: null,
};

function TariffFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  const isEdit = Boolean(id);
  const [form, setForm] = useState<TariffPayload>(emptyForm);
  const [features, setFeatures] = useState<TariffFeature[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isLoading) return;

    if (!user || user.role !== "admin") {
      navigate("/tariffs", { replace: true });
      return;
    }

    Promise.all([
      getFeatures(),
      isEdit ? getTariff(Number(id)) : Promise.resolve(null),
    ])
      .then(([featureData, tariff]) => {
        setFeatures(featureData);

        if (tariff) {
          setForm({
            title: tariff.title,
            description: tariff.description,
            cpu_cores: tariff.cpu_cores,
            ram_gb: tariff.ram_gb,
            storage_gb: tariff.storage_gb,
            traffic: tariff.traffic,
            price_monthly: tariff.price_monthly,
            is_recommended: tariff.is_recommended,
            is_active: tariff.is_active,
            feature_ids: tariff.features.map((f) => f.id),
            image_ids: tariff.image_ids ?? [],
            new_image: null,
          });
        }
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setIsLoadingData(false));
  }, [id, isEdit, isLoading, user, navigate]);

  const setField = <K extends keyof TariffPayload>(
    key: K,
    value: TariffPayload[K]
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const toggleFeature = (featureId: number) => {
    setForm((current) => ({
      ...current,
      feature_ids: current.feature_ids.includes(featureId)
        ? current.feature_ids.filter((id) => id !== featureId)
        : [...current.feature_ids, featureId],
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSaving(true);

    try {
      const saved: Tariff = isEdit
        ? await updateTariff(Number(id), form)
        : await createTariff(form);

      navigate(`/tariffs/${saved.id}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Не удалось сохранить тариф."
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || isLoadingData) {
    return <main className="container"><p>Загрузка...</p></main>;
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <main className="container tariff-form-page">
      <Link to="/tariffs">← К тарифам</Link>
      <h1>{isEdit ? "Редактирование тарифа" : "Создание тарифа"}</h1>

      {error && <p role="alert" className="form-error">{error}</p>}

      <form onSubmit={handleSubmit} className="tariff-form">
        <label>
          Название тарифа
          <input
            required
            value={form.title}
            onChange={(e) => setField("title", e.target.value)}
          />
        </label>

        <label>
          Описание
          <textarea
            value={form.description}
            onChange={(e) => setField("description", e.target.value)}
          />
        </label>

        <label>
          Количество ядер CPU
          <input
            type="number"
            min="1"
            required
            value={form.cpu_cores}
            onChange={(e) => setField("cpu_cores", Number(e.target.value))}
          />
        </label>

        <label>
          Оперативная память (ГБ)
          <input
            type="number"
            min="1"
            required
            value={form.ram_gb}
            onChange={(e) => setField("ram_gb", Number(e.target.value))}
          />
        </label>

        <label>
          Диск (ГБ)
          <input
            type="number"
            min="1"
            required
            value={form.storage_gb}
            onChange={(e) => setField("storage_gb", Number(e.target.value))}
          />
        </label>

        <label>
          Трафик
          <input
            required
            value={form.traffic}
            onChange={(e) => setField("traffic", e.target.value)}
          />
        </label>

        <label>
          Цена в месяц
          <input
            type="number"
            min="0"
            step="0.01"
            required
            value={form.price_monthly}
            onChange={(e) => setField("price_monthly", e.target.value)}
          />
        </label>

        <fieldset>
          <legend>Дополнительные характеристики</legend>
          {features.map((feature) => (
            <label key={feature.id} className="feature-option">
              <input
                type="checkbox"
                checked={form.feature_ids.includes(feature.id)}
                onChange={() => toggleFeature(feature.id)}
              />
              <span>{feature.title}</span>
            </label>
          ))}
        </fieldset>

        <label>
          Новое изображение
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setField("new_image", e.target.files?.[0] ?? null)
            }
          />
        </label>

        <label className="feature-option">
          <input
            type="checkbox"
            checked={form.is_recommended}
            onChange={(e) => setField("is_recommended", e.target.checked)}
          />
          Рекомендуемый тариф
        </label>

        <label className="feature-option">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(e) => setField("is_active", e.target.checked)}
          />
          Активный тариф
        </label>

        <button type="submit" disabled={isSaving}>
          {isSaving ? "Сохранение..." : "Сохранить"}
        </button>
      </form>
    </main>
  );
}

export default TariffFormPage;
