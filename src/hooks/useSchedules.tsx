import { useQuery } from "react-query";
import { api } from "../services/api";

export interface SchedulesFilterData{
    search?: string;
    start_date?: string;
    end_date?: string;
    company?: number;
    branch?: number;
    user?: number;
    group_by?: string;
    year?: string;
    status?: number;
    team_id?: number;
}

export const getSchedules = async (filter?: SchedulesFilterData, page: number = 0) => {
    if(filter){
        const {data, headers} = await api.get('/schedules', {
            params: {
              page: page,
              search: filter.search,
              company: filter.company,
              branch: filter.branch,
              user: filter.user,
              start_date: filter.start_date,
              end_date: filter.end_date,
              group_by: filter.group_by,
              year: filter.year,
              status: filter.status,
            }
        });

        return {data, total: Number(headers['x-total-count'])};
    }

    const { data, headers } = await api.get('/schedules');

    return {data, total: Number(headers['x-total-count'])};
}

export function useSchedules(filter: SchedulesFilterData, page?: number){
    return useQuery(['schedules', [filter, page]], () => getSchedules(filter, page), {
        staleTime: 1000 * 5 * 60, //fresh
    });
}