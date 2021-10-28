import { useQuery } from "react-query";
import { api } from "../services/api";

export interface LeadsFilterData{
    search?: string;
    start_date?: string;
    end_date?: string;
    company?: number;
    user?: number;
    value?: string;
    status?: number;
    group_by?: string;
}

export const getLeads = async (filter?: LeadsFilterData, page: number = 0) => {
    if(filter){
        const {data, headers} = await api.get('/leads', {
            params: {
              page: page,
              search: filter.search,
              status: filter.status,
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

    const { data, headers } = await api.get('/leads');

    return {data, total: Number(headers['x-total-count'])};
}

export function useLeads(filter: LeadsFilterData, page?: number){
    return useQuery(['leads', [filter, page]], () => getLeads(filter, page), {
        staleTime: 1000 * 5 * 60, //fresh
    });
}