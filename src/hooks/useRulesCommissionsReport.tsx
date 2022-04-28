import { useQuery } from "react-query";
import { api } from "../services/api";

export interface RulesCommissionsReportFilterData{
    title?: string;
    category?: number;
    company?: number;
    branch?: number;
    year?: string;
}

export const getRulesCommissionsReport = async (filter?: RulesCommissionsReportFilterData, page: number = 0) => {
    if(filter){
        const {data, headers} = await api.get('/rules-commissions-report', {
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

    const { data, headers } = await api.get('/rules-commissions-report');

    return {data, total: Number(headers['x-total-count'])};
}

export function useRulesCommissionsReport(filter: RulesCommissionsReportFilterData, page?: number){
    return useQuery(['rules-commissions-report', [filter, page]], () => getRulesCommissionsReport(filter, page), {
        staleTime: 1000 * 5 * 60, //fresh
    });
}