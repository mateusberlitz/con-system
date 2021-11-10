import { useQuery } from "react-query";
import { api } from "../services/api";

export interface LogsFilterData{
    search?: string;
    start_date?: string;
    end_date?: string;
    user?: number;
    company?: number;
}

export const getLogs = async (filter?: LogsFilterData, page: number = 0) => {
    if(filter){
        const {data, headers} = await api.get('/logs', {
            params: {
              page: page,
              search: filter.search,
              user: filter.user,
              company: filter.company,
              start_date: filter.start_date,
              end_date: filter.end_date,
            }
        });

        return {data, total: Number(headers['x-total-count'])};
    }

    const { data, headers } = await api.get('/logs');

    return {data, total: Number(headers['x-total-count'])};
}

export function useLogs(filter: LogsFilterData, page?: number){
    return useQuery(['logs', [filter, page]], () => getLogs(filter, page), {
        staleTime: 1000 * 5 * 60, //fresh
    });
}