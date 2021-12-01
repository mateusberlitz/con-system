import { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react";
import { isAuthenticated } from "../../services/auth";
import { encodePermissions, simplifyPermissions, decodePermissions } from "../../services/permissionsSecurity";
import { getMe, Profile } from "./useMe";
import { getPermissions } from "./useProfilePermissions";

interface ProfileProviderProps{
    children: ReactNode;
}

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
        const loadedProfile = await getMe();

        loadPermissions(loadedProfile.role.id);

        localStorage.setItem('@lance/company', JSON.stringify(loadedProfile.companies[0] ? loadedProfile.companies[0] : ''));

        setProfile(loadedProfile);
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

export function getInitialPage(permissions: SimplePermission[] | undefined){

    if(HasPermission(permissions, "Financeiro Limitado") || HasPermission(permissions, "Financeiro Completo")){
        return '/financeiro'
    }

    if(HasPermission(permissions, "Contempladas")){
        return '/contempladas'
    }

    if(HasPermission(permissions, "Vendas Limitado") || HasPermission(permissions, "Vendas Completo")){
        return '/comercial'
    }

    return '/home';
}

export const useProfile = () => useContext(ProfileContext);