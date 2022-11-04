import { Divider, Flex, FormControl, HStack, Select as ChakraSelect, Spinner, Text, Th, Tr } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Board } from "../../../components/Board";
import { Table } from "../../../components/Table";
import { useCompanies } from "../../../hooks/useCompanies";
import { CompanyCommissionsReportFilterData, useCompanyCommissionsReport } from "../../../hooks/useCompanyCommissionsReport";
import { useProfile } from "../../../hooks/useProfile";
import { useWorkingBranch } from "../../../hooks/useWorkingBranch";
import { useWorkingCompany } from "../../../hooks/useWorkingCompany";
import { api } from "../../../services/api";

export default function CommissionsReceivedReport() {
    const { permissions, profile } = useProfile();
    const workingCompany = useWorkingCompany();
    const workingBranch = useWorkingBranch();
    const dateObject = new Date;

    const history = useHistory();

    const [years, setYears] = useState<Number[]>([]);
    const [selectedYear, setSelectedYear] = useState<string>(dateObject.getFullYear().toString());

    const loadYears = async () => {
        const { data } = await api.get('/company-commissions-report-years');

        setYears(data);
    }

    useEffect(() => {
        loadYears();
    }, []);

    const companies = useCompanies();

    const [filterCompanyCommissionsReport, setFilterCompanyCommissionsReport] = useState<CompanyCommissionsReportFilterData>(() => {
        const data: CompanyCommissionsReportFilterData = {
            company: workingCompany.company?.id,
            branch: workingBranch.branch?.id,
            year: dateObject.getFullYear().toString(),
        };
        
        return data;
    })

    const [page, setPage] = useState(1);

    const companyCommissionsReport = useCompanyCommissionsReport(filterCompanyCommissionsReport, page);

    useEffect(() => {
        setFilterCompanyCommissionsReport({...filterCompanyCommissionsReport, company: workingCompany.company?.id, branch: workingBranch.branch?.id, year: selectedYear});
    }, [workingCompany, workingBranch, selectedYear]);

    function handleChangeYear(event:any){
        const newYear = (event?.target.value ? event?.target.value : selectedYear);

        setSelectedYear(newYear);
    }

    console.log(selectedYear);

    return (
            <Board mb="12">
                <HStack as="form" spacing="12" w="100%" mb="6" justifyContent="left">
                    <Text fontWeight="bold" w="100%" fontSize="13px">RELATÓRIO DE COMISSÕES RECEBIDAS</Text>

                    <FormControl display="flex" justifyContent="flex-end" minW="150px">
                        <ChakraSelect onChange={handleChangeYear} defaultValue={selectedYear} h="45px" name="selected_company" maxW="200px" fontSize="sm" focusBorderColor="purple.600" bg="gray.400" variant="filled" _hover={{ bgColor: 'gray.500' }} size="lg" borderRadius="full">
                            <option key={"2021"} value={"2021"}>2021</option>
                            {
                                years.map((year: Number) => {
                                    console.log(year.toString());
                                    return (
                                        <option key={year.toString()} value={year.toString()} selected={selectedYear === year.toString()}>{year}</option>
                                    )
                                })
                            }
                        </ChakraSelect>
                    </FormControl>

                </HStack>

                <Divider mb="6" />

                { companyCommissionsReport.isLoading ? (
                        <Flex justify="center">
                            <Spinner/>
                        </Flex>
                    ) : ( companyCommissionsReport.isError ? (
                        <Flex justify="center" mt="4" mb="4">
                            <Text>Erro listar as comissões recebidas</Text>
                        </Flex>
                    ) : (companyCommissionsReport.data?.data.length === 0) && (
                        <Flex justify="center">
                            <Text>Nenhuma comissão encontrada.</Text>
                        </Flex>
                    ) ) 
                }

                {
                    (!companyCommissionsReport.isLoading && !companyCommissionsReport.error) && (

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
                                <Th color="gray.900" fontSize="sm" position="sticky" bg="white" left="0" fontWeight={500} textTransform="capitalize">Entradas</Th>
                                {
                                    Object.keys(companyCommissionsReport.data?.data.company_commissions).map((month:string) => {
                                        return (
                                            <Th color="green.400">{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(companyCommissionsReport.data?.data.company_commissions[month])}</Th>
                                        )
                                    })
                                }
                            </Tr>
                            <Tr>
                                <Th color="gray.900" fontSize="sm" position="sticky" bg="white" left="0" fontWeight={500} textTransform="capitalize">Estornos</Th>
                                {
                                    Object.keys(companyCommissionsReport.data?.data.company_chargeback_commissions).map((month:string) => {
                                        return (
                                            <Th color="red.400">{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(companyCommissionsReport.data?.data.company_chargeback_commissions[month])}</Th>
                                        )
                                    })
                                }
                            </Tr>

                            <Tr>
                                <Th color="gray.900" fontSize="sm" position="sticky" bg="white" left="0" fontWeight={500} textTransform="capitalize">TOTAL</Th>
                                {
                                    Object.keys(companyCommissionsReport.data?.data.totals).map((month:string) => {
                                        return (
                                            <Th color="green.400">{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(companyCommissionsReport.data?.data.totals[month])}</Th>
                                        )
                                    })
                                }
                            </Tr>
                        </Table>
                    )
                }
            </Board>
    );
}