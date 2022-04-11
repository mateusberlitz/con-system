import { Table, Stack, Thead, Tr, Td, Tbody, HStack, TableContainer, Text, Flex, Divider } from "@chakra-ui/react";

import { ReactComponent as MinusIcon } from '../../../assets/icons/Minus.svg';
import { ReactComponent as StrongPlusIcon } from '../../../assets/icons/StrongPlus.svg';
import Badge from "../../../components/Badge";


export default function CommissionsSalesmanTable() {
    return (
        <Stack direction={['column', 'row']} spacing="6" justifyContent="space-between" alignItems="center">
            <TableContainer border="2px solid #D6D8E7" borderRadius={15}>
                <Table variant='simple' size="lg">
                    <Thead backgroundColor="#EFF0F7" maxWidTd="100%" whiteSpace="nowrap">
                        <HStack spacing={["5", "5"]} justifyContent="space-between">
                            <HStack spacing={["3", "4"]}>
                                <Tr>
                                    <Td color="#000">Fevereiro</Td>
                                    <Td color="#000">3 contratos</Td>
                                    <Td></Td>
                                    <Td></Td>
                                    <Td></Td>
                                    <Td>Créditos: R$2.800.000,00</Td>
                                    <Td></Td>
                                    <Td></Td>
                                    <Td></Td>
                                    <Td px="2px" isNumeric color="red.400">- R$ 3.000,00</Td>
                                </Tr>
                            </HStack>
                        </HStack>
                    </Thead>
                    <Tbody>
                        <Tr color="gray.800" fontWeight="normal">
                            <HStack spacing={["5", "5"]} justifyContent="space-between">
                                <HStack spacing={["3", "4"]}>
                                    <Td>
                                        <Text fontSize="8px">
                                            <Flex alignItems="center" justifyContent="center" h={["20px", "24px"]} w={["24px", "30px"]} p="0" borderRadius="full" border="2px" borderColor="red.400" variant="outline">
                                                <StrongPlusIcon stroke="#C30052" fill="none" width="12px" />
                                            </Flex>
                                        </Text>
                                    </Td>
                                    <Td>
                                        <Text fontSize="8px" color="#6E7191">Data da venda</Text>
                                        <Text fontSize="11px" color="#4E4B66" fontWeight="400">22/01/2022</Text>
                                    </Td>
                                    <Td>
                                        <Text fontSize="8px" color="#6E7191">Parcela</Text>
                                        <Text fontSize="11px" color="#4E4B66" fontWeight="400">1</Text>
                                    </Td>
                                    <Td>
                                        <Text fontSize="8px" color="#6E7191">Crédito</Text>
                                        <Text fontSize="11px" color="#4E4B66" fontWeight="400">R$500.000,00</Text>
                                    </Td>
                                    <Td>
                                        <Text fontSize="8px" color="#6E7191">Critério</Text>
                                        <Text fontSize="11px" color="#4E4B66" fontWeight="400">Regra Geral</Text>
                                    </Td>
                                    <Td>
                                        <Badge colorScheme='yellow' px="28px">Pendente</Badge>
                                    </Td>
                                    <Td isNumeric color="#4E4B66" fontWeight="regular" fontSize="11px" textTransform="capitalize">
                                        R$ 1.250,00
                                    </Td>
                                </HStack>
                            </HStack>
                        </Tr>
                        <Divider />
                        <Tr color="gray.800" fontWeight="normal">
                            <HStack spacing={["5", "5"]} justifyContent="space-between">
                                <HStack spacing={["3", "4"]}>
                                    <Td>
                                        <Text fontSize="8px">
                                            <Flex alignItems="center" justifyContent="center" h={["20px", "24px"]} w={["24px", "30px"]} p="0" borderRadius="full" border="2px" borderColor="red.400" variant="outline">
                                                <MinusIcon stroke="#C30052" fill="none" width="12px" />
                                            </Flex>
                                        </Text>
                                    </Td>
                                    <Td>
                                        <Text fontSize="8px" color="#6E7191">Data da venda</Text>
                                        <Text fontSize="11px" color="#4E4B66" fontWeight="400">22/01/2022</Text>
                                    </Td>

                                    <Td>
                                        <Text fontSize="8px" color="#6E7191">Parcela</Text>
                                        <Text fontSize="11px" color="#4E4B66" fontWeight="400">1</Text>
                                    </Td>
                                    <Td>
                                        <Text fontSize="8px" color="#6E7191">Crédito</Text>
                                        <Text fontSize="11px" color="#4E4B66" fontWeight="400">R$500.000,00</Text>
                                    </Td>
                                    <Td>
                                        <Text fontSize="8px" color="#6E7191">Critério</Text>
                                        <Text fontSize="11px" color="#4E4B66" fontWeight="400">Regra Geral</Text>
                                    </Td>
                                    <Td>
                                        <Badge colorScheme='green'>Confirmada</Badge>
                                    </Td>
                                    <Td color="#00BA88" fontWeight="regular" fontSize="11px" textTransform="capitalize">
                                        R$ 750,00
                                    </Td>
                                </HStack>
                            </HStack>
                        </Tr>
                        <Divider />
                        <Tr color="gray.800" fontWeight="normal">
                            <HStack spacing={["5", "5"]} justifyContent="space-between">
                                <HStack spacing={["3", "4"]}>
                                    <Td>
                                        <Text fontSize="11px" fontWeight="bold">
                                            Percentual:
                                        </Text>
                                    </Td>
                                    <Td px="5px">
                                        <Text fontSize="11px" color="#4E4B66" fontWeight="400">4%</Text>
                                    </Td>
                                    <Td></Td>
                                    <Td px="0">
                                        <Text fontSize="11px" color="#4E4B66" fontWeight="bold">Parcela:</Text>
                                    </Td>
                                    <Td>
                                        <Text fontSize="11px" color="#4E4B66" fontWeight="400">4</Text>
                                    </Td>
                                    <Td px="25px">
                                        <Text fontSize="11px" color="#4E4B66" fontWeight="bold">Parcela:</Text>
                                    </Td>
                                    <Td>
                                        <Text fontSize="11px" color="#4E4B66" fontWeight="400">Meia Parcela</Text>
                                    </Td>
                                    <Td></Td>
                                    <Td>
                                        <Text fontSize="11px" color="#4E4B66" fontWeight="bold">Restante:</Text>
                                    </Td>
                                    <Td px="15px">
                                        <Text fontSize="11px" color="#4E4B66">R$ 0</Text>
                                    </Td>
                                </HStack>
                            </HStack>
                        </Tr>
                        <Divider />
                        <Tr color="gray.800" fontWeight="normal">
                            <HStack spacing={["5", "5"]} justifyContent="space-between">
                                <HStack spacing={["3", "4"]}>
                                    <Td>
                                        <Text fontSize="11px" fontWeight="bold">
                                            Contrato:
                                        </Text>
                                    </Td>
                                    <Td px="5px">
                                        <Text fontSize="11px" color="#4E4B66" fontWeight="400">230495</Text>
                                    </Td>
                                    <Td>
                                        <Text fontSize="11px" color="#4E4B66" fontWeight="bold">Grupo:</Text>
                                    </Td>
                                    <Td px="-5px">
                                        <Text fontSize="11px" color="#4E4B66" fontWeight="400">1080</Text>
                                    </Td>
                                    <Td>
                                        <Text fontSize="11px" color="#4E4B66" fontWeight="bold">Cota:</Text>
                                    </Td>
                                    <Td px="-5px">
                                        <Text fontSize="11px" color="#4E4B66" fontWeight="400">874</Text>
                                    </Td>
                                    <Td>
                                        <Text fontSize="11px" color="#4E4B66" fontWeight="bold">Bem:</Text>
                                    </Td>
                                    <Td px="15px">
                                        <Text fontSize="11px" color="#4E4B66" fontWeight="400">Imóvel</Text>
                                    </Td>
                                    <Td px="45px">
                                        <Text fontSize="11px" color="#4E4B66" fontWeight="bold">Cliente:</Text>
                                    </Td>
                                    <Td px="15px">
                                        <Text fontSize="11px" color="#4E4B66" fontWeight="400">João Beltrano</Text>
                                    </Td>
                                </HStack>
                            </HStack>
                        </Tr>
                        <Tr color="gray.800" fontWeight="normal">
                            <HStack spacing={["5", "5"]} justifyContent="space-between">
                                <HStack spacing={["3", "4"]}>
                                    <Td>
                                        <Text fontSize="8px">
                                            <Flex alignItems="center" justifyContent="center" h={["20px", "24px"]} w={["24px", "30px"]} p="0" borderRadius="full" border="2px" borderColor="red.400" variant="outline">
                                                <StrongPlusIcon stroke="#C30052" fill="none" width="12px" />
                                            </Flex>
                                        </Text>
                                    </Td>
                                    <Td>
                                        <Text fontSize="8px" color="#6E7191">Data da venda</Text>
                                        <Text fontSize="11px" color="#4E4B66">22/01/2022</Text>
                                    </Td>
                                    <Td color="#C30052" fontWeight="400" fontSize="11px" textTransform="capitalize">
                                        Estorno
                                    </Td>

                                    <Td>
                                        <Text fontSize="8px" color="#6E7191">Crédito</Text>
                                        <Text fontSize="11px" color="#4E4B66">R$500.000,00</Text>
                                    </Td>
                                    <Td></Td>
                                    <Td>
                                        <Text fontSize="8px" color="#6E7191">Critério</Text>
                                        <Text fontSize="11px" color="#4E4B66">Regra 2m</Text>
                                    </Td>
                                    <Td></Td>
                                    <Td px="55px" isNumeric color="#C30052" fontWeight="regular" fontSize="11px" textTransform="capitalize">
                                       - R$ 1.250,00
                                    </Td>
                                </HStack>
                            </HStack>
                        </Tr>
                    </Tbody>
                </Table>
            </TableContainer>
        </Stack>
    )
}