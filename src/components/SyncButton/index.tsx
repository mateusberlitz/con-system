import { Icon } from "@chakra-ui/react";
import { useState } from "react";
import { Download } from "react-feather";
import { api } from "../../services/api";
import { OutlineButton } from "../Buttons/OutlineButton";

export function SyncButton(){
    const [loading, setLoading] = useState(false);

    const handleSyncCommissions = () => {
        setLoading(true);

        api.get('sync-commissions').then(response => {
            setLoading(false);
        });
    }

    return(
        <>
            <OutlineButton leftIcon={<Icon as={Download}/>} isLoading={loading} onClick={() => handleSyncCommissions()}>
                Sincronizar
            </OutlineButton>
        </>
    )
}