import { useQuery } from "react-query";
import { api } from "../services/api";

export interface SalesFilterData{
    search?: string;
    start_date?: string;
    end_date?: string;
    company?: number;
    user?: number;
    value?: string;
    status?: number;
    origin?: number;
    group_by?: string;
}

export const getSales = async (filter?: SalesFilterData, page: number = 0) => {
    if(filter){
        const {data, headers} = await api.get('/sales', {
            params: {
              page: page,
              search: filter.search,
              status: filter.status,
              origin: filter.origin,
              company: filter.company,
              start_date: filter.start_date,
              end_date: filter.end_date,
              user: filter.user,
              value: filter.value,
              group_by: filter.group_by,
            }
        });

        return {data, total: Number(headers['x-total-count'])};
    }

    const { data, headers } = await api.get('/sales');

    return {data, total: Number(headers['x-total-count'])};
}

export function useSales(filter: SalesFilterData, page?: number){
    return useQuery(['sales', [filter, page]], () => getSales(filter, page), {
        staleTime: 1000 * 5 * 60, //fresh
    });
}