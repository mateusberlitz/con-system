import { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react";
import { isAuthenticated } from "../../services/auth";
import { encodePermissions, simplifyPermissions, decodePermissions } from "../../services/permissionsSecurity";
import { getMe } from "./useMe";
import { getPermissions } from "./useProfilePermissions";

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

// interface Permission{
//     id: number;
//     name: string;
//     created_at: Date;
//     updated_at: Date;
// }

interface SimplePermission{
    name: string;
}

interface ProfileContextData{
    profile?: Profile;
    permissions?: SimplePermission[];
    loadProfile: () => void;
}

const ProfileContext = createContext<ProfileContextData>({} as ProfileContextData);

export function ProfileProvider({ children } : ProfileProviderProps){
    const [permissions, setPermissions] = useState<SimplePermission[]>(():SimplePermission[]|any => {
        const storagedPermissions = localStorage.getItem('@lance/permissions');
    
        if (storagedPermissions) {
            const parsedPermissions = JSON.parse(storagedPermissions);
            
            if(parsedPermissions){
                return decodePermissions(parsedPermissions);
            }
        }
    
        return [];
    });


    const [profile, setProfile] = useState<Profile>(() => {
        const storagedProfile = localStorage.getItem('@lance/profile');
    
        if (storagedProfile) {
          return JSON.parse(storagedProfile);
        }
    
        return {};
    });



    //PREFER STATE OF PROFILE
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


    //PREFER STATE OF PERMISSIONS
    const previousPermissionsRef = useRef<SimplePermission[]>();

    useEffect(() => {
        previousPermissionsRef.current = permissions;
    });

    const permissionsPreviousValue = previousPermissionsRef.current ?? permissions;

    useEffect(() => {
        if(permissionsPreviousValue !== permissions){
            if(permissions){
                const toStoragePermissions = encodePermissions(permissions);
                localStorage.setItem('@lance/permissions', JSON.stringify(toStoragePermissions));
            }
        }
    }, [permissions, permissionsPreviousValue]);



    //LOADERS
    const loadProfile = async () => {
        const requestedProfile = await getMe();

        setProfile(requestedProfile);

        loadPermissions(requestedProfile.role.id);
    }

    const loadPermissions = async (roleId = profile.role.id) => {
        const requestedPermissions = await getPermissions(roleId);
        const simplifiedPermissions = simplifyPermissions(requestedPermissions);

        setPermissions(simplifiedPermissions);
    }

    if(isAuthenticated()){
        if(!profile.name){
            loadProfile();
        }

        if(permissions.length === 0){
            loadPermissions();
        }
    }

    //const { permissions } = usePermissions(profile.role ? profile.role.id : 0);

    return(
        <ProfileContext.Provider value={{profile, permissions, loadProfile}}>
            {children}
        </ProfileContext.Provider>
    )
}

export function HasPermission(permissions: SimplePermission[] | undefined, neededPermission : string,){

    if(permissions){
        if(neededPermission === ""){
            return true;
        }

        if(permissions.find(permission => permission.name === neededPermission)){
            return true;
        }
    }

    return false;
}

export const useProfile = () => useContext(ProfileContext);