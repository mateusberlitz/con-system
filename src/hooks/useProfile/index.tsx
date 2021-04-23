import { useQuery } from "react-query";
import { createContext, ReactNode, useContext, useState } from "react";
import { api } from "../../services/api";
import { getToken } from "../../services/auth";
import { useMe } from "./useMe";
import { usePermissions } from "./usePermissions";

interface ProfileProviderProps{
    children: ReactNode;
}

interface Profile{
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
    created_at: Date;
    updated_at: Date;
}

interface Permission{
    id: number;
    name: string;
    created_at: Date;
    updated_at: Date;
}

interface ProfileContextData{
    profile?: Profile;
    permissions?: Permission[];
}

const ProfileContext = createContext<ProfileContextData>({} as ProfileContextData);

export function ProfileProvider({ children } : ProfileProviderProps){
    const token = getToken();

    //const [profile, setProfile] = useState<Profile>();
    //const [permissions, setPermissions] = useState<Permission[]>([]);
    
    const { profile, isLoading, isFetching, error} = useMe();
    const { permissions } = usePermissions((profile ? profile.role.id : 0));

    console.log(profile, permissions);

    return(
        <ProfileContext.Provider value={{profile, permissions}}>
            {children}
        </ProfileContext.Provider>
    )
}

export function HasPermission(permissions: Permission[] | undefined, neededPermission : string,){

    if(permissions){
        permissions.map(permission => permission.name === neededPermission);
    }

    return false;
}

export const useProfile = () => useContext(ProfileContext);