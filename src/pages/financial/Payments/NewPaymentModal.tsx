import { Flex, HStack, Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, Text, useToast } from "@chakra-ui/react";
import { SolidButton } from "../../../components/Buttons/SolidButton";


import { useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { api } from "../../../services/api";
import { useHistory } from "react-router";
import { useErrors } from "../../../hooks/useErrors";

import { Input } from "../../../components/Forms/Inputs/Input";
import { Select } from "../../../components/Forms/Selects/Select";
import { PaymentCategory, User, Provider, Company } from "../../../types";
import { useWorkingCompany } from "../../../hooks/useWorkingCompany";
import { formatInputDate } from "../../../utils/Date/formatInputDate";
import moneyToBackend from "../../../utils/moneyToBackend";
import { profile } from "console";
import { useProfile } from "../../../hooks/useProfile";
import { ControlledSelect } from "../../../components/Forms/Selects/ControlledSelect";
import { useEffect } from "react";
import { isAuthenticated } from "../../../services/auth";
import { redirectMessages } from "../../../utils/redirectMessages";

interface NewPaymentModalProps{
    isOpen: boolean;
    onRequestClose: () => void;
    afterCreate: () => void;
    categories: PaymentCategory[];
    providers: Provider[];
    users: User[];
}

interface CreateNewPaymentFormData{
    title: string;
    observation?: string;
    company: number;
    category: number;
    provider?: number;
    status?: boolean;
    pay_to_user?: number;
    value: string;
    expire: string;
    contract?: string;
    group?: string;
    quote?: string;
    recurrence?: number;
    file: any;
}

const CreateNewPaymentFormSchema = yup.object().shape({
    title: yup.string().required('Título do pagamento obrigatório'),
    observation: yup.string(),
    company: yup.number(),
    category: yup.number(),
    provider: yup.number().transform((v, o) => o === '' ? null : v).nullable(),
    status: yup.boolean(),
    pay_to_user: yup.number().transform((v, o) => o === '' ? null : v).nullable(),
    value: yup.string().required("Informe o valor do pagamento"),
    expire: yup.date().required("Selecione a data de vencimento"),
    contract: yup.string(),
    group: yup.string(),
    quote: yup.string(),
    recurrence: yup.number().transform((v, o) => o === '' ? null : v).nullable(),
    file: yup.array(),
});

export function NewPaymentModal( { isOpen, onRequestClose, afterCreate, categories, users, providers } : NewPaymentModalProps){
    const workingCompany = useWorkingCompany();
    const {profile} = useProfile();

    const history = useHistory();
    const toast = useToast();
    const { showErrors } = useErrors();

    const { register, handleSubmit, control, reset, formState} = useForm<CreateNewPaymentFormData>({
        resolver: yupResolver(CreateNewPaymentFormSchema),
    });

    function includeAndFormatData(paymentData: CreateNewPaymentFormData){
        paymentData.value = moneyToBackend(paymentData.value);

        if(paymentData.recurrence === null){
            delete paymentData.recurrence;
        }

        if(paymentData.provider === null){
            delete paymentData.provider;
        }

        if(paymentData.pay_to_user === null){
            delete paymentData.pay_to_user;
        }

        paymentData.expire = formatInputDate(paymentData.expire);

        if(!workingCompany.company){
            return paymentData;
        }else if(paymentData.company === 0){
            paymentData.company = workingCompany.company?.id;
        }


        return paymentData;
    }

    const handleCreateNewPayment = async (paymentData : CreateNewPaymentFormData) => {
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

            await api.post('/payments/store', paymentData);

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
            <ModalContent as="form" borderRadius="24px" onSubmit={handleSubmit(handleCreateNewPayment)}>
                <ModalHeader p="10" fontWeight="700" fontSize="2xl">Cadastrar Pagamento</ModalHeader>

                <ModalCloseButton top="10" right="5"/>
                
                <ModalBody pl="10" pr="10">
                    <Stack spacing="6">
                        
                        <Input register={register} name="title" type="text" placeholder="Título" variant="outline" error={formState.errors.title}/>

                        {
                            ( !profile || !profile.companies ? (
                                <Flex justify="center">
                                    <Text>Nenhuma empresa disponível</Text>
                                </Flex>
                            ) : (
                                <ControlledSelect control={control} value={(workingCompany && workingCompany.company) ? workingCompany.company.id.toString() : "0"}  h="45px" name="company" w="100%" fontSize="sm" focusBorderColor="blue.400" bg="gray.400" variant="outline" _hover={ {bgColor: 'gray.500'} } size="lg" borderRadius="full" error={formState.errors.company}>
                                    {profile.companies && profile.companies.map((company:Company) => {
                                        return (
                                            <option key={company.id} value={company.id}>{company.name}</option>
                                        )
                                    })}
                                </ControlledSelect>
                            ))
                        }

                        <HStack spacing="4" align="baseline">
                            <Input register={register} name="expire" type="date" placeholder="Data de Vencimento" variant="outline" error={formState.errors.expire}/>

                            <Input register={register} name="value" type="text" placeholder="Valor" variant="outline" mask="money" error={formState.errors.value}/>
                        </HStack>

                        <HStack spacing="4" align="baseline">
                            <Select register={register} h="45px" value="0" name="category" w="100%" fontSize="sm" focusBorderColor="blue.400" bg="gray.400" variant="outline" _hover={ {bgColor: 'gray.500'} } size="lg" borderRadius="full" placeholder="Categoria" error={formState.errors.category}>
                                {categories && categories.map((category:PaymentCategory) => {
                                    return (
                                        <option key={category.id} value={category.id}>{category.name}</option>
                                    )
                                })}
                            </Select>

                            <Select register={register} h="45px" value="0" name="provider" w="100%" fontSize="sm" focusBorderColor="blue.400" bg="gray.400" variant="outline" _hover={ {bgColor: 'gray.500'} } size="lg" borderRadius="full" placeholder="Fornecedor" error={formState.errors.pay_to_user}>
                                {providers && providers.map((provider:Provider) => {
                                    return (
                                        <option key={provider.id} value={provider.id}>{provider.name}</option>
                                    )
                                })}
                            </Select>
                        </HStack>

                        <HStack spacing="4" align="baseline">
                            <Input register={register} name="contract" type="text" placeholder="Contrato" variant="outline" error={formState.errors.contract}/>

                            <Select register={register} h="45px" name="pay_to_user" value="0" w="100%" fontSize="sm" focusBorderColor="blue.400" bg="gray.400" variant="outline" _hover={ {bgColor: 'gray.500'} } size="lg" borderRadius="full" placeholder="Pagar para" error={formState.errors.pay_to_user}>
                                {users && users.map((user:User) => {
                                    return (
                                        <option key={user.id} value={user.id}>{user.name}</option>
                                    )
                                })}
                            </Select>
                        </HStack>

                        <HStack spacing="4" align="baseline">
                            <Input register={register} name="recurrence" type="number" placeholder="Repetir Mensalmente" variant="outline" error={formState.errors.recurrence}/>
                        </HStack>

                        <Input register={register} name="observation" type="text" placeholder="Observação" variant="outline" error={formState.errors.observation}/>

                    </Stack>
                </ModalBody>

                <ModalFooter p="10">
                    <SolidButton mr="6" color="white" bg="blue.400" colorScheme="blue" type="submit" isLoading={formState.isSubmitting}>
                        Cadastrar
                    </SolidButton>

                    <Link onClick={onRequestClose} color="gray.700" fontSize="14px">Cancelar</Link>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}