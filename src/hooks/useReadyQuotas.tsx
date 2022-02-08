import { useQuery } from "react-query";
import { api } from "../services/api";

export interface QuotaFilterData{
    search?: string;
    start_date?: string;
    end_date?: string;
    segment?: string;
    company?: number;
    contemplated_type?: string;
    group?: string;
    quote?: string;
    group_by?: string;
    status?: number;
    sold?: string;
}

export const getReadyQuotas = async (filter?: QuotaFilterData, page: number = 0) => {
    if(filter){
        const {data, headers} = await api.get('/ready_quotas', {
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
              sold: filter.sold,
            }
        });

        return {data, total: Number(headers['x-total-count'])};
    }

    const { data, headers } = await api.get('/ready_quotas');

    return {data, total: Number(headers['x-total-count'])};
}

export function useReadyQuotas(filter: QuotaFilterData, page?: number){
    return useQuery(['readyQuotas', [filter, page]], () => getReadyQuotas(filter, page), {
        staleTime: 1000 * 5 * 60, //fresh
    });
}