import { useQuery } from "react-query";
import { api } from "../services/api";

export interface quotaReportFilterData{
    type?: string;
    company?: number;
    branch?: number;
    year?: string;
}

export const getQuotaReport = async (filter?: quotaReportFilterData, page: number = 0) => {
    if(filter){
        const {data} = await api.get('/quota_reports', {
            params: {
              page: page,
              type: filter.type,
              company: filter.company,
              branch: filter.branch,
              year: filter.year,
            }
        });

        return data;
    }

    const { data } = await api.get('/quota_reports');

    return data;
}

export function useQuotaReport(filter: quotaReportFilterData, page?: number){
    return useQuery(['quotaReports', [filter, page]], () => getQuotaReport(filter, page), {
        staleTime: 1000 * 5 * 60, //fresh
    });
}