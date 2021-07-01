import { Flex, Grid, HStack, SimpleGrid, Stack, Text } from "@chakra-ui/layout";
import { Select as ChakraSelect } from "@chakra-ui/react";
import { Spinner } from "@chakra-ui/spinner";
import { useState } from "react";
import { SolidButton } from "../../components/Buttons/SolidButton";
import { MainBoard } from "../../components/MainBoard";
import { PaymentFilterData, usePayments } from "../../hooks/usePayments";
import { useWorkingCompany } from "../../hooks/useWorkingCompany";
import { Company, Payment } from "../../types";
import { formatBRDate } from "../../utils/Date/formatBRDate";
import { formatDate } from "../../utils/Date/formatDate";
import { formatInputDate } from "../../utils/Date/formatInputDate";
import { formatYmdDate } from "../../utils/Date/formatYmdDate";
import { getDay } from "../../utils/Date/getDay";
import { PayPaymentFormData, PayPaymentModal } from "./Payments/PayPaymentModal";
import { NewTaskModal } from "../../pages/Tasks/NewTaskModal";
import { PaymentsSummary } from "./PaymentsSummary";
import { TasksSummary } from "./TasksSummary";
import { CashSummary } from "./CashSummary";
import { CashFlowSummary } from "./CashFlowSummary";

import { ReactComponent as EllipseIcon } from '../../assets/icons/Ellipse.svg';
import { IconButton } from "@chakra-ui/button";
import { TaskFilterData, useTasks } from "../../hooks/useTasks";
import { HasPermission, useProfile } from "../../hooks/useProfile";
import { BillFilterData, useBills } from "../../hooks/useBills";
import { ReceiveBillFormData, ReceiveBillModal } from "./Bills/ReceiveBillModal";
import { BillsSummary } from "./BillsSummary";
import { PendenciesSummary } from "./PendenciesSummary";
import { useCompanies } from "../../hooks/useCompanies";
import { FormControl } from "@chakra-ui/react";
import { CashFlowsFilterData, useCashFlows } from "../../hooks/useCashFlows";


export default function Financial(){
    const { permissions } = useProfile();
    const workingCompany = useWorkingCompany();
    console.log(formatInputDate(new Date().toString()));

    const [filter, setFilter] = useState<PaymentFilterData>(() => {
        const data: PaymentFilterData = {
            search: '',
            company: workingCompany.company?.id,
            start_date: formatYmdDate(new Date().toString()),
            end_date: formatYmdDate(new Date().toString()),
            status: 0
        };
        
        return data;
    })

    function handleChangeFilter(newFilter: PaymentFilterData){
        setFilter(newFilter);
    }

    const payments = usePayments(filter, 1);

    const [isPayPaymentModalOpen, setIsPayPaymentModalOpen] = useState(false);
    const [toPayPaymentData, setToPayPaymentData] = useState<PayPaymentFormData>(() => {

        const data: PayPaymentFormData = {
            id: 0,
            value: '',
            new_value: '',
            title: '',
            company: workingCompany.company?.id,
        };
        
        return data;
    });

    function OpenPayPaymentModal(paymentIdAndName: PayPaymentFormData){
        setToPayPaymentData(paymentIdAndName);
        setIsPayPaymentModalOpen(true);
    }
    function ClosePayPaymentModal(){
        setIsPayPaymentModalOpen(false);
    }

    

    //BILLS

    const [filterBills, setFilterBills] = useState<BillFilterData>(() => {
        const data: BillFilterData = {
            search: '',
            company: workingCompany.company?.id,
            start_date: formatYmdDate(new Date().toString()),
            end_date: formatYmdDate(new Date().toString()),
            status: 0
        };
        
        return data;
    })

    function handleChangeBillsFilter(newFilter: BillFilterData){
        setFilterBills(newFilter);
    }

    const bills = useBills(filter, 1);

    const [isReceiveBillModalOpen, setIsReceiveBillModalOpen] = useState(false);
    const [toReceiveBillData, setToReceiveBillData] = useState<ReceiveBillFormData>(() => {

        const data: ReceiveBillFormData = {
            id: 0,
            value: '',
            new_value: '',
            title: '',
            company: workingCompany.company?.id,
        };
        
        return data;
    });

    function OpenReceiveBillModal(paymentIdAndName: ReceiveBillFormData){
        setToReceiveBillData(paymentIdAndName);
        setIsReceiveBillModalOpen(true);
    }
    function CloseReceiveBillModal(){
        setIsReceiveBillModalOpen(false);
    }

    const [filterPendencies, setFilterPendencies] = useState<PaymentFilterData>(() => {
        const data: PaymentFilterData = {
            search: '',
            company: workingCompany.company?.id,
            end_date: formatYmdDate(new Date().toString()),
            status: 0
        };
        
        return data;
    })

    const pendencies = usePayments(filterPendencies, 1);


    const [filterCashFlow, setFilterCashFlow] = useState<CashFlowsFilterData>(() => {
        const data: CashFlowsFilterData = {
            search: '',
            company: workingCompany.company?.id,
        };
        
        return data;
    })

    const cashFlows = useCashFlows(filterCashFlow, 5, 1);




    const companies = useCompanies();

    function handleChangeCompany(event:any){
        const selectedCompanyId = (event?.target.value ? event?.target.value : 1);
        const selectedCompanyData = companies.data.filter((company:Company) => Number(company.id) === Number(selectedCompanyId))[0]
        workingCompany.changeCompany(selectedCompanyData);

        //filtro das contas a receber
        const updatedFilterBills = filterBills;
        updatedFilterBills.company = selectedCompanyId;

        setFilterBills(updatedFilterBills);

        //filtro dos pagamentos
        const updatedFilterPayments = filter;
        updatedFilterPayments.company = selectedCompanyId;

        setFilter(updatedFilterPayments);

        //filtro dos pagamentos pendentes
        const updatedFilterPendencies = filterPendencies;
        updatedFilterPendencies.company = selectedCompanyId;

        setFilterPendencies(updatedFilterPendencies);

        //filtro do fluxo de caixa
        const updatedFilterCashFlow = filterCashFlow;
        updatedFilterCashFlow.company = selectedCompanyId;

        setFilterCashFlow(updatedFilterCashFlow);
    }

    return(
        <MainBoard sidebar="financial" header={
            (
                ( companies.isLoading ? (
                    <Flex justify="center">
                        <Spinner/>
                    </Flex>
                ) : (
                        <HStack as="form" spacing="10" w="100%" mb="10">
                            <FormControl pos="relative">
                                <ChakraSelect onChange={handleChangeCompany} defaultValue={workingCompany.company?.id} h="45px" name="selected_company" w="100%" maxW="200px" fontSize="sm" focusBorderColor="purple.600" bg="gray.400" variant="filled" _hover={ {bgColor: 'gray.500'} } size="lg" borderRadius="full">
                                {companies.data && companies.data.map((company:Company) => {
                                    return (
                                        <option key={company.id} value={company.id}>{company.name}</option>
                                    )
                                })}
                                </ChakraSelect>
                            </FormControl>
                        </HStack>
                    ))
                )
        }>
            <Stack fontSize="13px" spacing="12">
                <PayPaymentModal afterPay={payments.refetch} toPayPaymentData={toPayPaymentData} isOpen={isPayPaymentModalOpen} onRequestClose={ClosePayPaymentModal}/>
                <ReceiveBillModal afterReceive={bills.refetch} toReceiveBillData={toReceiveBillData} isOpen={isReceiveBillModalOpen} onRequestClose={CloseReceiveBillModal}/>

                <HStack spacing="8" alignItems="flex-start">
                    {/* PAGAMENTOS */}
                    <Stack spacing="8" w="55%">
                        <PaymentsSummary payments={payments} openPayPayment={OpenPayPaymentModal} filter={filter} handleChangeFilter={handleChangeFilter}/>

                        <BillsSummary bills={bills} openReceiveBill={OpenReceiveBillModal} filter={filterBills} handleChangeFilter={handleChangeBillsFilter}/>
                    
                        <PendenciesSummary payments={pendencies} openPayPayment={OpenPayPaymentModal} paymentFilter={filter} handleChangePaymentFilter={handleChangeFilter}/>
                    </Stack>
                    

                    {/* TAREFAS */}
                    <TasksSummary/>
                </HStack>

                {
                    HasPermission(permissions, 'Financeiro Completo') && (
                        <>
                            <HStack spacing="8" alignItems="flex-start">
                                {/* CAIXA */}
                                <CashSummary/>

                                {/* FLUXO */}
                                <CashFlowSummary cashFlows={cashFlows}/>
                            </HStack>
                        </>
                    )
                }

            </Stack>
        </MainBoard>
    );
}