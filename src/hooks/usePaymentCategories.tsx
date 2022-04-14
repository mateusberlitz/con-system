import { useQuery } from "react-query";
import { api } from "../services/api";

export const getPaymentCategories = async () => {
    const { data } = await api.get('/pay_categories');

    return data;
}

export function usePaymentCategories(){
    return useQuery(['pay_categories'], () => getPaymentCategories(), {
        staleTime: 1000 * 5 * 60, //fresh
    });
}