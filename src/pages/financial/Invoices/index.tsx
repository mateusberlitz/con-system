import { FormControl, Link, Flex, HStack, Stack, Spinner, IconButton, Text, Accordion, Select as ChakraSelect, AccordionItem, AccordionButton, AccordionPanel, useToast, Divider, Table, Thead, Th, Td, Tbody, Tr } from "@chakra-ui/react";
import { SolidButton } from "../../../components/Buttons/SolidButton";
import { MainBoard } from "../../../components/MainBoard";
import { useCompanies } from "../../../hooks/useCompanies";
import { HasPermission, useProfile } from "../../../hooks/useProfile";
import { Company, Invoice, PartialPayment, Payment, PaymentCategory, User } from "../../../types";

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
import { CompanySelect } from "../../../components/CompanySelect";
import { useProviders } from "../../../hooks/useProviders";
import { useWorkingCompany } from "../../../hooks/useWorkingCompany";
import { formatDate } from "../../../utils/Date/formatDate";
import { formatYmdDate } from "../../../utils/Date/formatYmdDate";
import { formatBRDate } from "../../../utils/Date/formatBRDate";
import { getDay } from "../../../utils/Date/getDay";
import { Select } from "../../../components/Forms/Selects/Select";
import { Pagination } from "../../../components/Pagination";
import { ReactComponent as BackArrow } from '../../../assets/icons/Back Arrow.svg';
import { api } from "../../../services/api";
import { UserFilterData, useUsers } from "../../../hooks/useUsers";
import { InvoicesFilterData, useInvoices } from "../../../hooks/useInvoices";
import { CompanySelectMaster } from "../../../components/CompanySelect/companySelectMaster";
import { useWorkingBranch } from "../../../hooks/useWorkingBranch";

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

export default function Invoices(){
    const workingCompany = useWorkingCompany();
    const workingBranch = useWorkingBranch();


    const [filter, setFilter] = useState<InvoicesFilterData>(() => {
        const data: InvoicesFilterData = {
            search: '',
            company: workingCompany.company?.id,
            branch: workingBranch.branch?.id
        };
        
        return data;
    })

    function handleChangeFilter(newFilter: InvoicesFilterData){
        setFilter(newFilter);
    }

    const [page, setPage] = useState(1);

    const invoices = useInvoices(filter, page);

    const {permissions, profile} = useProfile();
    const companies = useCompanies();
    const providers = useProviders();

    const { register, handleSubmit, formState} = useForm<InvoicesFilterData>({
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

    const toast = useToast();

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

    const handleSearchPayments = async (search : InvoicesFilterData) => {
        setPage(1);
        setFilter({...filter, ...search});
    }

    let totalOfSelectedDays = 0;

    useEffect(() => {
        setFilter({...filter, company: workingCompany.company?.id, branch: workingBranch.branch?.id});
    }, [workingCompany]);

    return(
        <MainBoard sidebar="financial" header={<CompanySelectMaster/>}
        >

            <Flex as="form" mb="20" onSubmit={handleSubmit(handleSearchPayments)}>

                <HStack spacing="6" w="100%">
                    <Input register={register} name="search" type="text" placeholder="Procurar" variant="filled" error={formState.errors.search}/>

                    <Input register={register} name="start_date" type="date" placeholder="Data Inicial" variant="filled" error={formState.errors.start_date}/>
                    <Input register={register} name="end_date" type="date" placeholder="Data Final" variant="filled" error={formState.errors.end_date}/>

                    <OutlineButton type="submit" color="blue.400" borderColor="blue.400" colorScheme="blue">
                        Filtrar
                    </OutlineButton>
                </HStack>

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

                {   invoices.isLoading ? (
                        <Flex justify="center">
                            <Spinner/>
                        </Flex>
                    ) : ( invoices.isError ? (
                        <Flex justify="center" mt="4" mb="4">
                            <Text>Erro listar as contas a pagar</Text>
                        </Flex>
                    ) : (invoices.data?.data.length === 0) && (
                        <Flex justify="center">
                            <Text>Nenhuma pagamento encontrado.</Text>
                        </Flex>
                    ) ) 
                }

                {
                    (!invoices.isLoading && !invoices.error) && Object.keys(invoices.data?.data).map((day:string) => {
                        const totalDayPayments = invoices.data?.data[day].length;
                        const totalDayAmount = invoices.data?.data[day].reduce((sumAmount:number, invoice:Invoice) => {
                            return sumAmount + invoice.payment.value;
                        }, 0);

                        const todayFormatedDate = formatDate(formatYmdDate(new Date().toDateString()));
                        const dayPaymentsFormated = formatDate(day);
                        const tomorrow = getDay(formatYmdDate(new Date().toDateString())) + 1;
                        const paymentDay = getDay(day);

                        const hasPaymentsYoPay = invoices.data?.data[day].filter((invoices:Invoice) => Number(invoices.payment.status) === 0).length;

                        return (
                            <Accordion key={day} w="100%" border="2px" borderColor="gray.500" borderRadius="26" overflow="hidden" spacing="0" allowMultiple>
                                <HStack spacing="8" justify="space-between" paddingX="8" paddingY="3" bg="gray.200">
                                    <Text fontWeight="bold">{(todayFormatedDate === dayPaymentsFormated) ? 'Hoje' : (tomorrow === paymentDay) ? "Amanhã" : ""} {day ? formatBRDate(day) : "Sem data"}</Text>
                                    
                                    <Text fontWeight="bold">{totalDayPayments} Notas</Text>
                                    
                                    <Text float="right"><strong>TOTAL: {Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(totalDayAmount)}</strong></Text>
                                </HStack>

                                {
                                    invoices.data?.data[day].map((invoice:Invoice) => {
                                        return (
                                            <AccordionItem key={invoice.id} display="flex" flexDir="column" paddingX="8" paddingTop="3" bg="white" borderTop="2px" borderTopColor="gray.500" borderBottom="0">
                                                {({ isExpanded }) => (
                                                    <>
                                                        <HStack justify="space-between" mb="3">
                                                            <Flex fontWeight="500" alignItems="center" opacity={invoice.payment.status ? 0.5 : 1}>
                                                                <EllipseIcon stroke="none" fill={invoice.payment.category?.color}/>
                                                                <Text ml="2" color={invoice.payment.category?.color}>{invoice.payment.title}</Text>
                                                            </Flex>

                                                            <Flex fontWeight="500" alignItems="center" color="gray.800" opacity={invoice.payment.status ? 0.5 : 1}>
                                                                <TagIcon stroke="#4e4b66" fill="none" width="17px"/>
                                                                {/* <Text ml="2">{payment.company.name}</Text> */}
                                                                <Text ml="2">{invoice.payment.category?.name}</Text>
                                                            </Flex>

                                                            
                                                            <Stack>
                                                                <HStack>
                                                                    <Link target="_blank" href={`${process.env.NODE_ENV === 'production' ? process.env.REACT_APP_API_STORAGE : process.env.REACT_APP_API_LOCAL_STORAGE}${invoice.file}`} display="flex" fontWeight="medium" alignItems="center" color="gray.900" _hover={{textDecor:"underline", cursor: "pointer"}}>
                                                                        <FileIcon stroke="#4e4b66" fill="none" width="16px"/>
                                                                        <Text ml="2">Ver Nota 1</Text>
                                                                    </Link>

                                                                    {/* <IconButton onClick={() => handleRemoveInvoice(payment.id)} h="24px" w="20px" minW="25px" p="0" float="right" aria-label="Excluir categoria" border="none" icon={ <CloseIcon width="20px" stroke="#C30052" fill="none"/>} variant="outline"/> */}
                                                                </HStack>

                                                                <Text fontWeight="bold" fontSize="10px" color="gray.800">{(invoice.date && formatBRDate(invoice.date))}</Text>
                                                            </Stack>

                                                            <Text opacity={invoice.payment.status ? 0.5 : 1} float="right">{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(invoice.payment.status ? (invoice.payment.paid > 0 ? invoice.payment.paid : invoice.payment.value) : invoice.payment.value - invoice.payment.paid)}</Text>
                                                        </HStack>
                                                        
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

                <Pagination totalCountOfRegister={invoices.data ? invoices.data.total : 0} registerPerPage={10} currentPage={page} onPageChange={setPage}/>
            </Stack>
            
        </MainBoard>
    );
}