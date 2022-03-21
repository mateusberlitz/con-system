import { Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, Text, useToast } from "@chakra-ui/react";
import { SolidButton } from "../../../components/Buttons/SolidButton";

import { ReactComponent as CloseIcon } from '../../../assets/icons/Close.svg';
import { showErrors } from "../../../hooks/useErrors";
import { api } from "../../../services/api";
import { isAuthenticated } from "../../../services/auth";
import { useEffect, useState } from "react";
import { redirectMessages } from "../../../utils/redirectMessages";
import { useHistory } from "react-router-dom";
import { useWorkingCompany } from "../../../hooks/useWorkingCompany";
import { useProfile } from "../../../hooks/useProfile";
import { ControlledInput } from "../../../components/Forms/Inputs/ControlledInput";
import { Input } from "../../../components/Forms/Inputs/Input";

export interface RemoveTeamData{
    id: number;
    name: string;
}

interface ConfirmTeamRemoveModalProps{
    isOpen: boolean;
    toRemoveTeamData: RemoveTeamData;
    onRequestClose: () => void;
    afterRemove: () => void;
}

export function ConfirmTeamRemoveModal( { isOpen, toRemoveTeamData, afterRemove, onRequestClose } : ConfirmTeamRemoveModalProps){
    const workingCompany = useWorkingCompany();
    const {profile, permissions} = useProfile();
    const toast = useToast();

    const history = useHistory();

    const [name, setName] = useState('');

    const handleRemoveTeam = async () => {
        try{
            if(!workingCompany.company){
                toast({
                    title: "Ué",
                    description: `Seleciona uma empresa para trabalhar`,
                    status: "warning",
                    duration: 12000,
                    isClosable: true,
                });

                return;
            }

            if(!profile){
                return;
            }

            if(name === toRemoveTeamData.name){
                await api.delete(`/branches/destroy/${toRemoveTeamData.id}`);

                toast({
                    title: "Sucesso",
                    description: `A filial ${toRemoveTeamData.name} foi removida`,
                    status: "success",
                    duration: 12000,
                    isClosable: true,
                });

                onRequestClose();
                afterRemove();
            }else{
                toast({
                    title: "Ops",
                    description: `O nome da filial não confere.`,
                    status: "warning",
                    duration: 12000,
                    isClosable: true,
                });
            }
            
        }catch(error){
            showErrors(error, toast);
        }
    }

    useEffect(() => {
        if(!isAuthenticated()){
            history.push({
                pathname: '/',
                state: redirectMessages.auth
            });
        }
    }, [isOpen])

    return(
        <Modal isOpen={isOpen} onClose={onRequestClose} size="xl">
            <ModalOverlay />
            <ModalContent borderRadius="24px">
                <ModalHeader p="10" fontWeight="700" fontSize="2xl">Remover a equipe {toRemoveTeamData.name}?</ModalHeader>

                <ModalCloseButton top="10" right="5"/>
                
                <ModalBody pl="10" pr="10">
                    <Stack spacing="6">
                        <Text>Para remover digite o nome da equipe</Text>

                        <Input name="name" type="text" placeholder="Nome" focusBorderColor="purple.300" variant="outline" onChange={(val) => setName(val)}/>

                        <SolidButton onClick={handleRemoveTeam} mr="6" color="white" bg="red.400" _hover={{filter: "brightness(90%)"}} rightIcon={<CloseIcon stroke="#ffffff" fill="none" width="18px" strokeWidth="3px"/>}>
                            Confirmar e Remover
                        </SolidButton>
                    </Stack>
                </ModalBody>

                <ModalFooter p="10">
                    <Link onClick={onRequestClose} color="gray.700" fontSize="14px">Cancelar</Link>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}