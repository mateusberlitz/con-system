import { Divider, Flex, FormControl, HStack, Select as ChakraSelect, Spinner, Text, Th, Tr } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Board } from "../../../components/Board";
import { CompanySelectMaster } from "../../../components/CompanySelect/companySelectMaster";
import { MainBoard } from "../../../components/MainBoard";
import { Table } from "../../../components/Table";
import { quotaReportFilterData, useQuotaReport } from "../../../hooks/useQuotaReport";
import { useWorkingCompany } from "../../../hooks/useWorkingCompany";
import { api } from "../../../services/api";
import { newMonthsAmountArray } from "../../Financial/Reports/populateMonthAmountArray";

interface purchaseReport{
    cost: number;
    purchase_date: string;
}

interface saleReport{
    value: number;
    sale_date: string;
}

interface cancelReport{
    quotaSale: {
        value: number;
    };
    cancel_date: string;
}

export default function QuotasReport(){
    //const {permissions, profile} = useProfile();
    const workingCompany = useWorkingCompany();

    //const history = useHistory();

    const [years, setYears] = useState<Number[]>([]);
    const [selectedYear, setSelectedYear] = useState<string>('');

    const loadYears = async () => {
        const { data } = await api.get('/quotas_years');

        setYears(data);
    }

    useEffect(() => {
        loadYears();
    }, [])

    const dateObject = new Date;

    const [filter, setFilter] = useState<quotaReportFilterData>(() => {
        const data: quotaReportFilterData = {
            company: workingCompany.company?.id,
            year: dateObject.getFullYear().toString(),
        };
        
        return data;
    })

    function handleChangeYear(event:any){
        const newYear = (event?.target.value ? event?.target.value : selectedYear);

        setSelectedYear(newYear);

        const newFilter = filter;
        newFilter.year = newYear
        setFilter(newFilter);
    }

    const [page, setPage] = useState(1);

    const quotaReports = useQuotaReport(filter, page);

    const totalExitsByMonths = newMonthsAmountArray();
    const totalEntriesByMonths = newMonthsAmountArray();
    const totalByMonths = newMonthsAmountArray();

    return (
        <MainBoard sidebar="quotas" header={ <CompanySelectMaster/>}>
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

                    <Text fontWeight="bold">RELATÓRIO CONTEMPLADAS</Text>
                </HStack>

                <Divider mb="6"/>

                { quotaReports.isLoading ? (
                        <Flex justify="center">
                            <Spinner/>
                        </Flex>
                    ) : ( quotaReports.isError ? (
                        <Flex justify="center" mt="4" mb="4">
                            <Text>Erro listar as contas a pagar</Text>
                        </Flex>
                    ) : (quotaReports.data.length === 0) && (
                        <Flex justify="center">
                            <Text>Nenhuma pagamento encontrado.</Text>
                        </Flex>
                    ) ) 
                }

                {
                    (!quotaReports.isLoading && !quotaReports.error) && (
                        <Table header={[
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
                            {text: 'Soma', bold:true},
                        ]}>
                            <Tr>
                                <Th></Th>
                            </Tr>
                           
                            <Tr>
                                <Th fontWeight="bold" color="gray.800" textTransform="capitalize" position="sticky" left="0" bg="white">COMPRAS</Th>
                                {
                                    Object.keys(quotaReports.data.purchases).map((month:string, index:number) => {
                                        let monthTotal = 0;

                                        if(quotaReports.data.purchases[month] !== 0){
                                            monthTotal = quotaReports.data.purchases[month].reduce((sumAmount:number, purchase:purchaseReport) => {
                                                return sumAmount + purchase.cost;
                                            }, 0);
                                        }

                                        console.log(quotaReports.data.cancels[(parseInt(month) - 1).toString()]);

                                        // if(quotaReports.data.cancels[(parseInt(month) - 1).toString()] !== 0){
                                        //     monthTotal = monthTotal + quotaReports.data.cancels[(parseInt(month) - 1).toString()].reduce((sumAmount:number, cancel:cancelReport) => {
                                        //         return sumAmount + cancel.quotaSale.value;
                                        //     }, 0);
                                        // }

                                        totalByMonths[index + 1] += monthTotal;

                                        return <Th whiteSpace="nowrap" fontWeight="500" color={monthTotal === 0 ? 'gray.800' : 'red.400'} key={`${month}-${monthTotal}`}>{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(monthTotal)}</Th>
                                    })
                                }
                            </Tr>

                            <Tr>
                                <Th></Th>
                            </Tr>
                           
                            <Tr>
                                <Th fontWeight="bold" color="gray.800" textTransform="capitalize" position="sticky" left="0" bg="white">VENDAS</Th>
                                {
                                    Object.keys(quotaReports.data.sales).map((month:string, index:number) => {
                                        let monthTotal = 0;

                                        if(quotaReports.data.sales[month] !== 0){
                                            monthTotal = quotaReports.data.sales[month].reduce((sumAmount:number, sale:saleReport) => {
                                                return sumAmount + sale.value;
                                            }, 0);
                                        }

                                        totalByMonths[index + 1] += monthTotal;

                                        return <Th whiteSpace="nowrap" fontWeight="500" color={monthTotal === 0 ? 'gray.800' : 'green.400'} key={`${month}-${monthTotal}`}>{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(monthTotal)}</Th>
                                    })
                                }
                            </Tr>

                            {/* <Tr>
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
                            </Tr> */}
            
                        </Table>
                    )
                }
            </Board>
        </MainBoard>
    )
}