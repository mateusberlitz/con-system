import axios, { AxiosInstance } from "axios";
import { createContext, ReactNode, useContext, useState } from "react";
import { getToken } from "../../services/auth";
import { getApiUrl } from "../../services/tenantApi";
import { Tenant } from "../../types";

// e pegar a rota da api
interface TenantProviderProps{
    children: ReactNode;
}

interface TenantContextData{
    prefix?: string;
    tenant?: Tenant;
    handleSetPrefix: (prefix:string) => void;
    //api: AxiosInstance;
}

const TenantContext = createContext<TenantContextData>({} as TenantContextData);

export function TenantProvider({ children } : TenantProviderProps){
    const [prefix, setPrefix] = useState('');
    const [tenant, setTenant] = useState('');

    // const [api, setApi] = useState<AxiosInstance>(() => {
    //     const api = axios.create({
    //         baseURL: getApiUrl()
    //     });
        
    //     api.interceptors.request.use(async config => {
    //         const token = getToken();
        
    //         if (token) {
    //           config.headers.Authorization = `Bearer ${token}`;
    //         }
        
    //         //config.headers.accept
        
    //         return config;
    //     });

    //     return api
    // });

    const handleSetPrefix = (prefix:string) => {
        setPrefix(prefix);

        // const newApi = axios.create({
        //     baseURL: `${getApiUrl()}${prefix}`
        // });

        // newApi.interceptors.request.use(async config => {
        //     const token = getToken();
        
        //     if (token) {
        //       config.headers.Authorization = `Bearer ${token}`;
        //     }
        
        //     return config;
        // });

        // setApi(api);
    }

    return(
        <TenantContext.Provider value={{prefix, handleSetPrefix}}>
            {children}
        </TenantContext.Provider>
    )
}

export const useTenant = () => useContext(TenantContext);