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
import { CompanySelect } from "../../../components/CompanySelect";
import { useProviders } from "../../../hooks/useProviders";
import { useWorkingCompany } from "../../../hooks/useWorkingCompany";
import { PaymentFilterData, usePayments } from "../../../hooks/usePayments";
import { formatDate } from "../../../utils/Date/formatDate";
import { formatYmdDate } from "../../../utils/Date/formatYmdDate";
import { formatBRDate } from "../../../utils/Date/formatBRDate";
import { getDay } from "../../../utils/Date/getDay";
import { Select } from "../../../components/Forms/Selects/Select";
import { Pagination } from "../../../components/Pagination";
import { ReactComponent as BackArrow } from '../../../assets/icons/Back Arrow.svg';
import { api } from "../../../services/api";
import { UserFilterData, useUsers } from "../../../hooks/useUsers";


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

    const [filter, setFilter] = useState<PaymentFilterData>(() => {
        const data: PaymentFilterData = {
            search: '',
            company: workingCompany.company?.id,
            status: 0,
            group_by: 'invoice_date',
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

    const handleSearchPayments = async (search : PaymentFilterData) => {
        search.company = workingCompany.company?.id;

        setPage(1);
        setFilter(search);
    }

    let totalOfSelectedDays = 0;

    return(
        <MainBoard sidebar="financial" header={
            <HStack>
                <Link href="/pagamentos"><BackArrow width="20px" stroke="#4e4b66" fill="none"/></Link> 
                {( ( (permissions && HasPermission(permissions, 'Todas Empresas')) || (profile && profile.companies && profile.companies.length > 1)) && <CompanySelect searchFilter={filter} setFilter={handleChangeFilter}/> )}
            </HStack>
        }
        >

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
                                    <Text fontWeight="bold">{(todayFormatedDate === dayPaymentsFormated) ? 'Hoje' : (tomorrow === paymentDay) ? "Amanhã" : ""} {day ? formatBRDate(day) : "Sem data"}</Text>
                                    
                                    <Text fontWeight="bold">{totalDayPayments} Pagamentos por Nota</Text>
                                    
                                    <Text float="right"><strong>TOTAL: {Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(totalDayAmount)}</strong></Text>
                                </HStack>

                                {
                                    payments.data?.data[day].map((payment:Payment) => {

                                        return (
                                            <AccordionItem key={payment.id} display="flex" flexDir="column" paddingX="8" paddingTop="3" bg="white" borderTop="2px" borderTopColor="gray.500" borderBottom="0">
                                                {({ isExpanded }) => (
                                                    <>
                                                        <HStack justify="space-between" mb="3">
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
                                                                payment.invoice && (
                                                                    <Stack>
                                                                        <HStack>
                                                                            <Link target="_blank" href={`${process.env.NODE_ENV === 'production' ? process.env.REACT_APP_API_STORAGE : process.env.REACT_APP_API_LOCAL_STORAGE}${payment.invoice}`} display="flex" fontWeight="medium" alignItems="center" color="gray.900" _hover={{textDecor:"underline", cursor: "pointer"}}>
                                                                                <FileIcon stroke="#4e4b66" fill="none" width="16px"/>
                                                                                <Text ml="2">Ver Nota</Text>
                                                                            </Link>

                                                                            {/* <IconButton onClick={() => handleRemoveInvoice(payment.id)} h="24px" w="20px" minW="25px" p="0" float="right" aria-label="Excluir categoria" border="none" icon={ <CloseIcon width="20px" stroke="#C30052" fill="none"/>} variant="outline"/> */}
                                                                        </HStack>

                                                                        <Text fontWeight="bold" fontSize="10px" color="gray.800">{payment.invoice_date && formatBRDate(payment.invoice_date)}</Text>
                                                                    </Stack>
                                                                )
                                                            }

                                                            <Text opacity={payment.status ? 0.5 : 1} float="right">{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(payment.status ? (payment.paid > 0 ? payment.paid : payment.value) : payment.value - payment.paid)}</Text>
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

                <Pagination totalCountOfRegister={payments.data ? payments.data.total : 0} registerPerPage={10} currentPage={page} onPageChange={setPage}/>
            </Stack>
            
        </MainBoard>
    );
}