import { useQuery } from "react-query";
import { api } from "../services/api";

export interface QuotaSaleFilterData{
    search?: string;
    start_date?: string;
    end_date?: string;
    segment?: string;
    company?: number;
    contemplated_type?: string;
    group?: string;
    quote?: string;
    group_by?: string;
    status?: number
}

export const getQuotaSales = async (filter?: QuotaSaleFilterData, page: number = 0) => {
    if(filter){
        const {data, headers} = await api.get('/quotas', {
            params: {
              page: page,
              search: filter.search,
              segment: filter.segment,
              company: filter.company,
              start_date: filter.start_date,
              end_date: filter.end_date,
              contemplated_type: filter.contemplated_type,
              group: filter.group,
              quote: filter.quote,
              status: filter.status,
              group_by: filter.group_by,
            }
        });

        return {data, total: Number(headers['x-total-count'])};
    }

    const { data, headers } = await api.get('/quota_sales');

    return {data, total: Number(headers['x-total-count'])};
}

export function useQuotaSales(filter: QuotaSaleFilterData, page?: number){
    return useQuery(['quotaSales', [filter, page]], () => getQuotaSales(filter, page), {
        staleTime: 1000 * 5 * 60, //fresh
    });
}