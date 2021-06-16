import { Text, Stack,Flex, Spinner, HStack } from "@chakra-ui/react";
import { UseQueryResult } from "react-query";
import { SolidButton } from "../../components/Buttons/SolidButton";
import { Payment } from "../../types";
import { formatDate } from "../../utils/Date/formatDate";
import { formatYmdDate } from "../../utils/Date/formatYmdDate";
import { getDay } from "../../utils/Date/getDay";
import { PayPaymentFormData } from "./Payments/PayPaymentModal";


import { ReactComponent as EllipseIcon } from '../../assets/icons/Ellipse.svg';
import { ReactComponent as AttachIcon } from '../../assets/icons/Attach.svg';
import { ReactComponent as CheckIcon } from '../../assets/icons/Check.svg';
import { formatBRDate } from "../../utils/Date/formatBRDate";

interface PaymentsSummaryProps{
    payments: UseQueryResult<{
        data: any;
        total: number;
    }, unknown>;
    openPayPayment: (toPayPaymentData: PayPaymentFormData) => void;
}

export function PaymentsSummary({payments, openPayPayment}: PaymentsSummaryProps){
    return (
        <>
        
                <Stack w="55%" min-width="300px" justify="space-between" alignItems="left" bg="white" borderRadius="16px" shadow="xl" px="8" py="8">
                    <Text fontSize="xl" mb="8" w="100%">Contas a Pagar</Text>

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
                                <Text>Nenhum pagamento para hoje.</Text>
                            </Flex>
                        ) ) 
                    }

                    {
                        (!payments.isLoading && !payments.error) && Object.keys(payments.data?.data).map((day:string) => {
                            const totalDayAmount = payments.data?.data[day].reduce((sumAmount:number, payment:Payment) => {
                                return sumAmount + payment.value;
                            }, 0);

                            const todayFormatedDate = formatDate(formatYmdDate(new Date().toDateString()));
                            const dayCashFlowsFormated = formatDate(day);
                            const tomorrow = getDay(formatYmdDate(new Date().toDateString())) + 1;
                            const cashFlowDay = getDay(day);

                            return (
                                <Stack w="100%" border="2px" borderColor="gray.500" borderRadius="26" overflow="hidden" spacing="0" allowMultiple>
                                    <HStack spacing="8" w="100%" justify="space-between" paddingX="8" paddingY="3" bg="gray.200">
                                        <Text fontWeight="bold">{(todayFormatedDate === dayCashFlowsFormated) ? 'Hoje' : (tomorrow === cashFlowDay) ? "Amanhã" : ""} {formatBRDate(day)}</Text>

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
                                        payments.data?.data[day].map((payment:Payment) => {

                                            return (
                                                <HStack key={payment.id} justifyContent="space-between" borderTop="2px" borderColor="gray.500" px="8" py="4">
                                                    <Flex fontWeight="500" alignItems="center" opacity={payment.status ? 0.5 : 1}>
                                                        <EllipseIcon stroke="none" fill={payment.category?.color}/>
                                                        <Text ml="2" color={payment.category?.color}>{payment.title}</Text>
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
        </>

        
    )
}