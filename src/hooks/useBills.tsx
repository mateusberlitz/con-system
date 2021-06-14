import { useQuery } from "react-query";
import { api } from "../services/api";

export interface BillFilterData{
    search?: string;
    start_date?: string;
    end_date?: string;
    category?: number;
    company?: number;
    source?: number;
}

export const getBills = async (filter?: BillFilterData, page: number = 0) => {
    if(filter){
        const { data, headers } = await api.get('/bills', {
            params: {
                page: page,
                search: filter.search,
                category: filter.category,
                company: filter.company,
                start_date: filter.start_date,
                end_date: filter.end_date,
                source: filter.source
            }
        });

        return {data, total: Number(headers['x-total-count'])};
    }

    const { data, headers } = await api.get('/bills');

    return {data, total: Number(headers['x-total-count'])};
}

export function useBills(filter: BillFilterData, page?: number){
    return useQuery(['bills', [filter, page]], () => getBills(filter, page), {
        staleTime: 1000 * 5 * 60, //fresh
    });
}