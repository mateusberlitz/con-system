import { FormControl, Flex, HStack, Stack, Spinner, Text, IconButton, Select as ChakraSelect} from "@chakra-ui/react";
import { SolidButton } from "../../../components/Buttons/SolidButton";
import { MainBoard } from "../../../components/MainBoard";
import { useCompanies } from "../../../hooks/useCompanies";
import { useProfile } from "../../../hooks/useProfile";
import { BillCategory, CashFlowCategory, CashFlowInterface, Company } from "../../../types";

import { useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { ReactComponent as PlusIcon } from '../../../assets/icons/Plus.svg';
import { ReactComponent as CloseIcon } from '../../../assets/icons/Close.svg';

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
import { useCashFlows, CashFlowsFilterData } from "../../../hooks/useCashFlows";
import { getHour } from "../../../utils/Date/getHour";
import { NewCashFlowModal } from "./NewCashFlowModal";
import { EditCashFlowFormData, EditCashFlowModal } from "./EditCashFlowModal";
import { ConfirmCashFlowRemoveModal } from "./ConfirmCashFlowRemoveModal";
import { Select } from "../../../components/Forms/Selects/Select";
import { Pagination } from "../../../components/Pagination";

interface RemoveCashFlowData{
    id: number;
    title: string;
}

const FilterCashFlowFormSchema = yup.object().shape({
    search: yup.string(),
    start_date: yup.string(),
    end_date: yup.string(),
    category: yup.string(),
});

export default function CashFlow(){
    const workingCompany = useWorkingCompany();

    const [filter, setFilter] = useState<CashFlowsFilterData>(() => {
        const data: CashFlowsFilterData = {
            search: '',
            company: workingCompany.company?.id,
        };
        
        return data;
    })

    const [page, setPage] = useState(1);

    const cashFlows = useCashFlows(filter, 50, page);

    const {profile} = useProfile();
    const companies = useCompanies();

    const { register, handleSubmit, formState} = useForm<CashFlowsFilterData>({
        resolver: yupResolver(FilterCashFlowFormSchema),
    });

    function handleChangeCompany(event:any){
        const selectedCompanyId = (event?.target.value ? event?.target.value : 1);
        const selectedCompanyData = companies.data.filter((company:Company) => company.id === selectedCompanyId)[0]
        workingCompany.changeCompany(selectedCompanyData);

        const updatedFilter = filter;
        updatedFilter.company = selectedCompanyId;

        setFilter(updatedFilter);
    }

    function handleChangeFilter(newFilter: CashFlowsFilterData){
        setFilter(newFilter);
    }

    // useEffect(() => {
    //     console.log(filter);
    //     cashFlows.refetch();
    // }, [filter])

    const [isNewCashFlowModalOpen, setIsNewCashFlowModalOpen] = useState(false);

    function OpenNewCashFlowModal(){
        setIsNewCashFlowModalOpen(true);
    }
    function CloseNewCashFlowModal(){
        setIsNewCashFlowModalOpen(false);
    }

    const [toEditCashFlowData, setToEditCashFlowData] = useState<EditCashFlowFormData>(() => {

        const data: EditCashFlowFormData = {
            id: 0,
            title: '',
            value: '',
            company: 0,
            category: 0,
        };
        
        return data;
    });

    const [isEditCashFlowModalOpen, setIsEditCashFlowModalOpen] = useState(false);

    function OpenEditCashFlowModal(cashFlow : EditCashFlowFormData){
        setToEditCashFlowData(cashFlow);
        setIsEditCashFlowModalOpen(true);
    }
    function CloseEditCashFlowModal(){
        setIsEditCashFlowModalOpen(false);
    }

    const [isConfirmCashFlowRemoveModalOpen, setisConfirmCashFlowRemoveModalOpen] = useState(false);
    const [removeCashFlowData, setRemoveCashFlowData] = useState<RemoveCashFlowData>(() => {

        const data: RemoveCashFlowData = {
            title: '',
            id: 0,
        };
        
        return data;
    });

    function OpenConfirmCashFlowRemoveModal(paymentData: RemoveCashFlowData){
        setRemoveCashFlowData(paymentData);
        setisConfirmCashFlowRemoveModalOpen(true);
    }
    function CloseConfirmCashFlowRemoveModal(){
        setisConfirmCashFlowRemoveModalOpen(false);
    }


    const [categories, setCategories] = useState<BillCategory[]>([]);

    const loadCategories = async () => {
        const { data } = await api.get('/cashflow_categories');

        setCategories(data);
    }

    useEffect(() => {
        loadCategories();
        
    }, [])

    const handleSearchCashFlow = async (search : CashFlowsFilterData) => {
        setFilter(search);
    }

    return(
        <MainBoard sidebar="financial" header={ 
            ( ( profile && profile.role.id === 1) && <CompanySelect filter={filter} setFilter={handleChangeFilter}/> )
        }
        >
            <NewCashFlowModal categories={categories} afterCreate={cashFlows.refetch} isOpen={isNewCashFlowModalOpen} onRequestClose={CloseNewCashFlowModal}/>
            <EditCashFlowModal categories={categories} toEditCashFlowData={toEditCashFlowData} afterEdit={cashFlows.refetch} isOpen={isEditCashFlowModalOpen} onRequestClose={CloseEditCashFlowModal}/>
            <ConfirmCashFlowRemoveModal afterRemove={cashFlows.refetch} toRemoveCashFlowData={removeCashFlowData} isOpen={isConfirmCashFlowRemoveModalOpen} onRequestClose={CloseConfirmCashFlowRemoveModal}/>

            <Flex justify="space-between" alignItems="center" mb="10">
                <SolidButton onClick={OpenNewCashFlowModal} color="white" bg="blue.400" icon={PlusIcon} colorScheme="blue">
                    Adicionar Movimentação
                </SolidButton>

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
                {   cashFlows.isLoading ? (
                        <Flex justify="center">
                            <Spinner/>
                        </Flex>
                    ) : ( cashFlows.isError ? (
                        <Flex justify="center" mt="4" mb="4">
                            <Text>Erro listar as movimentações</Text>
                        </Flex>
                    ) : (cashFlows.data?.data.length === 0) && (
                        <Flex justify="center">
                            <Text>Nenhuma movimentação encontrada.</Text>
                        </Flex>
                    ) ) 
                }

                {
                    (!cashFlows.isLoading && !cashFlows.error) && Object.keys(cashFlows.data?.data).map((day:string) => {
                        //const totalDayCashFlows = cashFlows.data[day].length;
                        const totalDayAmount = cashFlows.data?.data[day].reduce((sumAmount:number, cashFlow:CashFlowInterface) => {
                            return sumAmount + cashFlow.value;
                        }, 0);

                        const todayFormatedDate = formatDate(formatYmdDate(new Date().toDateString()));
                        const dayCashFlowsFormated = formatDate(day);
                        const tomorrow = getDay(formatYmdDate(new Date().toDateString())) + 1;
                        const cashFlowDay = getDay(day);

                        return (
                            <Stack key={day} w="100%" border="2px" borderColor="gray.500" borderRadius="26" overflow="hidden" spacing="0" allowMultiple>
                                <HStack spacing="8" w="100%" justify="space-between" paddingX="8" paddingY="3" bg="gray.200">
                                    <Text fontWeight="bold">{(todayFormatedDate === dayCashFlowsFormated) ? 'Hoje' : (tomorrow === cashFlowDay) ? "Amanhã" : ""} {formatBRDate(day)}</Text>

                                    <Flex alignItems="center" float="right" color={totalDayAmount > 0 ? 'green.400' : 'red.400'}>
                                        {/* {totalDayAmount > 0 
                                            ? <StrongPlusIcon stroke="#48bb78" fill="none" width="12px"/> 
                                            : <MinusIcon stroke="#c30052" fill="none" width="12px"/>
                                        } */}
                                        <Text fontWeight="bold" ml="2">
                                            {Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(totalDayAmount)}
                                        </Text>
                                    </Flex>
                                </HStack>

                                {
                                    cashFlows.data?.data[day].map((cashFlow:CashFlowInterface) => {
                                        const cashFlowToEditData:EditCashFlowFormData = {
                                            id: cashFlow.id,
                                            title: cashFlow.title,
                                            value: cashFlow.value.toString().replace('.', ','),
                                            company: cashFlow.company?.id,
                                            category: cashFlow.category?.id,
                                        }

                                        return (
                                            <HStack justifyContent="space-between" borderTop="2px" borderColor="gray.500" px="8" py="4">
                                                <Flex>
                                                    <Text mr="6" fontSize="sm" color="gray.800">{cashFlow.created_at && getHour(cashFlow.created_at)}</Text>
                                                    <Text color="gray.800">{cashFlow.title}</Text>
                                                </Flex>

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

                                                        <EditButton onClick={() => OpenEditCashFlowModal(cashFlowToEditData)}/>

                                                        <IconButton onClick={() => OpenConfirmCashFlowRemoveModal({ id: cashFlow.id, title: cashFlow.title })} h="24px" w="23px" p="0" float="right" aria-label="Excluir categoria" border="none" icon={ <CloseIcon width="20px" stroke="#C30052" fill="none"/>} variant="outline"/>
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

                <Pagination totalCountOfRegister={cashFlows.data ? cashFlows.data.total : 0} registerPerPage={50} currentPage={page} onPageChange={setPage}/>
            </Stack>
            
        </MainBoard>
    );
}