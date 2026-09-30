export interface CartItem {
    tariff_id: number;
    tariff_title: string;
    quantity: number;
    price: string;
    total_price: string;
}

export interface CartData {
    items: CartItem[];
    total_quantity: number;
    total_price: string;
}