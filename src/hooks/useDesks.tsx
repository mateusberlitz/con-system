import { useQuery } from "react-query";
import { api } from "../services/api";

export const getDesks = async () => {
    const { data } = await api.get('/desks');

    return data;
}

export function useDesks(){
    return useQuery(['desks'], () => getDesks(), {
        staleTime: 1000 * 5 * 60, //fresh
    });
}