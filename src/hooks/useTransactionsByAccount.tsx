import { useQuery } from "react-query";
import { api } from "../services/api";

export interface TransactionsByAccountFilterData{
    transaction_type?: string;
    title?: string;
    category?: number;
    company?: number;
    branch?: number;
    year?: string;
    quote?: string;
}

export const getTransactions = async (filter?: TransactionsByAccountFilterData, page: number = 0) => {
    if(filter){
        const {data, headers} = await api.get('/yearByAccount', {
            params: {
              page: page,
              title: filter.title,
              category: filter.category,
              company: filter.company,
              branch: filter.branch,
              year: filter.year,
              transaction_type: filter.transaction_type
            }
        });

        return {data, total: Number(headers['x-total-count'])};
    }

    const { data, headers } = await api.get('/yearByAccount');

    return {data, total: Number(headers['x-total-count'])};
}

export function useTransactionsByAccount(filter: TransactionsByAccountFilterData, page?: number){
    return useQuery(['yearByAccount', [filter, page]], () => getTransactions(filter, page), {
        staleTime: 1000 * 5 * 60, //fresh
    });
}