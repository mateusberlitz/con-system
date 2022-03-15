import { useQuery } from "react-query";
import { api } from "../services/api";

export interface UserFilterData{
    search?: string;
    company?: number;
    branch?: number;
    role?: number;
    goals?: boolean;
}

export const getUsers = async (filter?: UserFilterData) => {
    if(filter){
        const { data } = await api.get('/users', {
            params: {
              search: filter.search,
              role: filter.role,
              company: filter.company,
              branch: filter.branch,
              goals: filter.goals
            }
        });

        return data;
    }

    const { data } = await api.get('/users');

    return data;
}

export function useUsers(filter: UserFilterData){
    return useQuery(['users', filter], () => getUsers(filter), {
        staleTime: 1000 * 5 * 60, //fresh
    });
}