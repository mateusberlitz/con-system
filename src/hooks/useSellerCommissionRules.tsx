import { useQuery } from "react-query";
import { api } from "../services/api";

export interface sellerCommissionsRulesFilterData{
    search?: string;
    start_date?: string;
    end_date?: string;
    company_id?: number;
    branch_id?: number;
    user?: number;
    value?: string;
    status?: number;
    origin?: number;
    group_by?: string;
}

export const getSellerCommissionRules = async (filter?: sellerCommissionsRulesFilterData, page: number = 0) => {
    if(filter){
        const {data, headers} = await api.get('/seller-commission-rules', {
            params: {
              page: page,
              search: filter.search,
              status: filter.status,
              origin: filter.origin,
              company_id: filter.company_id,
              branch_id: filter.branch_id,
              start_date: filter.start_date,
              end_date: filter.end_date,
              user: filter.user,
              value: filter.value,
              group_by: filter.group_by,
            }
        });

        return data;
    }
    
    const { data, headers } = await api.get('/seller-commission-rules');

    return data;
}

export function useSellerCommissionRules(filter: sellerCommissionsRulesFilterData, page?: number){
    return useQuery(['sellerCommissionRules', [filter, page]], () => getSellerCommissionRules(filter, page), {
        staleTime: 1000 * 5 * 60, //fresh
    });
}