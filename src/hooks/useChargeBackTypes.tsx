import { useQuery } from "react-query";
import { api } from "../services/api";

export const getChargeBacksTypes = async () => {
    const { data } = await api.get('/chargeback-types');

    return data.data;
}

export function useChargeBackTypes(){
    return useQuery(['chargeback-types'], () => getChargeBacksTypes(), {
        staleTime: 1000 * 5 * 60, //fresh
    });
}