import { useMemo, useState } from "react";

export function usePagination<T>(
    items: T[],
    pageSize = 10
) {
    const [page, setPage] = useState(1);

    const pages = Math.max(
        1,
        Math.ceil(items.length / pageSize)
    );

    const currentPage = Math.min(page, pages);

    const visible = useMemo(
        () =>
            items.slice(
                (currentPage - 1) * pageSize,
                currentPage * pageSize
            ),
        [items, currentPage, pageSize]
    );

    return {
        page,
        setPage,
        pages,
        currentPage,
        visible,
    };
}