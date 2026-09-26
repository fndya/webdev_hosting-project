import { apiFetch } from "./client";

import type { Order } from "@/types/order";
import type { Server } from "@/types/server";

interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

export function getOrders(): Promise<Order[]> {
    return apiFetch<Order[]>("/orders/");
}

export function getServers(): Promise<Server[]> {
    return apiFetch<Server[]>("/servers/");
}