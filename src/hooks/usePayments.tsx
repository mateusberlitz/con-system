import { useQuery } from "react-query";
import { api } from "../services/api";

export interface PaymentFilterData{
    search?: string;
    start_date?: string;
    end_date?: string;
    category?: number;
    company?: number;
    contract?: number;
    pay_to_user?: number;
    group?: string;
    quote?: string;
}

export const getPayments = async (filter?: PaymentFilterData) => {
    if(filter){
        const { data } = await api.get('/payments', {
            params: {
              search: filter.search,
              category: filter.category,
              company: filter.company,
              start_date: filter.start_date,
              end_date: filter.end_date,
              contract: filter.contract,
              pay_to_user: filter.pay_to_user,
              group: filter.group,
              quote: filter.quote,
            }
        });

        return data;
    }

    const { data } = await api.get('/payments');

    return data;
}

export function usePayments(filter: PaymentFilterData){
    return useQuery(['payments', filter], () => getPayments(filter), {
        staleTime: 1000 * 5 * 60, //fresh
    });
}