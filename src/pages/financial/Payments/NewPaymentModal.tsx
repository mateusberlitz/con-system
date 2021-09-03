import { Box, Flex, HStack, Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, Text, useToast, Input as ChakraInput } from "@chakra-ui/react";
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
import { useEffect, useState } from "react";
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
    invoice_date?: string;
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
    expire: yup.string().required("Selecione a data de vencimento"),
    invoice_date: yup.string(),
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

        // if(paymentData.invoice_date != null && paymentData.invoice_date != ""){
        //     paymentData.invoice_date = formatInputDate(paymentData.invoice_date);
        // }else{
        //     delete paymentData.invoice_date;
        // }

        if(!workingCompany.company){
            return paymentData;
        }else if(paymentData.company === 0){
            paymentData.company = workingCompany.company?.id;
        }

        return paymentData;
    }

    const handleCreateNewPayment = async (paymentData : CreateNewPaymentFormData) => {
        try{
            const paymentFormedData = new FormData();
            const invoiceFormedData = new FormData();

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

            if(paymentData.invoice_date !== undefined && paymentData.invoice_date !== ""){
                paymentData.invoice_date = formatInputDate(paymentData.invoice_date);
                invoiceFormedData.append('date', paymentData.invoice_date);
            }else{
                if(toFormInvoice !== undefined && toFormInvoice !== ""){
                    toast({
                        title: "Ops",
                        description: `Selecione a data da nota`,
                        status: "warning",
                        duration: 12000,
                        isClosable: true,
                    });
    
                    return;
                }
            }

            delete paymentData.invoice_date;

            const response = await api.post('/payments/store', paymentData);

            if(toFormFile !== undefined && toFormFile !== ""){
                paymentFormedData.append('file', toFormFile);
            }

            await api.post(`/payments/update/${response.data.id}`, paymentFormedData);

            if(toFormInvoice !== undefined && toFormInvoice !== ""){
                invoiceFormedData.append('file', toFormInvoice);
                invoiceFormedData.append('payment', response.data.id);

                await api.post(`/invoices/store`, invoiceFormedData, {
                    headers: {
                        'content-type': 'multipart/form-data'
                    }
                });
            }

            toast({
                title: "Sucesso",
                description: `O pagamento ${paymentData.title} foi cadastrado.`,
                status: "success",
                duration: 12000,
                isClosable: true,
            });

            setFileName("");
            setToFormFile("");

            setInvoiceName("");
            setToFormInvoice("");

            onRequestClose();
            afterCreate();
            reset();
        }catch(error:any) {
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


    const [fileName, setFileName] = useState("");
    const [toFormFile, setToFormFile] = useState<File | "">();

    function handleChangeFile(event: any){
        if(event.target.files.length){
            setFileName(event.target.files[0].name);

            setToFormFile(event.target.files[0]);
        }else{
            setFileName("");

            setToFormFile(event.target);
        }
    }

    const [invoiceName, setInvoiceName] = useState("");
    const [toFormInvoice, setToFormInvoice] = useState<File | "">();

    function handleChangeInvoice(event: any){
        if(event.target.files.length){
            setInvoiceName(event.target.files[0].name);

            setToFormInvoice(event.target.files[0]);
        }else{
            setInvoiceName("");

            setToFormInvoice(event.target);
        }
    }

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
                                <ControlledSelect control={control} value={(workingCompany.company && workingCompany.company.id) ? workingCompany.company.id.toString() : "0"}  h="45px" name="company" w="100%" fontSize="sm" focusBorderColor="blue.400" bg="gray.400" variant="outline" _hover={ {bgColor: 'gray.500'} } size="lg" borderRadius="full" error={formState.errors.company}>
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

                        <HStack spacing="4" align="baseline">

                            <Flex alignSelf="center">
                                <Box as="label" mr="10px" display="flex" borderRadius="full" alignItems="center" h="29px" fontWeight="600" fontSize="10px" pl="6" pr="6" cursor="pointer" border="2px" borderColor="purple.300" color="purple.300">
                                    <ChakraInput name="file" type="file" accept="image/png, image/jpeg, application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint,text/plain, application/pdf" display="none" onChange={handleChangeFile}/> 
                                    Selecionar Boleto
                                </Box>

                                <Text>{fileName}</Text>
                            </Flex>
                        </HStack>

                        <Input register={register} name="observation" type="text" placeholder="Observação" variant="outline" error={formState.errors.observation}/>

                        <HStack spacing="4" align="baseline">

                            <Flex alignSelf="center">
                                <Box as="label" mr="10px" display="flex" borderRadius="full" alignItems="center" h="29px" fontWeight="600" fontSize="10px" pl="6" pr="6" cursor="pointer" border="2px" borderColor="purple.300" color="purple.300">
                                    <ChakraInput name="invoice" type="file" accept="image/png, image/jpeg, application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint,text/plain, application/pdf" display="none" onChange={handleChangeInvoice}/> 
                                    Selecionar Nota
                                </Box>

                                <Text>{invoiceName}</Text>
                            </Flex>

                            <Input register={register} name="invoice_date" type="date" placeholder="Data da nota" variant="outline" error={formState.errors.invoice_date}/>
                        </HStack>

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