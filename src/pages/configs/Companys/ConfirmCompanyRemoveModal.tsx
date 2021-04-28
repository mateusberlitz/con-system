import { Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useToast } from "@chakra-ui/react";
import { SolidButton } from "../../../components/Buttons/SolidButton";

import { ReactComponent as CloseIcon } from '../../../assets/icons/Close.svg';
import { showErrors } from "../../../hooks/useErrors";
import { api } from "../../../services/api";

interface ConfirmCompanyRemoveModalProps{
    isOpen: boolean;
    toRemoveCompanyId: number;
    onRequestClose: () => void;
    afterRemove: () => void;
}

export function ConfirmCompanyRemoveModal( { isOpen, toRemoveCompanyId, afterRemove, onRequestClose } : ConfirmCompanyRemoveModalProps){
    const toast = useToast();

    const handleRemoveCompany = async () => {
        try{
            await api.delete(`/companies/destroy/${toRemoveCompanyId}`);

            toast({
                title: "Sucesso",
                description: "Empresa foi removida",
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

    return(
        <Modal isOpen={isOpen} onClose={onRequestClose} size="xl">
            <ModalOverlay />
            <ModalContent borderRadius="24px">
                <ModalHeader p="10" fontWeight="700" fontSize="2xl">Remover empresa?</ModalHeader>

                <ModalCloseButton top="10" right="5"/>
                
                <ModalBody pl="10" pr="10">
                    <SolidButton onClick={handleRemoveCompany} mr="6" color="white" bg="red.400" _hover={{filter: "brightness(90%)"}} rightIcon={<CloseIcon stroke="#ffffff" fill="none" width="18px" strokeWidth="3px"/>}>
                        Confirmar e Remover
                    </SolidButton>
                </ModalBody>

                <ModalFooter p="10">
                    <Link onClick={onRequestClose} color="gray.700" fontSize="14px">Cancelar</Link>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}