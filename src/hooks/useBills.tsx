import { useQuery } from "react-query";
import { api } from "../services/api";

export interface PaymentFilterData{
    search?: string;
    company?: number;
    category?: number;
}

export const getBills = async (filter?: PaymentFilterData) => {
    if(filter){
        const { data } = await api.get('/bills', {
            params: {
              search: filter.search,
              category: filter.category,
              company: filter.company
            }
        });

        return data;
    }

    const { data } = await api.get('/payments');

    return data;
}

export function useBills(filter: PaymentFilterData){
    return useQuery(['payments', filter], () => getBills(filter), {
        staleTime: 1000 * 5 * 60, //fresh
    });
}