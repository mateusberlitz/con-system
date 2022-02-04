import { Checkbox, Flex, HStack, Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, Text, useToast } from "@chakra-ui/react";
import { SolidButton } from "../../../components/Buttons/SolidButton";

import {  useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Company, PaymentCategory, Provider, User } from "../../../types";
import { api } from "../../../services/api";
import { useHistory } from "react-router";
import { useErrors } from "../../../hooks/useErrors";
import { useWorkingCompany } from "../../../hooks/useWorkingCompany";
import { ControlledInput } from "../../../components/Forms/Inputs/ControlledInput";
import { ControlledSelect } from "../../../components/Forms/Selects/ControlledSelect";
import { formatInputDate } from "../../../utils/Date/formatInputDate";
import moneyToBackend from "../../../utils/moneyToBackend";
import { useProfile } from "../../../hooks/useProfile";
import { redirectMessages } from "../../../utils/redirectMessages";
import { isAuthenticated } from "../../../services/auth";
import { useEffect, useState } from "react";

interface EditPartialBillModalProps{
    isOpen: boolean;
    onRequestClose: () => void;
    afterEdit: () => void;
    toEditPartialBillData: EditPartialBillFormData;
}

export interface EditPartialBillFormData{
    id: number;
    value: string;
    receive_date: string;
}

const EditBillFormSchema = yup.object().shape({
    value: yup.string().required("Informe o valor do pagamento"),
    receive_date: yup.date().required("Selecione a data de pagamento"),
});

export function EditPartialBillModal( { isOpen, onRequestClose, afterEdit, toEditPartialBillData } : EditPartialBillModalProps){
    const workingCompany = useWorkingCompany();
    const history = useHistory();
    const toast = useToast();
    const {profile} = useProfile();

    const { showErrors } = useErrors();

    const { handleSubmit, register, formState, control} = useForm<EditPartialBillFormData>({
        resolver: yupResolver(EditBillFormSchema),
        defaultValues: {
            value: toEditPartialBillData.value,
            receive_date: toEditPartialBillData.receive_date,
        }
    });

    function includeAndFormatData(paymentData: EditPartialBillFormData){
        paymentData.value = moneyToBackend(paymentData.value);

        console.log(paymentData.receive_date);
        paymentData.receive_date = formatInputDate(paymentData.receive_date);

        return paymentData;
    }

    const handleEditPayment = async (paymentData : EditPartialBillFormData) => {
        try{
            paymentData = includeAndFormatData(paymentData);
            console.log(paymentData);

            await api.post(`/partial_bills/update/${toEditPartialBillData.id}`, paymentData);

            toast({
                title: "Sucesso",
                description: `Dados da receita parcial atualizados.`,
                status: "success",
                duration: 12000,
                isClosable: true,
            });

            setIsDisabledRecurrence(true);
            afterEdit();
            onRequestClose();
        }catch(error: any) {
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

    const [isDisabledRecurrence, setIsDisabledRecurrence] = useState(true);

    const changeIsDisabledRecurrence = () => {
        setIsDisabledRecurrence(!isDisabledRecurrence);
    }

    console.log(toEditPartialBillData);

    return (
        <Modal isOpen={isOpen} onClose={onRequestClose} size="xl">
            <ModalOverlay />
            <ModalContent as="form" borderRadius="24px" onSubmit={handleSubmit(handleEditPayment)}>
                <ModalHeader p="10" fontWeight="700" fontSize="2xl">Alterar informações do pagamento</ModalHeader>

                <ModalCloseButton top="10" right="5"/>
                
                <ModalBody pl="10" pr="10">
                    <Stack spacing="6">
                        <HStack spacing="4" align="baseline">
                            <ControlledInput control={control} value={toEditPartialBillData.receive_date} name="receive_date" type="date" placeholder="Data do pagamento" variant="outline" error={formState.errors.receive_date} focusBorderColor="blue.400"/>
                            <ControlledInput control={control} value={toEditPartialBillData.value} name="value" type="text" placeholder="Valor" variant="outline" mask="money" error={formState.errors.value} focusBorderColor="blue.400"/>
                        </HStack>
                    </Stack>
                </ModalBody>

                <ModalFooter p="10">
                    <SolidButton mr="6" color="white" bg="blue.400" colorScheme="blue" type="submit" isLoading={formState.isSubmitting}>
                        Atualizar
                    </SolidButton>

                    <Link onClick={onRequestClose} color="gray.700" fontSize="14px">Cancelar</Link>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}