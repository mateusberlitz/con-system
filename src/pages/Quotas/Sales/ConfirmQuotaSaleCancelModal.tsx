import { Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useToast } from "@chakra-ui/react";
import { SolidButton } from "../../../components/Buttons/SolidButton";

import { ReactComponent as CloseIcon } from '../../../assets/icons/Close.svg';
import { showErrors } from "../../../hooks/useErrors";
import { api } from "../../../services/api";
import { isAuthenticated } from "../../../services/auth";
import { useEffect } from "react";
import { redirectMessages } from "../../../utils/redirectMessages";
import { useHistory } from "react-router-dom";

interface ConfirmQuotaSaleCancelModalProps{
    isOpen: boolean;
    toCancelQuotaSaleData: CancelQuotaSaleData;
    onRequestClose: () => void;
    afterCancel: () => void;
}

export interface CancelQuotaSaleData{
    group: string;
    quota: string;
    id: number;
}


export function ConfirmQuotaSaleCancelModal( { isOpen, toCancelQuotaSaleData, afterCancel, onRequestClose } : ConfirmQuotaSaleCancelModalProps){
    const toast = useToast();

    const history = useHistory();

    const handleCancelPayment = async () => {
        try{
            await api.delete(`/quota_sales/cancel/${toCancelQuotaSaleData.id}`);

            toast({
                title: "Sucesso",
                description: `A venda da cota ${toCancelQuotaSaleData.group}-${toCancelQuotaSaleData.quota} foi cancelada`,
                status: "success",
                duration: 12000,
                isClosable: true,
            });

            onRequestClose();
            afterCancel();
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
                <ModalHeader p="10" fontWeight="700" fontSize="2xl">Cancelar a venda {toCancelQuotaSaleData.group}-{toCancelQuotaSaleData.quota}?</ModalHeader>

                <ModalCloseButton top="10" right="5"/>
                
                <ModalBody pl="10" pr="10">
                    <SolidButton onClick={handleCancelPayment} mr="6" color="white" bg="red.400" _hover={{filter: "brightness(90%)"}} rightIcon={<CloseIcon stroke="#ffffff" fill="none" width="18px" strokeWidth="3px"/>}>
                        Confirmar e Cancelar
                    </SolidButton>
                </ModalBody>

                <ModalFooter p="10">
                    <Link onClick={onRequestClose} color="gray.700" fontSize="14px">Fechar</Link>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}