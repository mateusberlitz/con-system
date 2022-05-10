import { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { api } from "../../services/api";
import { getToken, isAuthenticated, logout } from "../../services/auth";
import { encodePermissions, simplifyPermissions, decodePermissions } from "../../services/permissionsSecurity";
import { Company, User } from "../../types";
import { useTenant } from "../useTenant";
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
    isAuthenticated: boolean;
}

const ProfileContext = createContext<ProfileContextData>({} as ProfileContextData);

export function ProfileProvider({ children } : ProfileProviderProps){
    const history = useHistory();
    const { prefix } = useTenant();

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


    const [profile, setProfile] = useState<Profile>(
        () => {
            const storagedProfile = localStorage.getItem('@lance/profile');
        
            if (storagedProfile) {
            return JSON.parse(storagedProfile);
            }
        
            return null;
        }
    );

    //const [user, setUser] = useState<Profile>();

    const isAuthenticated = !!profile;


    //PREFER STATE OF PROFILE
        // const previousProfileRef = useRef<Profile>();

        // useEffect(() => {
        //     previousProfileRef.current = profile;
        // });

        // const profilePreviousValue = previousProfileRef.current ?? profile;

        // useEffect(() => {
        //     if(profilePreviousValue !== profile){
        //         localStorage.setItem('@lance/profile', JSON.stringify(profile));
        //     }
        // }, [profile, profilePreviousValue]);


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
        const token = getToken();

        if(token){
            api.get('/me').then(response => {
                const loadedProfile = response.data;

                loadPermissions(loadedProfile.role.id);

                if(loadedProfile.branches[0]){
                    localStorage.setItem('@lance/branch', JSON.stringify(loadedProfile.branches[0] ? loadedProfile.branches[0] : ''));

                    const branchCompany = loadedProfile.companies.filter((company:Company) => company.id === loadedProfile.branches[0].company.id);

                    localStorage.setItem('@lance/company', JSON.stringify(branchCompany[0] ? branchCompany[0] : ''));
                }else{
                    localStorage.setItem('@lance/company', JSON.stringify(loadedProfile.companies[0] ? loadedProfile.companies[0] : ''));
                }

                setProfile(loadedProfile);
                localStorage.setItem('@lance/profile', JSON.stringify(loadedProfile));
            }).catch(error => {
                logout();
                //history.push(`/${prefix}/`);
            });

            //const loadedProfile = await getMe();

            // loadPermissions(loadedProfile.role.id);

            // if(loadedProfile.branches[0]){
            //     localStorage.setItem('@lance/branch', JSON.stringify(loadedProfile.branches[0] ? loadedProfile.branches[0] : ''));

            //     const branchCompany = loadedProfile.companies.filter((company:Company) => company.id === loadedProfile.branches[0].company.id);

            //     localStorage.setItem('@lance/company', JSON.stringify(branchCompany[0] ? branchCompany[0] : ''));
            // }else{
            //     localStorage.setItem('@lance/company', JSON.stringify(loadedProfile.companies[0] ? loadedProfile.companies[0] : ''));
            // }

            // setProfile(loadedProfile);
        }
    }

    const loadPermissions = async (roleId = profile ? profile.role.id : 0) => {
        const requestedPermissions = await getPermissions(roleId);
        const simplifiedPermissions = simplifyPermissions(requestedPermissions);

        //console.log(roleId, requestedPermissions, isAuthenticated());

        setPermissions(simplifiedPermissions);
    }

    if(isAuthenticated){
        // if(!profile.name){
        //     loadProfile();
        // }

        if(permissions.length === 0){
            loadPermissions();
        }
    }

    useEffect(() => {
        loadProfile();
        // const token = getToken();

        // if(token){
        //     api.get('/me').then(response => {
        //         setUser(response.data);
        //     }).catch(error => {
        //         logout();
        //         console.log(prefix);
        //         //history.push(`/${prefix}/`);
        //     });
        // }
    }, []);

    return(
        <ProfileContext.Provider value={{profile, permissions, loadProfile, isAuthenticated}}>
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

    if(HasPermission(permissions, "Comercial Limitado") || HasPermission(permissions, "Comercial Completo")){
        return '/comercial'
    }

    return '/home';
}

export const useProfile = () => useContext(ProfileContext);