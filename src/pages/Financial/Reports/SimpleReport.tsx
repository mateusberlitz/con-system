import { Divider, Flex, FormControl, HStack, Select as ChakraSelect, Spinner, Text, Th, Tr } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Board } from "../../../components/Board";
import { CompanySelectMaster } from "../../../components/CompanySelect/companySelectMaster";
import { MainBoard } from "../../../components/MainBoard";
import { Table } from "../../../components/Table";
import { useCompanies } from "../../../hooks/useCompanies";
import { useProfile } from "../../../hooks/useProfile";
import { useSimpleReport } from "../../../hooks/useSimpleRepor";
import { TransactionsByAccountFilterData } from "../../../hooks/useTransactionsByAccount";
import { useWorkingBranch } from "../../../hooks/useWorkingBranch";
import { useWorkingCompany } from "../../../hooks/useWorkingCompany";
import { api } from "../../../services/api";
import { Company } from "../../../types";
import { newMonthsAmountArray } from "./populateMonthAmountArray";
import { newMonthsAmountArraySimple } from "./populateMonthAmountArraySimple";

export default function SimpleReport(){
    const {permissions, profile} = useProfile();
    const workingCompany = useWorkingCompany();
    const workingBranch = useWorkingBranch();

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
            branch: workingBranch.branch?.id,
            year: dateObject.getFullYear().toString(),
        };
        
        return data;
    })

    const [filterEntryTransactions, setFilterEntryTransactions] = useState<TransactionsByAccountFilterData>(() => {
        const data: TransactionsByAccountFilterData = {
            transaction_type: 'bills',
            company: workingCompany.company?.id,
            branch: workingBranch.branch?.id,
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

    const simpleExitReport = useSimpleReport(filterExitTransactions, page);
    const simpleEntryReport = useSimpleReport(filterEntryTransactions, page);

    const totalExitsByMonths = newMonthsAmountArray();
    const totalEntriesByMonths = newMonthsAmountArray();
    const totalByMonths = newMonthsAmountArray();

    const months = newMonthsAmountArraySimple();

    useEffect(() => {
        setFilterExitTransactions({...filterExitTransactions, company: workingCompany.company?.id, branch: workingBranch.branch?.id});
        setFilterEntryTransactions({...filterEntryTransactions, company: workingCompany.company?.id, branch: workingBranch.branch?.id});
    }, [workingCompany, workingBranch]);

    return(
        <MainBoard sidebar="financial" header={ <CompanySelectMaster />  }>

        <Board mb="12">
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

                <Text fontWeight="bold">RELATÓRIO DE FLUXO DE CAIXA</Text>
            </HStack>

            <Divider mb="6"/>

            { simpleExitReport.isLoading ? (
                    <Flex justify="center">
                        <Spinner/>
                    </Flex>
                ) : ( simpleExitReport.isError ? (
                    <Flex justify="center" mt="4" mb="4">
                        <Text>Erro listar as contas a pagar</Text>
                    </Flex>
                ) : (simpleExitReport.data?.data.length === 0) && (
                    <Flex justify="center">
                        <Text>Nenhuma pagamento encontrado.</Text>
                    </Flex>
                ) ) 
            }

            {
                (!simpleExitReport.isLoading && !simpleExitReport.error && !simpleEntryReport.isLoading && !simpleEntryReport.error) && (
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
                            <Th color="gray.900" fontSize="sm" position="sticky" left="0">SAÍDAS</Th>
                        </Tr>
                        <Tr>
                            <Th color="gray.900" fontSize="sm" position="sticky" left="0"></Th>
                        </Tr>
                        {
                            Object.keys(simpleExitReport.data?.data).map((category:string) => {
                                let categoryAmount = 0;

                                //console.log(simpleExitReport.data?.data[category]);
                                let categoryResult = Object.keys(simpleExitReport.data?.data[category]).reduce((sumAmount, month, index) => {
                                    return sumAmount + simpleExitReport.data?.data[category][month];
                                }, 0) 

                                if(simpleEntryReport.data?.data[category]){
                                    categoryResult = categoryResult + Object.keys(simpleEntryReport.data?.data[category]).reduce((sumAmount, month, index) => {
                                        return sumAmount + simpleEntryReport.data?.data[category][month];
                                    }, 0);
                                }

                                return (
                                    <Tr key={category}>
                                        <Th fontWeight="bold" color="gray.800" textTransform="capitalize" position="sticky" left="0" bg="white">{category}</Th>
                                        {
                                            months.map((value:number, month:number) => {
                                                categoryAmount = categoryAmount + (simpleExitReport.data?.data[category][month] ? simpleExitReport.data?.data[category][month] : 0);

                                                totalExitsByMonths[month] += simpleExitReport.data?.data[category][month] ? simpleExitReport.data?.data[category][month] : 0;
                                                totalExitsByMonths[13] += simpleExitReport.data?.data[category][month] ? simpleExitReport.data?.data[category][month] : 0;
                                                totalByMonths[month] += simpleExitReport.data?.data[category][month] ? simpleExitReport.data?.data[category][month] : 0;
                                                totalByMonths[13] += simpleExitReport.data?.data[category][month] ? simpleExitReport.data?.data[category][month] : 0;

                                                return(
                                                    <Th whiteSpace="nowrap" fontWeight="500" color={simpleExitReport.data?.data[category][month] > 0 ? 'green.400' : (simpleExitReport.data?.data[category][month] < 0 ? 'red.400' : 'gray.800')} key={`${category}-${month}-${simpleExitReport.data?.data[category][month]}`}>{
                                                        Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(simpleExitReport.data?.data[category][month] ? simpleExitReport.data?.data[category][month] : 0)
                                                    }</Th>
                                                )
                                            })
                                        }

                                        <Th whiteSpace="nowrap" fontWeight="500" color={categoryAmount > 0 ? 'green.400' : (categoryAmount < 0 ? 'red.400' : 'gray.800')} key={`${category}-total-${categoryAmount}`}>{
                                            Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(categoryAmount ? categoryAmount : 0)
                                        }</Th>
                                        <Th whiteSpace="nowrap" fontWeight="500" color={categoryResult > 0 ? 'green.400' : (categoryResult < 0 ? 'red.400' : 'gray.800')} key={`${category}-result-${categoryResult}`}>{
                                            Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(categoryResult ? categoryResult : 0)
                                        }</Th>
                                    </Tr>
                                )
                            })
                        }

                        <Tr>
                            <Th position="sticky" left="0" bg="white">Total de Saídas</Th>
                            {

                                totalExitsByMonths.map((value:number, index:number) => {
                                    console.log(totalExitsByMonths);
                                    if(index === 14){return;};
                                    return <Th whiteSpace="nowrap" color={value > 0 ? 'green.400' : (value < 0 ? 'red.400' : 'gray.800')} key={`exits-${index}-${value}}`}>{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(value)}</Th>
                                })
                            }
                        </Tr>


                        <Tr>
                            <Th color="gray.900" fontSize="sm" position="sticky" left="0"></Th>
                        </Tr>
                        <Tr>
                            <Th color="gray.900" fontSize="sm" position="sticky" left="0">ENTRADAS</Th>
                        </Tr>
                        {
                            Object.keys(simpleEntryReport.data?.data).map((category:string) => {
                                let categoryAmount = 0;

                                console.log(simpleEntryReport.data?.data[category]);
                                let categoryResult = Object.keys(simpleEntryReport.data?.data[category]).reduce((sumAmount, month, index) => {
                                    return sumAmount + simpleEntryReport.data?.data[category][month];
                                }, 0);

                                if(simpleExitReport.data?.data[category]){
                                    categoryResult = categoryResult + Object.keys(simpleExitReport.data?.data[category]).reduce((sumAmount, month, index) => {
                                        return sumAmount + simpleExitReport.data?.data[category][month];
                                    }, 0);
                                }

                                return (
                                    <Tr key={category}>
                                        <Th fontWeight="bold" color="gray.800" textTransform="capitalize" position="sticky" left="0" bg="white">{category}</Th>
                                        {
                                            months.map((value:number, month:number) => {
                                                categoryAmount = categoryAmount + (simpleEntryReport.data?.data[category][month] ? simpleEntryReport.data?.data[category][month] : 0);

                                                totalEntriesByMonths[month] += simpleEntryReport.data?.data[category][month] ? simpleEntryReport.data?.data[category][month] : 0;
                                                totalEntriesByMonths[13] += simpleEntryReport.data?.data[category][month] ? simpleEntryReport.data?.data[category][month] : 0;
                                                totalByMonths[month] += simpleEntryReport.data?.data[category][month] ? simpleEntryReport.data?.data[category][month] : 0;
                                                totalByMonths[13] += simpleEntryReport.data?.data[category][month] ? simpleEntryReport.data?.data[category][month] : 0;

                                                return(
                                                    <Th whiteSpace="nowrap" fontWeight="500" color={simpleEntryReport.data?.data[category][month] > 0 ? 'green.400' : (simpleEntryReport.data?.data[category][month] < 0 ? 'red.400' : 'gray.800')} key={`${category}-${month}-${simpleEntryReport.data?.data[category][month]}`}>{
                                                        Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(simpleEntryReport.data?.data[category][month] ? simpleEntryReport.data?.data[category][month] : 0)
                                                    }</Th>
                                                )
                                            })
                                        }

                                        <Th whiteSpace="nowrap" fontWeight="500" color={categoryAmount > 0 ? 'green.400' : (categoryAmount < 0 ? 'red.400' : 'gray.800')} key={`${category}-total-${categoryAmount}`}>{
                                            Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(categoryAmount ? categoryAmount : 0)
                                        }</Th>
                                        <Th whiteSpace="nowrap" fontWeight="500" color={categoryResult > 0 ? 'green.400' : (categoryResult < 0 ? 'red.400' : 'gray.800')} key={`${category}-result-${categoryResult}`}>{
                                            Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(categoryResult ? categoryResult : 0)
                                        }</Th>
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