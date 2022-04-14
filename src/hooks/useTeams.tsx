import { useQuery } from "react-query";
import { api } from "../services/api";

export interface TeamsFilterData{
    name?: string;
    company?: number;
    branch?: number;
    manager?: number;
}

export const getTeams = async (filter?: TeamsFilterData, page: number = 0) => {
    if(filter){
        const {data, headers} = await api.get('/teams', {
            params: {
              company: page,
              branch: filter.branch,
              manager: filter.manager,
              name: filter.name,
            }
        });

        return {data, total: Number(headers['x-total-count'])};
    }

    const { data, headers } = await api.get('/teams');

    return {data, total: Number(headers['x-total-count'])};
}

export function useTeams(filter: TeamsFilterData, page?: number){
    return useQuery(['teams', [filter, page]], () => getTeams(filter, page), {
        staleTime: 1000 * 5 * 60, //fresh
    });
}