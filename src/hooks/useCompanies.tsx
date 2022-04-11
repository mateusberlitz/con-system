import { useQuery } from "react-query";
import { api } from "../services/api";

export const getCompanies = async () => {
    const { data } = await api.get('/companies');

    return data;
}

export function useCompanies(){
    return useQuery(['companies'], () => getCompanies(), {
        staleTime: 1000 * 5 * 60, //fresh
    });
}