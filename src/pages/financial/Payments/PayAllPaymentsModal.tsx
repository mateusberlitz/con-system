import { Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useToast } from "@chakra-ui/react";
import { SolidButton } from "../../../components/Buttons/SolidButton";

import { ReactComponent as CheckIcon } from '../../../assets/icons/Check.svg';

import { api } from "../../../services/api";
import { useHistory } from "react-router";
import { useErrors } from "../../../hooks/useErrors";

import { useWorkingCompany } from "../../../hooks/useWorkingCompany";
import { formatYmdTodmY } from "../../../utils/Date/formatYmdTodmY";
import { formatDate } from "../../../utils/Date/formatDate";
import { formatBRDate } from "../../../utils/Date/formatBRDate";

interface PayPaymentModalProps{
    isOpen: boolean;
    onRequestClose: () => void;
    afterPay: () => void;
    dayToPayPayments: string;
}

export interface PayPaymentFormData{
    id: number,
    value: string,
    title: string,
    new_value: string,
}

export function PayAllPaymentsModal ( { isOpen, onRequestClose, afterPay, dayToPayPayments } : PayPaymentModalProps){
    const workingCompany = useWorkingCompany();
    const history = useHistory();
    const toast = useToast();
    const { showErrors } = useErrors();

    const handlePayDay = async () => {
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
            
            await api.post(`/payments/payall/${formatYmdTodmY(dayToPayPayments)}`);

            toast({
                title: "Sucesso",
                description: `Os pagamentos do dia ${formatBRDate(dayToPayPayments)} foram pagos.`,
                status: "success",
                duration: 12000,
                isClosable: true,
            });

            onRequestClose();
            afterPay();
        }catch(error) {
            showErrors(error, toast);

            if(error.response.data.access){
                history.push('/');
            }
        }
    }

    return(
        <Modal isOpen={isOpen} onClose={onRequestClose} size="xl">
            <ModalOverlay />
            <ModalContent as="form" borderRadius="24px">
                <ModalHeader p="10" fontWeight="700" fontSize="2xl">Pagar dia {dayToPayPayments}</ModalHeader>

                <ModalCloseButton top="10" right="5"/>
                
                <ModalBody pl="10" pr="10">
                    <SolidButton onClick={handlePayDay} mr="6" color="white" bg="green.400" _hover={{filter: "brightness(90%)"}} rightIcon={<CheckIcon stroke="#ffffff" fill="none" width="18px" strokeWidth="3px"/>}>
                        Confirmar e Pagar Tudo
                    </SolidButton>
                </ModalBody>

                <ModalFooter p="10">
                    <Link onClick={onRequestClose} color="gray.700" fontSize="14px">Cancelar</Link>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}