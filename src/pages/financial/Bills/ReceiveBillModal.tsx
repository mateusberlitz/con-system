import { HStack, Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, useToast } from "@chakra-ui/react";
import { SolidButton } from "../../../components/Buttons/SolidButton";


import { useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { api } from "../../../services/api";
import { useHistory } from "react-router";
import { useErrors } from "../../../hooks/useErrors";

import { useWorkingCompany } from "../../../hooks/useWorkingCompany";
import { ControlledInput } from "../../../components/Forms/Inputs/ControlledInput";
import moneyToBackend from "../../../utils/moneyToBackend";
import { formatYmdDate } from "../../../utils/Date/formatYmdDate";
import { useEffect } from "react";
import { isAuthenticated } from "../../../services/auth";
import { redirectMessages } from "../../../utils/redirectMessages";

interface ReceiveBillModalProps{
    isOpen: boolean;
    onRequestClose: () => void;
    afterReceive: () => void;
    toReceiveBillData: ReceiveBillFormData;
}

export interface ReceiveBillFormData{
    id: number,
    value: string,
    title: string,
    new_value?: string,
    bill_receive_day?: string,
    company?: number
}

const ReceiveBillFormSchema = yup.object().shape({
    value: yup.string(),
    new_value: yup.string().nullable(),
    bill_receive_day: yup.date().required("Selecione a data que foi recebido"),
});

export function ReceiveBillModal ( { isOpen, onRequestClose, afterReceive, toReceiveBillData } : ReceiveBillModalProps){
    const workingCompany = useWorkingCompany();
    const history = useHistory();
    const toast = useToast();
    const { showErrors } = useErrors();

    const { handleSubmit, reset, control, formState} = useForm<ReceiveBillFormData>({
        resolver: yupResolver(ReceiveBillFormSchema),
    });

    const handleReceiveBill = async (billData : ReceiveBillFormData) => {
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

            billData.new_value = (billData.new_value ? moneyToBackend(billData.new_value) : '');

            billData.company = workingCompany.company.id;
            billData.value = toReceiveBillData.value;

            await api.post(`/bills/receive/${toReceiveBillData.id}`, billData);

            toast({
                title: "Sucesso",
                description: `A Conta a receber ${toReceiveBillData.title} foi recebida.`,
                status: "success",
                duration: 12000,
                isClosable: true,
            });

            onRequestClose();
            afterReceive();
            reset();
        }catch(error) {
            showErrors(error, toast);

            if(error.response.data.access){
                history.push('/');
            }
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

    const todayYmd = formatYmdDate(new Date().toDateString());

    return(
        <Modal isOpen={isOpen} onClose={onRequestClose} size="xl">
            <ModalOverlay />
            <ModalContent as="form" borderRadius="24px" onSubmit={handleSubmit(handleReceiveBill)}>
                <ModalHeader p="10" fontWeight="700" fontSize="2xl">Receber {toReceiveBillData.title}</ModalHeader>

                <ModalCloseButton top="10" right="5"/>
                
                <ModalBody pl="10" pr="10">
                    <Stack spacing="6">
                        <HStack spacing="4" align="baseline">
                            <ControlledInput isDisabled={true} control={control} value={Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(Number(toReceiveBillData.value))} name="value" type="text" placeholder="Valor" variant="outline" error={formState.errors.value} mask="money" focusBorderColor="blue.400"/>
                            <ControlledInput control={control} value={toReceiveBillData.new_value} name="new_value" type="text" placeholder="Novo Valor" variant="outline" mask="money" error={formState.errors.new_value} focusBorderColor="blue.400"/>
                        </HStack>

                        <HStack spacing="4" align="baseline">
                            <ControlledInput control={control} value={todayYmd} name="bill_receive_day" type="date" placeholder="Data que foi recebido" variant="outline" error={formState.errors.bill_receive_day} focusBorderColor="blue.400"/>
                        </HStack>
                    </Stack>
                </ModalBody>

                <ModalFooter p="10">
                    <SolidButton mr="6" color="white" bg="green.400" colorScheme="green" type="submit" isLoading={formState.isSubmitting}>
                        Receber
                    </SolidButton>

                    <Link onClick={onRequestClose} color="gray.700" fontSize="14px">Cancelar</Link>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}