import { useQuery } from "react-query";
import { api } from "../services/api";

export const getProviders = async () => {
    const { data } = await api.get('/providers');

    return data;
}

export function useProviders(){
    return useQuery(['providers'], () => getProviders(), {
        staleTime: 1000 * 5 * 60, //fresh
    });
}