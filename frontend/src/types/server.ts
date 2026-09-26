export interface Server {
    id: number;
    tariff: number;
    tariff_title: string;
    status: number;
    status_name: string;
    ip_address: string;
    order: number;
    login: string;
    created_at: string;
    updated_at: string;
    expires_at: string;
    is_expired: boolean;
}