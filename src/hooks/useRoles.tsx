import { useQuery } from "react-query";
import { api } from "../services/api";

export const getRoles = async () => {
    const { data } = await api.get('/roles');

    return data;
}

export function useRoles(){
    return useQuery(['roles'], () => getRoles(), {
        staleTime: 1000 * 5 * 60, //fresh
    });
}