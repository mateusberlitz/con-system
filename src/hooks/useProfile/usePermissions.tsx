import { useQuery } from "react-query";
import { api } from "../../services/api";
import { getToken, isAuthenticated } from "../../services/auth";

interface Permission{
    id: number;
    name: string;
    created_at: Date;
    updated_at: Date;
}

export async function getPermissions(roleId: number): Promise<Permission[]>{
    const token = getToken();
    let permissions: Permission[] = [];
    let data;

    if(isAuthenticated()){
        const data = await api.get(`/roles/${roleId}/permissions`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        permissions = data.data;
    }
    
    return permissions;
}

export function usePermissions(roleId: number){
    const { data, isLoading, isFetching, error} = useQuery('Permissions', () => getPermissions(roleId), {
        staleTime: 1000 * 60 * 5,
        retry: 10, //fresh
    });
    
    const permissions = data;

    return {permissions, isLoading, isFetching, error};
}