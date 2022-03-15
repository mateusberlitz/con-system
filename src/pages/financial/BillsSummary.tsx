import { Text, Stack,Flex, Spinner, HStack, useBreakpointValue } from "@chakra-ui/react";
import { UseQueryResult } from "react-query";
import { SolidButton } from "../../components/Buttons/SolidButton";
import { Bill, Payment } from "../../types";
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
import { useState } from "react";

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
    const {permissions} = useProfile();

    const isWideVersion = useBreakpointValue({base: false, lg: true});

    return (
                <Stack w="100%" min-width="300px" spacing="6" justify="space-between" alignItems="left" bg="white" borderRadius="16px" shadow="xl" px="8" py="8">
                    <HStack>
                        <Text fontSize="xl" mb="4" w="100%">Contas a Receber</Text>
                        {/* {
                            ( ( permissions && HasPermission(permissions, 'Todas Empresas')) && <CompanySelect searchFilter={filter} setFilter={handleChangeFilter} mt="-35px !important"/> )
                        } */}
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
                        (!bills.isLoading && !bills.error) && Object.keys(bills.data?.data).map((company:string) => {
                            const totalDayAmount = bills.data?.data[company].reduce((sumAmount:number, bill:Bill) => {
                                return sumAmount + bill.value;
                            }, 0);

                            const todayFormatedDate = formatDate(formatYmdDate(new Date().toDateString()));
                            const tomorrow = getDay(formatYmdDate(new Date().toDateString())) + 1;

                            const companyName = bills.data?.data[company][0].company.name;

                            //console.log(bills.data?.data[company]);

                            return (
                                <Stack key={company} w="100%" border="2px" borderColor="gray.500" borderRadius="26" overflow="hidden" spacing="0">
                                    <HStack spacing="8" w="100%" justify="space-between" paddingX={["4","8"]} paddingY="3" bg="gray.200">
                                        <Text fontWeight="bold">{companyName}</Text>

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
                                        bills.data?.data[company].map((bills:Bill) => {
                                            console.log(bills.id);

                                            return (
                                                <HStack key={bills.id} justifyContent="space-between" borderTop="2px" borderColor="gray.500" paddingX={["4","8"]} py="4">
                                                    <Stack>
                                                        <Flex fontWeight="500" alignItems="center" opacity={bills.status ? 0.5 : 1}>
                                                            <EllipseIcon stroke="none" fill={bills.category?.color}/>
                                                            <Text ml="2" color={bills.category?.color}>{bills.title}</Text>
                                                        </Flex>

                                                        {
                                                            !isWideVersion && <Text fontSize={["10px", "13px"]} opacity={bills.status ? 0.5 : 1} float="right">{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(bills.value - bills.paid )}</Text>
                                                        }
                                                    </Stack>

                                                    {
                                                        isWideVersion && (
                                                            <Flex fontWeight="medium" alignItems="center" color="gray.900" _hover={{textDecor:"underline", cursor: "pointer"}}>
                                                                <AttachIcon stroke="#4e4b66" fill="none" width="16px"/>
                                                                <Text ml="2">Anexar</Text>
                                                            </Flex>
                                                        )
                                                    }

                                                    <Flex>
                                                        <HStack fontWeight="bold" spacing="7">
                                                            {
                                                                bills.status ? (
                                                                    <Flex fontWeight="bold" alignItems="center" color="green.400">
                                                                        <CheckIcon stroke="#48bb78" fill="none" width="16px"/>
                                                                        <Text ml="2">Pago</Text>
                                                                    </Flex>
                                                                ) : (
                                                                    <SolidButton isDisabled={bills.status}  onClick={() => openReceiveBill({ id: bills.id, title: bills.title , value: bills.value, paid: bills.paid, new_value: '', status: bills.status}) }
                                                                        h="30px" size="sm" color="white" bg="green.400" colorScheme="green" fontSize="11">
                                                                        Receber
                                                                    </SolidButton>
                                                                )
                                                            }

                                                            {
                                                                isWideVersion && <Text fontSize={["10px", "13px"]} opacity={bills.status ? 0.5 : 1} float="right">{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(bills.value - bills.paid )}</Text>
                                                            }
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