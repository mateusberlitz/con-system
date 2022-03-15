import { Flex, Heading, HStack, Icon, SimpleGrid, Spinner, Stack, Text } from "@chakra-ui/react";
import { Board } from "../../../components/Board";
import { EditButton } from "../../../components/Buttons/EditButton";
import { RemoveButton } from "../../../components/Buttons/RemoveButton";
import { NewCompanyModal } from "./NewCompanyModal";

import { ReactComponent as LocationIcon } from '../../../assets/icons/Location.svg';
import { ReactComponent as CallIcon } from '../../../assets/icons/Call.svg';
import { ReactComponent as PlusIcon } from '../../../assets/icons/Plus.svg';
import { SolidButton } from "../../../components/Buttons/SolidButton";
import { MainBoard } from "../../../components/MainBoard";
import { useState } from "react";
import { ConfirmCompanyRemoveModal } from "./ConfirmCompanyRemoveModal";
import { useCompanies } from "../../../hooks/useCompanies";
import { EditCompanyModal } from "./EditCompanyModal";
import { Company } from "../../../types";
import { useHistory } from "react-router-dom";



export default function Companys(){
    const history = useHistory();
    const { data, isLoading, refetch, error} = useCompanies();

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

    const [isNewCompanyModalOpen, setIsNewCompanyModalOpen] = useState(false);
    const [isConfirmCompanyRemoveModalOpen, setisConfirmCompanyRemoveModalOpen] = useState(false);
    const [isEditCompanyModalOpen, setIsEditCompanyModalOpen] = useState(false);

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
            <NewCompanyModal afterCreate={refetch} isOpen={isNewCompanyModalOpen} onRequestClose={CloseNewCompanyModal}/>
            <ConfirmCompanyRemoveModal afterRemove={refetch} isOpen={isConfirmCompanyRemoveModalOpen} toRemoveCompanyId={removeCompanyId} onRequestClose={CloseConfirmCompanyRemoveModal}/>
            <EditCompanyModal afterEdit={refetch} isOpen={isEditCompanyModalOpen} toEditCompanyData={editCompanyData} onRequestClose={CloseEditCompanyModal}/>

            <MainBoard sidebar="configs">
                <SolidButton onClick={OpenNewCompanyModal} mb="12" color="white" bg="purple.300" icon={PlusIcon} colorScheme="purple">
                    Adicionar Empresa
                </SolidButton>

                <SimpleGrid flex="1" gap="12" minChildWidth="100%" align="flex-start">
                    {/* !isLoading && isFetching && <Spinner size="sm" color="gray.500" ml="4"/> */}

                    { isLoading ? (
                        <Flex justify="center">
                            <Spinner/>
                        </Flex>
                    ) : error ? (
                        <Flex justify="center">
                            <Text>Erro ao obter os dados das empresas</Text>
                        </Flex>
                    ) : data.map((company:Company) => {
                        return(
                                <Board key={company.id} mt="4" mb="4">
                                    <Flex mb="12">
                                        <Heading fontSize="2xl" fontWeight="500">{company.name}</Heading>

                                        <HStack spacing="10" ml="auto">
                                            <RemoveButton onClick={() => OpenConfirmCompanyRemoveModal(company.id)}/>
                                            <EditButton onClick={() => OpenEditCompanyModal(company)}/>
                                        </HStack>
                                    </Flex>

                                    <HStack justifyContent="space-between">
                                        <Stack spacing="4">
                                            <Text color="gray.800" fontSize="md"> <Icon as={LocationIcon}  stroke="#4e4b66" fill="none" mr="2"/>{company.address}</Text>
                                            <Text color="gray.800" fontSize="md"> <Icon as={CallIcon}  stroke="#4e4b66" fill="none" mr="2"/>{company.phone}</Text>
                                        </Stack>

                                        <SolidButton colorScheme="purple" bg="purple.300" onClick={() => history.push(`/empresas/${company.id}`)}>Gerenciar</SolidButton>
                                    </HStack>
                                    
                                </Board>
                            )
                        })
                    }
                </SimpleGrid>
            </MainBoard>
        </>
    );
}