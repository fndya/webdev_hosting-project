import { apiFetch } from "./client";
import type { TariffFeature } from "@/types/feature";

export function getFeatures(): Promise<TariffFeature[]> {
  return apiFetch("/features/");
}