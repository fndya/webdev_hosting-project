export interface Order {
    id: number;
    tariff: number;
    tariff_title: string;
    quantity: number;
    server: number | null;
    server_ip: string | null;
    total_price: string;
    pdf_file: string | null;
    status: string;
    created_at: string;
    updated_at: string;
}