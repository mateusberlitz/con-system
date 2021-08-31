import { Text, Stack,Flex, Spinner, HStack } from "@chakra-ui/react";
import { UseQueryResult } from "react-query";
import { SolidButton } from "../../components/Buttons/SolidButton";
import { Payment } from "../../types";
import { formatDate } from "../../utils/Date/formatDate";
import { formatYmdDate } from "../../utils/Date/formatYmdDate";
import { getDay } from "../../utils/Date/getDay";
import { ReceiveBillFormData } from "./Bills/ReceiveBillModal";


import { ReactComponent as EllipseIcon } from '../../assets/icons/Ellipse.svg';
import { ReactComponent as AttachIcon } from '../../assets/icons/Attach.svg';
import { ReactComponent as CheckIcon } from '../../assets/icons/Check.svg';
import { formatBRDate } from "../../utils/Date/formatBRDate";
import { HasPermission, useProfile } from "../../hooks/useProfile";
import { CompanySelect } from "../../components/CompanySelect";
import { BillFilterData } from "../../hooks/useBills";
import { PaymentFilterData, usePayments } from "../../hooks/usePayments";
import { PayPaymentFormData } from "./Payments/PayPaymentModal";
import { useWorkingCompany } from "../../hooks/useWorkingCompany";
import { useState } from "react";

interface PendenciesSummaryProps{
    // bills: UseQueryResult<{
    //     data: any;
    //     total: number;
    // }, unknown>;
    // billFilter: BillFilterData;
    // handleChangeBillFilter: (newFilterValue: BillFilterData) => void;
    // openReceiveBill: (toPayPaymentData: ReceiveBillFormData) => void;

    payments: UseQueryResult<{
        data: any;
        total: number;
    }, unknown>;
    paymentFilter: PaymentFilterData;
    handleChangePaymentFilter: (newFilterValue: PaymentFilterData) => void;
    openPayPayment: (toPayPaymentData: PayPaymentFormData) => void;
}

export function PendenciesSummary({payments, paymentFilter, openPayPayment, handleChangePaymentFilter}: PendenciesSummaryProps){
    // const {permissions} = useProfile();

    // const workingCompany = useWorkingCompany();

    // const [filter, setFilter] = useState<PaymentFilterData>(() => {
    //     const data: PaymentFilterData = {
    //         search: '',
    //         company: workingCompany.company?.id,
    //         end_date: formatYmdDate(new Date().toString()),
    //         status: 0
    //     };
        
    //     return data;
    // })

    // function handleChangeFilter(newFilter: PaymentFilterData){
    //     setFilter(newFilter);
    // }

    // const payments = usePayments(filter, 1);

    return (
        <Stack w="100%" spacing="6" min-width="300px" justify="space-between" alignItems="left" bg="white" borderRadius="16px" shadow="xl" px="8" py="8">
                    <HStack>
                        <Text fontSize="xl" mb="4" w="100%">Pendências</Text>
                        {/* {
                            ( ( permissions && HasPermission(permissions, 'Todas Empresas')) && <CompanySelect searchFilter={filter} setFilter={handleChangeFilter} mt="-35px !important"/> )
                        } */}
                    </HStack>
                    

                    {   payments.isLoading ? (
                            <Flex justify="left">
                                <Spinner/>
                            </Flex>
                        ) : ( payments.isError ? (
                            <Flex justify="left" mt="4" mb="4">
                                <Text>Erro listar os pagamentos</Text>
                            </Flex>
                        ) : (payments.data?.data.length === 0) && (
                            <Flex justify="left">
                                <Text>Nenhuma pendência encontrada.</Text>
                            </Flex>
                        ) ) 
                    }

                    {
                        (!payments.isLoading && !payments.error) && Object.keys(payments.data?.data).map((company:string) => {
                            const totalDayAmount = payments.data?.data[company].reduce((sumAmount:number, payment:Payment) => {
                                return sumAmount + payment.value;
                            }, 0);

                            const companyName = payments.data?.data[company][0].company.name;

                            return (
                                <Stack key={company} w="100%" border="2px" borderColor="gray.500" borderRadius="26" overflow="hidden" spacing="0">
                                    <HStack spacing="8" w="100%" justify="space-between" paddingX="8" paddingY="3" bg="gray.200">
                                        <Text fontWeight="bold" color="orange.400">{companyName}</Text>

                                        <Flex alignItems="center" float="right" color={totalDayAmount > 0 ? 'green.400' : 'red.400'}>
                                            {/* {totalDayAmount > 0 
                                                ? <StrongPlusIcon stroke="#48bb78" fill="none" width="12px"/> 
                                                : <MinusIcon stroke="#c30052" fill="none" width="12px"/>
                                            } */}
                                            <Text fontWeight="bold" ml="2">
                                                {Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(totalDayAmount)}
                                            </Text>
                                        </Flex>
                                    </HStack>

                                    {
                                        payments.data?.data[company].map((payment:Payment) => {

                                            return (
                                                <HStack key={payment.id} justifyContent="space-between" borderTop="2px" borderColor="gray.500" px="8" py="4">
                                                    <Flex fontWeight="500" alignItems="center" opacity={payment.status ? 0.5 : 1}>
                                                        <EllipseIcon stroke="none" fill="#f24e1e"/>
                                                        <Text ml="2" color="orange.400">{payment.title}</Text>
                                                    </Flex>

                                                    <Flex fontWeight="medium" alignItems="center" color="gray.900" _hover={{textDecor:"underline", cursor: "pointer"}}>
                                                        <AttachIcon stroke="#4e4b66" fill="none" width="16px"/>
                                                        <Text ml="2">Anexar</Text>
                                                    </Flex>

                                                    <Flex>
                                                        <HStack fontWeight="bold" spacing="7">
                                                            {
                                                                payment.status ? (
                                                                    <Flex fontWeight="bold" alignItems="center" color="green.400">
                                                                        <CheckIcon stroke="#48bb78" fill="none" width="16px"/>
                                                                        <Text ml="2">Pago</Text>
                                                                    </Flex>
                                                                ) : (
                                                                    <SolidButton isDisabled={payment.status}  onClick={() => openPayPayment({ id: payment.id, title: payment.title , value: payment.value.toString(), new_value: ''}) }
                                                                        h="30px" size="sm" color="white" bg="green.400" colorScheme="green" fontSize="11">
                                                                        Pagar
                                                                    </SolidButton>
                                                                )
                                                            }

                                                            <Text opacity={payment.status ? 0.5 : 1} float="right">{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(payment.value)}</Text>
                                                        </HStack>
                                                    </Flex>
                                                </HStack>
                                            )
                                        })
                                    }

                                    
                                </Stack>
                            )
                        })
                    }
                </Stack>
    )
}