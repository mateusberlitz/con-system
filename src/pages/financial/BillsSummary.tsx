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
import { useProfile } from "../../hooks/useProfile";
import { CompanySelect } from "../../components/CompanySelect";
import { BillFilterData } from "../../hooks/useBills";

interface BillsSummaryProps{
    bills: UseQueryResult<{
        data: any;
        total: number;
    }, unknown>;
    filter: BillFilterData;
    handleChangeFilter: (newFilterValue: BillFilterData) => void;
    openReceiveBill: (toPayPaymentData: ReceiveBillFormData) => void;
}

export function BillsSummary({bills, openReceiveBill, filter, handleChangeFilter}: BillsSummaryProps){
    const {profile} = useProfile();

    return (
                <Stack w="100%" min-width="300px" justify="space-between" alignItems="left" bg="white" borderRadius="16px" shadow="xl" px="8" py="8">
                    <HStack>
                        <Text fontSize="xl" mb="8" w="100%">Contas a Receber</Text>
                        {
                            ( ( profile && profile.role.id === 1) && <CompanySelect searchFilter={filter} setFilter={handleChangeFilter} mt="-35px !important"/> )
                        }
                    </HStack>
                    

                    {   bills.isLoading ? (
                            <Flex justify="left">
                                <Spinner/>
                            </Flex>
                        ) : ( bills.isError ? (
                            <Flex justify="left" mt="4" mb="4">
                                <Text>Erro listar os pagamentos</Text>
                            </Flex>
                        ) : (bills.data?.data.length === 0) && (
                            <Flex justify="left">
                                <Text>Nenhum pagamento para hoje.</Text>
                            </Flex>
                        ) ) 
                    }

                    {
                        (!bills.isLoading && !bills.error) && Object.keys(bills.data?.data).map((day:string) => {
                            const totalDayAmount = bills.data?.data[day].reduce((sumAmount:number, payment:Payment) => {
                                return sumAmount + payment.value;
                            }, 0);

                            const todayFormatedDate = formatDate(formatYmdDate(new Date().toDateString()));
                            const dayCashFlowsFormated = formatDate(day);
                            const tomorrow = getDay(formatYmdDate(new Date().toDateString())) + 1;
                            const cashFlowDay = getDay(day);

                            return (
                                <Stack key={day} w="100%" border="2px" borderColor="gray.500" borderRadius="26" overflow="hidden" spacing="0">
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
                                        bills.data?.data[day].map((bills:Payment) => {

                                            return (
                                                <HStack key={bills.id} justifyContent="space-between" borderTop="2px" borderColor="gray.500" px="8" py="4">
                                                    <Flex fontWeight="500" alignItems="center" opacity={bills.status ? 0.5 : 1}>
                                                        <EllipseIcon stroke="none" fill={bills.category?.color}/>
                                                        <Text ml="2" color={bills.category?.color}>{bills.title}</Text>
                                                    </Flex>

                                                    <Flex fontWeight="medium" alignItems="center" color="gray.900" _hover={{textDecor:"underline", cursor: "pointer"}}>
                                                        <AttachIcon stroke="#4e4b66" fill="none" width="16px"/>
                                                        <Text ml="2">Anexar</Text>
                                                    </Flex>

                                                    <Flex>
                                                        <HStack fontWeight="bold" spacing="7">
                                                            {
                                                                bills.status ? (
                                                                    <Flex fontWeight="bold" alignItems="center" color="green.400">
                                                                        <CheckIcon stroke="#48bb78" fill="none" width="16px"/>
                                                                        <Text ml="2">Pago</Text>
                                                                    </Flex>
                                                                ) : (
                                                                    <SolidButton isDisabled={bills.status}  onClick={() => openReceiveBill({ id: bills.id, title: bills.title , value: bills.value.toString(), new_value: ''}) }
                                                                        h="30px" size="sm" color="white" bg="green.400" colorScheme="green" fontSize="11">
                                                                        Pagar
                                                                    </SolidButton>
                                                                )
                                                            }

                                                            <Text opacity={bills.status ? 0.5 : 1} float="right">{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(bills.value)}</Text>
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