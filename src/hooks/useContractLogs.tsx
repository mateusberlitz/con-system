import { useQuery } from "react-query";
import { api } from "../services/api";

export interface ContractLogsFilterData{
    search?: string;
    start_date?: string;
    end_date?: string;
    number_contract?: string;
    quote?: string;
    active?: string;
    group?: string;
    parcel_number?: string;
    company_id?: number;
    branch_id?: number;
    group_by?: string;
    is_chargeback?: string;
    seller_id?: number;
    team_id?: number;
}

export const getContractLogs = async (filter?: ContractLogsFilterData, page: number = 0) => {
    if(filter){
        const { data, headers } = await api.get("/contract_logs", {
            params: {
                page: page,
                search: filter.search,
                start_date: filter.start_date,
                end_date: filter.end_date,
                number_contract: filter.number_contract,
                quote: filter.quote,
                active: filter.active,
                group: filter.group,
                parcel_number: filter.parcel_number,
                company_id: filter.company_id,
                branch_id: filter.branch_id,
                group_by: filter.group_by,
                is_chargeback: filter.is_chargeback,
                seller_id: filter.seller_id,
                team_id: filter.team_id,
            }
        });

        return { data, total: Number(headers['x-total-count'])};
    }

    const { data, headers } = await api.get("/contracts");

    return { data, total: Number(headers['x-total-count'])};
};

export function useContractLogs(filter: ContractLogsFilterData, page?: number){
    return useQuery(['contract-logs', [filter, page]], () => getContractLogs(filter, page), {
        staleTime: 1000 * 5 * 60, //fresh
    });
}