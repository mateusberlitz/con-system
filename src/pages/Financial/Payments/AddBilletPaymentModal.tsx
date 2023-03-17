import { Text, HStack, Link, Modal, Input as ChakraInput, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, useToast, IconButton, Flex, Spinner, Divider } from "@chakra-ui/react";
import { SolidButton } from "../../../components/Buttons/SolidButton";

import { useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { api } from "../../../services/api";
import { useHistory } from "react-router";
import { useErrors } from "../../../hooks/useErrors";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import { redirectMessages } from "../../../utils/redirectMessages";
import { isAuthenticated } from "../../../services/auth";
import { formatYmdDate } from "../../../utils/Date/formatYmdDate";
import { ControlledInput } from "../../../components/Forms/Inputs/ControlledInput";
import { formatInputDate } from "../../../utils/Date/formatInputDate";

import { ReactComponent as CloseIcon } from '../../../assets/icons/Close.svg';
import { ReactComponent as FileIcon } from '../../../assets/icons/File.svg';

import { Invoice } from "../../../types";
import { InvoicesFilterData, useInvoices } from "../../../hooks/useInvoices";
import { useWorkingCompany } from "../../../hooks/useWorkingCompany";
import { FileInput } from "../../../components/Forms/FileInput";
import { useBillets } from "../../../hooks/useBillets";
import { Input } from "../../../components/Forms/Inputs/Input";
import { DraggableFileInput } from "../../../components/Forms/DraggableFileInput";

interface AddInvoicePaymentModalProps{
    isOpen: boolean;
    onRequestClose: () => void;
    afterAttach: () => void;
    toAddBilletData: AddBilletPaymentFormData;
}

export interface AddBilletPaymentFormData{
    title: string;
    id: number,
}

export interface AddBilletFormData{
    file: string,
    date: string,
}

export interface UpdateBilletFormData{
    date: string,
}


const CreateInvoiceFormSchema = yup.object().shape({
    file: yup.mixed(),
    date: yup.string(),
});

const UpdateInvoiceFormSchema = yup.object().shape({
    date: yup.string(),
});

export function AddBilletPaymentModal ( { isOpen, onRequestClose, afterAttach, toAddBilletData } : AddInvoicePaymentModalProps){
    const history = useHistory();
    const toast = useToast();
    const { showErrors } = useErrors();

    const workingCompany = useWorkingCompany();

    const [filter, setFilter] = useState<InvoicesFilterData>(() => {
        const data: InvoicesFilterData = {
            search: '',
            company: workingCompany.company?.id,
            payment: toAddBilletData.id,
        };
        
        return data;
    })

    useEffect(() => {
        setFilter({
            search: '',
            company: workingCompany.company?.id,
            payment: toAddBilletData.id,
        });

    }, [toAddBilletData.id, setFilter, workingCompany.company?.id])

    const [page, setPage] = useState(1);

    const billets = useBillets(filter, page);

    // const [payment, setPayment] = useState<Payment>();

    // const loadPayment = async () => {
    //     const { data } = await api.get(`/payments/${toAddBilletData.id}`);

    //     setPayment(data);
    // }

    // useEffect(() => {
    //     loadPayment();
    // }, [])


    const { handleSubmit, register, reset, control, formState} = useForm<AddBilletFormData>({
        resolver: yupResolver(CreateInvoiceFormSchema),
    });

    const handleCreateInvoice = async (invoiceData : AddBilletFormData) => {
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

            if(invoiceData.date !== ""){
                invoiceData.date = formatInputDate(invoiceData.date);
                InvoiceFormedData.append('date', invoiceData.date);
            }

            InvoiceFormedData.append('payment', toAddBilletData.id.toString());

            await api.post(`/billets/store`, InvoiceFormedData, {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            });

            toast({
                title: "Sucesso",
                description: `Foi anexado uma nota ao pagamento ${toAddBilletData.title}.`,
                status: "success",
                duration: 12000,
                isClosable: true,
            });

            setFileName("");
            setToFormFile("");

            billets.refetch();
            afterAttach();
        }catch(error:any) {
            showErrors(error, toast);

            if(error.response.data.access){
                history.push('/');
            }
        }
    }

    const UpdateInvoiceForm = useForm<AddBilletFormData>({
        resolver: yupResolver(UpdateInvoiceFormSchema),
    });

    const handleUpdateInvoice = async (invoiceData : AddBilletFormData, invoiceId : number) => {
        try{
            await api.post(`/billets/update/${invoiceId}`, invoiceData);

            billets.refetch();

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

    const handleRemoveBillet = async (invoiceId : number) => {
        try{
            await api.delete(`/billets/destroy/${invoiceId}`);
            
            billets.refetch();
            afterAttach();

            toast({
                title: "Sucesso",
                description: `Boleto Removido`,
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

    const inputFilesRef = useRef<HTMLInputElement>(null);
    const [fileList, setFileList] = useState<{
        files: File[],
        count: number
    }>({
        files: [],
        count: 0
    });

    const handleUploadBillets =  async () => {
        try{
            const billetsFormData = new FormData();

            if(fileList.count){
                fileList.files.map((file, index) => {
                    billetsFormData.append(`file${index}`, file);
                });
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

            billetsFormData.append('payment', toAddBilletData.id.toString());

            await api.post(`/billets/store`, billetsFormData, {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            });

            toast({
                title: "Sucesso",
                description: `Foram anexados os boletos ao pagamento ${toAddBilletData.title}.`,
                status: "success",
                duration: 12000,
                isClosable: true,
            });

            setFileName("");
            setToFormFile("");

            billets.refetch();
            afterAttach();
        }catch(error:any) {
            showErrors(error, toast);

            if(error.response.data.access){
                history.push('/');
            }
        }
    }

    return(
        <Modal isOpen={isOpen} onClose={onRequestClose} size="xl">
            <ModalOverlay />
            <ModalContent borderRadius="24px">
                <ModalHeader p="10" fontWeight="700" fontSize="2xl">Anexar Boleto em {toAddBilletData.title}</ModalHeader>

                <ModalCloseButton top="10" right="5"/>
                
                    <ModalBody pl="10" pr="10">
                        <Stack spacing="8">

                            {   billets.isLoading ? (
                                    <Flex justify="center">
                                        <Spinner/>
                                    </Flex>
                                ) : ( billets.isError ? (
                                    <Flex justify="left" mt="4" mb="4">
                                        <Text>Erro listar as contas a pagar</Text>
                                    </Flex>
                                ) : (billets.data?.data.length === 0) && (
                                    <Flex justify="left">
                                        <Text>Nenhum boleto encontrado.</Text>
                                    </Flex>
                                ) ) 
                            }

                            {
                                (!billets.isLoading && !billets.error) && Object.keys(billets.data?.data).map((day:string) => {
                                    return(
                                        billets.data?.data[day].map((billet:Invoice) => {
                                            console.log(billet.file);
                                            return (
                                                <Stack key={billet.file} p="6" border="1px solid" borderColor="gray.400" borderRadius="26px">
                                                    <HStack>
                                                        <Link target="_blank" href={`${process.env.NODE_ENV === 'production' ? process.env.REACT_APP_API_STORAGE : process.env.REACT_APP_API_LOCAL_STORAGE}${billet.file}`} display="flex" fontWeight="medium" alignItems="center" color="gray.900" _hover={{textDecor:"underline", cursor: "pointer"}}>
                                                            <FileIcon stroke="#4e4b66" fill="none" width="16px"/>
                                                            <Text ml="2">Ver boleto</Text>
                                                        </Link>
    
                                                        <IconButton onClick={() => handleRemoveBillet(billet.id)} h="24px" w="20px" minW="25px" p="0" float="right" aria-label="Excluir nota" border="none" icon={ <CloseIcon width="20px" stroke="#C30052" fill="none"/>} variant="outline"/>
                                                    </HStack>
    
                                                    <HStack spacing="6" as="form" onSubmit={UpdateInvoiceForm.handleSubmit( (data) => handleUpdateInvoice(data, billet.id))}>
                                                        <ControlledInput key={billet.file} control={UpdateInvoiceForm.control} value={billet.date} name="date" type="date" placeholder="Data da nota" variant="outline" error={formState.errors.date} focusBorderColor="blue.400"/>
                                                        
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
                                <Text fontWeight="bold">Adicionar Boleto</Text>

                                <Divider/>
                            </Stack>

                            <DraggableFileInput fileList={fileList} setFiles={setFileList}/>

                            <SolidButton mr="6" color="white" bg="green.400" colorScheme="green" onClick={() => handleUploadBillets()}>
                                Salvar
                            </SolidButton>

                            {/* <Stack pos="relative" h="120px" border="2px dashed" borderColor="gray.200" cursor="pointer" borderRadius={10}>

                                <ChakraInput ref={inputFilesRef} name="date" type="file" accept={"image/png, image/jpeg, application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint,text/plain, application/pdf"} zIndex="2" pos="absolute" multiple={true} opacity="0" cursor="pointer" minH="120px" onChange={handleChangeFileInput}/> 

                                <Stack pos="absolute" p="8" left="0" right="0" top="0" bottom="0" justifyContent="center" alignItems={"center"}>
                                    <Text color="gray.600">Arraste os arquivos</Text>
                                </Stack>
                            </Stack>

                            <Stack>
                                {
                                    files && files.map((file, index) => {
                                        return(
                                            <HStack key={`${file.name}-${index}`} bg="gray.200" p="1" px="3" borderRadius="4" justifyContent="space-between">
                                                <Text>{file.name}</Text>
                                                <IconButton onClick={() => handleRemoveFile(index)} h="24px" w="20px" minW="25px" p="0" float="right" aria-label="Remover arquivo" border="none" icon={ <CloseIcon width="20px" stroke="#C30052" fill="none"/>} variant="outline"/>
                                            </HStack>
                                        )
                                    })
                                }
                            </Stack> */}

                            {/* <Stack as="form"  spacing="4" onSubmit={handleSubmit(handleCreateInvoice)}>
                                <HStack spacing="4" align="baseline">
                                    <FileInput label="Selecionar Boleto" handleChangeFile={setToFormFile} fileName={fileName} handleChangeFileName={setFileName}/>
                                </HStack>

                                <HStack spacing="6">
                                    <ControlledInput control={control} value={todayYmd} name="date" type="date" placeholder="Data da nota" variant="outline" error={formState.errors.date} focusBorderColor="blue.400"/>

                                    <SolidButton mr="6" color="white" bg="green.400" colorScheme="green" type="submit" isLoading={formState.isSubmitting}>
                                        Adicionar
                                    </SolidButton>
                                </HStack>
                            </Stack> */}
                        </Stack>
                    </ModalBody>

                <ModalFooter p="10">
                    <Link onClick={onRequestClose} color="gray.700" fontSize="14px">Fechar</Link>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}