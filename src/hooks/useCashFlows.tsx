import { useQuery } from "react-query";
import { api } from "../services/api";

export interface CashFlowsFilterData{
    search?: string;
    start_date?: string;
    end_date?: string;
    category?: number;
    company?: number;
}

export const getCashFlows = async (filter?: CashFlowsFilterData) => {
    if(filter){
        const { data } = await api.get('/cashflows', {
            params: {
              search: filter.search,
              company: filter.company,
              category: filter.category,
              start_date: filter.start_date,
              end_date: filter.end_date,
            }
        });

        return data;
    }

    const { data } = await api.get('/cashflows');

    return data;
}

export function useCashFlows(filter: CashFlowsFilterData){
    return useQuery(['cashflows', filter], () => getCashFlows(filter), {
        staleTime: 1000 * 5 * 60, //fresh
    });
}