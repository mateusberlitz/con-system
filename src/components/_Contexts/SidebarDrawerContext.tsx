import { useDisclosure, UseDisclosureReturn } from "@chakra-ui/react";
import { useLocation } from 'react-router-dom';
import { createContext, ReactNode, useContext, useEffect } from "react";

interface SidebarDrawerProviderProps{
    children: ReactNode;
}

type SidebarDrawerContextData = UseDisclosureReturn;

const SidebarDrawerContext = createContext({} as SidebarDrawerContextData);

export function SidebarDrawerProvider({ children }: SidebarDrawerProviderProps){
    const disclosure = useDisclosure();
    const router = useLocation();

    useEffect(() => {
        disclosure.onClose();
    }, [router.pathname]);

    console.log(disclosure);

    return(
        <SidebarDrawerContext.Provider value={disclosure}>
            {children}
        </SidebarDrawerContext.Provider>
    )
}

export const useSideBarDrawer = () => useContext(SidebarDrawerContext);