import { useQuery } from "react-query";
import { api } from "../services/api";

export const getSources = async () => {
    const { data } = await api.get('/sources');

    return data;
}

export function useSources(){
    return useQuery(['sources'], () => getSources(), {
        staleTime: 1000 * 5 * 60, //fresh
    });
}