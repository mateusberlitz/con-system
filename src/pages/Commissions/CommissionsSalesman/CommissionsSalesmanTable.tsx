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

    //console.log(totalMonthAmount);

    return (
        <Accordion w="100%" border="2px" borderColor="gray.500" borderRadius="26" overflow="hidden" allowMultiple>
            <HStack spacing="8" justify="space-between" paddingX={["4", "8"]} paddingY="3" bg="gray.200">
                <Stack direction={["column", "row"]} spacing={["4", "6"]} alignItems="baseline" mt={["1", "0"]}>
                    <Text fontWeight="bold">{monthName}</Text>

                    <Text fontWeight="bold" px="6rem">{commissionsSeller.length} contratos</Text>

                    <Text fontWeight="bold" px="6rem" color="#6E7191">Créditos: {Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(totalCreditMonthAmount)}</Text>
                </Stack>
                <Stack direction={["column", "row"]} spacing={["3", "6"]} alignItems={["flex-end", "center"]}>
                    <Text float="right" textAlign="right" px="40px" color="red.400"><strong>{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(totalMonthAmount)}</strong></Text>
                </Stack>
            </HStack>
            {
                    commissionsSeller.map((commissionsSeller:SellerCommission) => {
                        //console.log(commissionsSeller)
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
                                                <Text ml="2" color="#4e4b66" fontSize="13px">{formatBRDate(commissionsSeller.quota.date_sale)}</Text>
                                            </Stack>
                                        </Stack>
                                    </HStack>
                                    <HStack spacing={["5", "5"]} justifyContent="space-between">
                                        <HStack spacing={["3", "4"]}>
                                            <Stack fontWeight="500" alignItems="center">
                                                <Text ml="2" color="#6E7191" fontSize="10px">Parcela</Text>
                                                <Text ml="2" color="#4e4b66" fontSize="13px">{commissionsSeller.seller_commission_rule_parcel.parcel_number}</Text>
                                            </Stack>
                                        </HStack>
                                    </HStack>
                                    <HStack spacing={["5", "5"]} justifyContent="space-between" fontSize={["11px", "13px"]}>
                                        <HStack>
                                            <Stack direction={['column', 'row']} spacing={["1", "4"]}>
                                                <Stack fontWeight="500" alignItems="center">
                                                    <Text ml="2" color="#6E7191" fontSize="10px">Crédito</Text>
                                                    <Text ml="2" color="#4e4b66" fontSize="13px">{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(commissionsSeller.quota.credit)}</Text>
                                                </Stack>
                                            </Stack>
                                        </HStack>
                                    </HStack>
                                    {
                                        isManager && (
                                            <Stack direction={['column', 'row']} spacing={["1", "4"]}>
                                                <Stack fontWeight="500" alignItems="center">
                                                    <Text ml="2" color="#6E7191" fontSize="10px">Vendedor</Text>
                                                    <Text ml="2" color="#4e4b66" fontSize="13px">{commissionsSeller.seller.name}</Text>
                                                </Stack>
                                            </Stack>
                                        )
                                    }
                                    <Stack direction={['column', 'row']} spacing={["1", "4"]}>
                                        <Stack fontWeight="500" alignItems="center">
                                            <Text ml="2" color="#6E7191" fontSize="10px">Critério</Text>
                                            <Text ml="2" color="#4e4b66" fontSize="13px">{commissionsSeller.seller_commission_rule_parcel.seller_commission_rule.name}</Text>
                                        </Stack>
                                    </Stack>
                                    <Stack direction={['column', 'row']} spacing={["1", "4"]}>
                                    <Stack fontWeight="500" alignItems="center">
                                        {
                                            !commissionsSeller.is_chargeback ? (
                                                <Badge colorScheme={commissionsSeller.confirmed ? "green" : "yellow"} width="110px" px="27px">{commissionsSeller.confirmed ? "Confirmada" : "Pendente"}</Badge>
                                            ) : (
                                                <Badge colorScheme="red" width="110px" px="27px">Estorno</Badge>
                                            )
                                        }
                                    </Stack>
                                    <Stack fontWeight="500" alignItems="center" color={commissionsSeller.is_chargeback ? "red.400" : commissionsSeller.confirmed ? "green.400" : "gray.800"}>
                                        <Text float="right" px="2rem">{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(commissionsSeller.value)}</Text>
                                    </Stack>
                                    </Stack>
                                </Stack>

                                <AccordionPanel flexDir="column" borderTop="2px" borderColor="gray.500" px="0" py="5" fontSize={["11px", "small"]}>
                                    <Stack direction={['column', 'row']} spacing={["5", "4"]} justifyContent="space-between" mb="4">
                                        <HStack spacing="2">
                                            <strong color="#4e4b66">Percentual:</strong>
                                            <Text>
                                            {commissionsSeller.seller_commission_rule_parcel.percentage_to_pay}%
                                            </Text>
                                        </HStack>
                                        <HStack spacing="4">
                                            <strong color="#4e4b66">Parcelas:</strong>
                                            <Text>
                                            {commissionsSeller.seller_commission_rule_parcel.parcel_number}
                                            </Text>
                                        </HStack>
                                        <HStack spacing="4">
                                            <strong color="#4e4b66">Parcela:</strong>
                                            <Text>
                                            {commissionsSeller.seller_commission_rule_parcel.parcel_number}
                                            </Text>
                                        </HStack>

                                        <HStack spacing="2" px="1rem">
                                            <strong color="#4e4b66">Restante:</strong>
                                            <Text>
                                                {Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(commissionsSeller.quota.credit - commissionsSeller.value)}
                                            </Text>
                                        </HStack>
                                    </Stack>

                                    <Divider mb="3" />

                                    <Stack direction={['column', 'row']} spacing={["5", "4"]} justifyContent="space-between" mb="4">
                                        <HStack spacing="2">
                                            <strong color="#4e4b66">Contrato:</strong>
                                            <Text>
                                            {commissionsSeller.quota.contract.number_contract}
                                            </Text>
                                        </HStack>
                                        <HStack spacing="4">
                                            <strong color="#4e4b66">Grupo:</strong>
                                            <Text>
                                            {commissionsSeller.quota.group}
                                            </Text>
                                        </HStack>
                                        <HStack spacing="4">
                                            <strong color="#4e4b66">Cota:</strong>
                                            <Text>
                                            {commissionsSeller.quota.quota}
                                            </Text>
                                        </HStack>

                                        <HStack spacing="2" px="1rem">
                                            <strong color="#4e4b66">Bem:</strong>
                                            <Text>
                                                {/* {commissionsSeller.quota.consortium_type.description} */}
                                            </Text>
                                        </HStack>
                                        <HStack spacing="2" px="0rem">
                                            <strong color="#4e4b66">Cliente:</strong>
                                            <Text>
                                                João Beltrano
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