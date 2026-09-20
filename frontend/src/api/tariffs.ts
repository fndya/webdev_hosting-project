import { apiFetch } from "./client";
import type { Tariff } from "../types/tariff";

interface TariffResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Tariff[];
}

export function getTariffs(page = 1): Promise<TariffResponse> {
  return apiFetch(`/tariffs/?page=${page}`);
}

export function getRecommendedTariffs():  Promise<TariffResponse> {
  return apiFetch("/tariffs/?is_recommended=true");
}