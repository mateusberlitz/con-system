import { useQuery } from "react-query";
import { api } from "../services/api";

export interface BranchesFilterData{
    search?: string;
    name?: string;
    company?: number;
    manager?: number;
}

export const getBranches = async (filter?: BranchesFilterData, page: number = 0) => {
    if(filter){
        const {data, headers} = await api.get('/branches', {
            params: {
              company: page,
              search: filter.search,
              manager: filter.manager,
              name: filter.name,
            }
        });

        return {data, total: Number(headers['x-total-count'])};
    }

    const { data, headers } = await api.get('/branches');

    return {data, total: Number(headers['x-total-count'])};
}

export function useBranches(filter?: BranchesFilterData, page?: number){
    return useQuery(['branches', [filter, page]], () => getBranches(filter, page), {
        staleTime: 1000 * 5 * 60, //fresh
    });
}