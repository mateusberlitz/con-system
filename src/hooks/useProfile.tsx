import { useQuery } from "react-query";
import { createContext, ReactNode, useContext, useState } from "react";
import { api } from "../services/api";
import { getToken } from "../services/auth";

interface ProfileProviderProps{
    children: ReactNode;
}

interface ProfileContextData{
    profile: Profile;
    permissions: Permission[];
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
    permission_id: number;
}

const ProfileContext = createContext<ProfileContextData>({} as ProfileContextData);

export function ProfileProvider({ children } : ProfileProviderProps){
    const token = getToken();
    const [profile, setProfile] = useState<Profile>();

    useQuery('profile', async () => {
        const { data } = await api.get("/me", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        setProfile(data);
    },{staleTime: 60*1000});

    const [permissions, setPermissions] = useState<Permissions[]>([]);

    // return(
    //     <ProfileContext.Provider value={{profile, permission}}>
    //         {children}
    //     </ProfileContext.Provider>
    // )
}

export const useProfile = () => useContext(ProfileContext);