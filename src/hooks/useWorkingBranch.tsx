import { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react";
import { Branch, Company } from "../types";
import { useProfile } from "./useProfile";
import { useWorkingCompany } from "./useWorkingCompany";

interface WorkingBranchProviderProps{
    children: ReactNode;
}

interface WorkingBranchContextData{
    branch?: Branch|null;
    changeBranch: (branch: Branch) => void;
    clearBranch: (company?: Company) => void;
}

const WorkingBranchContext = createContext<WorkingBranchContextData>({} as WorkingBranchContextData);

export function WorkingBranchProvider({ children } : WorkingBranchProviderProps){
    const workingCompany = useWorkingCompany();
    const {profile} = useProfile();
    const [branch, setBranch] = useState<Branch|null>(():Branch|any => {
        const storagedBranch = localStorage.getItem('@lance/branch');
    
        if (!!storagedBranch) {
            return JSON.parse(storagedBranch);
        }else{
            if(profile){
                if(Object.keys(profile).length > 0){
                    if((profile?.role.id !== 1) && (profile?.branches.length > 0)){
                        localStorage.setItem('@lance/branch', JSON.stringify(profile.branches[0]));
                        return profile.branches[0];
                    }
                }
            }
        }
    
        return {};
    });

    const previousBranchRef = useRef<Branch|null>();

    useEffect(() => {
        previousBranchRef.current = branch;
    });

    const profileBranchValue = previousBranchRef.current ?? branch;

    useEffect(() => {
        if(branch){
            if(profileBranchValue !== branch){
                localStorage.setItem('@lance/branch', JSON.stringify(branch));
            }else{
                if(profile){
                    if(Object.keys(profile).length > 0){
                        if((profile?.role.id !== 1) && (profile?.branches.length > 0) && (profile?.branches[0].id !== branch.id)){
                            changeBranch(profile.branches[0]);
                        }
                    }
                }
            }
        }
    }, [branch, profileBranchValue]);



    //LOADERS
    const changeBranch = async (branch: Branch) => {
        setBranch(branch);
        localStorage.setItem('@lance/branch', JSON.stringify(branch));
    }

    const clearBranch = async (company?: Company) => {
        if(profile && company){
            const companyBranch = profile.branches.filter((branch:Branch) => branch.company.id === company.id);

            if(companyBranch[0]){
                setBranch(companyBranch[0]);
                localStorage.setItem('@lance/branch', JSON.stringify(companyBranch[0]));

                return;
            }
        }

        setBranch(null);
        localStorage.setItem('@lance/branch', "");
    }

    return(
        <WorkingBranchContext.Provider value={{branch, changeBranch, clearBranch}}>
            {children}
        </WorkingBranchContext.Provider>
    )
}

export const useWorkingBranch = () => useContext(WorkingBranchContext);