import { useQuery } from "react-query";
import { api } from "../services/api";

export interface CompanyCommissionsFilterData{
    search?: string;
    start_date?: string;
    end_date?: string;
    parcel_number?: number;
    company?: number;
    branch?: number;
    chargeback?: number;
    group?: number;
    quota?: number;
    contract_number?: number;
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
              company: filter.company,
              branch: filter.branch,
              start_date: filter.start_date,
              end_date: filter.end_date,
              parcel_number: filter.parcel_number,
              confirmed: filter.confirmed,
              group: filter.group,
              quota: filter.quota,
              contract_number: filter.contract_number,
              is_chargeback: filter.is_chargeback,
              group_by: filter.group_by,
            }
        });

        return {data, total: Number(headers['x-total-count'])};
    }

    const { data, headers } = await api.get('/company-commissions');

    return {data, total: Number(headers['x-total-count'])};
}

export function useCompanyCommissions(filter: CompanyCommissionsFilterData, page?: number){
    return useQuery(['company-commissions', [filter, page]], () => getCompanyCommissions(filter, page), {
        staleTime: 1000 * 5 * 60, //fresh
    });
}