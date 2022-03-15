import { useQuery } from "react-query";
import { api } from "../../services/api";
import { getToken } from "../../services/auth";
import { Branch, Company } from "../../types";

export interface Profile{
    id: number,
    name: string;
    last_name: string;
    email: string;
    image: string;
    cpf: string;
    email_verified_at: Date;
    phone: string;
    role: {
        id: number,
        name: string,
        desk_id: number,
        created_at: Date;
        updated_at: Date;
    };
    companies: Company[];
    branches: Branch[];
    created_at: Date;
    updated_at: Date;
}

export async function getMe(): Promise<Profile>{
    const token = getToken();

    const { data } = await api.get("/me", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return data;
}

export function useMe(){
    const { data, isLoading, isFetching, error} = useQuery('Me', () => getMe(), {
        staleTime: 1000 * 60 * 5, //fresh
    });

    const profile = data;

    return {profile, isLoading, isFetching, error};
}