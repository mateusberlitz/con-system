import { useQuery } from "react-query";
import { api } from "../services/api";

export interface CommissionsSellerFilterData{
    search?: string;
    start_date?: string;
    end_date?: string;
    reversal?: string;
    contract?: string;
    quote?: string;
    status?: string;
    group?: string;
    parcel?: string;
    company?: number;
    branch?: number;
}

export const getCommissionsSeller = async (filter?: CommissionsSellerFilterData, page: number = 0) => {
    if(filter){
        const { data, headers } = await api.get("/seller-commissions", {
            params: {
                page: page,
                search: filter.search,
                start_date: filter.start_date,
                end_date: filter.end_date,
                reversal: filter.reversal,
                contract: filter.contract,
                quote: filter.quote,
                status: filter.status,
                group: filter.group,
                parcel: filter.parcel,
                company: filter.company,
                branch: filter.branch
            }
        });

        return { data, total: Number(headers['x-total-count'])};
    }

    const { data, headers } = await api.get("/seller-commissions");

    return { data, total: Number(headers['x-total-count'])};
};

export function useCommissionsSeller(filter: CommissionsSellerFilterData, page?: number){
    return useQuery(['commissions', [filter, page]], () => getCommissionsSeller(filter, page), {
        staleTime: 1000 * 5 * 60, //fresh
    });
}