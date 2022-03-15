import { useQuery } from "react-query";
import { api } from "../services/api";

export interface TaskFilterData{
    search?: string;
    start_date?: string;
    end_date?: string;
    author?: number;
    company?: number;
    branch?: number;
}

export const getTasks = async (filter?: TaskFilterData, page: number = 0) => {
    if(filter){
        const {data, headers} = await api.get('/tasks', {
            params: {
              page: page,
              search: filter.search,
              author: filter.author,
              company: filter.company,
              branch: filter.branch,
              start_date: filter.start_date,
              end_date: filter.end_date,
            }
        });

        return {data, total: Number(headers['x-total-count'])};
    }

    const { data, headers } = await api.get('/tasks');

    return {data, total: Number(headers['x-total-count'])};
}

export function useTasks(filter: TaskFilterData, page?: number){
    return useQuery(['tasks', [filter, page]], () => getTasks(filter, page), {
        staleTime: 1000 * 5 * 60, //fresh
    });
}