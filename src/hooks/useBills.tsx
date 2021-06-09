import { useQuery } from "react-query";
import { api } from "../services/api";

export interface BillFilterData{
    search?: string;
    start_date?: string;
    end_date?: string;
    category?: number;
    company?: number;
    source?: number;
}

export const getBills = async (filter?: BillFilterData) => {
    if(filter){
        const { data } = await api.get('/bills', {
            params: {
                search: filter.search,
                category: filter.category,
                company: filter.company,
                start_date: filter.start_date,
                end_date: filter.end_date,
                source: filter.source
            }
        });

        return data;
    }

    const { data } = await api.get('/bills');

    return data;
}

export function useBills(filter: BillFilterData){
    return useQuery(['bills', filter], () => getBills(filter), {
        staleTime: 1000 * 5 * 60, //fresh
    });
}