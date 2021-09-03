import { useQuery } from "react-query";
import { api } from "../services/api";

export interface CashDesksFilterData{
    search?: string;
    start_date?: string;
    end_date?: string;
    category?: number;
    type?: number;
    company?: number;
    page?: number;
    limit?: number;
}

export const getCashDesks = async (filter?: CashDesksFilterData, limit: number = 20, page: number = 0) => {
    if(filter){
        const { data, headers } = await api.get('/cashdesks', {
            params: {
              page: page,
              limit: limit,
              search: filter.search,
              company: filter.company,
              category: filter.category,
              type: filter.type,
              start_date: filter.start_date,
              end_date: filter.end_date,
            }
        });

        return {data, total: Number(headers['x-total-count']), initialCash: Number(headers['x-initial-cash'])};

    }

    const { data, headers } = await api.get('/cashdesks');

    return {data, total: Number(headers['x-total-count']), initialCash: Number(headers['x-initial-cash'])};
}

export function useCashDesks(filter: CashDesksFilterData, limit: number = 20, page: number){
    return useQuery(['cashdesks', [filter, page]], () => getCashDesks(filter, limit, page), {
        staleTime: 1000 * 5 * 60, //fresh
    });
}