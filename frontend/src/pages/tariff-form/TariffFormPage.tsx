
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
        <main className="tariff-form-page">
            <div className="container">
                <Link to="/tariffs" className="back-link">
                    ← Вернуться к тарифам
                </Link>

                <section className="tariff-detail-card tariff-form-card">
                    <div className="tariff-form-header">
                        <div>
                            <span className="form-label">
                                Управление тарифом
                            </span>

                            <h1>
                                {isEdit ? "Редактирование тарифа" : "Создание тарифа"}
                            </h1>

                            <p>
                                Заполните параметры тарифа и сохраните изменения.
                            </p>
                        </div>
                    </div>

                    <form
                        className="tariff-form"
                        onSubmit={handleSubmit}
                        noValidate
                    >
                        {error && (
                            <div className="form-error" role="alert">
                                {error}
                            </div>
                        )}

                        <section className="form-section">
                            <h2>Основная информация</h2>

                            <div className="form-fields">
                                <div className="tariff-form-field">
                                    <label htmlFor="title">Название тарифа</label>
                                    <input
                                        id="title"
                                        name="title"
                                        value={form.title}
                                        onChange={(e) => setField("title", e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="tariff-form-field">
                                    <label htmlFor="description">Описание</label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={form.description}
                                        onChange={(e) => setField("description", e.target.value)}
                                    />
                                </div>
                            </div>
                        </section>

                        <section className="form-section">
                            <h2>Ресурсы сервера</h2>

                            <div className="form-fields form-fields-three">
                                <div className="tariff-form-field">
                                    <label htmlFor="cpu_cores">Количество ядер ЦП</label>
                                    <input
                                        id="cpu_cores"
                                        type="number"
                                        min="1"
                                        value={form.cpu_cores}
                                        onChange={(e) => setField("cpu_cores", Number(e.target.value))}
                                        required
                                    />
                                </div>

                                <div className="tariff-form-field">
                                    <label htmlFor="ram_gb">ОЗУ (ГБ)</label>
                                    <input
                                        id="ram_gb"
                                        type="number"
                                        min="1"
                                        value={form.ram_gb}
                                        onChange={(e) => setField("ram_gb", Number(e.target.value))}
                                        required
                                    />
                                </div>

                                <div className="tariff-form-field">
                                    <label htmlFor="storage_gb">Диск (ГБ)</label>
                                    <input
                                        id="storage_gb"
                                        type="number"
                                        min="1"
                                        value={form.storage_gb}
                                        onChange={(e) => setField("storage_gb", Number(e.target.value))}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-fields">
                                <div className="tariff-form-field">
                                    <label htmlFor="traffic">Трафик</label>
                                    <input
                                        id="traffic"
                                        value={form.traffic}
                                        onChange={(e) => setField("traffic", e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="tariff-form-field">
                                    <label htmlFor="price_monthly">Цена в месяц (₽)</label>
                                    <input
                                        id="price_monthly"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={form.price_monthly}
                                        onChange={(e) => setField("price_monthly", e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </section>

                        <section className="form-section">
                            <h2>Параметры тарифа</h2>

                            <div className="form-options">
                                <label className="form-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={form.is_recommended}
                                        onChange={(e) => setField("is_recommended", e.target.checked)}
                                    />
                                    <span>Рекомендуемый тариф</span>
                                </label>

                                <label className="form-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={form.is_active}
                                        onChange={(e) => setField("is_active", e.target.checked)}
                                    />
                                    <span>Активный тариф</span>
                                </label>
                            </div>
                        </section>

                        <section className="form-section">
                            <h2>Дополнительные возможности</h2>

                            <div className="tariff-form-field">
                                <label htmlFor="features">Возможности тарифа</label>
                                <select
                                    id="features"
                                    multiple
                                    value={form.feature_ids.map(String)}
                                    onChange={(e) => {
                                        const ids = Array.from(
                                            e.target.selectedOptions,
                                            (option) => Number(option.value)
                                        );
                                        setField("feature_ids", ids);
                                    }}
                                >
                                    {features.map((feature) => (
                                        <option key={feature.id} value={feature.id}>
                                            {feature.title}
                                        </option>
                                    ))}
                                </select>
                                <small>
                                    Для выбора нескольких пунктов используйте Ctrl
                                    или Cmd.
                                </small>
                            </div>
                        </section>

                        <section className="form-section">
                            <h2>Изображения</h2>

                            <div className="tariff-form-field">
                                <label htmlFor="new_image">Новое изображение</label>
                                <input
                                    id="new_image"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        setField("new_image", e.target.files?.[0] ?? null)
                                    }
                                />
                                <small>
                                    Выберите файл, если необходимо добавить новое изображение.
                                </small>
                            </div>
                        </section>

                        <div className="tariff-form-actions">
                            <Link to="/tariffs" className="form-cancel-btn">
                                Отмена
                            </Link>

                            <button
                                type="submit"
                                className="form-save-btn"
                                disabled={isSaving}
                            >
                                {isSaving ? "Сохранение..." : "Сохранить тариф"}
                            </button>
                        </div>
                    </form>
                </section>
            </div>
        </main>
    );

}

export default TariffFormPage;
