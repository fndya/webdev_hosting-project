import { apiFetch } from "./client";

import type { CartData } from "@/types/cart";

export interface CartResponse {
    detail: string;
}

export function getCart(): Promise<CartData> {
    return apiFetch("/cart/");
}

export function addToCart(
    tariffId: number,
    quantity = 1
): Promise<CartResponse> {
    return apiFetch("/cart/items/", {
        method: "POST",
        body: JSON.stringify({
            tariff_id: tariffId,
            quantity,
        }),
    });
}

export function updateCartItem(
    tariffId: number,
    quantity: number
): Promise<CartResponse> {
    return apiFetch(`/cart/items/${tariffId}/`, {
        method: "PATCH",
        body: JSON.stringify({
            quantity,
        }),
    });
}

export function removeFromCart(
    tariffId: number
): Promise<CartResponse> {
    return apiFetch(`/cart/items/${tariffId}/delete/`, {
        method: "DELETE",
    });
}

export function clearCart(): Promise<CartResponse> {
    return apiFetch("/cart/", {
        method: "DELETE",
    });
}

export function checkout(): Promise<unknown> {
    return apiFetch("/orders/checkout/", {
        method: "POST",
    });
}