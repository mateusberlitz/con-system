import { Divider, Flex, FormControl, HStack, Select as ChakraSelect, Spinner, Text, Th, Tr } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Board } from "../../../components/Board";
import { CompanySelect } from "../../../components/CompanySelect";
import { MainBoard } from "../../../components/MainBoard";
import { Table } from "../../../components/Table";
import { useCompanies } from "../../../hooks/useCompanies";
import { PaymentFilterData } from "../../../hooks/usePayments";
import { HasPermission, useProfile } from "../../../hooks/useProfile";
import { TransactionsByAccountFilterData, useTransactionsByAccount } from "../../../hooks/useTransactionsByAccount";
import { useWorkingCompany } from "../../../hooks/useWorkingCompany";
import { api } from "../../../services/api";
import { Company } from "../../../types";
import { newMonthsAmountArray } from "./populateMonthAmountArray";

export default function Reports(){
    const {permissions, profile} = useProfile();
    const workingCompany = useWorkingCompany();

    const history = useHistory();

    const [years, setYears] = useState<Number[]>([]);
    const [selectedYear, setSelectedYear] = useState<string>('');

    const loadYears = async () => {
        const { data } = await api.get('/transactionsYears');

        setYears(data);
    }

    useEffect(() => {
        loadYears();
    }, [])

    const dateObject = new Date;

    const [filterExitTransactions, setFilterExitTransactions] = useState<TransactionsByAccountFilterData>(() => {
        const data: TransactionsByAccountFilterData = {
            transaction_type: 'payments',
            company: workingCompany.company?.id,
            year: dateObject.getFullYear().toString(),
        };
        
        return data;
    })

    const [filterEntryTransactions, setFilterEntryTransactions] = useState<TransactionsByAccountFilterData>(() => {
        const data: TransactionsByAccountFilterData = {
            transaction_type: 'bills',
            company: workingCompany.company?.id,
            year: dateObject.getFullYear().toString(),
        };
        
        return data;
    })

    function handleChangeFilter(newFilter: TransactionsByAccountFilterData){
        setFilterExitTransactions(newFilter);
        setFilterEntryTransactions(newFilter);
    }

    function handleChangeYear(event:any){
        const newYear = (event?.target.value ? event?.target.value : selectedYear);

        setSelectedYear(newYear);

        const newExitFilter = filterExitTransactions;
        newExitFilter.year = newYear
        setFilterExitTransactions(newExitFilter);

        const newEntryFilter = filterEntryTransactions;
        newEntryFilter.year = newYear
        setFilterEntryTransactions(newEntryFilter);
    }
    
    const companies = useCompanies();

    function handleChangeCompany(event:any){
        const selectedCompanyId = (event?.target.value ? event?.target.value : 1);
        const selectedCompanyData = companies.data.filter((company:Company) => Number(company.id) === Number(selectedCompanyId))[0]
        workingCompany.changeCompany(selectedCompanyData);

        const newExitFilter = filterExitTransactions;
        newExitFilter.company = selectedCompanyId
        setFilterExitTransactions(newExitFilter);

        const newEntryFilter = filterEntryTransactions;
        newEntryFilter.company = selectedCompanyId
        setFilterEntryTransactions(newEntryFilter);
    }

    const [page, setPage] = useState(1);

    const exitTransactions = useTransactionsByAccount(filterExitTransactions, page);
    const entryTransactions = useTransactionsByAccount(filterEntryTransactions, page);

    const totalExitsByMonths = newMonthsAmountArray();
    const totalEntriesByMonths = newMonthsAmountArray();
    const totalByMonths = newMonthsAmountArray();

    console.log();

    return(
        <MainBoard sidebar="financial" header={
            ( ((permissions && HasPermission(permissions, 'Todas Empresas'))  || (profile && profile.companies && profile.companies.length > 1)) ?
                ( !profile || !profile.companies ? (
                    <Flex justify="center">
                        <Text>Nenhuma empresa disponível</Text>
                    </Flex>
                ) : (
                        <HStack as="form" spacing="10" w="100%" mb="10">
                            <FormControl pos="relative">
                                <ChakraSelect onChange={handleChangeCompany} defaultValue={workingCompany.company?.id} h="45px" name="selected_company" w="100%" maxW="200px" fontSize="sm" focusBorderColor="purple.600" bg="gray.400" variant="filled" _hover={ {bgColor: 'gray.500'} } size="lg" borderRadius="full">
                                {profile.companies && profile.companies.map((company:Company) => {
                                    return (
                                        <option key={company.id} value={company.id}>{company.name}</option>
                                    )
                                })}
                                </ChakraSelect>
                            </FormControl>
                        </HStack>
                    ))
                :
                <div></div>
            )
        }
        >

        <Board>
            <HStack as="form" spacing="12" w="100%" mb="6" justifyContent="left">
                <FormControl display="flex" w="fit-content" minW="150px">
                    <ChakraSelect onChange={handleChangeYear} defaultValue={workingCompany.company?.id} h="45px" name="selected_company" maxW="200px" fontSize="sm" focusBorderColor="purple.600" bg="gray.400" variant="filled" _hover={ {bgColor: 'gray.500'} } size="lg" borderRadius="full">
                        {
                            years.map((year:Number) => {
                                return (
                                    <option key={year.toString()} value={year.toString()}>{year}</option>
                                )
                            })
                        }
                    </ChakraSelect>
                </FormControl>

                <Text fontWeight="bold">RELATÓRIO GERAL</Text>
            </HStack>

            <Divider mb="6"/>

            { exitTransactions.isLoading ? (
                    <Flex justify="center">
                        <Spinner/>
                    </Flex>
                ) : ( exitTransactions.isError ? (
                    <Flex justify="center" mt="4" mb="4">
                        <Text>Erro listar as contas a pagar</Text>
                    </Flex>
                ) : (exitTransactions.data?.data.length === 0) && (
                    <Flex justify="center">
                        <Text>Nenhuma pagamento encontrado.</Text>
                    </Flex>
                ) ) 
            }

            {
                (!exitTransactions.isLoading && !exitTransactions.error && !entryTransactions.isLoading && !entryTransactions.error) && (
                    <Table header={[
                        {text: 'Conta', bold: true},
                        {text: 'Janeiro'},
                        {text: 'Fevereiro'},
                        {text: 'Março'},
                        {text: 'Abril'},
                        {text: 'Maio'},
                        {text: 'Junho'},
                        {text: 'Julho'},
                        {text: 'Agosto'},
                        {text: 'Setembro'},
                        {text: 'Outubro'},
                        {text: 'Novembro'},
                        {text: 'Dezembro'},
                        {text: 'Soma da Categoria', bold:true},
                        {text: 'Resultado da Categoria', bold:true},
                    ]}>
                        <Tr>
                            <Th></Th>
                        </Tr>
                        <Tr>
                            <Th color="gray.900" fontSize="sm" position="sticky" left="0">SAÍDAS</Th>
                        </Tr>
                        {

                            Object.keys(exitTransactions.data?.data).map((category:string) => {
                                return (
                                    <Tr key={`exits-${category}`}>
                                        <Th fontWeight="bold" color="gray.800" textTransform="capitalize" key={category} position="sticky" left="0" bg="white">{category}</Th>

                                        {
                                            Object.keys(exitTransactions.data?.data[category]).map((month:string, index:number) => {
                                                totalExitsByMonths[index + 1] += exitTransactions.data?.data[category][month];
                                                totalByMonths[index + 1] += exitTransactions.data?.data[category][month];

                                                return <Th whiteSpace="nowrap" fontWeight="500" color={exitTransactions.data?.data[category][month] > 0 ? 'green.400' : (exitTransactions.data?.data[category][month] < 0 ? 'red.400' : 'gray.800')} key={`${category}-${month}-${exitTransactions.data?.data[category][month]}`}>{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(exitTransactions.data?.data[category][month])}</Th>
                                            })
                                        }
                                    </Tr>
                                )
                            })
                        }
                        <Tr>
                            <Th position="sticky" left="0" bg="white">Total de Saídas</Th>
                            {

                                totalExitsByMonths.map((value:number, index:number) => {
                                    if(index === 14){return;};
                                    return <Th whiteSpace="nowrap" color={value > 0 ? 'green.400' : (value < 0 ? 'red.400' : 'gray.800')} key={`exits-${index}-${value}}`}>{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(value)}</Th>
                                })
                            }
                        </Tr>

                        <Tr>
                            <Th></Th>
                        </Tr>
                        <Tr>
                            <Th color="gray.900" fontSize="sm" position="sticky" left="0" bg="white">ENTRADAS</Th>
                        </Tr>

                        {
                            Object.keys(entryTransactions.data?.data).map((category:string) => {
                                return (
                                    <Tr key={`entries-${category}`}>
                                        <Th fontWeight="bold" color="gray.800" textTransform="capitalize" position="sticky" left="0" bg="white">{category}</Th>

                                        {
                                            Object.keys(entryTransactions.data?.data[category]).map((month:string, index: number) => {
                                                totalEntriesByMonths[index + 1] += entryTransactions.data?.data[category][month];
                                                totalByMonths[index + 1] += entryTransactions.data?.data[category][month];

                                                return <Th whiteSpace="nowrap" fontWeight="500" color={entryTransactions.data?.data[category][month] > 0 ? 'green.400' : (entryTransactions.data?.data[category][month] < 0 ? 'red.400' : 'gray.800')} key={`${category}-${month}-${entryTransactions.data?.data[category][month]}`}>{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(entryTransactions.data?.data[category][month])}</Th>
                                            })
                                        }
                                    </Tr>
                                )
                            })
                        }
                        <Tr>
                            <Th position="sticky" left="0" bg="white">Total de Entradas</Th>
                            {

                                totalEntriesByMonths.map((value:number, index:number) => {
                                    if(index === 14){return;};
                                    return <Th whiteSpace="nowrap" color={value > 0 ? 'green.400' : (value < 0 ? 'red.400' : 'gray.800')} key={`exits-${index}-${value}}`}>{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(value)}</Th>
                                })
                            }
                        </Tr>

                        <Tr>
                            <Th></Th>
                        </Tr>

                        <Tr>
                            <Th position="sticky" fontSize="sm" left="0" bg="white" color="black">RESULTADO</Th>
                            {

                                totalByMonths.map((value:number, index:number) => {
                                    if(index === 14){return;};
                                    return <Th whiteSpace="nowrap" color={value > 0 ? 'green.400' : (value < 0 ? 'red.400' : 'gray.800')} key={`exits-${index}-${value}}`}>{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(value)}</Th>
                                })
                            }
                        </Tr>
        
                    </Table>
                )
            }

            
        </Board>

        

        </MainBoard>
    );
}