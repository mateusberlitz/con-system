import { Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useToast } from "@chakra-ui/react";
import { SolidButton } from "../../../components/Buttons/SolidButton";

import { ReactComponent as CloseIcon } from '../../../assets/icons/Close.svg';
import { showErrors } from "../../../hooks/useErrors";
import { api } from "../../../services/api";

interface ConfirmBillCategoryRemoveModalProps{
    isOpen: boolean;
    toRemoveBillCategoryId: number;
    onRequestClose: () => void;
    afterRemove: () => void;
}

export function ConfirmBillCategoryRemoveModal( { isOpen, toRemoveBillCategoryId, afterRemove, onRequestClose } : ConfirmBillCategoryRemoveModalProps){
    const toast = useToast();

    const handleBillPaymentCategory = async () => {
        try{
            await api.delete(`/bill_categories/destroy/${toRemoveBillCategoryId}`);

            toast({
                title: "Sucesso",
                description: `A categoria foi removida`,
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
                <ModalHeader p="10" fontWeight="700" fontSize="2xl">Remover a categoria selecionada?</ModalHeader>

                <ModalCloseButton top="10" right="5"/>
                
                <ModalBody pl="10" pr="10">
                    <SolidButton onClick={handleBillPaymentCategory} mr="6" color="white" bg="red.400" _hover={{filter: "brightness(90%)"}} rightIcon={<CloseIcon stroke="#ffffff" fill="none" width="18px" strokeWidth="3px"/>}>
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