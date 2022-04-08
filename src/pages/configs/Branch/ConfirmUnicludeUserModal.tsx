import { Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useToast } from "@chakra-ui/react";
import { SolidButton } from "../../../components/Buttons/SolidButton";

import { ReactComponent as CloseIcon } from '../../../assets/icons/Close.svg';
import { showErrors } from "../../../hooks/useErrors";
import { api } from "../../../services/api";
import { useEffect } from "react";
import { isAuthenticated } from "../../../services/auth";
import { redirectMessages } from "../../../utils/redirectMessages";
import { useHistory } from "react-router-dom";
import { Branch, User } from "../../../types";

interface ConfirmCompanyRemoveModalProps{
    isOpen: boolean;
    toRemoveUser: User;
    toRemoveBranchId: number;
    onRequestClose: () => void;
    afterRemove: () => void;
}

interface Sync {
    [key: number]: string
}

export function ConfirmUnicludeUserModal( { isOpen, toRemoveUser, toRemoveBranchId, afterRemove, onRequestClose } : ConfirmCompanyRemoveModalProps){
    const toast = useToast();
    const history = useHistory();

    const handleUnicludeUser = async () => {
        try{
            const branchesData: Sync = toRemoveUser.branches.reduce(
                (syncTeams: Sync, userBranch: Branch) => {
                  if(userBranch.id !== toRemoveBranchId){
                    syncTeams[userBranch.id] = 'on';
                  }
                  return syncTeams
                },
                {} as Sync
              )

              console.log(branchesData);

            await api.post(`/users/${toRemoveUser.id}/sync_branches`, branchesData);

            toast({
                title: "Sucesso",
                description: "Usuário foi desvinculado",
                status: "success",
                duration: 12000,
                isClosable: true,
            });

            onRequestClose();
            afterRemove();
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
                <ModalHeader p="10" fontWeight="700" fontSize="2xl">Desvincular dessa filial?</ModalHeader>

                <ModalCloseButton top="10" right="5"/>
                
                <ModalBody pl="10" pr="10">
                    <SolidButton onClick={handleUnicludeUser} mr="6" color="white" bg="red.400" _hover={{filter: "brightness(90%)"}} rightIcon={<CloseIcon stroke="#ffffff" fill="none" width="18px" strokeWidth="3px"/>}>
                        Desvincular
                    </SolidButton>
                </ModalBody>

                <ModalFooter p="10">
                    <Link onClick={onRequestClose} color="gray.700" fontSize="14px">Cancelar</Link>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}