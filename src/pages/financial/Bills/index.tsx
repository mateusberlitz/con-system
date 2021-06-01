import { FormControl, Flex, HStack, Stack, Spinner, Text, IconButton, Select, Accordion, AccordionItem, AccordionButton, AccordionPanel, Link } from "@chakra-ui/react";
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
import { useBills } from "../../../hooks/useBills";
import { EditBillFormData, EditBillModal } from "./EditBillModal";
import { formatDate } from "../../../utils/Date/formatDate";
import { formatYmdDate } from "../../../utils/Date/formatYmdDate";
import { formatBRDate } from "../../../utils/Date/formatBRDate";
import { getDay } from "../../../utils/Date/getDay";



interface FilterBillsFormData{
    search: string;
    name: string;
    address: string;
    phone?: string;
    cnpj?: string;
}

interface RemoveBillData{
    id: number;
    title: string;
}

const FilterBillsFormSchema = yup.object().shape({
    search: yup.string(),
    name: yup.string().required('Nome da Empresa Obrigatório'),
    address: yup.string().required('Endereço Obrigatório'),
    phone: yup.string().min(9, "Existe Telefone com menos de 9 dígitos?"),//51991090700
    cnpj: yup.string().min(12, "Não parece ser um CNPJ correto"),//02.999.999/0001-00
});

export default function Bills(){
    const workingCompany = useWorkingCompany();
    const history = useHistory();

    const [filter, setFilter] = useState<UserFilterData>(() => {
        const data: UserFilterData = {

        };
        
        return data;
    })
    const bills = useBills(filter);

    const {profile} = useProfile();
    const companies = useCompanies();
    const providers = useProviders();
    const { showErrors } = useErrors();
    //const { data, isLoading, refetch, error} = useCompanies();

    const { register, handleSubmit, reset, formState} = useForm<FilterBillsFormData>({
        resolver: yupResolver(FilterBillsFormSchema),
    });

    const { companyId, changeCompanyId } = useSelectedCompany();

    function handleChangeCompany(event:any){
        const selectedCompanyId = (event?.target.value ? event?.target.value : 1);
        const selectedCompanyData = companies.data.filter((company:Company) => company.id == selectedCompanyId)[0]
        workingCompany.changeCompany(selectedCompanyData);
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
        const { data } = await api.get('/Bill_categories');

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
            provider: 0,
            pay_to_user: 0,
            status: false,
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

    return(
        <MainBoard sidebar="financial" header={ 
            ( profile && profile.role.id == 1) && ( companies.isLoading ? (
                <Flex justify="center">
                    <Spinner/>
                </Flex>
            ) : (
                    <HStack as="form" spacing="10" w="100%" mb="10">
                        <FormControl pos="relative">
                            <Select onChange={handleChangeCompany} h="45px" name="selected_company" w="100%" maxW="200px" fontSize="sm" focusBorderColor="purple.600" bg="gray.400" variant="filled" _hover={ {bgColor: 'gray.500'} } size="lg" borderRadius="full" placeholder="Empresa">
                            {companies.data && companies.data.map((company:Company) => {
                                return (
                                    <option key={company.id} value={company.id}>{company.name}</option>
                                )
                            })}
                            </Select>
                        </FormControl>
                    </HStack>
                ))
        }
        >
            {/* <NewBillModal categories={categories} users={users.data} providers={providers.data} afterCreate={bills.refetch} isOpen={isNewBillModalOpen} onRequestClose={CloseNewBillModal}/>
            <PayBillModal afterCreate={bills.refetch} toPayBillData={toPayBillData} isOpen={isPayBillModalOpen} onRequestClose={ClosePayBillModal}/>
            <EditBillModal categories={categories} toEditBillData={toEditBillData} users={users.data} providers={providers.data} afterEdit={bills.refetch} isOpen={isEditBillModalOpen} onRequestClose={CloseEditBillModal}/>
            <ConfirmBillRemoveModal afterRemove={bills.refetch} toRemoveBillData={removeBillData} isOpen={isConfirmBillRemoveModalOpen} onRequestClose={CloseConfirmBillRemoveModal}/> */}

            <Flex justify="space-between" alignItems="center" mb="10">
                <SolidButton onClick={OpenNewBillModal} color="white" bg="blue.400" icon={PlusIcon} colorScheme="blue">
                    Adicionar Pagamento
                </SolidButton>

                {/* <Link href="/categorias" border="2px" borderRadius="full" borderColor="gray.500" px="6" h="8" alignItems="center">
                    <Text>Categorias</Text>
                </Link> */}

                <OutlineButton onClick={() => {history.push('/categorias')}}>
                    Categorias
                </OutlineButton>

                <OutlineButton onClick={() => {history.push('/fornecedores')}}>
                    Fornecedores
                </OutlineButton>
            </Flex>

            <Flex as="form" mb="20">

                <Stack spacing="6" w="100%">
                    <HStack spacing="6">
                        <Input register={register} name="search" type="text" placeholder="Procurar" variant="filled" error={formState.errors.search}/>

                        <Input register={register} name="initial_date" type="date" placeholder="Data inicial" variant="filled" error={formState.errors.name}/>
                        <Input register={register} name="final_date" type="date" placeholder="Data Final" variant="filled" error={formState.errors.name}/>

                        <Select register={register} h="45px" name="category" w="100%" maxW="200px" fontSize="sm" focusBorderColor="blue.600" bg="gray.400" variant="filled" _hover={ {bgColor: 'gray.500'} } size="lg" borderRadius="full" placeholder="Categoria">
                            <option value="1">Comissões</option>
                            <option value="2">Materiais</option>
                            <option value="3">Escritório</option>
                        </Select>

                    </HStack>

                    <HStack spacing="6">
                        <Input register={register} name="group" type="text" placeholder="Grupo" variant="filled" error={formState.errors.name}/>
                            
                        <Input register={register} name="quote" type="text" placeholder="Cota" variant="filled" error={formState.errors.cnpj}/>
                        <Input register={register} name="contract" type="text" placeholder="Contrato" variant="filled" error={formState.errors.phone}/>
                            
                        <Select register={register} h="45px" name="pay_to_user" w="100%" maxW="200px" fontSize="sm" focusBorderColor="blue.600" bg="gray.400" variant="filled" _hover={ {bgColor: 'gray.500'} } size="lg" borderRadius="full" placeholder="Pagar para">
                            <option value="1">Comissões</option>
                            <option value="2">Materiais</option>
                            <option value="3">Escritório</option>
                        </Select>

                        <OutlineButton mb="10" color="blue.400" borderColor="blue.400" colorScheme="blue">
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
                    ) : bills.isLoading && (
                        <Flex justify="center" mt="4" mb="4">
                            <Text>Erro listar as contas a pagar</Text>
                        </Flex>
                    )
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
                                    <Text fontWeight="bold">{totalDayBills} Pagamentos</Text>
                                    <SolidButton h="30px" size="sm" fontSize="11" color="white" bg="green.400" colorScheme="green">
                                        Pagar Tudo
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
                                            provider: bill.provider?.id,
                                            pay_to_user: bill.pay_to_user?.id,
                                            status: bill.status,
                                            expire: bill.expire,
                                            observation: bill.observation,
                                            contract: bill.contract,
                                            group: bill.group,
                                            quote: bill.quote,
                                            recurrence: bill.recurrence,
                                            file: bill.file,
                                        }

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
                                                                <EllipseIcon stroke="none" fill="#2097ed"/>
                                                                <Text ml="2" color="#2097ed">{bill.title}</Text>
                                                            </Flex>

                                                            <Flex fontWeight="500" alignItems="center" color="gray.800">
                                                                <HomeIcon stroke="#4e4b66" fill="none" width="17px"/>
                                                                <Text ml="2">{bill.company.name}</Text>
                                                            </Flex>
                                                            
                                                            <Flex fontWeight="medium" alignItems="center" color="gray.900" _hover={{textDecor:"underline", cursor: "pointer"}}>
                                                                <AttachIcon stroke="#4e4b66" fill="none" width="16px"/>
                                                                <Text ml="2">Ver Anexo</Text>
                                                            </Flex>
                                                            
                                                            <OutlineButton
                                                                h="30px" size="sm" color="green.400" borderColor="green.400" colorScheme="green" fontSize="11">
                                                                Pagar
                                                            </OutlineButton>
                                                            <Text float="right">{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(bill.value)}</Text>
                                                        </HStack>

                                                        <AccordionPanel flexDir="column" borderTop="2px" borderColor="gray.500" px="0" py="5">
                                                            <HStack justifyContent="space-between" mb="4">
                                                                    <Text>
                                                                        <strong>Pagar para: </strong>
                                                                        {bill.pay_to_user?.name && `${bill.pay_to_user.name} ${bill.pay_to_user.last_name}`}
                                                                    </Text>

                                                                    <Text>
                                                                        <strong>Contrato: </strong>
                                                                        {bill.contract && bill.contract}
                                                                    </Text>

                                                                    <Text>
                                                                        <strong>Grupo: </strong>
                                                                        {bill.group && bill.group}
                                                                    </Text>

                                                                    <Text>
                                                                        <strong>Cota: </strong>
                                                                        {bill.quote && bill.quote}
                                                                    </Text>
                                                            </HStack>

                                                            <HStack justifyContent="space-between" alignItems="center">
                                                                <Flex alignItems="center">
                                                                    <Text fontWeight="500">Observação: </Text>
                                                                    <Text> {bill.observation && bill.observation}</Text>
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