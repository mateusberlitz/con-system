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

interface CompanyStepProps{
    firstCompany?:Company | undefined;
    setFirstCompany: (company: Company) => void;
}

export function CompanyStep({firstCompany, setFirstCompany} : CompanyStepProps){

    const fetchCompany = async () => {
        api.get('/companies').then(response => {
            setFirstCompany(response.data[0]);
        });
    }

    useEffect(() => {
        fetchCompany();
    }, []);


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
            <NewCompanyModal afterCreate={fetchCompany} isOpen={isNewCompanyModalOpen} onRequestClose={CloseNewCompanyModal}/>
            <ConfirmCompanyRemoveModal afterRemove={fetchCompany} isOpen={isConfirmCompanyRemoveModalOpen} toRemoveCompanyId={removeCompanyId} onRequestClose={CloseConfirmCompanyRemoveModal}/>
            <EditCompanyModal afterEdit={fetchCompany} isOpen={isEditCompanyModalOpen} toEditCompanyData={editCompanyData} onRequestClose={CloseEditCompanyModal}/>
        
            {
                firstCompany ? (
                    <Board key={firstCompany.id}>
                        <HStack mb="12" spacing="6">
                            <Heading fontSize="2xl" fontWeight="500">{firstCompany.name}</Heading>
            
                            <HStack spacing="6" ml="auto">
                                <RemoveButton onClick={() => OpenConfirmCompanyRemoveModal(firstCompany.id)}/>
                                <EditButton onClick={() => OpenEditCompanyModal(firstCompany)}/>
                            </HStack>
                        </HStack>
            
                        <HStack justifyContent="space-between">
                            <Stack spacing="4">
                                <Text color="gray.800" fontSize="md"> <Icon as={LocationIcon}  stroke="#4e4b66" fill="none" mr="2"/>{firstCompany.address}</Text>
                                <Text color="gray.800" fontSize="md"> <Icon as={CallIcon}  stroke="#4e4b66" fill="none" mr="2"/>{firstCompany.phone}</Text>
                            </Stack>
                        </HStack>
                        
                    </Board>
                ) : (
                    <Stack spacing="10" border="1px solid" borderColor="gray.200" borderRadius="24" width={["100%", "45%"]} maxW="100%" p="10">
                        <Text fontWeight="700" fontSize="2xl">Cadastre sua primeira empresa</Text>
            
                        <SolidButton onClick={OpenNewCompanyModal} mb="12" color="white" bg="purple.300" icon={PlusIcon} colorScheme="purple">
                            Adicionar Empresa
                        </SolidButton>
                    </Stack>
                )
            }
        </>
    )
}