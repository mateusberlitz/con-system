import { useQuery } from "react-query";
import { api } from "../services/api";

export interface CashFlowsFilterData{
    search?: string;
    start_date?: string;
    end_date?: string;
    category?: number;
    company?: number;
    branch?: number;
    page?: number;
    limit?: number;
}

export const getCashFlows = async (filter?: CashFlowsFilterData, limit: number = 20, page: number = 0) => {
    if(filter){
        const { data, headers } = await api.get('/cashflows', {
            params: {
              page: page,
              limit: limit,
              search: filter.search,
              company: filter.company,
              branch: filter.branch,
              category: filter.category,
              start_date: filter.start_date,
              end_date: filter.end_date,
            }
        });

        return {data, total: Number(headers['x-total-count']), initialCash: Number(headers['x-initial-cash'])};

    }

    const { data, headers } = await api.get('/cashflows');

    return {data, total: Number(headers['x-total-count']), initialCash: Number(headers['x-initial-cash'])};
}

export function useCashFlows(filter: CashFlowsFilterData, limit: number = 20, page: number){
    return useQuery(['cashflows', [filter, page]], () => getCashFlows(filter, limit, page), {
        staleTime: 1000 * 5 * 60, //fresh
    });
}