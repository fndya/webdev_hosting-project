const API_URL = "/api";

export async function apiFetch<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    });

    const contentType = response.headers.get("content-type");

    let data: unknown;

    if (contentType?.includes("application/json")) {
        data = await response.json();
    } else {
        data = await response.text();
    }

    if (!response.ok) {
        if (
            typeof data === "object" &&
            data !== null &&
            "detail" in data &&
            typeof data.detail === "string"
        ) {
            throw new Error(data.detail);
        }

        if (typeof data === "string" && data.trim()) {
            throw new Error(
                `Сервер вернул ошибку (${response.status}).`
            );
        }

        throw new Error(
            "Произошла ошибка при выполнении запроса."
        );
    }

    return data as T;
}