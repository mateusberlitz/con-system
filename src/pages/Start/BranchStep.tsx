import { Heading, HStack, Icon, Spinner, Stack, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Board } from "../../components/Board";
import { EditButton } from "../../components/Buttons/EditButton";
import { RemoveButton } from "../../components/Buttons/RemoveButton";
import { api } from "../../services/api";
import { Branch } from "../../types";

import { ReactComponent as LocationIcon } from '../../assets/icons/Location.svg';
import { ReactComponent as CallIcon } from '../../assets/icons/Call.svg';
import { ReactComponent as PlusIcon } from '../../assets/icons/Plus.svg';
import { SolidButton } from "../../components/Buttons/SolidButton";
import { ConfirmCompanyRemoveModal } from "../configs/Companys/ConfirmCompanyRemoveModal";
import { EditCompanyModal } from "../configs/Companys/EditCompanyModal";
import { NewBranchModal } from "../configs/Companys/CompanyPage/NewBranchModal";
import { ConfirmBranchRemoveModal, RemoveBranchData } from "../configs/Companys/CompanyPage/ConfirmBranchRemoveModal";
import { EditBranchFormData, EditBranchModal } from "../configs/Companys/CompanyPage/EditBranchModal";

interface BranchStepProps{
    firstBranch: Branch | undefined;
    setFirstBranch: (branch: Branch) => void;
    loading: boolean;
}

export function BranchStep({firstBranch, setFirstBranch, loading}: BranchStepProps){
    //const [firstBranch, setFirstBranch] = useState<Branch>()

    const fetchBranch = async () => {
        api.get('/branches').then(response => {
            setFirstBranch(response.data[0]);
        });
    }

    useEffect(() => {
        fetchBranch();
    }, []);


    const [isNewBranchModalOpen, setIsNewBranchModalOpen] = useState(false);
    const [isConfirmBranchRemoveModalOpen, setisConfirmBranchRemoveModalOpen] = useState(false);
    const [isEditBranchModalOpen, setIsEditBranchModalOpen] = useState(false);

    const [removeBranch, setRemoveBranch] = useState<RemoveBranchData>(() => {
        const data: RemoveBranchData = {
            id: 0,
            name: ''
        }

        return data
    })
    
    const [editBranchData, setEditBranchData] = useState<EditBranchFormData>(
        () => {
          const data: EditBranchFormData = {
            id: 0,
            name: '',
            company: 0,
            manager: 0,
            state: 0,
            city: '',
            address: '',
            phone: '',
            email: ''
          }
    
          return data
        }
    )

    function OpenNewBranchModal(){
        setIsNewBranchModalOpen(true);
    }
    function CloseNewBranchModal(){
        setIsNewBranchModalOpen(false);
    }

    function OpenEditBranchModal(branchData: EditBranchFormData) {
        setEditBranchData(branchData)
        setIsEditBranchModalOpen(true)
    }
    function CloseEditBranchModal() {
        setIsEditBranchModalOpen(false)
    }

    function OpenConfirmBranchRemoveModal(branchData: RemoveBranchData) {
        setRemoveBranch(branchData)
        setisConfirmBranchRemoveModalOpen(true)
    }
    function CloseConfirmBranchRemoveModal() {
        setisConfirmBranchRemoveModalOpen(false)
    }


    return (
        <>
            <NewBranchModal afterCreate={fetchBranch} isOpen={isNewBranchModalOpen} onRequestClose={CloseNewBranchModal}/>
            <ConfirmBranchRemoveModal afterRemove={fetchBranch} isOpen={isConfirmBranchRemoveModalOpen} toRemoveBranchData={removeBranch} onRequestClose={CloseConfirmBranchRemoveModal}/>
            <EditBranchModal afterEdit={fetchBranch} isOpen={isEditBranchModalOpen} toEditBranchData={editBranchData} onRequestClose={CloseEditBranchModal}/>
        
            {   loading ? (
                    <Spinner/>
                )
                : (firstBranch ? (
                    <Board key={firstBranch.id}>
                        <HStack mb="12" spacing="6">
                            <Heading fontSize="2xl" fontWeight="500">{firstBranch.name}</Heading>
            
                            <HStack spacing="6" ml="auto">
                                <RemoveButton onClick={() => OpenConfirmBranchRemoveModal(firstBranch)}/>
                                <EditButton onClick={() => OpenEditBranchModal({id: firstBranch.id, name: firstBranch.name, phone: firstBranch.phone, email: firstBranch.email, company: firstBranch.company.id, manager: firstBranch.manager.id, city: firstBranch.city.name, state: firstBranch.state.id, address: firstBranch.address })}/>
                            </HStack>
                        </HStack>
            
                        <HStack justifyContent="space-between">
                            <Stack spacing="4">
                                <Text color="gray.800" fontSize="md"> <Icon as={LocationIcon}  stroke="#4e4b66" fill="none" mr="2"/>{firstBranch.address}</Text>
                                <Text color="gray.800" fontSize="md"> <Icon as={CallIcon}  stroke="#4e4b66" fill="none" mr="2"/>{firstBranch.phone}</Text>
                            </Stack>
                        </HStack>
                        
                    </Board>
                ) : (
                    <Stack spacing="10" border="1px solid" borderColor="gray.200" borderRadius="24" width={["100%", "45%"]} maxW="100%" p="10">
                        <Text fontWeight="700" fontSize="2xl">Cadastre sua primeira filial</Text>
            
                        <SolidButton onClick={OpenNewBranchModal} mb="12" color="white" bg="purple.300" icon={PlusIcon} colorScheme="purple">
                            Adicionar Filial
                        </SolidButton>
                    </Stack>
                ))
            }
        </>
    )
}