import { useQuery } from "react-query";
import { api } from "../services/api";

export interface PaymentFilterData{
    search?: string;
    start_date?: string;
    end_date?: string;
    category?: number;
    company?: number;
    branch?: number;
    contract?: number;
    cpf?: string;
    group?: string;
    quote?: string;
    group_by?: string;
    status?: number;
    pendency?: number;
    city_id?: number;
    state_id?: number;
}

export const getCustomers = async (filter?: PaymentFilterData, page: number = 0) => {
    if(filter){
        const {data, headers} = await api.get('/customers', {
            params: {
              page: page,
              search: filter.search,
              company: filter.company,
              branch: filter.branch,
              start_date: filter.start_date,
              end_date: filter.end_date,
              contract: filter.contract,
              cpf: filter.cpf,
              group: filter.group,
              quote: filter.quote,
              city_id: filter.city_id,
              state_id: filter.state_id,
              group_by: filter.group_by,
            }
        });

        return {data, total: Number(headers['x-total-count'])};
    }

    const { data, headers } = await api.get('/customers');

    return {data, total: Number(headers['x-total-count'])};
}

export function useCustomers(filter: PaymentFilterData, page?: number){
    return useQuery(['customers', [filter, page]], () => getCustomers(filter, page), {
        staleTime: 1000 * 5 * 60, //fresh
    });
}