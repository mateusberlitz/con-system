import { FormControl, Flex, HStack, Stack, Spinner, Text, IconButton, Select as ChakraSelect} from "@chakra-ui/react";
import { SolidButton } from "../../../components/Buttons/SolidButton";
import { MainBoard } from "../../../components/MainBoard";
import { useCompanies } from "../../../hooks/useCompanies";
import { HasPermission, useProfile } from "../../../hooks/useProfile";
import { BillCategory, CashDeskInterface, CashFlowCategory, CashFlowInterface, Company } from "../../../types";

import { useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { ReactComponent as PlusIcon } from '../../../assets/icons/Plus.svg';
import { ReactComponent as CloseIcon } from '../../../assets/icons/Close.svg';
import { ReactComponent as TagIcon } from '../../../assets/icons/Tag.svg';

import { Input } from "../../../components/Forms/Inputs/Input";
import { OutlineButton } from "../../../components/Buttons/OutlineButton";
import { EditButton } from "../../../components/Buttons/EditButton";
import { CompanySelect } from "../../../components/CompanySelect";
import { useEffect, useState } from "react";
import { api } from "../../../services/api";
import { useWorkingCompany } from "../../../hooks/useWorkingCompany";
import { formatDate } from "../../../utils/Date/formatDate";
import { formatYmdDate } from "../../../utils/Date/formatYmdDate";
import { formatBRDate } from "../../../utils/Date/formatBRDate";
import { getDay } from "../../../utils/Date/getDay";
import { useCashDesks, CashDesksFilterData } from "../../../hooks/useCashDesks";
import { getHour } from "../../../utils/Date/getHour";
import { NewCashDesksModal } from "./NewCashDesksModal";
import { EditCashDeskFormData, EditCashDeskModal } from "./EditCashDeskModal";
import { ConfirmCashDeskRemoveModal } from "./ConfirmCashDeskRemoveModal";
import { Select } from "../../../components/Forms/Selects/Select";
import { Pagination } from "../../../components/Pagination";
import { useHistory } from "react-router-dom";

interface RemoveCashFlowData{
    id: number;
    title: string;
}

const FilterCashDeskFormSchema = yup.object().shape({
    search: yup.string(),
    start_date: yup.string(),
    end_date: yup.string(),
    category: yup.string(),
});

export default function CashDesks(){
    const workingCompany = useWorkingCompany();
    const history = useHistory();

    const [filter, setFilter] = useState<CashDesksFilterData>(() => {
        const data: CashDesksFilterData = {
            search: '',
            company: workingCompany.company?.id,
        };
        
        return data;
    })

    const [page, setPage] = useState(1);

    const cashDesks = useCashDesks(filter, 50, page);
    let viewCashAmount = (!cashDesks.isLoading && !cashDesks.error && cashDesks.data?.initialCash) ? cashDesks.data.initialCash : 0;

    const {profile, permissions} = useProfile();
    const companies = useCompanies();

    const { register, handleSubmit, formState} = useForm<CashDesksFilterData>({
        resolver: yupResolver(FilterCashDeskFormSchema),
    });

    function handleChangeCompany(event:any){
        const selectedCompanyId = (event?.target.value ? event?.target.value : 1);
        const selectedCompanyData = companies.data.filter((company:Company) => company.id === selectedCompanyId)[0]
        workingCompany.changeCompany(selectedCompanyData);

        const updatedFilter = filter;
        updatedFilter.company = selectedCompanyId;

        setFilter(updatedFilter);
    }

    function handleChangeFilter(newFilter: CashDesksFilterData){
        setFilter(newFilter);
    }

    // useEffect(() => {
    //     console.log(filter);
    //     cashDesks.refetch();
    // }, [filter])

    const [isNewCashDeskModalOpen, setIsNewCashDeskModalOpen] = useState(false);

    function OpenNewCashDeskModal(){
        setIsNewCashDeskModalOpen(true);
    }
    function CloseNewCashDeskModal(){
        setIsNewCashDeskModalOpen(false);
    }

    const [toEditCashDeskData, setToEditCashDeskData] = useState<EditCashDeskFormData>(() => {

        const data: EditCashDeskFormData = {
            id: 0,
            title: '',
            value: '',
            company: 0,
            category: 0,
            date: '',
        };
        
        return data;
    });

    const [isEditCashDeskModalOpen, setIsEditCashDeskModalOpen] = useState(false);

    function OpenEditCashDeskModal(cashFlow : EditCashDeskFormData){
        setToEditCashDeskData(cashFlow);
        setIsEditCashDeskModalOpen(true);
    }
    function CloseEditCashDeskModal(){
        setIsEditCashDeskModalOpen(false);
    }

    const [isConfirmCashDeskRemoveModalOpen, setisConfirmCashDeskRemoveModalOpen] = useState(false);
    const [removeCashFlowData, setRemoveCashFlowData] = useState<RemoveCashFlowData>(() => {

        const data: RemoveCashFlowData = {
            title: '',
            id: 0,
        };
        
        return data;
    });

    function OpenConfirmCashDeskRemoveModal(paymentData: RemoveCashFlowData){
        setRemoveCashFlowData(paymentData);
        setisConfirmCashDeskRemoveModalOpen(true);
    }
    function CloseConfirmCashDeskRemoveModal(){
        setisConfirmCashDeskRemoveModalOpen(false);
    }

    const [categories, setCategories] = useState<BillCategory[]>([]);

    const loadCategories = async () => {
        const { data } = await api.get('/cashdesk_categories');

        setCategories(data);
    }

    useEffect(() => {
        loadCategories();
    }, [])

    const handleSearchCashFlow = async (search : CashDesksFilterData) => {
        search.company = workingCompany.company?.id;
        
        setFilter(search);
    }

    return(
        <MainBoard sidebar="financial" header={ 
            ( ( (permissions && HasPermission(permissions, 'Todas Empresas')) || (profile && profile.companies && profile.companies.length > 1)) && <CompanySelect searchFilter={filter} setFilter={handleChangeFilter}/> )
        }
        >
            <NewCashDesksModal categories={categories} afterCreate={cashDesks.refetch} isOpen={isNewCashDeskModalOpen} onRequestClose={CloseNewCashDeskModal}/>
            <EditCashDeskModal categories={categories} toEditCashDeskData={toEditCashDeskData} afterEdit={cashDesks.refetch} isOpen={isEditCashDeskModalOpen} onRequestClose={CloseEditCashDeskModal}/>
            <ConfirmCashDeskRemoveModal afterRemove={cashDesks.refetch} toRemoveCashDeskData={removeCashFlowData} isOpen={isConfirmCashDeskRemoveModalOpen} onRequestClose={CloseConfirmCashDeskRemoveModal}/>

            <Flex justify="space-between" alignItems="center" mb="10">
                <SolidButton onClick={OpenNewCashDeskModal} color="white" bg="blue.400" icon={PlusIcon} colorScheme="blue">
                    Adicionar Movimentação
                </SolidButton>

                <OutlineButton onClick={() => {history.push('/caixa/categorias')}}>
                    Categorias
                </OutlineButton>

                {/* <OutlineButton onClick={OpenExportReportModal} variant="outline" colorScheme="blue" color="blue.400" borderColor="blue.400">
                    Gerar Relatório
                </OutlineButton> */}

                {/* <Link href="/categorias" border="2px" borderRadius="full" borderColor="gray.500" px="6" h="8" alignItems="center">
                    <Text>Categorias</Text>
                </Link> */}
            </Flex>

            <Flex as="form" mb="20" onSubmit={handleSubmit(handleSearchCashFlow)}>

                <Stack spacing="6" w="100%">
                    <Input register={register} name="search" type="text" placeholder="Procurar" variant="filled" error={formState.errors.search}/>

                    <HStack spacing="6">
                        <Input register={register} name="start_date" type="date" placeholder="Data inicial" variant="filled" error={formState.errors.start_date}/>
                        <Input register={register} name="end_date" type="date" placeholder="Data Final" variant="filled" error={formState.errors.end_date}/>

                        <Select register={register} h="45px" name="category" w="100%" maxW="200px" fontSize="sm" focusBorderColor="blue.600" bg="gray.400" variant="filled" _hover={ {bgColor: 'gray.500'} } size="lg" borderRadius="full" placeholder="Categoria" error={formState.errors.category}>
                            {categories && categories.map((category:CashFlowCategory) => {
                                return (
                                    <option key={category.id} value={category.id}>{category.name}</option>
                                )
                            })}
                        </Select>

                        <OutlineButton type="submit" mb="10" color="blue.400" borderColor="blue.400" colorScheme="blue">
                            Filtrar
                        </OutlineButton>

                    </HStack>
                </Stack>

            </Flex>

            <Stack fontSize="13px" spacing="12">
                {   cashDesks.isLoading ? (
                        <Flex justify="center">
                            <Spinner/>
                        </Flex>
                    ) : ( cashDesks.isError ? (
                        <Flex justify="center" mt="4" mb="4">
                            <Text>Erro listar as movimentações</Text>
                        </Flex>
                    ) : (cashDesks.data?.data.length === 0) && (
                        <Flex justify="center">
                            <Text>Nenhuma movimentação encontrada.</Text>
                        </Flex>
                    ) ) 
                }

                {
                    (!cashDesks.isLoading && !cashDesks.error) && Object.keys(cashDesks.data?.data).map((day:string) => {
                        //const totalDayCashDesks = cashDesks.data[day].length;
                        // viewCashAmount = viewCashAmount + cashDesks.data?.data[day].reduce((sumAmount:number, cashFlow:CashFlowInterface) => {
                        //     return sumAmount + cashFlow.value;
                        // }, 0);

                        const todayFormatedDate = formatDate(formatYmdDate(new Date().toDateString()));
                        const dayCashDesksFormated = formatDate(day);
                        const tomorrow = getDay(formatYmdDate(new Date().toDateString())) + 1;
                        const cashFlowDay = getDay(day);

                        viewCashAmount = cashDesks.data?.data[day]['balance'];

                        // const indexBalance = cashDesks.data?.data[day].indexOf('balance');
                        // if (indexBalance > -1) {
                        //     cashDesks.data?.data[day].splice(indexBalance, 1);
                        // }

                        return (
                            <Stack key={day} w="100%" border="2px" borderColor="gray.500" borderRadius="26" overflow="hidden" spacing="0">
                                <HStack spacing="8" w="100%" justify="space-between" paddingX="8" paddingY="3" bg="gray.200">
                                    <Text fontWeight="bold">{(todayFormatedDate === dayCashDesksFormated) ? 'Hoje' : (tomorrow === cashFlowDay) ? "Amanhã" : ""} {formatBRDate(day)}</Text>

                                    <Flex alignItems="center" float="right" color={viewCashAmount > 0 ? 'green.400' : 'red.400'}>
                                        {/* {totalDayAmount > 0 
                                            ? <StrongPlusIcon stroke="#48bb78" fill="none" width="12px"/> 
                                            : <MinusIcon stroke="#c30052" fill="none" width="12px"/>
                                        } */}
                                        <Text fontWeight="bold" ml="2">
                                            {Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(viewCashAmount)}
                                        </Text>
                                    </Flex>
                                </HStack>

                                {
                                    cashDesks.data?.data[day]['items'].map((cashFlow:CashDeskInterface) => {
                                        const cashFlowToEditData:EditCashDeskFormData = {
                                            id: cashFlow.id,
                                            title: cashFlow.title,
                                            value: cashFlow.value.toString().replace('.', ','),
                                            company: cashFlow.company?.id,
                                            category: cashFlow.category?.id,
                                            date: cashFlow.date,
                                        }

                                        return (
                                            <HStack key={`${cashFlow.id}-${cashFlow.title}`} justifyContent="space-between" borderTop="2px" borderColor="gray.500" px="8" py="4">
                                                <Flex>
                                                    <Text mr="6" fontSize="sm" color="gray.800">{cashFlow.created_at && getHour(cashFlow.created_at)}</Text>
                                                    <Text color="gray.800">{cashFlow.title}</Text>
                                                </Flex>

                                                {/* <HStack>
                                                    {
                                                        (cashFlow.payment && cashFlow.payment.category) ? <TagIcon stroke="#4e4b66" fill="none" width="17px"/> : (
                                                            (cashFlow.bill && cashFlow.bill.category)? <TagIcon stroke="#4e4b66" fill="none" width="17px"/> : ""
                                                        )
                                                    }
                                                    <Text fontWeight="" color="gray.800">
                                                        {
                                                            (cashFlow.payment && cashFlow.payment.category) ? cashFlow.payment.category.name : (
                                                                (cashFlow.bill && cashFlow.bill.category)? cashFlow.bill.category.name : ""
                                                            )
                                                        }
                                                    </Text>
                                                </HStack> */}

                                                <Flex>
                                                    <Text fontWeight="bold" color="gray.800">{cashFlow.category.name}</Text>
                                                </Flex>

                                                <Flex>
                                                    <HStack fontWeight="bold" spacing="7">
                                                        <Flex alignItems="center" color={cashFlow.value > 0 ? 'green.400' : 'red.400'}>
                                                            {/* {cashFlow.value > 0 
                                                                ? <StrongPlusIcon stroke="#48bb78" fill="none" width="12px"/> 
                                                                : <MinusIcon stroke="#c30052" fill="none" width="12px"/>
                                                            } */}
                                                            <Text fontWeight="bold" ml="2">
                                                                {Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(cashFlow.value)}
                                                            </Text>
                                                        </Flex>

                                                        <EditButton onClick={() => OpenEditCashDeskModal(cashFlowToEditData)}/>

                                                        <IconButton onClick={() => OpenConfirmCashDeskRemoveModal({ id: cashFlow.id, title: cashFlow.title })} h="24px" w="23px" p="0" float="right" aria-label="Excluir categoria" border="none" icon={ <CloseIcon width="20px" stroke="#C30052" fill="none"/>} variant="outline"/>
                                                    </HStack>
                                                </Flex>
                                            </HStack>
                                        )
                                    })
                                }

                                
                            </Stack>
                        )
                    })
                }

                <Pagination totalCountOfRegister={cashDesks.data ? cashDesks.data.total : 0} registerPerPage={50} currentPage={page} onPageChange={setPage}/>
            </Stack>
            
        </MainBoard>
    );
}