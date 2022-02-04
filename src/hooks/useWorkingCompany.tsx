import { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react";
import { Company } from "../types";
import { useProfile } from "./useProfile";

interface WorkingCompanyProviderProps{
    children: ReactNode;
}

interface WorkingCompanyContextData{
    company?: Company;
    changeCompany: (company: Company) => void;
}

const WorkingCompanyContext = createContext<WorkingCompanyContextData>({} as WorkingCompanyContextData);

export function WorkingCompanyProvider({ children } : WorkingCompanyProviderProps){
    const {profile} = useProfile();
    const [company, setCompany] = useState<Company>(():Company|any => {
        const storagedCompany = localStorage.getItem('@lance/company');
    
        if (!!storagedCompany) {
            return JSON.parse(storagedCompany);
        }else{
            console.log(profile);
            if(profile){
                if(Object.keys(profile).length > 0){
                    if((profile?.role.id !== 1) && (profile?.companies.length > 0)){
                        localStorage.setItem('@lance/company', JSON.stringify(profile.companies[0]));
                        return profile.companies[0];
                    }
                }
            }
        }
    
        return {};
    });

    const previousCompanyRef = useRef<Company>();

    useEffect(() => {
        previousCompanyRef.current = company;
    });

    const profileCompanyValue = previousCompanyRef.current ?? company;

    useEffect(() => {
        if(profileCompanyValue !== company){
            localStorage.setItem('@lance/company', JSON.stringify(company));
        }else{
            if(profile){
                if(Object.keys(profile).length > 0){
                    if((profile?.role.id !== 1) && (profile?.companies.length > 0) && (profile?.companies[0].id !== company.id)){
                        changeCompany(profile.companies[0]);
                    }
                }
            }
        }
    }, [company, profileCompanyValue]);



    //LOADERS
    const changeCompany = async (company: Company) => {
        setCompany(company);
        localStorage.setItem('@lance/company', JSON.stringify(company));
    }


    return(
        <WorkingCompanyContext.Provider value={{company, changeCompany}}>
            {children}
        </WorkingCompanyContext.Provider>
    )
}

export const useWorkingCompany = () => useContext(WorkingCompanyContext);