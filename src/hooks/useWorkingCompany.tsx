import { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react";
import { Company } from "../types";

interface WorkingCompanyProviderProps{
    children: ReactNode;
}

interface WorkingCompanyContextData{
    company?: Company;
    changeCompany: (company: Company) => void;
}

const WorkingCompanyContext = createContext<WorkingCompanyContextData>({} as WorkingCompanyContextData);

export function WorkingCompanyProvider({ children } : WorkingCompanyProviderProps){
    const [company, setCompany] = useState<Company>(():Company|any => {
        const storagedCompany = localStorage.getItem('@lance/company');
    
        if (storagedCompany) {
            const parsedCompany = JSON.parse(storagedCompany);
            return parsedCompany;
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