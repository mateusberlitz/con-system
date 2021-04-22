import { useToast } from "@chakra-ui/toast";
import { createContext, ReactNode, useContext, useState } from "react";

interface RedirectedToastsProps{
    children: ReactNode;
}

interface Toast{
    title: string;
    isClosable?: boolean;
    description: string;
    duration?: number;
    status: "error" | "warning" | "success" | "info";
}

interface RedirectedToastsData{
    //toasts: Toast[];
    sendNewToast: (newToast: Toast) => void;
    getToasts: () => Toast[];
}

const RedirectedToastsContext = createContext<RedirectedToastsData>({} as RedirectedToastsData);

export function RedirectedToastsProvider({ children } : RedirectedToastsProps){
    const showToast = useToast();

    const [toasts, setToasts] = useState<Toast[]>([]);

    function sendNewToast(newToast : Toast){
        const updatedToasts = [...toasts];

        updatedToasts.push(newToast);
        setToasts(updatedToasts);
    }

    function getToasts(){
        return toasts;
    }

    if(toasts.length > 0){
        const updatedToasts = [...toasts];

        toasts.map((toast, index) => {
            showToast(toast);

            updatedToasts.splice(index, 1);
        });
        
        setToasts(updatedToasts);
    }

    console.log(toasts);

    return(
        <RedirectedToastsContext.Provider value={{getToasts, sendNewToast}}>
            {children}
        </RedirectedToastsContext.Provider>
    )
}

export const useRedirectedToasts = () => useContext(RedirectedToastsContext);