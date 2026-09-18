export interface Tariff {
  id: number;
  title: string;
  description: string;
  cpu_cores: number;
  ram_gb: number;
  storage_gb: number;
  traffic: string;
  price_monthly: string;
  is_recommended: boolean;
  is_active: boolean;
  features: TariffFeature[];
  image_ids: number[];
  image_urls: string[];
  created_at: string;
  updated_at: string;
}

export interface TariffFeature {
  id: number;
  title: string;
  description: string;
}