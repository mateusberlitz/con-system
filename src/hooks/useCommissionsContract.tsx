import { useQuery } from "react-query";
import { api } from "../services/api";

export interface CommissionsContractFilterData{
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
    group_by?: string;
    is_chargeback?: string;
}

export const getCommissionsCompany = async (filter?: CommissionsContractFilterData, page: number = 0) => {
    if(filter){
        const { data, headers } = await api.get("/contracts", {
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
                branch: filter.branch,
                group_by: filter.group_by,
                is_chargeback: filter.is_chargeback,
            }
        });

        return { data, total: Number(headers['x-total-count'])};
    }

    const { data, headers } = await api.get("/contracts");

    return { data, total: Number(headers['x-total-count'])};
};

export function useCommissionsCompany(filter: CommissionsContractFilterData, page?: number){
    return useQuery(['commissions', [filter, page]], () => getCommissionsCompany(filter, page), {
        staleTime: 1000 * 5 * 60, //fresh
    });
}