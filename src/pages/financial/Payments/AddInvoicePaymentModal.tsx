import { Text, Input as ChakraInput, HStack, Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, useToast, Box, IconButton, Flex, Spinner } from "@chakra-ui/react";
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
import { Payment } from "../../../types";

interface AddFilePaymentModalProps{
    isOpen: boolean;
    onRequestClose: () => void;
    afterAttach: () => void;
    toAddInvoicePaymentData: AddInvoicePaymentFormData;
}

export interface AddInvoicePaymentFormData{
    title: string;
    id: number,
    invoice: string,
    invoice2: string,
    invoice_date: string,
    invoice2_date: string,
}

const PayPaymentFormSchema = yup.object().shape({
    invoice: yup.mixed(),
    invoice2: yup.mixed(),
    invoice_date: yup.string(),
    invoice2_date: yup.string(),
});

export function AddInvoicePaymentModal ( { isOpen, onRequestClose, afterAttach, toAddInvoicePaymentData } : AddFilePaymentModalProps){
    const history = useHistory();
    const toast = useToast();
    const { showErrors } = useErrors();

    // const [payment, setPayment] = useState<Payment>();

    // const loadPayment = async () => {
    //     const { data } = await api.get(`/payments/${toAddInvoicePaymentData.id}`);

    //     setPayment(data);
    // }

    // useEffect(() => {
    //     loadPayment();
    // }, [])


    const { handleSubmit, register, reset, control, formState} = useForm<AddInvoicePaymentFormData>({
        resolver: yupResolver(PayPaymentFormSchema),
    });

    const handleChangePaymentFile = async (paymentData : AddInvoicePaymentFormData) => {
        try{
            const paymentFormedData = new FormData();

            if(toFormFile !== undefined){
                paymentFormedData.append('invoice', toFormFile);
            }// }else{
            //     toast({
            //         title: "Error",
            //         description: `Nenhum arquivo foi selecionado.`,
            //         status: "error",
            //         duration: 12000,
            //         isClosable: true,
            //     });

            //     return;
            // }

            if(toFormFile2 !== undefined){
                paymentFormedData.append('invoice2', toFormFile2);
            }

            paymentData.invoice_date = formatInputDate(paymentData.invoice_date);
            paymentFormedData.append('invoice_date', paymentData.invoice_date);

            paymentData.invoice2_date = formatInputDate(paymentData.invoice2_date);
            paymentFormedData.append('invoice2_date', paymentData.invoice2_date);

            console.log(paymentData.invoice2_date);

            await api.post(`/payments/update/${toAddInvoicePaymentData.id}`, paymentFormedData, {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            });

            toast({
                title: "Sucesso",
                description: `Foi anexado uma nota ao pagamento ${toAddInvoicePaymentData.title}.`,
                status: "success",
                duration: 12000,
                isClosable: true,
            });

            onRequestClose();
            afterAttach();
            reset();
        }catch(error) {
            showErrors(error, toast);

            if(error.response.data.access){
                history.push('/');
            }
        }
    }


    const [fileName, setFileName] = useState("");
    const [toFormFile, setToFormFile] = useState<File>();

    function handleChangeFile(event: any){
        if(event.target.files.length){
            setFileName(event.target.files[0].name);

            setToFormFile(event.target.files[0]);
        }else{
            setFileName("");

            setToFormFile(event.target);
        }
    }

    const [fileName2, setFileName2] = useState("");
    const [toFormFile2, setToFormFile2] = useState<File>();

    function handleChangeFile2(event: any){
        if(event.target.files.length){
            setFileName2(event.target.files[0].name);

            setToFormFile2(event.target.files[0]);
        }else{
            setFileName2("");

            setToFormFile2(event.target);
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

    const handleRemoveInvoice = async (paymentId : number) => {
        try{
            await api.post(`/payments/remove_invoice2/${paymentId}`);
            
            afterAttach();
            toAddInvoicePaymentData.invoice = "";
            toAddInvoicePaymentData.invoice_date = "";

            toast({
                title: "Sucesso",
                description: `Nota Removida`,
                status: "success",
                duration: 12000,
                isClosable: true,
            });
        }catch(error) {
            showErrors(error, toast);

            if(error.response.data.access){
                history.push('/');
            }
        }
    }

    const handleRemoveInvoice2 = async (paymentId : number) => {
        try{
            await api.post(`/payments/remove_invoice2/${paymentId}`);
            
            afterAttach();
            toAddInvoicePaymentData.invoice2 = "";
            toAddInvoicePaymentData.invoice2_date = "";

            toast({
                title: "Sucesso",
                description: `Segunda Nota Removida`,
                status: "success",
                duration: 12000,
                isClosable: true,
            });
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
            <ModalContent as="form" borderRadius="24px" onSubmit={handleSubmit(handleChangePaymentFile)}>
                <ModalHeader p="10" fontWeight="700" fontSize="2xl">Anexar Nota em {toAddInvoicePaymentData.title}</ModalHeader>

                <ModalCloseButton top="10" right="5"/>
                
                    <ModalBody pl="10" pr="10">
                        <Stack spacing="6">
                            {
                                toAddInvoicePaymentData.invoice ? (
                                    <Stack>
                                        <HStack>
                                            <Link target="_blank" href={`${process.env.NODE_ENV === 'production' ? process.env.REACT_APP_API_STORAGE : process.env.REACT_APP_API_LOCAL_STORAGE}${toAddInvoicePaymentData.invoice}`} display="flex" fontWeight="medium" alignItems="center" color="gray.900" _hover={{textDecor:"underline", cursor: "pointer"}}>
                                                <FileIcon stroke="#4e4b66" fill="none" width="16px"/>
                                                <Text ml="2">Ver Nota</Text>
                                            </Link>

                                            <IconButton onClick={() => handleRemoveInvoice(toAddInvoicePaymentData.id)} h="24px" w="20px" minW="25px" p="0" float="right" aria-label="Excluir categoria" border="none" icon={ <CloseIcon width="20px" stroke="#C30052" fill="none"/>} variant="outline"/>
                                        </HStack>

                                    </Stack>
                                )
                                : (
                                    <HStack spacing="4" align="baseline">
                                        <HStack spacing="6" display="flex" pos="relative">

                                            <Box as="label" display="flex" borderRadius="full" alignItems="center" h="29px" fontWeight="600" fontSize="12px" pl="6" pr="6" cursor="pointer" border="2px" borderColor="blue.400" color="blue.400">
                                                <ChakraInput name="file" type="file" accept="image/png, image/jpeg, application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint,text/plain, application/pdf" display="none" onChange={handleChangeFile}/> 
                                                Selecionar Nota
                                            </Box>

                                            <Text>{fileName}</Text>
                                            
                                        </HStack>
                                    </HStack>
                                )
                            }
                            

                            {/* <Input register={register} name="invoice_date" type="date" placeholder="Data da nota" variant="outline" error={formState.errors.invoice_date}/> */}
                            <ControlledInput control={control} value={toAddInvoicePaymentData.invoice_date} name="invoice_date" type="date" placeholder="Data da nota" variant="outline" error={formState.errors.invoice_date} focusBorderColor="blue.400"/>


                            {
                                toAddInvoicePaymentData.invoice2 ? (
                                    <Stack>
                                        <HStack>
                                            <Link target="_blank" href={`${process.env.NODE_ENV === 'production' ? process.env.REACT_APP_API_STORAGE : process.env.REACT_APP_API_LOCAL_STORAGE}${toAddInvoicePaymentData.invoice2}`} display="flex" fontWeight="medium" alignItems="center" color="gray.900" _hover={{textDecor:"underline", cursor: "pointer"}}>
                                                <FileIcon stroke="#4e4b66" fill="none" width="16px"/>
                                                <Text ml="2">Ver Nota</Text>
                                            </Link>

                                            <IconButton onClick={() => handleRemoveInvoice2(toAddInvoicePaymentData.id)} h="24px" w="20px" minW="25px" p="0" float="right" aria-label="Excluir categoria" border="none" icon={ <CloseIcon width="20px" stroke="#C30052" fill="none"/>} variant="outline"/>
                                        </HStack>

                                    </Stack>
                                )
                                :(
                                    <HStack spacing="4" align="baseline">
                                        <HStack spacing="6" display="flex" pos="relative">

                                            <Box as="label" display="flex" borderRadius="full" alignItems="center" h="29px" fontWeight="600" fontSize="12px" pl="6" pr="6" cursor="pointer" border="2px" borderColor="blue.400" color="blue.400">
                                                <ChakraInput name="invoice2" type="file" accept="image/png, image/jpeg, application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint,text/plain, application/pdf" display="none" onChange={handleChangeFile2}/> 
                                                Selecionar Nota 2
                                            </Box>

                                            <Text>{fileName2}</Text>
                                            
                                        </HStack>
                                    </HStack>
                                )
                            }

                            

                            {/* <Input register={register} name="invoice_date" type="date" placeholder="Data da nota" variant="outline" error={formState.errors.invoice_date}/> */}
                            <ControlledInput control={control} value={toAddInvoicePaymentData.invoice2_date} name="invoice2_date" type="date" placeholder="Data da nota" variant="outline" error={formState.errors.invoice2_date} focusBorderColor="blue.400"/>
                        </Stack>
                    </ModalBody>

                <ModalFooter p="10">
                    <SolidButton mr="6" color="white" bg="green.400" colorScheme="green" type="submit" isLoading={formState.isSubmitting}>
                        Salvar
                    </SolidButton>

                    <Link onClick={onRequestClose} color="gray.700" fontSize="14px">Cancelar</Link>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}