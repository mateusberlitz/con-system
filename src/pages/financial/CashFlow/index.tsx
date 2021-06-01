import { FormControl, Flex, HStack, Stack, Spinner, Text, IconButton, Select, Accordion, AccordionItem, AccordionButton, AccordionPanel, Link } from "@chakra-ui/react";
import { SolidButton } from "../../../components/Buttons/SolidButton";
import { MainBoard } from "../../../components/MainBoard";
import { useCompanies } from "../../../hooks/useCompanies";
import { useProfile } from "../../../hooks/useProfile";
import { useSelectedCompany } from "../../../hooks/useSelectedCompany";
import { Company, dayPayments, Payment, PaymentCategory } from "../../../types";

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
import { useHistory } from "react-router";
import { api } from "../../../services/api";
import { UserFilterData, useUsers } from "../../../hooks/useUsers";
import { useProviders } from "../../../hooks/useProviders";
import { useWorkingCompany } from "../../../hooks/useWorkingCompany";
import { usePayments } from "../../../hooks/usePayments";
import { formatDate } from "../../../utils/Date/formatDate";
import { formatYmdDate } from "../../../utils/Date/formatYmdDate";
import { formatBRDate } from "../../../utils/Date/formatBRDate";
import { getDay } from "../../../utils/Date/getDay";



interface FilterPaymentsFormData{
    search: string;
    name: string;
    address: string;
    phone?: string;
    cnpj?: string;
}

interface RemovePaymentData{
    id: number;
    title: string;
}

const FilterPaymentsFormSchema = yup.object().shape({
    search: yup.string(),
    name: yup.string().required('Nome da Empresa Obrigatório'),
    address: yup.string().required('Endereço Obrigatório'),
    phone: yup.string().min(9, "Existe Telefone com menos de 9 dígitos?"),//51991090700
    cnpj: yup.string().min(12, "Não parece ser um CNPJ correto"),//02.999.999/0001-00
});

export default function CashFlow(){
    const workingCompany = useWorkingCompany();
    const history = useHistory();

    const [filter, setFilter] = useState<UserFilterData>(() => {
        const data: UserFilterData = {

        };
        
        return data;
    })
    const payments = usePayments(filter);

    const {profile} = useProfile();
    const companies = useCompanies();
    const providers = useProviders();
    const { showErrors } = useErrors();
    //const { data, isLoading, refetch, error} = useCompanies();

    const { register, handleSubmit, reset, formState} = useForm<FilterPaymentsFormData>({
        resolver: yupResolver(FilterPaymentsFormSchema),
    });

    const { companyId, changeCompanyId } = useSelectedCompany();

    function handleChangeCompany(event:any){
        const selectedCompanyId = (event?.target.value ? event?.target.value : 1);
        const selectedCompanyData = companies.data.filter((company:Company) => company.id == selectedCompanyId)[0]
        workingCompany.changeCompany(selectedCompanyData);
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

            <Flex justify="space-between" alignItems="center" mb="10">
                <SolidButton onClick={OpenNewPaymentModal} color="white" bg="blue.400" icon={PlusIcon} colorScheme="blue">
                    Adicionar Movimentação
                </SolidButton>

                {/* <Link href="/categorias" border="2px" borderRadius="full" borderColor="gray.500" px="6" h="8" alignItems="center">
                    <Text>Categorias</Text>
                </Link> */}
            </Flex>

            <Flex as="form" mb="20">

                <Stack spacing="6" w="100%">
                    <Input register={register} name="search" type="text" placeholder="Procurar" variant="filled" error={formState.errors.search}/>

                    <HStack spacing="6">
                        <Input register={register} name="initial_date" type="date" placeholder="Data inicial" variant="filled" error={formState.errors.name}/>
                        <Input register={register} name="final_date" type="date" placeholder="Data Final" variant="filled" error={formState.errors.name}/>

                        <Select register={register} h="45px" name="category" w="100%" maxW="200px" fontSize="sm" focusBorderColor="blue.600" bg="gray.400" variant="filled" _hover={ {bgColor: 'gray.500'} } size="lg" borderRadius="full" placeholder="Categoria">
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
                {   payments.isLoading ? (
                        <Flex justify="center">
                            <Spinner/>
                        </Flex>
                    ) : payments.isLoading && (
                        <Flex justify="center" mt="4" mb="4">
                            <Text>Erro listar as contas a pagar</Text>
                        </Flex>
                    )
                }

                {
                    (!payments.isLoading && !payments.error) && Object.keys(payments.data).map((day:string) => {
                        const totalDayPayments = payments.data[day].length;
                        const totalDayAmount = payments.data[day].reduce((sumAmount:number, payment:Payment) => {
                            return sumAmount + payment.value;
                        }, 0);

                        const todayFormatedDate = formatDate(formatYmdDate(new Date().toDateString()));
                        const dayPaymentsFormated = formatDate(day);
                        const tomorrow = getDay(formatYmdDate(new Date().toDateString())) + 1;
                        const paymentDay = getDay(day);

                        console.log(getDay(day), getDay(formatYmdDate(new Date().toDateString())));

                        return (
                            <Stack key={day} w="100%" border="2px" borderColor="gray.500" borderRadius="26" overflow="hidden" spacing="0" allowMultiple>
                                <HStack spacing="8" w="100%" justify="space-between" paddingX="8" paddingY="3" bg="gray.200">
                                    <Text fontWeight="bold">{(todayFormatedDate === dayPaymentsFormated) ? 'Hoje' : (tomorrow == paymentDay) ? "Amanhã" : ""} {formatBRDate(day)}</Text>

                                    <Flex alignItems="center" float="right" color={totalDayAmount > 0 ? 'green.400' : 'red.400'}>
                                        {totalDayAmount > 0 
                                            ? <StrongPlusIcon stroke="#48bb78" fill="none" width="12px"/> 
                                            : <MinusIcon stroke="#c30052" fill="none" width="12px"/>
                                        }
                                        <Text fontWeight="bold" ml="2">
                                            {Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(totalDayAmount)}
                                        </Text>
                                    </Flex>
                                </HStack>

                                <HStack justifyContent="space-between" borderTop="2px" borderColor="gray.500" px="8" py="4">
                                    <Flex>
                                        <Text mr="6" fontSize="sm" color="gray.800">14:20</Text>
                                        <Text color="gray.800">Materiais de limpeza e trabalho</Text>
                                    </Flex>

                                    <Flex>
                                        <Text fontWeight="bold" color="gray.800">Despesas</Text>
                                    </Flex>

                                    <Flex>
                                        <Text fontWeight="bold">
                                            <EditButton />

                                            <Flex ml="3" alignItems="center" float="right" color={totalDayAmount > 0 ? 'green.400' : 'red.400'}>
                                                {totalDayAmount > 0 
                                                    ? <StrongPlusIcon stroke="#48bb78" fill="none" width="12px"/> 
                                                    : <MinusIcon stroke="#c30052" fill="none" width="12px"/>
                                                }
                                                <Text fontWeight="bold" ml="2">
                                                    {Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(totalDayAmount)}
                                                </Text>
                                            </Flex>
                                        </Text>
                                    </Flex>
                                </HStack>
                            </Stack>
                        )
                    })
                }

            </Stack>
            
        </MainBoard>
    );
}