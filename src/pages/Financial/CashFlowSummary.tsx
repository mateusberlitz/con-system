import { Text, Stack,Flex, Spinner, HStack } from "@chakra-ui/react";
import { UseQueryResult } from "react-query";
import { CashFlowInterface, Payment } from "../../types";
import { formatDate } from "../../utils/Date/formatDate";
import { formatYmdDate } from "../../utils/Date/formatYmdDate";
import { getDay } from "../../utils/Date/getDay";


import { formatBRDate } from "../../utils/Date/formatBRDate";
import { getHour } from "../../utils/Date/getHour";

interface CashFlowSummaryProps{
    cashFlows: UseQueryResult<{
        data: any;
        total: number;
        initialCash: number;
    }, unknown>;
}

export function CashFlowSummary({cashFlows} : CashFlowSummaryProps){

    return (
        <>
        
                <Stack w="100%" min-width="300px" justify="space-between" alignItems="left" bg="white" borderRadius="16px" shadow="xl" px="8" py="8">
                    

                    <HStack>
                        <Text fontSize="xl" mb="8" w="100%">Últimas movimentações</Text>
                        {/* {
                            ( ( permissions && HasPermission(permissions, 'Todas Empresas')) && <CompanySelect mt="-35px !important" searchFilter={filter} setFilter={handleChangeFilter}/> )
                        } */}
                    </HStack>

                    {   cashFlows.isLoading ? (
                            <Flex justify="left">
                                <Spinner/>
                            </Flex>
                        ) : ( cashFlows.isError ? (
                            <Flex justify="left" mt="4" mb="4">
                                <Text>Erro listar as movimentações</Text>
                            </Flex>
                        ) : (cashFlows.data?.data.length === 0) && (
                            <Flex justify="left">
                                <Text>Nenhuma movimentação encontrada.</Text>
                            </Flex>
                        ) ) 
                    }

                    {
                        (!cashFlows.isLoading && !cashFlows.error) && Object.keys(cashFlows.data?.data).map((day:string) => {
                            const totalDayAmount = cashFlows.data?.data[day].reduce((sumAmount:number, payment:Payment) => {
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
                                        cashFlows.data?.data[day].map((cashFlow:CashFlowInterface) => {

                                            return (
                                                <HStack key={cashFlow.id} justifyContent="space-between" borderTop="2px" borderColor="gray.500" px="8" py="4">
                                                    <Flex>
                                                        <Text mr="6" fontSize="sm" color="gray.800">{cashFlow.created_at && getHour(cashFlow.created_at)}</Text>
                                                    </Flex>

                                                    <Flex alignItems="center" color={cashFlow.value > 0 ? 'green.400' : 'red.400'}>
                                                        {/* {cashFlow.value > 0 
                                                            ? <StrongPlusIcon stroke="#48bb78" fill="none" width="12px"/> 
                                                            : <MinusIcon stroke="#c30052" fill="none" width="12px"/>
                                                        } */}
                                                        <Text fontWeight="bold" ml="2">
                                                            {Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(cashFlow.value)}
                                                        </Text>
                                                    </Flex>

                                                    <Flex>
                                                        <Text color="gray.800">{cashFlow.title.substring(0,20)}{(cashFlow.title.length > 20) && "..."}</Text>
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