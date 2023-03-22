import { Flex, HStack, Stack, Text, Th, Tr, Link, Table, Thead, Tbody, IconButton, TableContainer, Accordion, AccordionItem, AccordionButton, AccordionPanel, Divider, Td } from '@chakra-ui/react'
import { HasPermission, useProfile } from '../../../hooks/useProfile'


import { ReactComponent as MinusIcon } from '../../../assets/icons/Minus.svg';
import { ReactComponent as StrongPlusIcon } from '../../../assets/icons/StrongPlus.svg';


import Badge from '../../../components/Badge'
import { SellerCommission } from '../../../types';
import { formatBRDate } from '../../../utils/Date/formatBRDate';


interface SellerCommissionProps{
    monthName: string;
    commissionsSeller: SellerCommission[];
}

export default function LastComissionsTable({monthName, commissionsSeller}: SellerCommissionProps) {
    const { profile, permissions } = useProfile()

    const isManager = HasPermission(permissions, 'Comercial Completo');

    const totalCreditMonthAmount = commissionsSeller.reduce((sumAmount:number, sellerCommission:SellerCommission) => {
        return sumAmount + sellerCommission.quota.credit;
    }, 0);

    const totalMonthAmount = commissionsSeller.reduce((sumAmount:number, sellerCommission:SellerCommission) => {
        return sumAmount + sellerCommission.value;
    }, 0);

    console.log(commissionsSeller);

    return (
        <Accordion w="100%" border="2px" borderColor="gray.500" borderRadius="26" overflow="hidden" allowMultiple>
            <HStack spacing="8" justify="space-between" paddingX={["4", "8"]} paddingY="3" bg="gray.200">
                <Stack direction={["column", "row"]} spacing={["4", "6"]} alignItems="baseline" mt={["1", "0"]}>
                    <Text fontWeight="bold">{monthName}</Text>

                    <Text fontWeight="bold" px="6rem">{commissionsSeller.length} contratos</Text>

                    <Text fontWeight="bold" px="6rem" color="#6E7191">Créditos: {Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(totalCreditMonthAmount)}</Text>
                </Stack>
                <Stack direction={["column", "row"]} spacing={["3", "6"]} alignItems={["flex-end", "center"]}>
                    <Text float="right" textAlign="right" px="40px" color={totalMonthAmount < 0 ? "red.400" : "green.400"}><strong>{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(totalMonthAmount)}</strong></Text>
                </Stack>
            </HStack>
            {
                    commissionsSeller.map((commissionSeller:SellerCommission) => {
                        if(commissionSeller.is_chargeback){
                            commissionSeller.value = 0 - commissionSeller.value;
                        }

                return (
             <>
             <AccordionItem display="flex" flexDir="column" paddingX={["4", "8"]} paddingTop="3" bg="white" borderTop="2px" borderTopColor="gray.500" borderBottom="0">
                        {({ isExpanded }) => (
                            <>
                                <Stack spacing={["5", ""]} direction={['column', 'row']} justify="space-between" mb="3" alignItems={["", "center"]}>
                                    <HStack spacing={["5", "5"]} justifyContent="space-between">
                                        <HStack spacing={["3", "4"]}>
                                            <AccordionButton p="0" height="fit-content" w="auto">
                                                <Flex alignItems="center" justifyContent="center" h={["20px", "24px"]} w={["24px", "30px"]} p="0" borderRadius="full" border="2px" borderColor="red.400">
                                                    {!isExpanded ? <StrongPlusIcon stroke="#C30052" fill="none" width="12px" /> :
                                                        <MinusIcon stroke="#C30052" fill="none" width="12px" />}
                                                </Flex>
                                            </AccordionButton>
                                        </HStack>

                                        <Stack direction={['column', 'row']} spacing={["1", "4"]}>
                                            <Stack fontWeight="500" alignItems="center">
                                                <Text ml="2" color="#6E7191" fontSize="10px">Data da venda</Text>
                                                <Text ml="2" color="#4e4b66" fontSize="13px">{formatBRDate(commissionSeller.quota.date_sale)}</Text>
                                            </Stack>
                                        </Stack>
                                    </HStack>
                                    <HStack spacing={["5", "5"]} justifyContent="space-between">
                                        <HStack spacing={["3", "4"]}>
                                            <Stack fontWeight="500" alignItems="center">
                                                <Text ml="2" color="#6E7191" fontSize="10px">Parcela</Text>
                                                <Text ml="2" color="#4e4b66" fontSize="13px">{commissionSeller.seller_commission_rule_parcel.parcel_number}</Text>
                                            </Stack>
                                        </HStack>
                                    </HStack>
                                    <HStack spacing={["5", "5"]} justifyContent="space-between" fontSize={["11px", "13px"]}>
                                        <HStack>
                                            <Stack direction={['column', 'row']} spacing={["1", "4"]}>
                                                <Stack fontWeight="500" alignItems="center">
                                                    <Text ml="2" color="#6E7191" fontSize="10px">Crédito</Text>
                                                    <Text ml="2" color="#4e4b66" fontSize="13px">{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(commissionSeller.quota.credit)}</Text>
                                                </Stack>
                                            </Stack>
                                        </HStack>
                                    </HStack>
                                    {
                                        isManager && (
                                            <Stack direction={['column', 'row']} spacing={["1", "4"]}>
                                                <Stack fontWeight="500" alignItems="center">
                                                    <Text ml="2" color="#6E7191" fontSize="10px">Vendedor</Text>
                                                    <Text ml="2" color="#4e4b66" fontSize="13px">{commissionSeller.seller.name}</Text>
                                                </Stack>
                                            </Stack>
                                        )
                                    }
                                    <Stack direction={['column', 'row']} spacing={["1", "4"]}>
                                        <Stack fontWeight="500" alignItems="center">
                                            <Text ml="2" color="#6E7191" fontSize="10px">Critério</Text>
                                            <Text ml="2" color="#4e4b66" fontSize="13px">{commissionSeller.seller_commission_rule_parcel.seller_commission_rule.name}</Text>
                                        </Stack>
                                    </Stack>
                                    <Stack direction={['column', 'row']} spacing={["1", "4"]}>
                                    <Stack fontWeight="500" alignItems="center">
                                        {
                                            !commissionSeller.is_chargeback ? (
                                                <Badge colorScheme={commissionSeller.confirmed ? "green" : "yellow"} width="110px" px="27px">{commissionSeller.confirmed ? "Confirmada" : "Pendente"}</Badge>
                                            ) : (
                                                <Badge colorScheme="red" width="110px" px="27px">Estorno</Badge>
                                            )
                                        }
                                    </Stack>
                                        <Stack fontWeight="500" alignItems="center" color={commissionSeller.is_chargeback ? "red.400" : commissionSeller.confirmed ? "green.400" : "gray.800"}>
                                            <Text float="right" px="2rem">{commissionSeller.is_chargeback ? "-" : ''}{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(commissionSeller.value)}</Text>
                                        </Stack>
                                    </Stack>
                                </Stack>

                                <AccordionPanel flexDir="column" borderTop="2px" borderColor="gray.500" px="0" py="5" fontSize={["11px", "small"]}>
                                    <Stack direction={['column', 'row']} spacing={["5", "4"]} justifyContent="space-between" mb="4">
                                        <HStack spacing="2">
                                            <strong color="#4e4b66">Percentual:</strong>
                                            <Text>
                                            {commissionSeller.seller_commission_rule_parcel.percentage_to_pay}%
                                            </Text>
                                        </HStack>
                                        <HStack spacing="4">
                                            <strong color="#4e4b66">Parcela:</strong>
                                            <Text>
                                            {commissionSeller.seller_commission_rule_parcel.parcel_number}
                                            </Text>
                                        </HStack>

                                        <HStack spacing="2" px="0rem">
                                            <strong color="#4e4b66">Data de comissão:</strong>
                                            <Text>
                                                {formatBRDate(commissionSeller.commission_date)}
                                            </Text>
                                        </HStack>

                                        {/* <HStack spacing="2" px="1rem">
                                            <strong color="#4e4b66">Restante:</strong>
                                            <Text>
                                                {Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(commissionSeller.quota.credit - commissionSeller.value)}
                                            </Text>
                                        </HStack> */}
                                    </Stack>

                                    <Divider mb="3" />

                                    <Stack direction={['column', 'row']} spacing={["5", "4"]} justifyContent="space-between" mb="4">
                                        <HStack spacing="2">
                                            <strong color="#4e4b66">Contrato:</strong>
                                            <Text>
                                                {commissionSeller.quota.contract.number_contract}
                                            </Text>
                                        </HStack>
                                        <HStack spacing="4">
                                            <strong color="#4e4b66">Grupo:</strong>
                                            <Text>
                                                {commissionSeller.quota.group}
                                            </Text>
                                        </HStack>
                                        <HStack spacing="4">
                                            <strong color="#4e4b66">Cota:</strong>
                                            <Text>
                                                {commissionSeller.quota.quota}
                                            </Text>
                                        </HStack>

                                        <HStack spacing="2" px="1rem">
                                            <strong color="#4e4b66">Bem:</strong>
                                            <Text>
                                                {commissionSeller.quota.consortium_type.description}
                                            </Text>
                                        </HStack>
                                    </Stack>
                                </AccordionPanel>
                            </>
                        )}
                    </AccordionItem>
    

                        </>
    )
    })
    }
    </Accordion>
    )
    }