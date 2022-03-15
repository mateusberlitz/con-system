import { useQuery } from "react-query";
import { api } from "../services/api";

export interface BillFilterData{
    search?: string;
    start_date?: string;
    end_date?: string;
    category?: number;
    company?: number;
    branch?: number;
    source?: number;
    status?: number;
    group_by?: string;
    quota_sales_id?: number;
}

export const getBills = async (filter?: BillFilterData, page: number = 0) => {
    if(filter){
        const { data, headers } = await api.get('/bills', {
            params: {
                page: page,
                search: filter.search,
                category: filter.category,
                company: filter.company,
                branch: filter.branch,
                start_date: filter.start_date,
                end_date: filter.end_date,
                source: filter.source,
                status: filter.status,
                quota_sales_id: filter.quota_sales_id,
                group_by: filter.group_by
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