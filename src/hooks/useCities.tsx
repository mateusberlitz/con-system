import { useQuery } from "react-query";
import { api } from "../services/api";

export interface CitiesFilterData{
    name?: string;
    state_id?: number;
}

export const getCities = async (filter?: CitiesFilterData) => {
    if(filter){
        const {data, headers} = await api.get('/cities', {
            params: {
              name: filter.name,
              state_id: filter.state_id,
            }
        });

        return data;
    }

    const { data } = await api.get('/cities');

    return data;
}

export function useCities(filter?: CitiesFilterData){
    return useQuery(['cities', [filter]], () => getCities(filter), {
        staleTime: 1000 * 5 * 60, //fresh
    });
}