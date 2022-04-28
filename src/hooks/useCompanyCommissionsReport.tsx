import { useQuery } from "react-query";
import { api } from "../services/api";

export interface CompanyCommissionsReportFilterData{
    title?: string;
    category?: number;
    company?: number;
    branch?: number;
    year?: string;
}

export const getCompanyCommissionsReport = async (filter?: CompanyCommissionsReportFilterData, page: number = 0) => {
    if(filter){
        const {data, headers} = await api.get('/company-commissions-report', {
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

    const { data, headers } = await api.get('/company-commissions-report');

    return {data, total: Number(headers['x-total-count'])};
}

export function useCompanyCommissionsReport(filter: CompanyCommissionsReportFilterData, page?: number){
    return useQuery(['company-commissions-report', [filter, page]], () => getCompanyCommissionsReport(filter, page), {
        staleTime: 1000 * 5 * 60, //fresh
    });
}