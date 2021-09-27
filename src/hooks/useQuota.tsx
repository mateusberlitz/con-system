import { useQuery } from "react-query";
import { api } from "../services/api";

export const getQuota = async (id: string) => { 

    const { data } = await api.get(`/quotas/${id}`);

    return data;
}

export function useQuota(id: string){
    return useQuery(['quota', id], () => getQuota(id), {
        staleTime: 1000 * 5 * 60, //fresh
    });
}