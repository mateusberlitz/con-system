import { Divider, Flex, FormControl, HStack, Select as ChakraSelect, Spinner, Text, Th, Tr } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Board } from "../../../components/Board";
import { Table } from "../../../components/Table";
import { useCompanies } from "../../../hooks/useCompanies";
import { useProfile } from "../../../hooks/useProfile";
import { RulesCommissionsReportFilterData, useRulesCommissionsReport } from "../../../hooks/useRulesCommissionsReport";
import { useWorkingBranch } from "../../../hooks/useWorkingBranch";
import { useWorkingCompany } from "../../../hooks/useWorkingCompany";
import { api } from "../../../services/api";

export default function RulesReport() {
    const { permissions, profile } = useProfile();
    const workingCompany = useWorkingCompany();
    const workingBranch = useWorkingBranch();

    const history = useHistory();

    const [years, setYears] = useState<Number[]>([]);
    const [selectedYear, setSelectedYear] = useState<string>('');

    const loadYears = async () => {
        const { data } = await api.get('/seller-commissions-report-years');

        setYears(data);
    }

    useEffect(() => {
        loadYears();
    }, [])

    const dateObject = new Date;

    const [filterRulesCommissionsReport, setFilterRulesCommissionsReport] = useState<RulesCommissionsReportFilterData>(() => {
        const data: RulesCommissionsReportFilterData = {
            company: workingCompany.company?.id,
            branch: workingBranch.branch?.id,
            year: dateObject.getFullYear().toString(),
        };
        
        return data;
    })

    const [page, setPage] = useState(1);

    const rulesCommissionsReport = useRulesCommissionsReport(filterRulesCommissionsReport, page);

    useEffect(() => {
        setFilterRulesCommissionsReport({...filterRulesCommissionsReport, company: workingCompany.company?.id, branch: workingBranch.branch?.id, year: selectedYear});
    }, [workingCompany, workingBranch, selectedYear]);

    function handleChangeYear(event:any){
        const newYear = (event?.target.value ? event?.target.value : selectedYear);

        setSelectedYear(newYear);
    }

    return (
            <Board mb="12">
                <HStack as="form" spacing="12" w="100%" mb="6" justifyContent="left">
                    <Text fontWeight="bold" w="100%" fontSize="13px">RELATÓRIO DE REGRAS</Text>

                    <FormControl display="flex" justifyContent="flex-end" minW="150px">
                        <ChakraSelect onChange={handleChangeYear} defaultValue={workingCompany.company?.id} h="45px" name="selected_company" maxW="200px" fontSize="sm" focusBorderColor="purple.600" bg="gray.400" variant="filled" _hover={{ bgColor: 'gray.500' }} size="lg" borderRadius="full">
                            {
                                years.map((year: Number) => {
                                    return (
                                        <option key={year.toString()} value={year.toString()} selected={selectedYear === year.toString()}>{year}</option>
                                    )
                                })
                            }
                        </ChakraSelect>
                    </FormControl>

                </HStack>

                <Divider mb="6" />
                    { rulesCommissionsReport.isLoading ? (
                            <Flex justify="center">
                                <Spinner/>
                            </Flex>
                        ) : ( rulesCommissionsReport.isError ? (
                            <Flex justify="center" mt="4" mb="4">
                                <Text>Erro listar as comissões das regras</Text>
                            </Flex>
                        ) : (rulesCommissionsReport.data?.data.length === 0) && (
                            <Flex justify="center">
                                <Text>Nenhuma comissão encontrada.</Text>
                            </Flex>
                        ) ) 
                    }

                {
                    (!rulesCommissionsReport.isLoading && !rulesCommissionsReport.error) && (
                        <Table header={[
                            { text: 'Regra', bold: true },
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
                            {
                                Object.keys(rulesCommissionsReport.data?.data).map((rule:string) => {
                                    return(
                                        <Tr key={`${rule}`}>
                                            <Th color="gray.900" fontSize="sm" position="sticky" bg="white" left="0" fontWeight={500} textTransform="capitalize">{rule}</Th>

                                            {
                                                Object.keys(rulesCommissionsReport.data?.data[rule]).map((month:string, index: number) => {
                                                    return <Th fontWeight="bold" whiteSpace="nowrap" color={rulesCommissionsReport.data?.data[rule][month] > 0 ? 'green.400' : (rulesCommissionsReport.data?.data[rule][month] < 0 ? 'red.400' : 'gray.800')} key={`${rule}-${month}-${rulesCommissionsReport.data?.data[rule][month]}`}>{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(rulesCommissionsReport.data?.data[rule][month])}</Th>
                                                })
                                            }
                                        </Tr>
                                    )
                                })
                            }
                            {/* <Tr>
                                <Th color="gray.900" fontSize="sm" position="sticky" left="0">Entradas</Th>
                                <Th color="green.400">R$58.000,00</Th>
                                <Th color="green.400">R$R$91.000,00</Th>
                                <Th color="green.400">R$102.000,00</Th>
                                <Th color="green.400">R$83.000,00</Th>
                                <Th color="green.400">R$R$145.000,00</Th>
                                <Th color="green.400">R$177.000,00</Th>
                                <Th color="green.400">R$198.000,00</Th>
                                <Th color="green.400">R$256.000,00</Th>
                                <Th color="green.400">R$102.000,00</Th>
                                <Th color="green.400">R$102.000,00</Th>
                                <Th color="green.400">R$102.000,00</Th>
                                <Th color="green.400">R$102.000,00</Th>
                            </Tr>
                            <Tr>
                                <Th></Th>
                            </Tr>
                            <Tr>
                                <Th color="gray.900" fontSize="sm" position="sticky" left="0">Estornos</Th>
                                <Th color="red.400">R$1.000,00</Th>
                                <Th color="red.400">R$5.000,00</Th>
                                <Th color="red.400">R$9.000,00</Th>
                                <Th color="red.400">R$83.000,00</Th>
                                <Th color="red.400">R$6.000,00</Th>
                                <Th color="red.400">R$8.000,00</Th>
                                <Th color="red.400">R$14.000,00</Th>
                                <Th color="red.400">R$11.000,00</Th>
                                <Th color="red.400">R$25.000,00</Th>
                                <Th color="red.400">R$13.000,00</Th>
                                <Th color="red.400">R$13.000,00</Th>
                                <Th color="red.400">R$13.000,00</Th>
                            </Tr>
                            <Tr>
                                <Th></Th>
                            </Tr>

                            <Tr>
                                <Th position="sticky" fontSize="sm" left="0" bg="white" color="black">TOTAL</Th>
                                <Th color="green.400">R$57.000,00</Th>
                                <Th color="green.400">R$57.000,00</Th>
                                <Th color="green.400">R$57.000,00</Th>
                                <Th color="green.400">R$57.000,00</Th>
                                <Th color="green.400">R$57.000,00</Th>
                                <Th color="green.400">R$57.000,00</Th>
                                <Th color="green.400">R$57.000,00</Th>
                                <Th color="green.400">R$57.000,00</Th>
                                <Th color="green.400">R$57.000,00</Th>
                                <Th color="green.400">R$57.000,00</Th>
                                <Th color="green.400">R$57.000,00</Th>
                                <Th color="green.400">R$57.000,00</Th>
                            </Tr> */}
                        </Table>
                    )
                }
            </Board>
    );
}