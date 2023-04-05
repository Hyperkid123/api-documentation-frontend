import {Dispatch, SetStateAction, useCallback, useEffect, useState} from "react";

interface PaginatedState {
    count: number;
    perPage: number;
    page: number;
}

export interface PaginationInfo<T> extends PaginatedState {
    items: ReadonlyArray<T>;
    onSetPage: Dispatch<SetStateAction<number>>;
    onSetPerPage: Dispatch<SetStateAction<number>>;
}

export const usePagination = <T>(elements: ReadonlyArray<T>, defaultPerPage = 10): PaginationInfo<T> => {
    const [paging, setPaging] = useState<PaginatedState>({
        count: elements.length,
        perPage: defaultPerPage,
        page: 1
    });

    const [paginatedElements, setPaginatedElements] = useState<ReadonlyArray<T>>([]);

    useEffect(() => {
        setPaginatedElements(elements.slice((paging.page - 1) * paging.perPage, paging.page * paging.perPage));
    }, [paging, elements]);

    const onSetPage = useCallback((page: SetStateAction<number>) => {
        setPaging(prev => ({
            ...prev,
            page: typeof page === 'number' ? page : page(prev.page)
        }));
    }, [setPaging]);

    const onSetPerPage = useCallback((perPage: SetStateAction<number>) => {
        setPaging(prev => ({
            ...prev,
            perPage: typeof perPage === 'number' ? perPage : perPage(prev.perPage)
        }));
    }, [setPaging]);

    return {
        ...paging,
        items: paginatedElements,
        onSetPage,
        onSetPerPage
    };
}