import { HStack, Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, useToast } from "@chakra-ui/react";
import { SolidButton } from "../../../components/Buttons/SolidButton";

import { ReactComponent as CheckIcon } from '../../../assets/icons/Check.svg';

import { api } from "../../../services/api";
import { useHistory } from "react-router";
import { useErrors } from "../../../hooks/useErrors";

import { useWorkingCompany } from "../../../hooks/useWorkingCompany";
import { formatYmdTodmY } from "../../../utils/Date/formatYmdTodmY";
import { formatDate } from "../../../utils/Date/formatDate";
import { formatBRDate } from "../../../utils/Date/formatBRDate";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { ControlledInput } from "../../../components/Forms/Inputs/ControlledInput";
import { formatYmdDate } from "../../../utils/Date/formatYmdDate";
import { useForm } from "react-hook-form";

interface ReceiveAllBillsModalProps{
    isOpen: boolean;
    onRequestClose: () => void;
    afterReceive: () => void;
    dayToReceiveBills: string;
}

export interface ReceiveBillFormData{
    id: number,
    value: string,
    title: string,
    new_value: string,
    bill_receive_day?: string,
}

const ReceiveBillFormSchema = yup.object().shape({
    bill_receive_day: yup.date().required("Selecione a data que foi recebido"),
});

export function ReceiveAllBillsModal ( { isOpen, onRequestClose, afterReceive, dayToReceiveBills } : ReceiveAllBillsModalProps){
    const workingCompany = useWorkingCompany();
    const history = useHistory();
    const toast = useToast();
    const { showErrors } = useErrors();

    const { handleSubmit, reset, control, formState} = useForm<ReceiveBillFormData>({
        resolver: yupResolver(ReceiveBillFormSchema),
    });

    const handleReceiveDay = async (billData : ReceiveBillFormData) => {
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
            
            await api.post(`/bills/receiveall/${formatYmdTodmY(dayToReceiveBills)}`, billData);

            toast({
                title: "Sucesso",
                description: `As contas a receber do dia ${formatBRDate(dayToReceiveBills)} foram recebidas.`,
                status: "success",
                duration: 12000,
                isClosable: true,
            });

            onRequestClose();
            afterReceive();
        }catch(error) {
            showErrors(error, toast);

            if(error.response.data.access){
                history.push('/');
            }
        }
    }

    const todayYmd = formatYmdDate(new Date().toDateString());

    return(
        <Modal isOpen={isOpen} onClose={onRequestClose} size="xl">
            <ModalOverlay />

            <ModalContent as="form" borderRadius="24px" onSubmit={handleSubmit(handleReceiveDay)}>
                <ModalHeader p="10" fontWeight="700" fontSize="2xl">Receber {dayToReceiveBills}</ModalHeader>

                <ModalCloseButton top="10" right="5"/>
                
                <ModalBody pl="10" pr="10">
                    <Stack spacing="6">
                        <HStack spacing="4" align="baseline">
                            <ControlledInput control={control} value={todayYmd} name="bill_receive_day" type="date" placeholder="Data que foi recebido" variant="outline" error={formState.errors.bill_receive_day} focusBorderColor="blue.400"/>
                        </HStack>
                    </Stack>
                </ModalBody>

                <ModalFooter p="10">
                    <SolidButton mr="6" color="white" bg="green.400" colorScheme="green" type="submit" isLoading={formState.isSubmitting}>
                        Confirmar e Receber Tudo
                    </SolidButton>

                    <Link onClick={onRequestClose} color="gray.700" fontSize="14px">Cancelar</Link>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}