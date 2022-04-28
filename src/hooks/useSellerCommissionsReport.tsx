import { useQuery } from "react-query";
import { api } from "../services/api";

export interface SellerCommissionsReportFilterData{
    title?: string;
    category?: number;
    company?: number;
    branch?: number;
    year?: string;
}

export const getSellerCommissionsReport = async (filter?: SellerCommissionsReportFilterData, page: number = 0) => {
    if(filter){
        const {data, headers} = await api.get('/seller-commissions-report', {
            params: {
              page: page,
              title: filter.title,
              category: filter.category,
              company: filter.company,
              branch: filter.branch,
              year: filter.year,
            }
        });

        return {data, total: Number(headers['x-total-count'])};
    }

    const { data, headers } = await api.get('/seller-commissions-report');

    return {data, total: Number(headers['x-total-count'])};
}

export function useSellerCommissionsReport(filter: SellerCommissionsReportFilterData, page?: number){
    return useQuery(['seller-commissions-report', [filter, page]], () => getSellerCommissionsReport(filter, page), {
        staleTime: 1000 * 5 * 60, //fresh
    });
}