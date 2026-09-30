
import { apiFetch } from "./client";
import type { Tariff } from "../types/tariff";

interface TariffResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Tariff[];
}

export interface TariffPayload {
  title: string;
  description: string;
  cpu_cores: number;
  ram_gb: number;
  storage_gb: number;
  traffic: string;
  price_monthly: string;
  is_recommended: boolean;
  is_active: boolean;
  feature_ids: number[];
  image_ids: number[];
  new_image?: File | null;
}

export function getTariffs(page = 1): Promise<TariffResponse> {
  return apiFetch(`/tariffs/?page=${page}`);
}

export function getTariff(id: number): Promise<Tariff> {
  return apiFetch(`/tariffs/${id}/`);
}

export function getRecommendedTariffs(): Promise<TariffResponse> {
  return apiFetch("/tariffs/?is_recommended=true");
}

async function sendTariff(
  endpoint: string,
  method: "POST" | "PUT" | "PATCH",
  payload: TariffPayload
): Promise<Tariff> {
  const formData = new FormData();

  formData.append("title", payload.title);
  formData.append("description", payload.description);
  formData.append("cpu_cores", String(payload.cpu_cores));
  formData.append("ram_gb", String(payload.ram_gb));
  formData.append("storage_gb", String(payload.storage_gb));
  formData.append("traffic", payload.traffic);
  formData.append("price_monthly", payload.price_monthly);
  formData.append("is_recommended", String(payload.is_recommended));
  formData.append("is_active", String(payload.is_active));

  payload.feature_ids.forEach((id) => {
    formData.append("feature_ids", String(id));
  });

  payload.image_ids.forEach((id) => {
    formData.append("image_ids", String(id));
  });

  if (payload.new_image) {
    formData.append("new_image", payload.new_image);
  }

  const response = await fetch(`/api${endpoint}`, {
    method,
    credentials: "include",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    if (data && typeof data === "object") {
      const message =
        data.detail ||
        Object.entries(data)
          .map(([key, value]) => `${key}: ${String(value)}`)
          .join("\n");

      throw new Error(message || "Ошибка сохранения тарифа.");
    }

    throw new Error("Ошибка сохранения тарифа.");
  }

  return data as Tariff;
}

export function createTariff(
  payload: TariffPayload
): Promise<Tariff> {
  return sendTariff("/tariffs/", "POST", payload);
}

export function updateTariff(
  id: number,
  payload: TariffPayload
): Promise<Tariff> {
  return sendTariff(`/tariffs/${id}/`, "PUT", payload);
}

export function deleteTariff(id: number): Promise<void> {
  return apiFetch(`/tariffs/${id}/`, {
    method: "DELETE",
  });
}
