import { createContext, ReactNode, useContext, useState } from "react";

interface CompanyProviderProps{
    children: ReactNode;
}

interface SelectedCompanyContextData{
    companyId: number;
    changeCompanyId: (companyId: number) => void;
}

const SelectedCompanyContext = createContext<SelectedCompanyContextData>({} as SelectedCompanyContextData);

export function SelectedCompanyProvider({ children } : CompanyProviderProps){
    const [companyId, setCompanyId] = useState(():number => {
        const storageCompanyId = localStorage.getItem('@lance/company');
    
        if (storageCompanyId) {
            const companyId = JSON.parse(storageCompanyId);
            return companyId;
        }
    
        return 1;
    });

    const changeCompanyId = async (companyId: number) => {
        setCompanyId(companyId);

        localStorage.setItem('@lance/company', companyId.toString());
    }

    return(
        <SelectedCompanyContext.Provider value={{companyId, changeCompanyId}}>
            {children}
        </SelectedCompanyContext.Provider>
    )
}

export const useSelectedCompany = () => useContext(SelectedCompanyContext);