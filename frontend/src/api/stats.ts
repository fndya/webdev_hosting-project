import { apiFetch } from "./client";

export interface PlatformStats {
  users_count: number;
  servers_count: number;
  active_tariffs_count: number;
  average_tariff_price: string;
}

export function getPlatformStats(): Promise<PlatformStats> {
  return apiFetch("/stats/");
}