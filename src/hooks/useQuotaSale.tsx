import { useQuery } from "react-query";
import { api } from "../services/api";

export const getQuotaSale = async (id: string) => { 

    const { data } = await api.get(`/quota_sales/${id}`);

    return data;
}

export function useQuotaSale(id: string){
    return useQuery(['QuotaSale', id], () => getQuotaSale(id), {
        staleTime: 1000 * 5 * 60, //fresh
    });
}