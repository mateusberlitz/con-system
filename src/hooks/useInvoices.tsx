import { useQuery } from "react-query";
import { api } from "../services/api";

export interface InvoicesFilterData{
    search?: string;
    start_date?: string;
    end_date?: string;
    company?: number;
    branch?: number;
    payment?: number;
    group_by?: string;
}

export const getInvoices = async (filter?: InvoicesFilterData, page: number = 0) => {
    if(filter){
        const {data, headers} = await api.get('/invoices', {
            params: {
              page: page,
              search: filter.search,
              company: filter.company,
              branch: filter.branch,
              payment: filter.payment,
              start_date: filter.start_date,
              end_date: filter.end_date,
              group_by: filter.group_by,
            }
        });

        return {data, total: Number(headers['x-total-count'])};
    }

    const { data, headers } = await api.get('/invoices');

    return {data, total: Number(headers['x-total-count'])};
}

export function useInvoices(filter: InvoicesFilterData, page?: number){
    return useQuery(['invoices', [filter, page]], () => getInvoices(filter, page), {
        staleTime: 1000 * 5 * 60, //fresh
    });
}