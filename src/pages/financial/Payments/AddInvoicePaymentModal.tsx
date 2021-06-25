import { Text, Input, HStack, Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, useToast, Box } from "@chakra-ui/react";
import { SolidButton } from "../../../components/Buttons/SolidButton";


import { useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { api } from "../../../services/api";
import { useHistory } from "react-router";
import { useErrors } from "../../../hooks/useErrors";

import { useState } from "react";

interface AddFilePaymentModalProps{
    isOpen: boolean;
    onRequestClose: () => void;
    afterAttach: () => void;
    toAddInvoicePaymentData: AddFilePaymentFormData;
}

export interface AddFilePaymentFormData{
    title: string;
    id: number,
}

const PayPaymentFormSchema = yup.object().shape({
    invoice: yup.mixed(),
});

export function AddInvoicePaymentModal ( { isOpen, onRequestClose, afterAttach, toAddInvoicePaymentData } : AddFilePaymentModalProps){
    const history = useHistory();
    const toast = useToast();
    const { showErrors } = useErrors();

    const { handleSubmit, reset, control, formState} = useForm<AddFilePaymentFormData>({
        resolver: yupResolver(PayPaymentFormSchema),
    });

    const handleChangePaymentFile = async (paymentData : AddFilePaymentFormData) => {
        try{
            const paymentFormedData = new FormData();

            if(toFormFile !== undefined){
                paymentFormedData.append('invoice', toFormFile);
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

            console.log(toFormFile, );

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


    return(
        <Modal isOpen={isOpen} onClose={onRequestClose} size="xl">
            <ModalOverlay />
            <ModalContent as="form" borderRadius="24px" onSubmit={handleSubmit(handleChangePaymentFile)}>
                <ModalHeader p="10" fontWeight="700" fontSize="2xl">Anexar Nota em {toAddInvoicePaymentData.title}</ModalHeader>

                <ModalCloseButton top="10" right="5"/>
                
                <ModalBody pl="10" pr="10">
                    <Stack spacing="6">
                        <HStack spacing="4" align="baseline">
                            <HStack spacing="6" display="flex" pos="relative">

                                <Box as="label" display="flex" borderRadius="full" alignItems="center" h="29px" fontWeight="600" fontSize="12px" pl="6" pr="6" cursor="pointer" border="2px" borderColor="purple.300" color="purple.300">
                                    <Input name="image" type="file" accept="application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint,text/plain, application/pdf" display="none" onChange={handleChangeFile}/> 
                                    Selecionar Nota
                                </Box>

                                <Text>{fileName}</Text>
                                
                            </HStack>
                        </HStack>
                    </Stack>
                </ModalBody>

                <ModalFooter p="10">
                    <SolidButton mr="6" color="white" bg="green.400" colorScheme="green" type="submit" isLoading={formState.isSubmitting}>
                        Anexar
                    </SolidButton>

                    <Link onClick={onRequestClose} color="gray.700" fontSize="14px">Cancelar</Link>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}