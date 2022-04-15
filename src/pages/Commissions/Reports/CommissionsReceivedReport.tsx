import { Divider, FormControl, HStack, Select as ChakraSelect, Spinner, Text, Th, Tr } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Board } from "../../../components/Board";
import { Table } from "../../../components/Table";
import { useCompanies } from "../../../hooks/useCompanies";
import { useProfile } from "../../../hooks/useProfile";
import { useSimpleReport } from "../../../hooks/useSimpleRepor";
import { TransactionsByAccountFilterData } from "../../../hooks/useTransactionsByAccount";
import { useWorkingBranch } from "../../../hooks/useWorkingBranch";
import { useWorkingCompany } from "../../../hooks/useWorkingCompany";
import { api } from "../../../services/api";

export default function CommissionsReceivedReport() {
    const { permissions, profile } = useProfile();
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

    const companies = useCompanies();

    const [page, setPage] = useState(1);

    const simpleExitReport = useSimpleReport(filterExitTransactions, page);
    const simpleEntryReport = useSimpleReport(filterEntryTransactions, page);

    return (
            <Board mb="12">
                <HStack as="form" spacing="12" w="100%" mb="6" justifyContent="left">
                    <Text fontWeight="bold" w="100%">RELATÓRIO DE COMISSÕES RECEBIDAS</Text>

                    <FormControl display="flex" justifyContent="flex-end" align="flex-end" minW="150px">
                        <ChakraSelect defaultValue={workingCompany.company?.id} h="45px" name="selected_company" maxW="200px" fontSize="sm" focusBorderColor="purple.600" bg="gray.400" variant="filled" _hover={{ bgColor: 'gray.500' }} size="lg" borderRadius="full">
                            {
                                years.map((year: Number) => {
                                    return (
                                        <option key={year.toString()} value={year.toString()}>{year}</option>
                                    )
                                })
                            }
                        </ChakraSelect>
                    </FormControl>

                </HStack>

                <Divider mb="6" />

                {
                    (!simpleExitReport.isLoading && !simpleExitReport.error && !simpleEntryReport.isLoading && !simpleEntryReport.error) && (
                        <Table header={[
                            { text: 'Tipo', bold: true },
                            { text: 'Janeiro' },
                            { text: 'Fevereiro' },
                            { text: 'Março' },
                            { text: 'Abril' },
                            { text: 'Maio' },
                            { text: 'Junho' },
                            { text: 'Julho' },
                            { text: 'Agosto' },
                            { text: 'Setembro' },
                            { text: 'Outubro' },
                            { text: 'Novembro' },
                            { text: 'Dezembro' },
                        ]}>
                            <Tr>
                                <Th></Th>
                            </Tr>
                            <Tr>
                                <Th color="gray.900" fontSize="sm" position="sticky" left="0">Entradas</Th>
                            </Tr>
                            <Tr>
                                <Th></Th>
                            </Tr>
                            <Tr>
                                <Th color="gray.900" fontSize="sm" position="sticky" left="0">Estornos</Th>
                            </Tr>
                            {
                                Object.keys(simpleExitReport.data?.data).map((category: string) => {
                                    let categoryAmount = 0;

                                    //console.log(simpleExitReport.data?.data[category]);
                                    let categoryResult = Object.keys(simpleExitReport.data?.data[category]).reduce((sumAmount, month, index) => {
                                        return sumAmount + simpleExitReport.data?.data[category][month];
                                    }, 0)

                                    if (simpleEntryReport.data?.data[category]) {
                                        categoryResult = categoryResult + Object.keys(simpleEntryReport.data?.data[category]).reduce((sumAmount, month, index) => {
                                            return sumAmount + simpleEntryReport.data?.data[category][month];
                                        }, 0);
                                    }

                                    return (
                                        <Tr key={category}>
                                            <Th fontWeight="bold" color="gray.800" textTransform="capitalize" position="sticky" left="0" bg="white">{category}</Th>
                                            return(
                                            <Th whiteSpace="nowrap" fontWeight="500">{
                                                <Text>Teste</Text>
                                            }</Th>
                                            )
                                            )

                                            <Th whiteSpace="nowrap" fontWeight="500" color={categoryAmount > 0 ? 'green.400' : (categoryAmount < 0 ? 'red.400' : 'gray.800')} key={`${category}-total-${categoryAmount}`}>{
                                                Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(categoryAmount ? categoryAmount : 0)
                                            }</Th>
                                            <Th whiteSpace="nowrap" fontWeight="500" color={categoryResult > 0 ? 'green.400' : (categoryResult < 0 ? 'red.400' : 'gray.800')} key={`${category}-result-${categoryResult}`}>{
                                                Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(categoryResult ? categoryResult : 0)
                                            }</Th>
                                        </Tr>
                                    )
                                })
                            }
                            {
                                Object.keys(simpleEntryReport.data?.data).map((category: string) => {
                                    let categoryAmount = 0;

                                    console.log(simpleEntryReport.data?.data[category]);
                                    let categoryResult = Object.keys(simpleEntryReport.data?.data[category]).reduce((sumAmount, month, index) => {
                                        return sumAmount + simpleEntryReport.data?.data[category][month];
                                    }, 0);

                                    if (simpleExitReport.data?.data[category]) {
                                        categoryResult = categoryResult + Object.keys(simpleExitReport.data?.data[category]).reduce((sumAmount, month, index) => {
                                            return sumAmount + simpleExitReport.data?.data[category][month];
                                        }, 0);
                                    }

                                    return (
                                        <Tr key={category}>
                                            <Th fontWeight="bold" color="gray.800" textTransform="capitalize" position="sticky" left="0" bg="white">{category}</Th>
                                            return(
                                            <Th whiteSpace="nowrap" fontWeight="500">{
                                                <Text>Teste2</Text>
                                            }</Th>
                                            )
                                            )


                                            <Th whiteSpace="nowrap" fontWeight="500" color={categoryAmount > 0 ? 'green.400' : (categoryAmount < 0 ? 'red.400' : 'gray.800')} key={`${category}-total-${categoryAmount}`}>{
                                                Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(categoryAmount ? categoryAmount : 0)
                                            }</Th>
                                            <Th whiteSpace="nowrap" fontWeight="500" color={categoryResult > 0 ? 'green.400' : (categoryResult < 0 ? 'red.400' : 'gray.800')} key={`${category}-result-${categoryResult}`}>{
                                                Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(categoryResult ? categoryResult : 0)
                                            }</Th>
                                        </Tr>
                                    )
                                })
                            }
                            <Tr>
                                <Th></Th>
                            </Tr>

                            <Tr>
                                <Th position="sticky" fontSize="sm" left="0" bg="white" color="black">TOTAL</Th>
                            </Tr>
                        </Table>
                    )
                }


            </Board>
    );
}