import { useQuery } from "react-query";
import { api } from "../services/api";

export const getSellerCommissionsRules = async () => {
    const { data } = await api.get('/seller-commission-rule-parcels');

    return data;
}

export function useSellerCommissionsRules(){
    return useQuery(['sellerCommissionsRules'], () => getSellerCommissionsRules(), {
        staleTime: 1000 * 5 * 60, //fresh
    });
}