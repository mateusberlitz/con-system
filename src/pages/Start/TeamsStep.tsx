import { Heading, HStack, Icon, Stack, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Board } from "../../components/Board";
import { EditButton } from "../../components/Buttons/EditButton";
import { RemoveButton } from "../../components/Buttons/RemoveButton";
import { api } from "../../services/api";
import { Branch, Company } from "../../types";

import { ReactComponent as LocationIcon } from '../../assets/icons/Location.svg';
import { ReactComponent as CallIcon } from '../../assets/icons/Call.svg';
import { ReactComponent as PlusIcon } from '../../assets/icons/Plus.svg';
import { SolidButton } from "../../components/Buttons/SolidButton";
import { NewCompanyModal } from "../configs/Companys/NewCompanyModal";
import { ConfirmCompanyRemoveModal } from "../configs/Companys/ConfirmCompanyRemoveModal";
import { EditCompanyModal } from "../configs/Companys/EditCompanyModal";
import { useTeams } from "../../hooks/useTeams";

export function TeamsStep(){

    const teams = useTeams({}, 1);

    const [isNewCompanyModalOpen, setIsNewCompanyModalOpen] = useState(false);
    const [isConfirmCompanyRemoveModalOpen, setisConfirmCompanyRemoveModalOpen] = useState(false);
    const [isEditCompanyModalOpen, setIsEditCompanyModalOpen] = useState(false);

    const [removeCompanyId, setRemoveCompanyId] = useState(0);
    const [editCompanyData, setEditCompanyData] = useState<Company>(() => {
        const data: Company = {
            id: 0,
            name: '',
            address: '',
            phone: '',
            cnpj: '',
        };
        
        return data;
    });

        function OpenNewCompanyModal(){
            setIsNewCompanyModalOpen(true);
        }
        function CloseNewCompanyModal(){
            setIsNewCompanyModalOpen(false);
        }

    function OpenConfirmCompanyRemoveModal(companyId:number){
        setRemoveCompanyId(companyId);
        setisConfirmCompanyRemoveModalOpen(true);
    }
    function CloseConfirmCompanyRemoveModal(){
        setisConfirmCompanyRemoveModalOpen(false);
    }


    function OpenEditCompanyModal(companyData:Company){
        setEditCompanyData(companyData);
        setIsEditCompanyModalOpen(true);
    }
    function CloseEditCompanyModal(){
        setIsEditCompanyModalOpen(false);
    }


    return (
        <>
        </>
    )
}