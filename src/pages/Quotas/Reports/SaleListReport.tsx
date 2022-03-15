import { Accordion, AccordionButton, AccordionItem, AccordionPanel, Divider, Flex, FormControl, HStack, Select as ChakraSelect, Spinner, Text, Th, Tr } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Board } from "../../../components/Board";
import { CompanySelectMaster } from "../../../components/CompanySelect/companySelectMaster";
import { MainBoard } from "../../../components/MainBoard";
import { Table } from "../../../components/Table";
import { quotaReportFilterData, useQuotaReport } from "../../../hooks/useQuotaReport";
import { QuotaSaleFilterData, useQuotaSales } from "../../../hooks/useQuotaSales";
import { useWorkingBranch } from "../../../hooks/useWorkingBranch";
import { useWorkingCompany } from "../../../hooks/useWorkingCompany";
import { api } from "../../../services/api";
import { Quota, QuotaSale } from "../../../types";
import { formatBRDate } from "../../../utils/Date/formatBRDate";
import { newMonthsAmountArray } from "../../Financial/Reports/populateMonthAmountArray";
import { SaleListReportMonthItem } from "./SaleListReportMonthItem";

interface purchaseReport{
    cost: number;
    purchase_date: string;
}

interface saleReport{
    value: number;
    sale_date: string;
}

interface cancelReport{
    quota_sale: {
        value: number;
    };
    cancel_date: string;
}

export default function SaleListReport(){
    const workingCompany = useWorkingCompany();
    const workingBranch = useWorkingBranch();

    const [years, setYears] = useState<Number[]>([]);
    const [selectedYear, setSelectedYear] = useState<string>('');

    const loadYears = async () => {
        const { data } = await api.get('/ready_quotas_years');

        setYears(data);
    }

    useEffect(() => {
        loadYears();
    }, [])

    const dateObject = new Date;

    function handleChangeYear(event:any){
        const newYear = (event?.target.value ? event?.target.value : selectedYear);

        setSelectedYear(newYear);

        const newFilter = filter;
        newFilter.year = newYear
        setFilter(newFilter);
    }

    const [filter, setFilter] = useState<QuotaSaleFilterData>(() => {
        const data: QuotaSaleFilterData = {
            search: '',
            company: workingCompany.company?.id,
            branch: workingBranch.branch?.id,
            group_by: 'month',
            status: 0,
        };
        
        return data;
    });

    function handleChangeFilter(newFilter: QuotaSaleFilterData){
        setFilter(newFilter);
    }

    const [page, setPage] = useState(1);

    const quotaSales = useQuotaSales(filter, page);

    useEffect(() => {
        setFilter({...filter, company: workingCompany.company?.id, branch: workingBranch.branch?.id});
    }, [workingCompany, workingBranch]);

    return (
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

                <Text fontWeight="bold">RELATÓRIO DE VENDAS</Text>
            </HStack>

            <Divider mb="6"/>

            { quotaSales.isLoading ? (
                    <Flex justify="center">
                        <Spinner/>
                    </Flex>
                ) : ( quotaSales.isError ? (
                    <Flex justify="center" mt="4" mb="4">
                        <Text>Erro listar as vendas</Text>
                    </Flex>
                ) : (quotaSales.data?.data.length === 0) && (
                    <Flex justify="center">
                        <Text>Nenhuma venda encontrado.</Text>
                    </Flex>
                ) ) 
            }

            {
                (!quotaSales.isLoading && !quotaSales.data?.data.error && quotaSales.data?.data.length !== 0) && (

                    <Accordion allowMultiple>
                        <Table header={[
                                {text: 'Data', bold: true},
                                {text: 'Cota'},
                                {text: 'Lucro'},
                                {text: 'Valor da venda'},
                                {text: 'Segmento'},
                                {text: 'Crédito'},
                                {text: 'Custo Total'},
                                {text: 'Custo do parceiro'},
                                {text: 'Ganho do parceiro'},
                                {text: 'Coordenador'},
                                {text: 'Supervisor'},
                                {text: 'Vendedor'},
                                {text: 'Comprador'},
                            ]}>

                            <Tr>
                                <Th></Th>
                            </Tr>

                            {
                                Object.keys(quotaSales.data?.data).map((month:string, index:number) => {
                                    console.log(index);
                                    return (
                                        <SaleListReportMonthItem open={index === 0 ? true : false} month={month} quotaSales={quotaSales.data?.data[month]}/>

                                        // <AccordionItem>
                                        //     <AccordionButton p="0" height="fit-content" w="auto">
                                        //         <Tr>
                                        //             <Th color="gray.900">{month}</Th>
                                        //         </Tr>
                                        //     </AccordionButton>

                                        //     <AccordionPanel>
                                        //     {
                                        //         quotaSales.data?.data[month].map((quotaSale:QuotaSale) => (
                                        //             <Tr>
                                        //                 <Th color="gray.800" fontWeight="normal">{formatBRDate(quotaSale.sale_date)}</Th>
                                        //                 <Th color="gray.800" fontWeight="normal">{quotaSale.quota.group}-{quotaSale.quota.quota}</Th>
                                        //                 <Th color="green.400" fontWeight="normal">{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(quotaSale.value - quotaSale.quota.cost - quotaSale.partner_value - (quotaSale.coordinator_value ? quotaSale.coordinator_value : 0) - (quotaSale.supervisor_value ? quotaSale.supervisor_value : 0))}</Th>
                                        //                 <Th color="gray.800" fontWeight="normal">{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(quotaSale.value)}</Th>
                                        //                 <Th color="gray.800" fontWeight="normal">{quotaSale.quota.segment}</Th>
                                        //                 <Th color="gray.800" fontWeight="normal">{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(quotaSale.quota.credit)}</Th>
                                        //                 <Th color="gray.800" fontWeight="normal">{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(quotaSale.quota.total_cost)}</Th>
                                        //                 <Th color="gray.800" fontWeight="normal">{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(quotaSale.quota.partner_cost ? quotaSale.quota.partner_cost : 0)}</Th>
                                        //                 <Th color="gray.800" fontWeight="normal">{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(quotaSale.partner_value && quotaSale.quota.partner_cost ? (quotaSale.partner_value - quotaSale.quota.partner_cost) : 0)}</Th>
                                        //                 <Th color="gray.800" fontWeight="normal">{quotaSale.coordinator ? quotaSale.coordinator : '--'}<br />{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(quotaSale.coordinator_value ? quotaSale.coordinator_value : 0)}</Th>
                                        //                 <Th color="gray.800" fontWeight="normal">{quotaSale.supervisor ? quotaSale.supervisor : '--'}<br />{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(quotaSale.supervisor_value ? quotaSale.supervisor_value : 0)}</Th>
                                        //                 <Th color="gray.800" fontWeight="normal">{quotaSale.seller}</Th>
                                        //                 <Th color="gray.800" fontWeight="normal">{quotaSale.buyer}</Th>
                                        //             </Tr>
                                        //         ))
                                        //     }
                                        //         <Tr>
                                        //             <Th>Janeiro</Th>
                                        //         </Tr>
                                        //     </AccordionPanel>
                                        // </AccordionItem>
                                    )
                                })
                            }

                            
                                    
                        </Table>
                    </Accordion>

                )
            }
        </Board>
    )
}