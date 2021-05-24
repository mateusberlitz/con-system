import { HStack, Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, useToast } from "@chakra-ui/react";
import { SolidButton } from "../../../components/Buttons/SolidButton";


import { useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { api } from "../../../services/api";
import { useHistory } from "react-router";
import { useErrors } from "../../../hooks/useErrors";

import { Input } from "../../../components/Forms/Inputs/Input";
import { Select } from "../../../components/Forms/Selects/Select";

interface NewPaymentModalProps{
    isOpen: boolean;
    onRequestClose: () => void;
    afterCreate: () => void;
}

interface CreateNewPaymentFormData{
    title: string;
    observation?: string;
    company: number;
    category: number;
    provider: number;
    status: boolean;
    pay_to_user: number;
    value: number;
    expire: string;
    contract: string;
    group: string;
    quote: string;
    recurrence: number;
    file: any;
}

const CreateNewPaymentFormSchema = yup.object().shape({
    title: yup.string().required('Título do pagamento obrigatório'),
    observation: yup.string(),
    company: yup.number().required("Selecione uma Empresa"),
    category: yup.number().required("Selecione uma categoria"),
    provider: yup.number(),
    status: yup.boolean(),
    pay_to_user: yup.number(),
    value: yup.number(),
    expire: yup.date().required("Selecione a data de vencimento"),
    contract: yup.string(),
    group: yup.string(),
    quote: yup.string(),
    recurrence: yup.number(),
    file: yup.array(),
});

export function NewPaymentModal( { isOpen, onRequestClose, afterCreate } : NewPaymentModalProps){
    const history = useHistory();
    const toast = useToast();
    const { showErrors } = useErrors();

    const { register, handleSubmit, reset, formState} = useForm<CreateNewPaymentFormData>({
        resolver: yupResolver(CreateNewPaymentFormSchema),
    });

    const handleCreateNewUser = async (paymentData : CreateNewPaymentFormData) => {
        try{
            console.log(paymentData);
            await api.post('/users/store', paymentData);

            toast({
                title: "Sucesso",
                description: `O pagamento ${paymentData.title} foi cadastrado.`,
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
            <ModalContent as="form" borderRadius="24px" onSubmit={handleSubmit(handleCreateNewUser)}>
                <ModalHeader p="10" fontWeight="700" fontSize="2xl">Cadastrar Pagamento</ModalHeader>

                <ModalCloseButton top="10" right="5"/>
                
                <ModalBody pl="10" pr="10">
                    <Stack spacing="6">
                        
                        <Input register={register} name="title" type="text" placeholder="Título" variant="outline" error={formState.errors.title}/>

                        <HStack spacing="4" align="baseline">
                            <Input register={register} name="expire" type="date" placeholder="Data de Vencimento" variant="filled" error={formState.errors.expire}/>

                            <Input register={register} name="value" type="text" placeholder="Valor" variant="outline" mask="money" error={formState.errors.value}/>
                        </HStack>

                        <HStack spacing="4" align="baseline">
                            <Select register={register} h="45px" name="category" w="100%" maxW="200px" fontSize="sm" focusBorderColor="purple.600" bg="gray.400" variant="filled" _hover={ {bgColor: 'gray.500'} } size="lg" borderRadius="full" placeholder="Categoria" error={formState.errors.category}>
                                <option value="1">Comissões</option>
                                <option value="2">Materiais</option>
                                <option value="3">Escritório</option>
                            </Select>

                            <Select register={register} h="45px" name="pay_to_user" w="100%" maxW="200px" fontSize="sm" focusBorderColor="purple.600" bg="gray.400" variant="filled" _hover={ {bgColor: 'gray.500'} } size="lg" borderRadius="full" placeholder="Pagar para" error={formState.errors.pay_to_user}>
                                <option value="1">Comissões</option>
                                <option value="2">Materiais</option>
                                <option value="3">Escritório</option>
                            </Select>
                        </HStack>

                        <HStack spacing="4" align="baseline">
                            <Input register={register} name="contract" type="text" placeholder="Contrato" variant="filled" error={formState.errors.contract}/>

                            <Input register={register} name="recurrence" type="number" placeholder="Repetir Mensalmente" variant="filled" error={formState.errors.recurrence}/>
                        </HStack>

                        <Input register={register} name="observation" type="text" placeholder="Título" variant="outline" error={formState.errors.observation}/>

                    </Stack>
                </ModalBody>

                <ModalFooter p="10">
                    <SolidButton mr="6" color="white" bg="purple.300" colorScheme="purple" type="submit" isLoading={formState.isSubmitting}>
                        Cadastrar
                    </SolidButton>

                    <Link onClick={onRequestClose} color="gray.700" fontSize="14px">Cancelar</Link>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}