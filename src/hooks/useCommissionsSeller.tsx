import { useQuery } from "react-query";
import { api } from "../services/api";

export interface CommissionsSellerFilterData{
    search?: string;
    start_date?: string;
    end_date?: string;
    parcel_number?: number;
    company_id?: number;
    branch_id?: number;
    chargeback?: number;
    seller_id?: number;
    team_id?: number;
    group?: number;
    quota?: number;
    number_contract?: number;
    confirmed?: boolean;
    group_by?: string
    is_chargeback?: boolean;
}

export const getCommissionsSeller = async (filter?: CommissionsSellerFilterData, page: number = 0, limit?: number) => {
    //console.log(filter);
    if(filter){
        const { data, headers } = await api.get("/seller-commissions", {
            params: {
                page: page,
                limit: limit,
                search: filter.search,
                company_id: filter.company_id,
                branch_id: filter.branch_id,
                start_date: filter.start_date,
                end_date: filter.end_date,
                parcel_number: filter.parcel_number,
                confirmed: filter.confirmed,
                group: filter.group,
                quota: filter.quota,
                seller_id: filter.seller_id,
                team_id: filter.team_id,
                number_contract: filter.number_contract,
                is_chargeback: filter.is_chargeback,
                group_by: filter.group_by,
            }
        });

        return { data, total: Number(headers['x-total-count'])};
    }

    const { data, headers } = await api.get("/seller-commissions");

    return { data, total: Number(headers['x-total-count'])};
};

export function useCommissionsSeller(filter: CommissionsSellerFilterData, page?: number, limit?: number){
    return useQuery(['commissions', [filter, page]], () => getCommissionsSeller(filter, page, limit), {
        staleTime: 1000 * 5 * 60, //fresh
    });
}