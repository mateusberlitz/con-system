import { useQuery } from "react-query";
import { api } from "../services/api";

export const getStates = async () => {
    const { data } = await api.get('/states');

    return data;
}

export function useStates(){
    return useQuery(['states'], () => getStates(), {
        staleTime: 1000 * 5 * 60, //fresh
    });
}