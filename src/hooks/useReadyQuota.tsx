import { useQuery } from "react-query";
import { api } from "../services/api";

export const getReadyQuota = async (id: string) => { 

    const { data } = await api.get(`/ready_quotas/${id}`);

    return data;
}

export function useReadyQuota(id: string){
    return useQuery(['readyQuota', id], () => getReadyQuota(id), {
        staleTime: 1000 * 5 * 60, //fresh
    });
}