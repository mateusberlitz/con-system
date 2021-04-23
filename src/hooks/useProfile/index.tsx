import { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react";
import { getMe, useMe } from "./useMe";
import { getPermissions, usePermissions } from "./usePermissions";

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
    permissions?: Permission[] | undefined;
    loadProfile: () => void;
}

const ProfileContext = createContext<ProfileContextData>({} as ProfileContextData);

export function ProfileProvider({ children } : ProfileProviderProps){
    const [profile, setProfile] = useState<Profile>(() => {
        const storagedProfile = localStorage.getItem('@lance/profile');
    
        if (storagedProfile) {
          return JSON.parse(storagedProfile);
        }
    
        return {};
    });

    const previousProfileRef = useRef<Profile>();

    useEffect(() => {
        previousProfileRef.current = profile;
    });

    const profilePreviousValue = previousProfileRef.current ?? profile;

    useEffect(() => {
        if(profilePreviousValue !== profile){
            localStorage.setItem('@lance/profile', JSON.stringify(profile));
        }
    }, [profile, profilePreviousValue]);

    const loadProfile = async () => {
        const requestedProfile = await getMe();

        setProfile(requestedProfile);
    }

    if(!profile.name){
        loadProfile();
    }

    const { permissions } = usePermissions(profile.role.id);

    return(
        <ProfileContext.Provider value={{profile, permissions, loadProfile}}>
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