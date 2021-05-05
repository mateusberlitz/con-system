import { useQuery } from "react-query";
import { api } from "../services/api";

export const getPermissions = async (roleId?: number) => {
    if(roleId){
        const { data } = await api.get(`/roles/${roleId}/permissions`);

        return data;
    }

    const { data } = await api.get('/permissions');

    return data;
}

export function usePermissions(roleId?: number){
    return useQuery(['permissions', roleId], () => getPermissions(roleId), {
        staleTime: 1000 * 5 * 60, //fresh
    });
}