import { Text, Input as ChakraInput, HStack, Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, useToast, Box, IconButton, Flex, Spinner, Divider } from "@chakra-ui/react";
import { SolidButton } from "../../../components/Buttons/SolidButton";


import { useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { api } from "../../../services/api";
import { useHistory } from "react-router";
import { useErrors } from "../../../hooks/useErrors";

import { useEffect, useState } from "react";
import { redirectMessages } from "../../../utils/redirectMessages";
import { isAuthenticated } from "../../../services/auth";
import { Input } from "../../../components/Forms/Inputs/Input";
import { formatYmdDate } from "../../../utils/Date/formatYmdDate";
import { ControlledInput } from "../../../components/Forms/Inputs/ControlledInput";
import { formatInputDate } from "../../../utils/Date/formatInputDate";

import { ReactComponent as CloseIcon } from '../../../assets/icons/Close.svg';
import { ReactComponent as FileIcon } from '../../../assets/icons/File.svg';

import { formatBRDate } from "../../../utils/Date/formatBRDate";
import { Invoice, Payment } from "../../../types";
import { InvoicesFilterData, useInvoices } from "../../../hooks/useInvoices";
import { useWorkingCompany } from "../../../hooks/useWorkingCompany";
import { FileInput } from "../../../components/Forms/FileInput";

interface AddFilePaymentModalProps{
    isOpen: boolean;
    onRequestClose: () => void;
    afterAttach: () => void;
    toAddInvoiceData: AddInvoicePaymentFormData;
}

export interface AddInvoicePaymentFormData{
    title: string;
    id: number,
}

export interface AddInvoiceFormData{
    file: string,
    date: string,
}

export interface UpdateInvoiceFormData{
    date: string,
}


const CreateInvoiceFormSchema = yup.object().shape({
    file: yup.mixed(),
    date: yup.string(),
});

const UpdateInvoiceFormSchema = yup.object().shape({
    date: yup.string(),
});

export function AddInvoicePaymentModal ( { isOpen, onRequestClose, afterAttach, toAddInvoiceData } : AddFilePaymentModalProps){
    const history = useHistory();
    const toast = useToast();
    const { showErrors } = useErrors();

    const workingCompany = useWorkingCompany();

    const [filter, setFilter] = useState<InvoicesFilterData>(() => {
        const data: InvoicesFilterData = {
            search: '',
            company: workingCompany.company?.id,
            payment: toAddInvoiceData.id,
        };
        
        return data;
    })

    useEffect(() => {
        setFilter({
            search: '',
            company: workingCompany.company?.id,
            payment: toAddInvoiceData.id,
        });

    }, [toAddInvoiceData.id, setFilter, workingCompany.company?.id])

    const [page, setPage] = useState(1);

    const invoices = useInvoices(filter, page);

    // const [payment, setPayment] = useState<Payment>();

    // const loadPayment = async () => {
    //     const { data } = await api.get(`/payments/${toAddInvoiceData.id}`);

    //     setPayment(data);
    // }

    // useEffect(() => {
    //     loadPayment();
    // }, [])


    const { handleSubmit, register, reset, control, formState} = useForm<AddInvoiceFormData>({
        resolver: yupResolver(CreateInvoiceFormSchema),
    });

    const handleCreateInvoice = async (invoiceData : AddInvoiceFormData) => {
        try{
            const InvoiceFormedData = new FormData();

            if(toFormFile !== undefined && toFormFile !== ""){
                InvoiceFormedData.append('file', toFormFile);
            }else{
                toast({
                    title: "Error",
                    description: `Nenhum arquivo foi selecionado.`,
                    status: "error",
                    duration: 12000,
                    isClosable: true,
                });

                return;
            }

            console.log(toFormFile);

            if(invoiceData.date !== ""){
                invoiceData.date = formatInputDate(invoiceData.date);
                InvoiceFormedData.append('date', invoiceData.date);
            }

            InvoiceFormedData.append('payment', toAddInvoiceData.id.toString());

            await api.post(`/invoices/store`, InvoiceFormedData, {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            });

            toast({
                title: "Sucesso",
                description: `Foi anexado uma nota ao pagamento ${toAddInvoiceData.title}.`,
                status: "success",
                duration: 12000,
                isClosable: true,
            });

            setFileName("");
            setToFormFile("");

            invoices.refetch();
        }catch(error:any) {
            showErrors(error, toast);

            if(error.response.data.access){
                history.push('/');
            }
        }
    }

    const UpdateInvoiceForm = useForm<AddInvoiceFormData>({
        resolver: yupResolver(UpdateInvoiceFormSchema),
    });

    const handleUpdateInvoice = async (invoiceData : AddInvoiceFormData, invoiceId : number) => {
        try{
            await api.post(`/invoices/update/${invoiceId}`, invoiceData);

            invoices.refetch();

            toast({
                title: "Sucesso",
                description: `Atualizada a data da nota.`,
                status: "success",
                duration: 12000,
                isClosable: true,
            });
        }catch(error:any) {
            showErrors(error, toast);

            if(error.response.data.access){
                history.push('/');
            }
        }
    }


    const [fileName, setFileName] = useState("");
    const [toFormFile, setToFormFile] = useState<File | "">();

    useEffect(() => {
        if(!isAuthenticated()){
            history.push({
                pathname: '/',
                state: redirectMessages.auth
            });
        }
    }, [isOpen])

    const todayYmd = formatYmdDate(new Date().toDateString());

    const handleRemoveInvoice = async (invoiceId : number) => {
        try{
            await api.delete(`/invoices/destroy/${invoiceId}`);
            
            invoices.refetch();

            toast({
                title: "Sucesso",
                description: `Nota Removida`,
                status: "success",
                duration: 12000,
                isClosable: true,
            });
        }catch(error:any) {
            showErrors(error, toast);

            if(error.response.data.access){
                history.push('/');
            }
        }
    }

    console.log(invoices, filter);
    // useEffect(() => {

    // }, [invoices])

    return(
        <Modal isOpen={isOpen} onClose={onRequestClose} size="xl">
            <ModalOverlay />
            <ModalContent borderRadius="24px">
                <ModalHeader p="10" fontWeight="700" fontSize="2xl">Anexar Nota em {toAddInvoiceData.title}</ModalHeader>

                <ModalCloseButton top="10" right="5"/>
                
                    <ModalBody pl="10" pr="10">
                        <Stack spacing="8">

                            {   invoices.isLoading ? (
                                    <Flex justify="center">
                                        <Spinner/>
                                    </Flex>
                                ) : ( invoices.isError ? (
                                    <Flex justify="left" mt="4" mb="4">
                                        <Text>Erro listar as contas a pagar</Text>
                                    </Flex>
                                ) : (invoices.data?.data.length === 0) && (
                                    <Flex justify="left">
                                        <Text>Nenhuma nota encontrada.</Text>
                                    </Flex>
                                ) ) 
                            }

                            {
                                (!invoices.isLoading && !invoices.error) && Object.keys(invoices.data?.data).map((day:string) => {
                                    return(
                                        invoices.data?.data[day].map((invoice:Invoice) => {
                                            return (
                                                <Stack key={invoice.file} p="6" border="1px solid" borderColor="gray.400" borderRadius="26px">
                                                    <HStack>
                                                        <Link target="_blank" href={`${process.env.NODE_ENV === 'production' ? process.env.REACT_APP_API_STORAGE : process.env.REACT_APP_API_LOCAL_STORAGE}${invoice.file}`} display="flex" fontWeight="medium" alignItems="center" color="gray.900" _hover={{textDecor:"underline", cursor: "pointer"}}>
                                                            <FileIcon stroke="#4e4b66" fill="none" width="16px"/>
                                                            <Text ml="2">Ver Nota</Text>
                                                        </Link>
    
                                                        <IconButton onClick={() => handleRemoveInvoice(invoice.id)} h="24px" w="20px" minW="25px" p="0" float="right" aria-label="Excluir nota" border="none" icon={ <CloseIcon width="20px" stroke="#C30052" fill="none"/>} variant="outline"/>
                                                    </HStack>
    
                                                    <HStack spacing="6" as="form" onSubmit={UpdateInvoiceForm.handleSubmit( (data) => handleUpdateInvoice(data, invoice.id))}>
                                                        <ControlledInput key={invoice.file} control={UpdateInvoiceForm.control} value={invoice.date} name="date" type="date" placeholder="Data da nota" variant="outline" error={formState.errors.date} focusBorderColor="blue.400"/>
                                                        
                                                        <SolidButton mr="6" color="white" bg="green.400" colorScheme="green" type="submit" isLoading={UpdateInvoiceForm.formState.isSubmitting}>
                                                            Salvar
                                                        </SolidButton>
                                                    </HStack>
                                                </Stack>
                                            )
                                        })
                                    )
                                })
                            }

                            <Stack>
                                <Text fontWeight="bold">Adicionar Nota</Text>

                                <Divider/>
                            </Stack>

                            <Stack as="form"  spacing="4" onSubmit={handleSubmit(handleCreateInvoice)}>
                                <HStack spacing="4" align="baseline">
                                    {/* <HStack spacing="6" display="flex" pos="relative">

                                        <Box as="label" display="flex" borderRadius="full" alignItems="center" h="29px" fontWeight="600" fontSize="12px" pl="6" pr="6" cursor="pointer" border="2px" borderColor="blue.400" color="blue.400">
                                            <ChakraInput name="date" type="file" accept="image/png, image/jpeg, application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint,text/plain, application/pdf" display="none" onChange={handleChangeFile}/> 
                                            Selecionar Nota
                                        </Box>

                                        <Text>{fileName}</Text>
                                        
                                    </HStack> */}
                                    <FileInput label="Selecionar Nota" handleChangeFile={setToFormFile} fileName={fileName} handleChangeFileName={setFileName}/>
                                </HStack>

                                <HStack spacing="6">
                                    <ControlledInput control={control} value={todayYmd} name="date" type="date" placeholder="Data da nota" variant="outline" error={formState.errors.date} focusBorderColor="blue.400"/>

                                    <SolidButton mr="6" color="white" bg="green.400" colorScheme="green" type="submit" isLoading={formState.isSubmitting}>
                                        Adicionar
                                    </SolidButton>
                                </HStack>
                            </Stack>
                        </Stack>
                    </ModalBody>

                <ModalFooter p="10">
                    <Link onClick={onRequestClose} color="gray.700" fontSize="14px">Fechar</Link>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}