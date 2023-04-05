import { useQuery } from "react-query";
import { api } from "../services/api";

export interface CompanyCommissionsFilterData{
    search?: string;
    start_date?: string;
    end_date?: string;
    parcel_number?: number;
    company_id?: number;
    seller_id?: number;
    branch_id?: number;
    chargeback?: number;
    group?: number;
    quota?: number;
    number_contract?: number;
    year?: string;
    confirmed?: boolean;
    group_by?: string
    is_chargeback?: boolean;
}

export const getCompanyCommissions = async (filter?: CompanyCommissionsFilterData, page: number = 0) => {
    if(filter){
        const {data, headers} = await api.get('/company-commissions', {
            params: {
              page: page,
              search: filter.search,
              company_id: filter.company_id,
              seller_id: filter.seller_id,
              branch_id: filter.branch_id,
              start_date: filter.start_date,
              end_date: filter.end_date,
              parcel_number: filter.parcel_number,
              confirmed: filter.confirmed,
              group: filter.group,
              quota: filter.quota,
              year: filter.year,
              number_contract: filter.number_contract,
              is_chargeback: filter.is_chargeback,
              group_by: filter.group_by,
            }
        });

        return {data, total: Number(headers['x-total-count']), credit: Number(headers['x-total-credit']), value: Number(headers['x-total-value'])};
    }

    const { data, headers } = await api.get('/company-commissions');

    return {data, total: Number(headers['x-total-count']), credit: Number(headers['x-total-credit']), value: Number(headers['x-total-value'])};
}

export function useCompanyCommissions(filter: CompanyCommissionsFilterData, page?: number){
    return useQuery(['company-commissions', [filter, page]], () => getCompanyCommissions(filter, page), {
        staleTime: 1000 * 5 * 60, //fresh
    });
}