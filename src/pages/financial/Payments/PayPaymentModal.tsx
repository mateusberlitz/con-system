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

interface PayPaymentModalProps{
    isOpen: boolean;
    onRequestClose: () => void;
    afterCreate: () => void;
    toPayPaymentData: PayPaymentFormData;
}

export interface PayPaymentFormData{
    id: number,
    value: string,
    title: string,
    new_value: string,
}

const PayPaymentFormSchema = yup.object().shape({
    id: yup.number().required('Selecione o pagamento para pagar.'),
    value: yup.string().required('O pagamento deve possuir um valor.'),
    new_value: yup.string().nullable(),
});

export function PayPaymentModal ( { isOpen, onRequestClose, afterCreate, toPayPaymentData } : PayPaymentModalProps){
    const workingCompany = useWorkingCompany();
    const history = useHistory();
    const toast = useToast();
    const { showErrors } = useErrors();

    const { register, handleSubmit, reset, control, formState} = useForm<PayPaymentFormData>({
        resolver: yupResolver(PayPaymentFormSchema),
    });

    const handleCreateNewPayment = async (paymentData : PayPaymentFormData) => {
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

            await api.post('/payments/store', paymentData);

            toast({
                title: "Sucesso",
                description: `O pagamento ${toPayPaymentData.title} foi pago.`,
                status: "success",
                duration: 12000,
                isClosable: true,
            });

            onRequestClose();
            afterCreate();
            reset();
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
            <ModalContent as="form" borderRadius="24px" onSubmit={handleSubmit(handleCreateNewPayment)}>
                <ModalHeader p="10" fontWeight="700" fontSize="2xl">Pagar {toPayPaymentData.title}</ModalHeader>

                <ModalCloseButton top="10" right="5"/>
                
                <ModalBody pl="10" pr="10">
                    <Stack spacing="6">
                        <HStack spacing="4" align="baseline">
                            <ControlledInput control={control} value={Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(parseFloat(toPayPaymentData.value))} name="value" type="text" placeholder="Valor" variant="outline" error={formState.errors.value} mask="money" focusBorderColor="blue.400"/>
                            <ControlledInput control={control} value={toPayPaymentData.new_value} name="new_value" type="text" placeholder="Novo Valor" variant="outline" mask="money" error={formState.errors.new_value} focusBorderColor="blue.400"/>
                        </HStack>

                        {/* <HStack spacing="4" align="baseline">
                            <Input register={register} name="value" type="text" placeholder="Valor" variant="outline" mask="money" error={formState.errors.value}/>

                            <Input register={register} name="new_value" type="text" placeholder="Novo Valor" variant="outline" mask="money" error={formState.errors.new_value}/>
                        </HStack> */}
                    </Stack>
                </ModalBody>

                <ModalFooter p="10">
                    <SolidButton mr="6" color="white" bg="green.400" colorScheme="green" type="submit" isLoading={formState.isSubmitting}>
                        Pagar
                    </SolidButton>

                    <Link onClick={onRequestClose} color="gray.700" fontSize="14px">Cancelar</Link>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}