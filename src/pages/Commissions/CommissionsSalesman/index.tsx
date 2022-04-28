import { Flex, HStack, Stack, Spinner, Text, Accordion, AccordionItem, AccordionButton, AccordionPanel, useToast, Divider, Table, Thead, Th, Tr, useBreakpointValue, Icon, Box } from "@chakra-ui/react";
import { SolidButton } from "../../../components/Buttons/SolidButton";
import { MainBoard } from "../../../components/MainBoard";
import { useCompanies } from "../../../hooks/useCompanies";
import { Company, SellerCommission } from "../../../types";

import { useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { ReactComponent as PlusIcon } from '../../../assets/icons/Plus.svg';
import { ReactComponent as MinusIcon } from '../../../assets/icons/Minus.svg';
import { ReactComponent as StrongPlusIcon } from '../../../assets/icons/StrongPlus.svg';

import Badge from '../../../components/Badge'

import { Input } from "../../../components/Forms/Inputs/Input";
import { OutlineButton } from "../../../components/Buttons/OutlineButton";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { UserFilterData, useUsers } from "../../../hooks/useUsers";
import { useWorkingCompany } from "../../../hooks/useWorkingCompany";
import { formatDate } from "../../../utils/Date/formatDate";
import { formatYmdDate } from "../../../utils/Date/formatYmdDate";
import { formatBRDate } from "../../../utils/Date/formatBRDate";
import { getDay } from "../../../utils/Date/getDay";
import { CompanySelectMaster } from "../../../components/CompanySelect/companySelectMaster";
import { useWorkingBranch } from "../../../hooks/useWorkingBranch";
import { CommissionsSellerFilterData, useCommissionsSeller } from "../../../hooks/useCommissionsSeller";
import { Select } from "../../../components/Forms/Selects/Select";
import { profile } from "console";
import { useProfile } from "../../../hooks/useProfile";

const FilterCommissionsFormSchema = yup.object().shape({
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
    pendency: yup.string(),
});

export default function CommissionsSalesman(){
    const workingCompany = useWorkingCompany();
    const workingBranch = useWorkingBranch();
    const { profile } = useProfile();
    const history = useHistory();
    const isWideVersion = useBreakpointValue({base: false, lg: true});

    const [filter, setFilter] = useState<CommissionsSellerFilterData>(() => {
        const data: CommissionsSellerFilterData = {
            search: '',
            start_date: '',
            end_date: '',
            contract: '',
            quote: '',
            company: workingCompany.company?.id,
            branch: workingBranch.branch?.id,
            group: '',
            status: '',
            parcel: '',
        };

        return data;
    })

    function handleChangeFilter(newFilter: CommissionsSellerFilterData){
        setFilter(newFilter);
    }

    const [page, setPage] = useState(1);

    const commissions = useCommissionsSeller(filter, page);

    const companies = useCompanies();

    const { register, handleSubmit, formState} = useForm<CommissionsSellerFilterData>({
        resolver: yupResolver(FilterCommissionsFormSchema),
    });

    function handleChangeCompany(event:any){
        const selectedCompanyId = (event?.target.value ? event?.target.value : 1);
        const selectedCompanyData = companies.data.filter((company:Company) => company.id == selectedCompanyId)[0]
        workingCompany.changeCompany(selectedCompanyData);

        const updatedFilter = filter;
        updatedFilter.company = selectedCompanyId;

        setFilter(updatedFilter);
    }

    const usersFilter: UserFilterData = {
        search: ''
    };
    const users = useUsers(usersFilter);

    const toast = useToast();


    const handleSearchCommissions = async (search : CommissionsSellerFilterData) => {
        search.company = workingCompany.company?.id;

        setPage(1);
        setFilter(search);
    }

    let totalOfSelectedDays = 0;

    if((filter.start_date !== undefined && filter.start_date !== '') && (filter.end_date !== undefined && filter.end_date !== '')){
        (!commissions.isLoading && !commissions.error) && Object.keys(commissions.data?.data).map((day:string) => {
            totalOfSelectedDays = totalOfSelectedDays + commissions.data?.data[day].reduce((sumAmount:number, commissions:SellerCommission) => {
                return sumAmount + (commissions.confirmed ? (commissions.value > 0 ? commissions.value : 0) : 0);
            }, 0);
        })
    }

    console.log(isWideVersion);
    const [toggleFilter, setToggleFilter] = useState(false);

    useEffect(() => {
        setFilter({...filter, company: workingCompany.company?.id, branch: workingBranch.branch?.id});
    }, [workingCompany, workingBranch]);

    return(
        <MainBoard sidebar="commissions" header={ <CompanySelectMaster filters={[{filterData: filter, setFilter: handleChangeFilter}]}/>}>

            <Stack flexDirection={["column", "row"]} spacing={["4", "0"]} justify="space-between" mb="10">
                <SolidButton color="white" bg="red.400" icon={PlusIcon} colorScheme="red">
                    Cadastrar venda
                </SolidButton>
            </Stack>

            <Stack flexDir={["column", "row"]} spacing="6" as="form" mb="20" onSubmit={handleSubmit(handleSearchCommissions)} borderRadius={!isWideVersion ? "24" : ""}  p={!isWideVersion ? "5" : ""} bg={!isWideVersion ? "white" : ""} boxShadow={!isWideVersion ? "md" : ""}>

                 {
                    !isWideVersion && (
                        <HStack onClick={() => setToggleFilter(!toggleFilter)}>
                            <Icon as={PlusIcon} fontSize="20" stroke={"gray.800"} />
                            <Text>Filtrar</Text>
                        </HStack>
                    )
                }

                <Box w="100%" display={(isWideVersion || (!isWideVersion && toggleFilter)) ? 'flex' : 'none'}>
                    <Stack spacing="6" w="100%">
                        <Stack direction={["column", "row"]} spacing="6">
                            <Input register={register} name="search" type="text" placeholder="Procurar" variant="filled" error={formState.errors.search}/>

                            <Input register={register} name="start_date" type="date" placeholder="Data Inicial" variant="filled" error={formState.errors.start_date}/>
                            <Input register={register} name="end_date" type="date" placeholder="Data Final" variant="filled" error={formState.errors.end_date}/>

                            <Select register={register} h="45px" name="reversal" w="100%" maxW="200px" fontSize="sm" focusBorderColor="blue.600" bg="gray.400" variant="filled" _hover={ {bgColor: 'gray.500'} } size="lg" borderRadius="full" placeholder="Estorno">
                                {/* {categories && categories.map((category:PaymentCategory) => {
                                    return (
                                        <option key={category.id} value={category.id}>{category.name}</option>
                                    )
                                })} */}
                            </Select>

                        </Stack>

                        <Stack direction={["column", "row"]} spacing="6">
                            <Input register={register} name="group" type="text" placeholder="Grupo" variant="filled" error={formState.errors.group}/>

                            <Input register={register} name="quote" type="text" placeholder="Cota" variant="filled" error={formState.errors.quote}/>

                            <Input register={register} name="contract" type="text" placeholder="Contrato" variant="filled" error={formState.errors.contract}/>

                            <Input register={register} name="parcela" type="text" placeholder="Parcela" variant="filled" error={formState.errors.parcel}/>

                            <Select register={register} defaultValue={0} h="45px" name="status" error={formState.errors.status} w="100%" maxW="200px" fontSize="sm" focusBorderColor="blue.600" bg="gray.400" variant="filled" _hover={ {bgColor: 'gray.500'} } size="lg" borderRadius="full">
                                <option value={1}>Pendente</option>
                                <option value={0}>Confirmada</option>
                            </Select>

                            <OutlineButton type="submit" mb="10" color="red.400" borderColor="red.400" colorScheme="red">
                                Filtrar
                            </OutlineButton>
                        </Stack>
                    </Stack>
                </Box>

            </Stack>

            <Stack fontSize="13px" spacing="12">
                {
                    (!commissions.isLoading && !commissions.error) && Object.keys(commissions.data?.data).map((day:string) => {
                        const totalDayCommissions = commissions.data?.data[day].reduce((sumAmount:number, commissions:SellerCommission) => {
                        const totalDayAmount = (commissions.confirmed ? (commissions.value > 0 ? commissions.value : 0) : 0);
                        return sumAmount + totalDayAmount;
                        }, 0);
                
                        const todayFormatedDate = formatDate(formatYmdDate(new Date().toDateString()));
                        const dayCommssionsFormated = formatDate(day);
                        const tomorrow = getDay(formatYmdDate(new Date().toDateString())) + 1;
                        const commissionDay = getDay(day);
                
                        const hasCommissionsYoPay = commissions.data?.data[day].filter((commissions:SellerCommission) => Number(commissions.confirmed) === 0).length;
                        <Accordion w="100%" border="2px" borderColor="gray.500" borderRadius="26" overflow="hidden" spacing="0" allowMultiple>
                            <HStack spacing="8" justify="space-between" paddingX={["4", "8"]} paddingY="3" bg="gray.200">

                            <Stack direction={["column", "row"]} spacing={["4", "6"]} alignItems="baseline" mt={["1", "0"]}>
                                <Text fontWeight="bold">22/02/2022</Text>

                                <Text fontWeight="bold" px="6rem">Contratos:</Text>


                                <Text fontWeight="bold" px="6rem" color="#6E7191">Créditos:</Text>
                            </Stack>
                                        {   commissions.isLoading ? (
                                            <Flex justify="center">
                                    <Spinner/>
                                </Flex>
                            ) : ( commissions.isError ? (
                                <Flex justify="center" mt="4" mb="4">
                                    <Text>Erro listar as contas a pagar</Text>
                                </Flex>
                            ) : (commissions.data?.data.length === 0) && (
                                <Flex justify="center">
                                    <Text>Nenhuma pagamento encontrado.</Text>
                                </Flex>
                            ) )
                        }
                            <Stack direction={["column", "row"]} spacing={["3", "6"]} alignItems={["flex-end", "center"]}>
                                <Text float="right" textAlign="right" px="40px" color="red.400"><strong>- R$ 3.000,00</strong></Text>
                            </Stack>
                            </HStack>
                            <AccordionItem display="flex" flexDir="column" paddingX={["4", "8"]} paddingTop="3" bg="white" borderTop="2px" borderTopColor="gray.500" borderBottom="0">
                            {({ isExpanded }) => (
                                <>
                                    <Stack spacing={["5", ""]} direction={['column', 'row']} justify="space-between" mb="3" alignItems={["", "center"]}>
                                        <HStack spacing={["5", "5"]} justifyContent="space-between">
                                            <HStack spacing={["3", "4"]}>
                                                <AccordionButton p="0" height="fit-content" w="auto">
                                                    <Flex alignItems="center" justifyContent="center" h={["20px", "24px"]} w={["24px", "30px"]} p="0" borderRadius="full" border="2px" borderColor="red.400" variant="outline">
                                                        {
                                                            !isExpanded ? <StrongPlusIcon stroke="#C30052" fill="none" width="12px" /> :
                                                                <MinusIcon stroke="#C30052" fill="none" width="12px" />
                                                        }
                                                    </Flex>
                                                </AccordionButton>
                                            </HStack>

                                            <Stack direction={['column', 'row']} spacing={["1", "4"]}>
                                                <Stack fontWeight="500" alignItems="center">
                                                    <Text ml="2" color="#6E7191" fontSize="10px">Data da venda</Text>
                                                    <Text ml="2" color="#4e4b66" fontSize="13px">22/01/2022</Text>
                                                </Stack>
                                            </Stack>
                                        </HStack>
                                        <HStack spacing={["5", "5"]} justifyContent="space-between">
                                            <HStack spacing={["3", "4"]}>
                                                <Stack fontWeight="500" alignItems="center">
                                                    <Text ml="2" color="#6E7191" fontSize="10px">Parcela</Text>
                                                    <Text ml="2" color="#4e4b66" fontSize="13px">2</Text>
                                                </Stack>
                                            </HStack>
                                        </HStack>
                                        <HStack spacing={["5", "5"]} justifyContent="space-between" fontSize={["11px", "13px"]}>
                                            <HStack>
                                                <Stack direction={['column', 'row']} spacing={["1", "4"]}>
                                                    <Stack fontWeight="500" alignItems="center">
                                                        <Text ml="2" color="#6E7191" fontSize="10px">Crédito</Text>
                                                        <Text ml="2" color="#4e4b66" fontSize="13px">R$500.000,00</Text>
                                                    </Stack>
                                                </Stack>
                                            </HStack>
                                        </HStack>
                                        <Stack direction={['column', 'row']} spacing={["1", "4"]}>
                                            <Stack fontWeight="500" alignItems="center">
                                                <Text ml="2" color="#6E7191" fontSize="10px">Critério</Text>
                                                <Text ml="2" color="#4e4b66" fontSize="13px">Regra Geral</Text>
                                            </Stack>
                                        </Stack>
                                        <Stack direction={['column', 'row']} spacing={["1", "4"]}>
                                            <Stack fontWeight="500" alignItems="center">
                                                <Badge colorScheme='green'>Confirmada</Badge>
                                            </Stack>
                                            <Stack fontWeight="500" alignItems="center">
                                                <Text float="right" px="2rem" color="green.400">R$ 1.000,00</Text>
                                            </Stack>
                                        </Stack>
                                    </Stack>

                                    <AccordionPanel flexDir="column" borderTop="2px" borderColor="gray.500" px="0" py="5" fontSize={["11px", "small"]}>
                                        <Stack direction={['column', 'row']} spacing={["5", "4"]} justifyContent="space-between" mb="4">
                                            <HStack spacing="2">
                                                <strong color="#4e4b66">Percentual:</strong>
                                                <Text>
                                                    1%
                                                </Text>
                                            </HStack>
                                            <HStack spacing="4">
                                                <strong color="#4e4b66">Parcelas:</strong>
                                                <Text>
                                                    4
                                                </Text>
                                            </HStack>
                                            <HStack spacing="4">
                                                <strong color="#4e4b66">Parcela:</strong>
                                                <Text>
                                                    Meia Parcela
                                                </Text>
                                            </HStack>

                                            <HStack spacing="2" px="1rem">
                                                <strong color="#4e4b66">Restante:</strong>
                                                <Text>
                                                    R$ 0,00
                                                </Text>
                                            </HStack>
                                        </Stack>

                                        <Divider mb="3" />

                                        <Stack direction={['column', 'row']} spacing={["5", "4"]} justifyContent="space-between" mb="4">
                                            <HStack spacing="2">
                                                <strong color="#4e4b66">Contrato:</strong>
                                                <Text>
                                                    230495
                                                </Text>
                                            </HStack>
                                            <HStack spacing="4">
                                                <strong color="#4e4b66">Grupo:</strong>
                                                <Text>
                                                    1080
                                                </Text>
                                            </HStack>
                                            <HStack spacing="4">
                                                <strong color="#4e4b66">Cota:</strong>
                                                <Text>
                                                    874
                                                </Text>
                                            </HStack>

                                            <HStack spacing="2" px="1rem">
                                                <strong color="#4e4b66">Bem:</strong>
                                                <Text>
                                                    imóvel
                                                </Text>
                                            </HStack>
                                            <HStack spacing="2" px="0rem">
                                                <strong color="#4e4b66">Cliente:</strong>
                                                <Text>
                                                    João Beltrano
                                                </Text>
                                            </HStack>
                                        </Stack>
                                    </AccordionPanel>
                                </>
                            )}
                            </AccordionItem>
                            <AccordionItem display="flex" flexDir="column" paddingX={["4", "8"]} paddingTop="3" bg="white" borderTop="2px" borderTopColor="gray.500" borderBottom="0">
                            {({ isExpanded }) => (
                                <>
                                    <Stack spacing={["5", ""]} direction={['column', 'row']} justify="space-between" mb="3" alignItems={["", "center"]}>
                                        <HStack spacing={["5", "5"]} justifyContent="space-between">
                                            <HStack spacing={["3", "4"]}>
                                                <AccordionButton p="0" height="fit-content" w="auto">
                                                    <Flex alignItems="center" justifyContent="center" h={["20px", "24px"]} w={["24px", "30px"]} p="0" borderRadius="full" border="2px" borderColor="red.400" variant="outline">
                                                        {
                                                            !isExpanded ? <StrongPlusIcon stroke="#C30052" fill="none" width="12px" /> :
                                                                <MinusIcon stroke="#C30052" fill="none" width="12px" />
                                                        }
                                                    </Flex>
                                                </AccordionButton>
                                            </HStack>

                                            <Stack direction={['column', 'row']} spacing={["1", "4"]}>
                                                <Stack fontWeight="500" alignItems="center">
                                                    <Text ml="2" color="#6E7191" fontSize="10px">Data da venda</Text>
                                                    <Text ml="2" color="#4e4b66" fontSize="13px">22/01/2022</Text>
                                                </Stack>
                                            </Stack>
                                        </HStack>
                                        <HStack spacing={["5", "5"]} justifyContent="space-between">
                                            <HStack spacing={["3", "4"]}>
                                                <Stack fontWeight="500" alignItems="center">
                                                    <Text px="0px" color="red.400" fontSize="13px">Estorno</Text>
                                                </Stack>
                                            </HStack>
                                        </HStack>
                                        <HStack spacing={["5", "5"]} justifyContent="space-between" fontSize={["11px", "13px"]}>
                                            <HStack>
                                                <Stack direction={['column', 'row']} spacing={["1", "4"]}>
                                                    <Stack fontWeight="500" alignItems="center">
                                                        <Text ml="2" color="#6E7191" fontSize="10px">Crédito</Text>
                                                        <Text ml="2" color="#4e4b66" fontSize="13px">R$500.000,00</Text>
                                                    </Stack>
                                                </Stack>
                                            </HStack>
                                        </HStack>
                                        <Stack direction={['column', 'row']} spacing={["1", "4"]}>
                                            <Stack fontWeight="500" alignItems="center">
                                                <Stack fontWeight="500" alignItems="center">
                                                    <Text ml="2" color="#6E7191" fontSize="10px">Critério</Text>
                                                    <Text ml="2" color="#4e4b66" fontSize="13px">Regra Geral</Text>
                                                </Stack>                                </Stack>
                                        </Stack>
                                        <Stack direction={['column', 'row']} spacing={["1", "4"]}>
                                            <Stack fontWeight="500" alignItems="center">
                                                <Text float="right" px="2rem" color="red.400">-R$ 5.000,00</Text>
                                            </Stack>
                                        </Stack>
                                    </Stack>

                                    <AccordionPanel flexDir="column" borderTop="2px" borderColor="gray.500" px="0" py="5" fontSize={["11px", "small"]}>
                                        <Stack direction={['column', 'row']} spacing={["5", "4"]} justifyContent="space-between" mb="4">
                                            <HStack spacing="2">
                                                <strong color="#4e4b66">Percentual:</strong>
                                                <Text>
                                                    1%
                                                </Text>
                                            </HStack>
                                            <HStack spacing="4">
                                                <strong color="#4e4b66">Parcelas:</strong>
                                                <Text>
                                                    4
                                                </Text>
                                            </HStack>
                                            <HStack spacing="4">
                                                <strong color="#4e4b66">Parcela:</strong>
                                                <Text>
                                                    Meia Parcela
                                                </Text>
                                            </HStack>

                                            <HStack spacing="2" px="1rem">
                                                <strong color="#4e4b66">Restante:</strong>
                                                <Text>
                                                    R$ 0,00
                                                </Text>
                                            </HStack>
                                        </Stack>

                                        <Divider mb="3" />

                                        <Stack direction={['column', 'row']} spacing={["5", "4"]} justifyContent="space-between" mb="4">
                                            <HStack spacing="2">
                                                <strong color="#4e4b66">Contrato:</strong>
                                                <Text>
                                                    230495
                                                </Text>
                                            </HStack>
                                            <HStack spacing="4">
                                                <strong color="#4e4b66">Grupo:</strong>
                                                <Text>
                                                    1080
                                                </Text>
                                            </HStack>
                                            <HStack spacing="4">
                                                <strong color="#4e4b66">Cota:</strong>
                                                <Text>
                                                    874
                                                </Text>
                                            </HStack>

                                            <HStack spacing="2" px="1rem">
                                                <strong color="#4e4b66">Bem:</strong>
                                                <Text>
                                                    imóvel
                                                </Text>
                                            </HStack>
                                            <HStack spacing="2" px="0rem">
                                                <strong color="#4e4b66">Cliente:</strong>
                                                <Text>
                                                    João Beltrano
                                                </Text>
                                            </HStack>
                                        </Stack>
                                    </AccordionPanel>
                                </>
                            )}
                    </AccordionItem>                                
                        </Accordion>     
                                })
                            } 
                </Stack>
        </MainBoard>
    );
}