import { Flex, Grid, HStack, SimpleGrid, Stack, Text } from "@chakra-ui/layout";
import { Select as ChakraSelect } from "@chakra-ui/react";
import { Spinner } from "@chakra-ui/spinner";
import { useState } from "react";
import { SolidButton } from "../../components/Buttons/SolidButton";
import { MainBoard } from "../../components/MainBoard";
import { PaymentFilterData, usePayments } from "../../hooks/usePayments";
import { useWorkingCompany } from "../../hooks/useWorkingCompany";
import { Company } from "../../types";
import { formatYmdDate } from "../../utils/Date/formatYmdDate";
import { PayPaymentFormData, PayPaymentModal } from "./Payments/PayPaymentModal";
import { PaymentsSummary } from "./PaymentsSummary";
import { TasksSummary } from "./TasksSummary";
import { CashSummary } from "./CashSummary";

import { HasPermission, useProfile } from "../../hooks/useProfile";
import { BillFilterData, useBills } from "../../hooks/useBills";
import { ReceiveBillFormData, ReceiveBillModal } from "./Bills/ReceiveBillModal";
import { BillsSummary } from "./BillsSummary";
import { PendenciesSummary } from "./PendenciesSummary";
import { useCompanies } from "../../hooks/useCompanies";
import { FormControl } from "@chakra-ui/react";
import { CashFlowsFilterData, useCashFlows } from "../../hooks/useCashFlows";
import { TaskFilterData, useTasks } from "../../hooks/useTasks";


export default function Financial(){
    const { profile, permissions } = useProfile();
    const workingCompany = useWorkingCompany();

    const [filter, setFilter] = useState<PaymentFilterData>(() => {
        const data: PaymentFilterData = {
            search: '',
            start_date: formatYmdDate(new Date().toString()),
            end_date: formatYmdDate(new Date().toString()),
            status: 0,
            group_by: 'company',
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
            value: 0,
            paid: 0,
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
            start_date: formatYmdDate(new Date().toString()),
            end_date: formatYmdDate(new Date().toString()),
            status: 0,
            group_by: 'company',
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
            value: 0,
            paid: 0,
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
            end_date: formatYmdDate(new Date().toString()),
            status: 0,
            group_by: 'company',
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

    //const cashFlows = useCashFlows(filterCashFlow, 5, 1);


    const [page, setPage] = useState(1);

    const handleChangePage = (page: number) => {
        setPage(page);
    }

    const [tasksFilter, setTasksFilter] = useState<TaskFilterData>(() => {
        const data: TaskFilterData = {
            search: '',
            company: workingCompany.company?.id,
            author: (profile ? profile.id : 0),
        };
        
        return data;
    })

    const tasks = useTasks(tasksFilter, page);

    const companies = useCompanies();

    function handleChangeCompany(event:any){
        let selectedCompanyId: number | undefined;

        if(event.target.value === ''){
            selectedCompanyId = event.target.value;
            workingCompany.changeCompany(event.target.value);
        }else{
            selectedCompanyId = (event?.target.value ? event?.target.value : 1);
            const selectedCompanyData = companies.data.filter((company:Company) => Number(company.id) === Number(selectedCompanyId))[0]
            workingCompany.changeCompany(selectedCompanyData);
        }

        // const selectedCompanyId = (event?.target.value ? event?.target.value : 1);
        // const selectedCompanyData = companies.data.filter((company:Company) => Number(company.id) === Number(selectedCompanyId))[0]
        // workingCompany.changeCompany(selectedCompanyData);

        //filtro das contas a receber
        const updatedFilterBills = filterBills;
        updatedFilterBills.company = selectedCompanyId;

        setFilterBills(updatedFilterBills);

        // //filtro dos pagamentos
        const updatedFilterPayments = filter;
        updatedFilterPayments.company = selectedCompanyId;

        setFilter(updatedFilterPayments);

        // //filtro de tarefas
        const updatedTasksFilter = tasksFilter;
        updatedTasksFilter.company = selectedCompanyId;

        setTasksFilter(updatedTasksFilter);

        // //filtro dos pagamentos pendentes
        // const updatedFilterPendencies = filterPendencies;
        // updatedFilterPendencies.company = selectedCompanyId;

        // setFilterPendencies(updatedFilterPendencies);

        // //filtro do fluxo de caixa
        // const updatedFilterCashFlow = filterCashFlow;
        // updatedFilterCashFlow.company = selectedCompanyId;

        // setFilterCashFlow(updatedFilterCashFlow);
    }

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
                                {profile.role.name === "Diretor" && <option value="">Todas as empresas</option>}

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
                    

                    <Stack spacing="8" w="45%">
                        <TasksSummary tasks={tasks} page={page} setPage={handleChangePage}/>

                        {
                            HasPermission(permissions, 'Financeiro Completo') && (
                                <CashSummary/>
                            )
                        }
                    </Stack>
                </HStack>

            </Stack>
        </MainBoard>
    );
}