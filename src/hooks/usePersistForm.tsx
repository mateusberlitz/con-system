import { useEffect } from "react";

export interface usePersistForm{
    value: {};
    localStorageKey: string;
}

export const usePersistForm = ({value, localStorageKey}: usePersistForm) => {
    useEffect(() => {
      localStorage.setItem(localStorageKey, JSON.stringify(value));
    }, [value, localStorageKey]);

    return;
};