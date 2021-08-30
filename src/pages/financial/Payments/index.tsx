import { FormControl, Link, Flex, HStack, Stack, Spinner, IconButton, Text, Accordion, Select as ChakraSelect, AccordionItem, AccordionButton, AccordionPanel, useToast, Divider, Table, Thead, Th, Td, Tbody, Tr } from "@chakra-ui/react";
import { SolidButton } from "../../../components/Buttons/SolidButton";
import { MainBoard } from "../../../components/MainBoard";
import { useCompanies } from "../../../hooks/useCompanies";
import { HasPermission, useProfile } from "../../../hooks/useProfile";
import { Company, PartialPayment, Payment, PaymentCategory, User } from "../../../types";

import { useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { ReactComponent as PlusIcon } from '../../../assets/icons/Plus.svg';
import { ReactComponent as MinusIcon } from '../../../assets/icons/Minus.svg';
import { ReactComponent as StrongPlusIcon } from '../../../assets/icons/StrongPlus.svg';
import { ReactComponent as EllipseIcon } from '../../../assets/icons/Ellipse.svg';
import { ReactComponent as AttachIcon } from '../../../assets/icons/Attach.svg';
import { ReactComponent as TagIcon } from '../../../assets/icons/Tag.svg';
import { ReactComponent as CheckIcon } from '../../../assets/icons/Check.svg';
import { ReactComponent as FileIcon } from '../../../assets/icons/File.svg';
import { ReactComponent as CloseIcon } from '../../../assets/icons/Close.svg';
import { ReactComponent as RefreshIcon } from '../../../assets/icons/Refresh.svg';

import { Input } from "../../../components/Forms/Inputs/Input";
import { OutlineButton } from "../../../components/Buttons/OutlineButton";
import { EditButton } from "../../../components/Buttons/EditButton";
import { RemoveButton } from "../../../components/Buttons/RemoveButton";
import { useEffect, useState } from "react";
import { NewPaymentModal } from "./NewPaymentModal";
import { ConfirmPaymentRemoveModal } from "./ConfirmPaymentRemoveModal";
import { CompanySelect } from "../../../components/CompanySelect";
import { useHistory } from "react-router";
import { api } from "../../../services/api";
import { UserFilterData, useUsers } from "../../../hooks/useUsers";
import { useProviders } from "../../../hooks/useProviders";
import { useWorkingCompany } from "../../../hooks/useWorkingCompany";
import { PaymentFilterData, usePayments } from "../../../hooks/usePayments";
import { EditPaymentFormData, EditPaymentModal } from "./EditPaymentModal";
import { formatDate } from "../../../utils/Date/formatDate";
import { formatYmdDate } from "../../../utils/Date/formatYmdDate";
import { formatBRDate } from "../../../utils/Date/formatBRDate";
import { getDay } from "../../../utils/Date/getDay";
import { PayPaymentFormData, PayPaymentModal } from "./PayPaymentModal";
import { Select } from "../../../components/Forms/Selects/Select";
import { PayAllPaymentsModal } from "./PayAllPaymentsModal";
import { Pagination } from "../../../components/Pagination";
import { AddFilePaymentFormData, AddFilePaymentModal } from "./AddFilePaymentModal";
import { showErrors } from "../../../hooks/useErrors";
import { AddProofPaymentModal } from "./AddProofPaymentModal";
import { AddInvoicePaymentFormData, AddInvoicePaymentModal } from "./AddInvoicePaymentModal";
import { ConfirmPartialRemoveModal } from "./ConfirmPartialRemoveModal";
import { profile } from "node:console";
import { ExportDocumentsModal } from "./ExportDocumentsModal";

interface RemovePaymentData{
    id: number;
    title: string;
}

const FilterPaymentsFormSchema = yup.object().shape({
    search: yup.string(),
    start_date: yup.string(),
    end_date: yup.string(),
    category: yup.string(),
    company: yup.string(),
    contract: yup.string(),
    group: yup.string(),
    quote: yup.string(),
    status: yup.string(),
    pay_to_user: yup.string(),
});

export default function Payments(){
    const workingCompany = useWorkingCompany();
    const history = useHistory();

    const [filter, setFilter] = useState<PaymentFilterData>(() => {
        const data: PaymentFilterData = {
            search: '',
            company: workingCompany.company?.id,
            status: 0,
        };
        
        return data;
    })

    function handleChangeFilter(newFilter: PaymentFilterData){
        setFilter(newFilter);
    }

    const [page, setPage] = useState(1);

    const payments = usePayments(filter, page);

    const {permissions, profile} = useProfile();
    const companies = useCompanies();
    const providers = useProviders();

    const { register, handleSubmit, formState} = useForm<PaymentFilterData>({
        resolver: yupResolver(FilterPaymentsFormSchema),
    });

    function handleChangeCompany(event:any){
        const selectedCompanyId = (event?.target.value ? event?.target.value : 1);
        const selectedCompanyData = companies.data.filter((company:Company) => company.id == selectedCompanyId)[0]
        workingCompany.changeCompany(selectedCompanyData);

        const updatedFilter = filter;
        updatedFilter.company = selectedCompanyId;

        setFilter(updatedFilter);
    }

    const [isNewPaymentModalOpen, setIsNewPaymentModalOpen] = useState(false);

    function OpenNewPaymentModal(){
        setIsNewPaymentModalOpen(true);
    }
    function CloseNewPaymentModal(){
        setIsNewPaymentModalOpen(false);
    }


    const [categories, setCategories] = useState<PaymentCategory[]>([]);

    const loadCategories = async () => {
        const { data } = await api.get('/payment_categories');

        setCategories(data);
    }

    useEffect(() => {
        loadCategories();
        
    }, [])

    const usersFilter: UserFilterData = {
        search: ''
    };
    const users = useUsers(usersFilter);


    const [toEditPaymentData, setToEditPaymentData] = useState<EditPaymentFormData>(() => {

        const data: EditPaymentFormData = {
            id: 0,
            title: '',
            value: '',
            paid: '',
            company: 0,
            category: 0,
            provider: 0,
            pay_to_user: 0,
            //status: false,
            expire: '',
            observation: '',
            contract: '',
            group: '',
            quote: '',
            recurrence: 0,
            file: [],
        };
        
        return data;
    });

    const [isEditPaymentModalOpen, setIsEditPaymentModalOpen] = useState(false);

    function OpenEditPaymentModal(paymentData : EditPaymentFormData){
        setToEditPaymentData(paymentData);
        setIsEditPaymentModalOpen(true);
    }
    function CloseEditPaymentModal(){
        setIsEditPaymentModalOpen(false);
    }

    const [isConfirmPaymentRemoveModalOpen, setisConfirmPaymentRemoveModalOpen] = useState(false);
    const [removePaymentData, setRemovePaymentData] = useState<RemovePaymentData>(() => {

        const data: RemovePaymentData = {
            title: '',
            id: 0,
        };
        
        return data;
    });

    function OpenConfirmPaymentRemoveModal(paymentData: RemovePaymentData){
        setRemovePaymentData(paymentData);
        setisConfirmPaymentRemoveModalOpen(true);
    }
    function CloseConfirmPaymentRemoveModal(){
        setisConfirmPaymentRemoveModalOpen(false);
    }

    const [isConfirmPartialRemoveModalOpen, setisConfirmPartialRemoveModalOpen] = useState(false);
    const [removePartialData, setRemovePartialData] = useState<RemovePaymentData>(() => {

        const data: RemovePaymentData = {
            title: '',
            id: 0,
        };
        
        return data;
    });

    function OpenConfirmPartialRemoveModal(partialData: RemovePaymentData){
        setRemovePartialData(partialData);
        setisConfirmPartialRemoveModalOpen(true);
    }
    function CloseConfirmPartialRemoveModal(){
        setisConfirmPartialRemoveModalOpen(false);
    }

    const [isPayPaymentModalOpen, setIsPayPaymentModalOpen] = useState(false);
    const [toPayPaymentData, setToPayPaymentData] = useState<PayPaymentFormData>(() => {

        const data: PayPaymentFormData = {
            id: 0,
            value: '',
            new_value: '',
            title: '',
            company: workingCompany.company?.id,
        };
        
        return data;
    });

    function OpenPayPaymentModal(paymentIdAndName: PayPaymentFormData){
        setToPayPaymentData(paymentIdAndName);
        setIsPayPaymentModalOpen(true);
    }
    function ClosePayPaymentModal(){
        setIsPayPaymentModalOpen(false);
    }

    const [isPayAllPaymentsModalOpen, setIsPayAllPaymentsModalOpen] = useState(false);
    const [dayToPayPayments, setDayToPayPayments] = useState<string>(() => {

        const day: string = '';
        
        return day;
    });

    function OpenPayAllPaymentsModal(day: string){
        setDayToPayPayments(day);
        setIsPayAllPaymentsModalOpen(true);
    }
    function ClosePayAllPaymentsModal(){
        setIsPayAllPaymentsModalOpen(false);
    }


    const [isAddFilePaymentModalOpen, setIsAddFilePaymentModalOpen] = useState(false);
    const [addFilePaymentData, setAddFilePaymentData] = useState<AddFilePaymentFormData>(() => {

        const data: AddFilePaymentFormData = {
            id: 0,
            title: '',
        };
        
        return data;
    });

    function OpenAddFilePaymentModal(toAddFilePayment: AddFilePaymentFormData){
        setAddFilePaymentData(toAddFilePayment);
        setIsAddFilePaymentModalOpen(true);
    }
    function CloseAddFilePaymentModal(){
        setIsAddFilePaymentModalOpen(false);
    }



    const [isAddProofPaymentModalOpen, setIsAddProofPaymentModalOpen] = useState(false);
    const [addProofPaymentData, setAddProofPaymentData] = useState<AddFilePaymentFormData>(() => {

        const data: AddFilePaymentFormData = {
            id: 0,
            title: '',
        };
        
        return data;
    });

    function OpenAddProofPaymentModal(toAddProofPayment: AddFilePaymentFormData){
        setAddProofPaymentData(toAddProofPayment);
        setIsAddProofPaymentModalOpen(true);
    }
    function CloseAddProofPaymentModal(){
        setIsAddProofPaymentModalOpen(false);
    }


    const [isAddInvoicePaymentModalOpen, setIsAddInvoicePaymentModalOpen] = useState(false);
    const [addInvoicePaymentData, setAddInvoicePaymentData] = useState<AddInvoicePaymentFormData>(() => {

        const data: AddInvoicePaymentFormData = {
            id: 0,
            title: ''
        };
        
        return data;
    });

    function OpenAddInvoicePaymentModal(toAddInvoicePayment: AddInvoicePaymentFormData){
        setAddInvoicePaymentData(toAddInvoicePayment);
        setIsAddInvoicePaymentModalOpen(true);
    }
    function CloseAddInvoicePaymentModal(){
        setIsAddInvoicePaymentModalOpen(false);
    }


    const [isExportDocumentsModalOpen, setIsExportDocumentsModalOpen] = useState(false);

    function OpenExportDocumentsModal(){
        setIsExportDocumentsModalOpen(true);
    }
    function CloseExportDocumentsModal(){
        setIsExportDocumentsModalOpen(false);
    }


    const toast = useToast();

    const handleRemoveAttachment = async (paymentId : number) => {
        try{
            await api.post(`/payments/remove_file/${paymentId}`);

            toast({
                title: "Sucesso",
                description: `Boleto removido`,
                status: "success",
                duration: 12000,
                isClosable: true,
            });

            payments.refetch();
        }catch(error) {
            showErrors(error, toast);

            if(error.response.data.access){
                history.push('/');
            }
        }
    }

    const handleRemoveProof = async (paymentId : number) => {
        try{
            await api.post(`/payments/remove_proof/${paymentId}`);

            toast({
                title: "Sucesso",
                description: `Comprovante removido`,
                status: "success",
                duration: 12000,
                isClosable: true,
            });

            payments.refetch();
        }catch(error) {
            showErrors(error, toast);

            if(error.response.data.access){
                history.push('/');
            }
        }
    }

    const handleRemoveInvoice = async (paymentId : number) => {
        try{
            await api.post(`/payments/remove_invoice/${paymentId}`);

            toast({
                title: "Sucesso",
                description: `Nota Removida`,
                status: "success",
                duration: 12000,
                isClosable: true,
            });

            payments.refetch();
        }catch(error) {
            showErrors(error, toast);

            if(error.response.data.access){
                history.push('/');
            }
        }
    }

    const handleReversePayment = async (paymentId : number) => {
        try{
            await api.post(`/payments/unpay/${paymentId}`);

            toast({
                title: "Sucesso",
                description: `Pagamento redefindo como não pago.`,
                status: "success",
                duration: 12000,
                isClosable: true,
            });

            payments.refetch();
        }catch(error) {
            showErrors(error, toast);

            if(error.response.data.access){
                history.push('/');
            }
        }
    }

    //console.log(filter);

    const handleSearchPayments = async (search : PaymentFilterData) => {
        search.company = workingCompany.company?.id;

        setPage(1);
        setFilter(search);
    }

    let totalOfSelectedDays = 0;

    if((filter.start_date !== undefined && filter.start_date !== '') && (filter.end_date !== undefined && filter.end_date !== '')){
        (!payments.isLoading && !payments.error) && Object.keys(payments.data?.data).map((day:string) => {
            totalOfSelectedDays = totalOfSelectedDays + payments.data?.data[day].reduce((sumAmount:number, payment:Payment) => {
                return sumAmount + payment.value;
            }, 0);
        })
    }

    return(
        <MainBoard sidebar="financial" header={ 
            ( ( (permissions && HasPermission(permissions, 'Todas Empresas')) || (profile && profile.companies && profile.companies.length > 1)) && <CompanySelect searchFilter={filter} setFilter={handleChangeFilter}/> )
        }
        >
            <NewPaymentModal categories={categories} users={users.data} providers={providers.data} afterCreate={payments.refetch} isOpen={isNewPaymentModalOpen} onRequestClose={CloseNewPaymentModal}/>
            <PayPaymentModal afterPay={payments.refetch} toPayPaymentData={toPayPaymentData} isOpen={isPayPaymentModalOpen} onRequestClose={ClosePayPaymentModal}/>
            <PayAllPaymentsModal afterPay={payments.refetch} dayToPayPayments={dayToPayPayments} isOpen={isPayAllPaymentsModalOpen} onRequestClose={ClosePayAllPaymentsModal}/>
            <EditPaymentModal categories={categories} toEditPaymentData={toEditPaymentData} users={users.data} providers={providers.data} afterEdit={payments.refetch} isOpen={isEditPaymentModalOpen} onRequestClose={CloseEditPaymentModal}/>
            <ConfirmPaymentRemoveModal afterRemove={payments.refetch} toRemovePaymentData={removePaymentData} isOpen={isConfirmPaymentRemoveModalOpen} onRequestClose={CloseConfirmPaymentRemoveModal}/>
            <ConfirmPartialRemoveModal afterRemove={payments.refetch} toRemovePaymentData={removePartialData} isOpen={isConfirmPartialRemoveModalOpen} onRequestClose={CloseConfirmPartialRemoveModal}/>
            <AddFilePaymentModal afterAttach={payments.refetch} toAddFilePaymentData={addFilePaymentData} isOpen={isAddFilePaymentModalOpen} onRequestClose={CloseAddFilePaymentModal}/>
            <AddProofPaymentModal afterAttach={payments.refetch} toAddProofPaymentData={addProofPaymentData} isOpen={isAddProofPaymentModalOpen} onRequestClose={CloseAddProofPaymentModal}/>
            <AddInvoicePaymentModal afterAttach={payments.refetch} toAddInvoiceData={addInvoicePaymentData} isOpen={isAddInvoicePaymentModalOpen} onRequestClose={CloseAddInvoicePaymentModal}/>
            <ExportDocumentsModal isOpen={isExportDocumentsModalOpen} onRequestClose={CloseExportDocumentsModal}/>

            <Flex justify="space-between" alignItems="center" mb="10">
                <SolidButton onClick={OpenNewPaymentModal} color="white" bg="blue.400" icon={PlusIcon} colorScheme="blue">
                    Adicionar Pagamento
                </SolidButton>

                {/* <Link href="/categorias" border="2px" borderRadius="full" borderColor="gray.500" px="6" h="8" alignItems="center">
                    <Text>Categorias</Text>
                </Link> */}

                <OutlineButton onClick={() => {history.push('/pagamentos/categorias')}}>
                    Categorias
                </OutlineButton>

                <OutlineButton onClick={() => {history.push('/pagamentos/notas')}}>
                    Notas
                </OutlineButton>

                <OutlineButton onClick={() => {history.push('/pagamentos/fornecedores')}}>
                    Fornecedores
                </OutlineButton>

                <OutlineButton onClick={OpenExportDocumentsModal} variant="outline" colorScheme="blue" color="blue.400" borderColor="blue.400">
                    Baixar Documentos
                </OutlineButton>
            </Flex>

            <Flex as="form" mb="20" onSubmit={handleSubmit(handleSearchPayments)}>

                <Stack spacing="6" w="100%">
                    <HStack spacing="6">
                        <Input register={register} name="search" type="text" placeholder="Procurar" variant="filled" error={formState.errors.search}/>

                        <Input register={register} name="start_date" type="date" placeholder="Data Inicial" variant="filled" error={formState.errors.start_date}/>
                        <Input register={register} name="end_date" type="date" placeholder="Data Final" variant="filled" error={formState.errors.end_date}/>

                        <Select register={register} h="45px" name="category" w="100%" maxW="200px" error={formState.errors.category} fontSize="sm" focusBorderColor="blue.600" bg="gray.400" variant="filled" _hover={ {bgColor: 'gray.500'} } size="lg" borderRadius="full" placeholder="Categoria">
                            {categories && categories.map((category:PaymentCategory) => {
                                return (
                                    <option key={category.id} value={category.id}>{category.name}</option>
                                )
                            })}
                        </Select>

                    </HStack>

                    <HStack spacing="6">
                        <Input register={register} name="group" type="text" placeholder="Grupo" variant="filled" error={formState.errors.group}/>
                            
                        <Input register={register} name="quote" type="text" placeholder="Cota" variant="filled" error={formState.errors.quote}/>
                        <Input register={register} name="contract" type="text" placeholder="Contrato" variant="filled" error={formState.errors.contract}/>
                            
                        <Select register={register} h="45px" name="pay_to_user" error={formState.errors.pay_to_user} w="100%" maxW="200px" fontSize="sm" focusBorderColor="blue.600" bg="gray.400" variant="filled" _hover={ {bgColor: 'gray.500'} } size="lg" borderRadius="full" placeholder="Pagar para">
                            {users.data && users.data.map((user:User) => {
                                return (
                                    <option key={user.id} value={user.id}>{user.name}</option>
                                )
                            })}
                        </Select>

                        <Select register={register} defaultValue={0} h="45px" name="status" error={formState.errors.status} w="100%" maxW="200px" fontSize="sm" focusBorderColor="blue.600" bg="gray.400" variant="filled" _hover={ {bgColor: 'gray.500'} } size="lg" borderRadius="full">
                            <option value="">Todos</option>
                            <option value={1}>Pagos</option>
                            <option value={0}>Pendentes</option>
                        </Select>

                        <OutlineButton type="submit" mb="10" color="blue.400" borderColor="blue.400" colorScheme="blue">
                            Filtrar
                        </OutlineButton>
                    </HStack>
                </Stack>

            </Flex>

            <Stack fontSize="13px" spacing="12">
                { totalOfSelectedDays > 0 &&
                    (
                        <Flex>
                            <Text fontSize="md" mr="2">{`Do dia ${formatBRDate(filter.start_date !== undefined ? filter.start_date : '')} ao dia ${formatBRDate(filter.end_date !== undefined ? filter.end_date : '')} soma:`}</Text>
                            <Text fontSize="md" fontWeight="semibold">{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(totalOfSelectedDays)} a pagar</Text>
                        </Flex>
                    )
                }

                {   payments.isLoading ? (
                        <Flex justify="center">
                            <Spinner/>
                        </Flex>
                    ) : ( payments.isError ? (
                        <Flex justify="center" mt="4" mb="4">
                            <Text>Erro listar as contas a pagar</Text>
                        </Flex>
                    ) : (payments.data?.data.length === 0) && (
                        <Flex justify="center">
                            <Text>Nenhuma pagamento encontrado.</Text>
                        </Flex>
                    ) ) 
                }

                {
                    (!payments.isLoading && !payments.error) && Object.keys(payments.data?.data).map((day:string) => {
                        const totalDayPayments = payments.data?.data[day].length;
                        const totalDayAmount = payments.data?.data[day].reduce((sumAmount:number, payment:Payment) => {
                            return sumAmount + payment.value;
                        }, 0);

                        const todayFormatedDate = formatDate(formatYmdDate(new Date().toDateString()));
                        const dayPaymentsFormated = formatDate(day);
                        const tomorrow = getDay(formatYmdDate(new Date().toDateString())) + 1;
                        const paymentDay = getDay(day);

                        const hasPaymentsYoPay = payments.data?.data[day].filter((payment:Payment) => Number(payment.status) === 0).length;

                        return (
                            <Accordion key={day} w="100%" border="2px" borderColor="gray.500" borderRadius="26" overflow="hidden" spacing="0" allowMultiple>
                                <HStack spacing="8" justify="space-between" paddingX="8" paddingY="3" bg="gray.200">
                                    <Text fontWeight="bold">{(todayFormatedDate === dayPaymentsFormated) ? 'Hoje' : (tomorrow === paymentDay) ? "Amanhã" : ""} {formatBRDate(day)}</Text>
                                    
                                    <Text fontWeight="bold">{totalDayPayments} Pagamentos</Text>

                                    {
                                        !hasPaymentsYoPay ? (
                                            <Flex fontWeight="bold" alignItems="center" color="green.400">
                                                <CheckIcon stroke="#48bb78" fill="none" width="16px"/>
                                                <Text ml="2">Pago</Text>
                                            </Flex>
                                        ) : (
                                            <SolidButton h="30px" size="sm" fontSize="11" color="white" bg="green.400" colorScheme="green" onClick={() => OpenPayAllPaymentsModal(day)}>
                                                Pagar Tudo
                                            </SolidButton>
                                        )
                                    }
                                    
                                    <Text float="right"><strong>TOTAL: {Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(totalDayAmount)}</strong></Text>
                                </HStack>

                                {
                                    payments.data?.data[day].map((payment:Payment) => {
                                        const paymentToEditData:EditPaymentFormData = {
                                            id: payment.id,
                                            title: payment.title,
                                            value: payment.value.toString().replace('.', ','),
                                            paid: payment.paid.toString().replace('.', ','),
                                            company: payment.company?.id,
                                            category: payment.category?.id,
                                            provider: payment.provider?.id,
                                            pay_to_user: payment.pay_to_user?.id,
                                            //status: payment.status,
                                            expire: payment.expire,
                                            observation: payment.observation,
                                            contract: payment.contract,
                                            group: payment.group,
                                            quote: payment.quote,
                                            recurrence: payment.recurrence,
                                            file: payment.file,
                                        }

                                        return (
                                            <AccordionItem key={payment.id} display="flex" flexDir="column" paddingX="8" paddingTop="3" bg="white" borderTop="2px" borderTopColor="gray.500" borderBottom="0">
                                                {({ isExpanded }) => (
                                                    <>
                                                        <HStack justify="space-between" mb="3">
                                                            <AccordionButton p="0" height="fit-content" w="auto">
                                                                <Flex alignItems="center" justifyContent="center" h="24px" w="30px" p="0" borderRadius="full" border="2px" borderColor="blue.400" variant="outline">
                                                                { 
                                                                        !isExpanded ? <StrongPlusIcon stroke="#2097ed" fill="none" width="12px"/> :
                                                                        <MinusIcon stroke="#2097ed" fill="none" width="12px"/>
                                                                } 
                                                                </Flex>
                                                            </AccordionButton>

                                                            <Flex fontWeight="500" alignItems="center" opacity={payment.status ? 0.5 : 1}>
                                                                <EllipseIcon stroke="none" fill={payment.category?.color}/>
                                                                <Text ml="2" color={payment.category?.color}>{payment.title}</Text>
                                                            </Flex>

                                                            <Flex fontWeight="500" alignItems="center" color="gray.800" opacity={payment.status ? 0.5 : 1}>
                                                                <TagIcon stroke="#4e4b66" fill="none" width="17px"/>
                                                                {/* <Text ml="2">{payment.company.name}</Text> */}
                                                                <Text ml="2">{payment.category?.name}</Text>
                                                            </Flex>

                                                            {
                                                                payment.file ? (
                                                                    <HStack>
                                                                        <Link target="_blank" href={`${process.env.NODE_ENV === 'production' ? process.env.REACT_APP_API_STORAGE : process.env.REACT_APP_API_LOCAL_STORAGE}${payment.file}`} display="flex" fontWeight="medium" alignItems="center" color="gray.900" _hover={{textDecor:"underline", cursor: "pointer"}}>
                                                                            <FileIcon stroke="#4e4b66" fill="none" width="16px"/>
                                                                            <Text ml="2">Ver Boleto</Text>
                                                                        </Link>

                                                                        <IconButton onClick={() => handleRemoveAttachment(payment.id)} h="24px" w="20px" minW="25px" p="0" float="right" aria-label="Excluir categoria" border="none" icon={ <CloseIcon width="20px" stroke="#C30052" fill="none"/>} variant="outline"/>
                                                                    </HStack>
                                                                ) : (
                                                                    <Flex onClick={() => OpenAddFilePaymentModal({id: payment.id, title: payment.title})} fontWeight="medium" alignItems="center" color="gray.900" _hover={{textDecor:"underline", cursor: "pointer"}}>
                                                                        <AttachIcon stroke="#4e4b66" fill="none" width="16px"/>
                                                                        <Text ml="2">Boleto</Text>
                                                                    </Flex>
                                                                )
                                                            
                                                            }

                                                            {
                                                                payment.proof ? (
                                                                    <HStack>
                                                                        <Link target="_blank" href={`${process.env.NODE_ENV === 'production' ? process.env.REACT_APP_API_STORAGE : process.env.REACT_APP_API_LOCAL_STORAGE}${payment.proof}`} display="flex" fontWeight="medium" alignItems="center" color="gray.900" _hover={{textDecor:"underline", cursor: "pointer"}}>
                                                                            <FileIcon stroke="#4e4b66" fill="none" width="16px"/>
                                                                            <Text ml="2">Ver Comprovante</Text>
                                                                        </Link>

                                                                        <IconButton onClick={() => handleRemoveProof(payment.id)} h="24px" w="20px" minW="25px" p="0" float="right" aria-label="Excluir categoria" border="none" icon={ <CloseIcon width="20px" stroke="#C30052" fill="none"/>} variant="outline"/>
                                                                    </HStack>
                                                                ) : (
                                                                    <Flex onClick={() => OpenAddProofPaymentModal({id: payment.id, title: payment.title})} fontWeight="medium" alignItems="center" color="gray.900" _hover={{textDecor:"underline", cursor: "pointer"}}>
                                                                        <AttachIcon stroke="#4e4b66" fill="none" width="16px"/>
                                                                        <Text ml="2">Comprovante</Text>
                                                                    </Flex>
                                                                )
                                                            
                                                            }

                                                            {
                                                                payment.invoice && (
                                                                    <HStack>
                                                                        <Link target="_blank" href={`${process.env.NODE_ENV === 'production' ? process.env.REACT_APP_API_STORAGE : process.env.REACT_APP_API_LOCAL_STORAGE}${payment.invoice}`} display="flex" fontWeight="medium" alignItems="center" color="gray.900" _hover={{textDecor:"underline", cursor: "pointer"}}>
                                                                            <FileIcon stroke="#4e4b66" fill="none" width="16px"/>
                                                                            <Text ml="2">Ver Nota</Text>
                                                                        </Link>

                                                                        <IconButton onClick={() => handleRemoveProof(payment.id)} h="24px" w="20px" minW="25px" p="0" float="right" aria-label="Excluir categoria" border="none" icon={ <CloseIcon width="20px" stroke="#C30052" fill="none"/>} variant="outline"/>
                                                                    </HStack>
                                                                ) 
                                                            }

                                                            {
                                                                    <Flex onClick={() => OpenAddInvoicePaymentModal({id: payment.id, title: payment.title})} fontWeight="medium" alignItems="center" color="gray.900" _hover={{textDecor:"underline", cursor: "pointer"}}>
                                                                        <AttachIcon stroke="#4e4b66" fill="none" width="16px"/>
                                                                        <Text ml="2">Notas</Text>
                                                                    </Flex>
                                                            
                                                            }

                                                            {
                                                                payment.status ? (
                                                                    <HStack>
                                                                        <Flex fontWeight="bold" alignItems="center" color="green.400">
                                                                            <CheckIcon stroke="#48bb78" fill="none" width="16px"/>
                                                                            <Text ml="2">Pago</Text>
                                                                        </Flex>

                                                                        <IconButton onClick={() => handleReversePayment(payment.id)} h="24px" w="20px" minW="25px" p="0" float="right" aria-label="Excluir categoria" border="none" icon={ <RefreshIcon width="20px" stroke="#14142b" fill="none"/>} variant="outline"/>
                                                                    </HStack>
                                                                ) : (
                                                                    <OutlineButton isDisabled={payment.status}  onClick={() => OpenPayPaymentModal({ id: payment.id, title: payment.title , value: payment.value.toString(), new_value: ''}) }
                                                                        h="30px" size="sm" color="green.400" borderColor="green.400" colorScheme="green" fontSize="11">
                                                                        Pagar
                                                                    </OutlineButton>
                                                                )
                                                            }

                                                            <Text opacity={payment.status ? 0.5 : 1} float="right">{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(payment.status ? (payment.paid > 0 ? payment.paid : payment.value) : payment.value - payment.paid)}</Text>
                                                        </HStack>

                                                        <AccordionPanel flexDir="column" borderTop="2px" borderColor="gray.500" px="0" py="5">
                                                            <HStack justifyContent="space-between" mb="4">
                                                                    <Text>
                                                                        Valor total: 
                                                                        <strong> {Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(payment.value)}</strong>
                                                                    </Text>
                                                                    
                                                                    <Text>
                                                                        <strong>Pagar para: </strong>
                                                                        {payment.pay_to_user?.name && `${payment.pay_to_user.name} ${payment.pay_to_user.last_name}`}
                                                                    </Text>

                                                                    <Text>
                                                                        <strong>Contrato: </strong>
                                                                        {payment.contract && payment.contract}
                                                                    </Text>

                                                                    <Text>
                                                                        <strong>Grupo: </strong>
                                                                        {payment.group && payment.group}
                                                                    </Text>

                                                                    <Text>
                                                                        <strong>Cota: </strong>
                                                                        {payment.quote && payment.quote}
                                                                    </Text>
                                                            </HStack>

                                                            <HStack mb="3">
                                                                <Flex alignItems="center">
                                                                    <Text fontWeight="500" mr="2">Observação: </Text>
                                                                    <Text> {payment.observation && payment.observation}</Text>
                                                                </Flex>
                                                            </HStack>

                                                            <Divider mb="3"/>

                                                            <HStack justifyContent="space-between" alignItems="center">
                                                                <Table size="sm" variant="simple">
                                                                    <Thead>
                                                                        <Tr>
                                                                            <Th color="gray.900">Valores pagos: </Th>
                                                                            <Th color="gray.900">{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(payment.paid)}</Th>
                                                                            <Th></Th>
                                                                        </Tr>
                                                                    </Thead>
                                                                    <Tbody>
                                                                        
                                                                        {
                                                                            payment.partial_payments && payment.partial_payments.map((partial: PartialPayment) => {
                                                                                return (
                                                                                    <Tr>
                                                                                        <Td fontSize="12px">{partial.pay_date && formatBRDate(partial.pay_date.toString())}</Td>
                                                                                        <Td color="gray.800" fontWeight="semibold" fontSize="12px">{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(partial.value)}</Td>
                                                                                        <Td><IconButton onClick={() => OpenConfirmPartialRemoveModal({id: partial.id, title: partial.value.toString()})} h="24px" w="23px" p="0" float="right" aria-label="Excluir pagamento parcial" border="none" icon={ <CloseIcon width="20px" stroke="#C30052" fill="none"/>} variant="outline"/></Td>
                                                                                    </Tr>
                                                                                )
                                                                            })
                                                                        }
                                                                    </Tbody>

                                                                    {/* <HStack>
                                                                        <Text>Valores pagos: </Text>
                                                                        <strong> {Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(payment.paid)}</strong>
                                                                    </HStack>

                                                                    {
                                                                        payment.partial_payments && payment.partial_payments.map((partial: PartialPayment) => {
                                                                            return (
                                                                                <HStack>
                                                                                    <Text>{partial.pay_date && formatBRDate(partial.pay_date.toString())}</Text>
                                                                                    <Text color="gray.800" fontWeight="semibold"> {Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(partial.value)}</Text>
                                                                                </HStack>
                                                                            )
                                                                        })
                                                                    } */}
                                                                </Table>
                                                                

                                                                <HStack spacing="5" alignItems="center">
                                                                    <EditButton onClick={() => OpenEditPaymentModal(paymentToEditData)}/>
                                                                    <RemoveButton onClick={() => OpenConfirmPaymentRemoveModal({ id: payment.id, title: payment.title }) }/>
                                                                </HStack>
                                                            </HStack>

                                                        </AccordionPanel>
                                                    </>
                                                )}
                                            </AccordionItem>
                                        )
                                    })
                                }

                                
                            </Accordion>
                        )
                    })
                }

                <Pagination totalCountOfRegister={payments.data ? payments.data.total : 0} registerPerPage={10} currentPage={page} onPageChange={setPage}/>
            </Stack>
            
        </MainBoard>
    );
}