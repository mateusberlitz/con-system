import { FormControl, Flex, HStack, Stack, Spinner, Text, IconButton, Select as ChakraSelect, Accordion, AccordionItem, AccordionButton, AccordionPanel, Link } from "@chakra-ui/react";
import { SolidButton } from "../../../components/Buttons/SolidButton";
import { MainBoard } from "../../../components/MainBoard";
import { useCompanies } from "../../../hooks/useCompanies";
import { useProfile } from "../../../hooks/useProfile";
import { useSelectedCompany } from "../../../hooks/useSelectedCompany";
import { Company, dayBills, Bill, BillCategory } from "../../../types";

import { useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { ReactComponent as PlusIcon } from '../../../assets/icons/Plus.svg';
import { ReactComponent as MinusIcon } from '../../../assets/icons/Minus.svg';
import { ReactComponent as StrongPlusIcon } from '../../../assets/icons/StrongPlus.svg';
import { ReactComponent as EllipseIcon } from '../../../assets/icons/Ellipse.svg';
import { ReactComponent as AttachIcon } from '../../../assets/icons/Attach.svg';
import { ReactComponent as HomeIcon } from '../../../assets/icons/Home.svg';
import { Input } from "../../../components/Forms/Inputs/Input";
import { useErrors } from "../../../hooks/useErrors";
import { OutlineButton } from "../../../components/Buttons/OutlineButton";
import { EditButton } from "../../../components/Buttons/EditButton";
import { RemoveButton } from "../../../components/Buttons/RemoveButton";
import { useEffect, useRef, useState } from "react";
import { NewBillModal } from "./NewBillModal";
import { ConfirmBillRemoveModal } from "./ConfirmBillRemoveModal";
import { useHistory } from "react-router";
import { api } from "../../../services/api";
import { UserFilterData, useUsers } from "../../../hooks/useUsers";
import { useProviders } from "../../../hooks/useProviders";
import { useWorkingCompany } from "../../../hooks/useWorkingCompany";
import { BillFilterData, useBills } from "../../../hooks/useBills";
import { EditBillFormData, EditBillModal } from "./EditBillModal";
import { formatDate } from "../../../utils/Date/formatDate";
import { formatYmdDate } from "../../../utils/Date/formatYmdDate";
import { formatBRDate } from "../../../utils/Date/formatBRDate";
import { getDay } from "../../../utils/Date/getDay";
import { useSources } from "../../../hooks/useSources";
import { Select } from "../../../components/Forms/Selects/Select";

interface RemoveBillData{
    id: number;
    title: string;
}

const FilterBillsFormSchema = yup.object().shape({
    search: yup.string(),
    start_date: yup.string(),
    end_date: yup.string(),
    category: yup.string(),
    company: yup.string(),
    source: yup.string(),
});

export default function Bills(){
    const workingCompany = useWorkingCompany();
    const history = useHistory();

    const [filter, setFilter] = useState<BillFilterData>(() => {
        const data: BillFilterData = {
            search: '',
            company: workingCompany.company?.id
        };
        
        return data;
    })

    const bills = useBills(filter);

    const {profile} = useProfile();
    const companies = useCompanies();
    const sources = useSources();
    const { showErrors } = useErrors();
    //const { data, isLoading, refetch, error} = useCompanies();

    const { register, handleSubmit, reset, formState} = useForm<BillFilterData>({
        resolver: yupResolver(FilterBillsFormSchema),
    });

    const { companyId, changeCompanyId } = useSelectedCompany();

    function handleChangeCompany(event:any){
        const selectedCompanyId = (event?.target.value ? event?.target.value : 1);
        const selectedCompanyData = companies.data.filter((company:Company) => company.id == selectedCompanyId)[0]
        workingCompany.changeCompany(selectedCompanyData);

        const updatedFilter = filter;
        updatedFilter.company = selectedCompanyId;

        setFilter(updatedFilter);
    }

    const [isNewBillModalOpen, setIsNewBillModalOpen] = useState(false);

    function OpenNewBillModal(){
        setIsNewBillModalOpen(true);
    }
    function CloseNewBillModal(){
        setIsNewBillModalOpen(false);
    }


    const [categories, setCategories] = useState<BillCategory[]>([]);

    const loadCategories = async () => {
        const { data } = await api.get('/bill_categories');

        setCategories(data);
    }

    useEffect(() => {
        loadCategories();
        
    }, [])

    const usersFilter: UserFilterData = {
        search: ''
    };
    const users = useUsers(usersFilter);


    const [toEditBillData, setToEditBillData] = useState<EditBillFormData>(() => {

        const data: EditBillFormData = {
            id: 0,
            title: '',
            value: '',
            company: 0,
            category: 0,
            source: 0,
            expire: '',
            observation: '',
        };
        
        return data;
    });

    const [isEditBillModalOpen, setIsEditBillModalOpen] = useState(false);

    function OpenEditBillModal(BillData : EditBillFormData){
        setToEditBillData(BillData);
        setIsEditBillModalOpen(true);
    }
    function CloseEditBillModal(){
        setIsEditBillModalOpen(false);
    }

    const [isConfirmBillRemoveModalOpen, setisConfirmBillRemoveModalOpen] = useState(false);
    const [removeBillData, setRemoveBillData] = useState<RemoveBillData>(() => {

        const data: RemoveBillData = {
            title: '',
            id: 0,
        };
        
        return data;
    });

    function OpenConfirmBillRemoveModal(BillData: RemoveBillData){
        setRemoveBillData(BillData);
        setisConfirmBillRemoveModalOpen(true);
    }
    function CloseConfirmBillRemoveModal(){
        setisConfirmBillRemoveModalOpen(false);
    }

    const handleSearchBills = async (search : BillFilterData) => {
        console.log(search);
        setFilter(search);
    }
    console.log(bills);

    return(
        <MainBoard sidebar="financial" header={ 
            ( profile && profile.role.id == 1) && ( companies.isLoading ? (
                <Flex justify="center">
                    <Spinner/>
                </Flex>
            ) : (
                    <HStack as="form" spacing="10" w="100%" mb="10">
                        <FormControl pos="relative">
                            <ChakraSelect onChange={handleChangeCompany} defaultValue={workingCompany.company?.id} h="45px" name="selected_company" w="100%" maxW="200px" fontSize="sm" focusBorderColor="purple.600" bg="gray.400" variant="filled" _hover={ {bgColor: 'gray.500'} } size="lg" borderRadius="full" placeholder="Empresa">
                            {companies.data && companies.data.map((company:Company) => {
                                return (
                                    <option key={company.id} value={company.id}>{company.name}</option>
                                )
                            })}
                            </ChakraSelect>
                        </FormControl>
                    </HStack>
                ))
        }
        >
            <NewBillModal categories={categories} users={users.data} sources={sources.data} afterCreate={bills.refetch} isOpen={isNewBillModalOpen} onRequestClose={CloseNewBillModal}/>
            {/* <PayBillModal afterCreate={bills.refetch} toPayBillData={toPayBillData} isOpen={isPayBillModalOpen} onRequestClose={ClosePayBillModal}/> */}
            <EditBillModal categories={categories} toEditBillData={toEditBillData} users={users.data} sources={sources.data} afterEdit={bills.refetch} isOpen={isEditBillModalOpen} onRequestClose={CloseEditBillModal}/>
            <ConfirmBillRemoveModal afterRemove={bills.refetch} toRemoveBillData={removeBillData} isOpen={isConfirmBillRemoveModalOpen} onRequestClose={CloseConfirmBillRemoveModal}/>

            <Flex justify="space-between" alignItems="center" mb="10">
                <SolidButton onClick={OpenNewBillModal} color="white" bg="blue.400" icon={PlusIcon} colorScheme="blue">
                    Adicionar Conta a Receber
                </SolidButton>

                {/* <Link href="/categorias" border="2px" borderRadius="full" borderColor="gray.500" px="6" h="8" alignItems="center">
                    <Text>Categorias</Text>
                </Link> */}

                <OutlineButton onClick={() => {history.push('/receber/categorias')}}>
                    Categorias
                </OutlineButton>

                <OutlineButton onClick={() => {history.push('/receber/fontes')}}>
                    Fontes
                </OutlineButton>
            </Flex>

            <Flex as="form" mb="20" onSubmit={handleSubmit(handleSearchBills)}>

                <Stack spacing="6" w="100%">
                    <Input register={register} name="search" type="text" placeholder="Procurar" variant="filled" error={formState.errors.search}/>

                    <HStack spacing="6">
                        <Input register={register} name="source" type="text" placeholder="Cliente" variant="filled" error={formState.errors.source}/>

                        <Input register={register} name="start_date" type="date" placeholder="Data Inicial" variant="filled" error={formState.errors.start_date}/>
                        <Input register={register} name="end_date" type="date" placeholder="Data Final" variant="filled" error={formState.errors.end_date}/>

                        <Select register={register} h="45px" name="category" w="100%" maxW="200px" fontSize="sm" focusBorderColor="blue.600" bg="gray.400" variant="filled" _hover={ {bgColor: 'gray.500'} } size="lg" borderRadius="full" placeholder="Categoria">
                            {categories && categories.map((category: BillCategory) => {
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
                {   bills.isLoading ? (
                        <Flex justify="center">
                            <Spinner/>
                        </Flex>
                    ) : (bills.isError ? (
                        <Flex justify="center" mt="4" mb="4">
                            <Text>Erro listar as contas a receber</Text>
                        </Flex>
                    ) : (bills.data.length === 0) && (
                        <Flex justify="center">
                            <Text>Nenhuma conta a pagar encontrada.</Text>
                        </Flex>
                    ) )
                }

                {
                    (!bills.isLoading && !bills.error) && Object.keys(bills.data).map((day:string) => {
                        const totalDayBills = bills.data[day].length;
                        const totalDayAmount = bills.data[day].reduce((sumAmount:number, Bill:Bill) => {
                            return sumAmount + Bill.value;
                        }, 0);

                        const todayFormatedDate = formatDate(formatYmdDate(new Date().toDateString()));
                        const dayBillsFormated = formatDate(day);
                        const tomorrow = getDay(formatYmdDate(new Date().toDateString())) + 1;
                        const BillDay = getDay(day);

                        console.log(getDay(day), getDay(formatYmdDate(new Date().toDateString())));

                        return (
                            <Accordion key={day} w="100%" border="2px" borderColor="gray.500" borderRadius="26" overflow="hidden" spacing="0" allowMultiple>
                                <HStack spacing="8" justify="space-between" paddingX="8" paddingY="3" bg="gray.200">
                                    <Text fontWeight="bold">{(todayFormatedDate === dayBillsFormated) ? 'Hoje' : (tomorrow == BillDay) ? "Amanhã" : ""} {formatBRDate(day)}</Text>
                                    <Text fontWeight="bold">{totalDayBills} Contas a Receber</Text>
                                    <SolidButton h="30px" size="sm" fontSize="11" color="white" bg="green.400" colorScheme="green">
                                        Tudo Recebido
                                    </SolidButton>
                                    <Text float="right"><strong>TOTAL: {Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(totalDayAmount)}</strong></Text>
                                </HStack>

                                {
                                    bills.data[day].map((bill:Bill) => {
                                        const billToEditData:EditBillFormData = {
                                            id: bill.id,
                                            title: bill.title,
                                            value: Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(bill.value),
                                            company: bill.company?.id,
                                            category: bill.category?.id,
                                            source: bill.source?.id,
                                            status: bill.status,
                                            expire: bill.expire,
                                            observation: bill.observation,
                                        }

                                        console.log(bill);

                                        return (
                                            <AccordionItem key={bill.id} display="flex" flexDir="column" paddingX="8" paddingTop="3" bg="white" borderTop="2px" borderTopColor="gray.500" borderBottom="0">
                                                {({ isExpanded }) => (
                                                    <>
                                                        <HStack justify="space-between" mb="3">
                                                            <AccordionButton p="0" height="fit-content" w="auto">
                                                                <IconButton h="24px" w="23px" p="0" borderRadius="full" border="2px" borderColor="blue.400" colorScheme="blue" aria-label="Ampliar informações" 
                                                                    icon={ 
                                                                        !isExpanded ? <StrongPlusIcon stroke="#2097ed" fill="none" width="12px"/> :
                                                                        <MinusIcon stroke="#2097ed" fill="none" width="12px"/>
                                                                    } 
                                                                    variant="outline"/>
                                                            </AccordionButton>

                                                            <Flex fontWeight="500" alignItems="center">
                                                                <EllipseIcon stroke="none" fill={bill.category?.color}/>
                                                                <Text ml="2" color={bill.category?.color}>{bill.title}</Text>
                                                            </Flex>

                                                            <Flex fontWeight="500" alignItems="center" color="gray.800">
                                                                <HomeIcon stroke="#4e4b66" fill="none" width="17px"/>
                                                                <Text ml="2">{bill.company.name}</Text>
                                                            </Flex>
                                                            
                                                            <OutlineButton
                                                                h="30px" size="sm" color="green.400" borderColor="green.400" colorScheme="green" fontSize="11">
                                                                Recebido
                                                            </OutlineButton>
                                                            <Text float="right">{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(bill.value)}</Text>
                                                        </HStack>

                                                        <AccordionPanel flexDir="column" borderTop="2px" borderColor="gray.500" px="0" py="5">
                                                            <HStack justifyContent="space-between" alignItems="center">
                                                                <Flex alignItems="center">
                                                                    <Text fontWeight="500">Observação: </Text>
                                                                    <Text> {bill.observation && bill.observation}</Text>
                                                                </Flex>

                                                                <Flex alignItems="center">
                                                                    <Text fontWeight="500">Fonte: </Text>
                                                                    <Text> {bill.source?.name && bill.source?.name}</Text>
                                                                </Flex>

                                                                <HStack spacing="5" alignItems="center">
                                                                    <EditButton onClick={() => OpenEditBillModal(billToEditData)}/>
                                                                    <RemoveButton onClick={() => OpenConfirmBillRemoveModal({ id: bill.id, title: bill.title }) }/>
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

            </Stack>
            
        </MainBoard>
    );
}