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

interface EditPaymentModalProps{
    isOpen: boolean;
    onRequestClose: () => void;
    afterEdit: () => void;
    categories: PaymentCategory[];
    providers: Provider[];
    users: User[];
    toEditPaymentData: EditPaymentFormData;
}

export interface EditPaymentFormData{
    id: number;
    title: string;
    observation?: string;
    company: number;
    category: number;
    provider?: number;
    //status?: boolean;
    pay_to_user?: number;
    value: string;
    paid?: string;
    expire: string;
    contract?: string;
    group?: string;
    quote?: string;
    recurrence?: number;
    activeRecurrence?: string;
    file: any;
}

const EditPaymentFormSchema = yup.object().shape({
    title: yup.string().required('Título do pagamento obrigatório'),
    observation: yup.string().nullable(),
    company: yup.number(),
    category: yup.number(),
    provider: yup.number().transform((v, o) => o === '' ? null : v).nullable(),
    //status: yup.boolean(),
    pay_to_user: yup.number().transform((v, o) => o === '' ? null : v).nullable(),
    value: yup.string().required("Informe o valor do pagamento"),
    paid: yup.string(),
    expire: yup.date().required("Selecione a data de vencimento"),
    contract: yup.string().nullable(),
    group: yup.string(),
    quote: yup.string(),
    recurrence: yup.number().transform((v, o) => o === '' ? null : v).nullable(),
    file: yup.array(),
});

export function EditPaymentModal( { isOpen, onRequestClose, afterEdit, toEditPaymentData, categories, users, providers } : EditPaymentModalProps){
    const workingCompany = useWorkingCompany();
    const history = useHistory();
    const toast = useToast();
    const {profile} = useProfile();

    const { showErrors } = useErrors();

    const { handleSubmit, register, formState, control} = useForm<EditPaymentFormData>({
        resolver: yupResolver(EditPaymentFormSchema),
        defaultValues: {
            title: toEditPaymentData.title,
            value: toEditPaymentData.value,
            company: toEditPaymentData.company,
            category: toEditPaymentData.category,
            provider: toEditPaymentData.provider,
            pay_to_user: toEditPaymentData.pay_to_user,
            //status: toEditPaymentData.status,
            expire: toEditPaymentData.expire,
            observation: toEditPaymentData.observation,
            contract: toEditPaymentData.contract,
            group: toEditPaymentData.group,
            quote: toEditPaymentData.quote,
            recurrence: toEditPaymentData.recurrence,
            paid: toEditPaymentData.paid,
            file: toEditPaymentData.file,
        }
    });

    function includeAndFormatData(paymentData: EditPaymentFormData){
        paymentData.value = moneyToBackend(paymentData.value);
        

        if(paymentData.paid === null || paymentData.paid === undefined){
            delete paymentData.paid;
        }else{
            paymentData.paid = moneyToBackend(paymentData.paid);
        }

        if(paymentData.recurrence === null){
            delete paymentData.recurrence;
        }

        if(paymentData.provider === null){
            delete paymentData.provider;
        }

        if(paymentData.pay_to_user === null){
            delete paymentData.pay_to_user;
        }

        if(paymentData.file === null || paymentData.file === "" || paymentData.file.length === 0){
            delete paymentData.file;
        }
        console.log(paymentData.expire);
        paymentData.expire = formatInputDate(paymentData.expire);

        if(!workingCompany.company){
            return paymentData;
        }else if(paymentData.company === 0){
            paymentData.company = workingCompany.company?.id;
        }

        return paymentData;
    }

    const handleEditPayment = async (paymentData : EditPaymentFormData) => {
        try{
            if(!workingCompany.company && paymentData.company === 0){
                toast({
                    title: "Ué",
                    description: `Seleciona uma empresa para trabalhar`,
                    status: "warning",
                    duration: 12000,
                    isClosable: true,
                });

                return;
            }

            paymentData = includeAndFormatData(paymentData);
            console.log(paymentData);

            await api.post(`/payments/update/${toEditPaymentData.id}`, paymentData);

            toast({
                title: "Sucesso",
                description: `Dados do pagamento ${toEditPaymentData.title} atualizados.`,
                status: "success",
                duration: 12000,
                isClosable: true,
            });

            setIsDisabledRecurrence(true);
            afterEdit();
            onRequestClose();
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

    const [isDisabledRecurrence, setIsDisabledRecurrence] = useState(true);

    const changeIsDisabledRecurrence = () => {
        setIsDisabledRecurrence(!isDisabledRecurrence);
    }

    return (
        <Modal isOpen={isOpen} onClose={onRequestClose} size="xl">
            <ModalOverlay />
            <ModalContent as="form" borderRadius="24px" onSubmit={handleSubmit(handleEditPayment)}>
                <ModalHeader p="10" fontWeight="700" fontSize="2xl">Alterar {toEditPaymentData.title}</ModalHeader>

                <ModalCloseButton top="10" right="5"/>
                
                <ModalBody pl="10" pr="10">
                    <Stack spacing="6">
                        <ControlledInput control={control} value={toEditPaymentData.title} name="title" type="text" placeholder="Título" variant="outline" error={formState.errors.title} focusBorderColor="blue.400"/>

                        {
                            ( !profile || !profile.companies ? (
                                <Flex justify="center">
                                    <Text>Nenhuma empresa disponível</Text>
                                </Flex>
                            ) : (
                                <ControlledSelect control={control} value={toEditPaymentData.company.toString()}  h="45px" name="company" w="100%" fontSize="sm" focusBorderColor="blue.400" bg="gray.400" variant="outline" _hover={ {bgColor: 'gray.500'} } size="lg" borderRadius="full" error={formState.errors.company}>
                                    {profile.companies && profile.companies.map((company:Company) => {
                                        return (
                                            <option key={company.id} value={company.id}>{company.name}</option>
                                        )
                                    })}
                                </ControlledSelect>
                            ))
                        }

                        <HStack spacing="4" align="baseline">
                            <ControlledInput control={control} value={toEditPaymentData.expire} name="expire" type="date" placeholder="Data de Vencimento" variant="outline" error={formState.errors.expire} focusBorderColor="blue.400"/>
                            <ControlledInput control={control} value={toEditPaymentData.value} name="value" type="text" placeholder="Telefone" variant="outline" mask="money" error={formState.errors.value} focusBorderColor="blue.400"/>
                        </HStack>


                        <HStack spacing="4" align="baseline">
                            <ControlledSelect control={control} name="category" value={toEditPaymentData.category.toString()} error={formState.errors.category} variant="outline" w="100%" maxW="100%" focusBorderColor="blue.400"> 
                                    <option key="0" value="0">Categoria</option>
                                    {categories && categories.map((category:PaymentCategory) => {
                                        return (
                                            <option key={category.id} value={category.id}>{category.name}</option>
                                        )
                                    })}
                            </ControlledSelect>

                            <ControlledSelect control={control} name="provider" value={toEditPaymentData.provider?.toString()} error={formState.errors.provider} variant="outline" w="100%" maxW="100%" focusBorderColor="blue.400"> 
                                    <option key="0" value="0">Fornecedor</option>
                                    {providers && providers.map((provider:Provider) => {
                                        return (
                                            <option key={provider.id} value={provider.id}>{provider.name}</option>
                                        )
                                    })}
                            </ControlledSelect>
                        </HStack>

                        <HStack spacing="4" align="baseline">
                            <ControlledInput control={control} value={toEditPaymentData.contract} name="contract" type="text" placeholder="Contrato" variant="outline" error={formState.errors.contract} focusBorderColor="blue.400"/>

                            <ControlledSelect control={control} name="pay_to_user" value={toEditPaymentData.pay_to_user?.toString()} error={formState.errors.pay_to_user} variant="outline" w="100%" maxW="100%" focusBorderColor="blue.400"> 
                                    <option key="0" value="0">Pagar para</option>
                                    {users && users.map((user:User) => {
                                        return (
                                            <option key={user.id} value={user.id}>{user.name}</option>
                                        )
                                    })}
                            </ControlledSelect>
                        </HStack>

                        <HStack spacing="4" align="baseline">
                            <ControlledInput isDisabled={isDisabledRecurrence} control={control} value={toEditPaymentData.recurrence?.toString()} name="recurrence" type="text" placeholder="Repetir Mensalmente" variant="outline" error={formState.errors.recurrence} focusBorderColor="blue.400"/>

                            <Flex alignSelf="center">
                                <Checkbox onChange={() => {changeIsDisabledRecurrence()}} colorScheme="blue" size="md" mr="15" borderRadius="full" fontSize="11px" color="gray.800">
                                    <Text fontSize="12px">Criar uma programação</Text>
                                </Checkbox>
                            </Flex>
                        </HStack>

                        <ControlledInput control={control} value={toEditPaymentData.paid} name="paid" type="text" placeholder="Valor já pago" variant="outline" error={formState.errors.paid} focusBorderColor="blue.400"/>
                        
                        <ControlledInput control={control} value={toEditPaymentData.observation} name="observation" type="text" placeholder="Observação" variant="outline" error={formState.errors.observation} focusBorderColor="blue.400"/>
                        
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