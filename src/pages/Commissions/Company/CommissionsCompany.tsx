import { Flex, HStack, Stack, Text, Th, Tr, Link, Table, Thead, Tbody, IconButton, TableContainer, Accordion, AccordionItem, AccordionButton, AccordionPanel, Divider, Td } from '@chakra-ui/react'
import { useProfile } from '../../../hooks/useProfile'

import { ReactComponent as MinusIcon } from '../../../assets/icons/Minus.svg';
import { ReactComponent as StrongPlusIcon } from '../../../assets/icons/StrongPlus.svg';

import Badge from '../../../components/Badge'
import { CompanyCommission } from '../../../types';

interface CommissionsCompanyProps{
    monthName: string;
    companyCommissions: CompanyCommission[];
}

export default function CommissionsCompany({monthName, companyCommissions}: CommissionsCompanyProps) {
    const { profile, permissions } = useProfile()

    const totalMonthAmount = companyCommissions.reduce((sumAmount:number, companyCommission:CompanyCommission) => {
        return sumAmount + companyCommission.value;
    }, 0);

    console.log(companyCommissions)

    return (
        <Accordion w="100%" border="2px" borderColor="gray.500" borderRadius="26" overflow="hidden" spacing="0" allowMultiple>
            <HStack spacing="8" justify="space-between" paddingX={["4", "8"]} paddingY="3" bg="gray.200">
                <Stack direction={["column", "row"]} spacing={["4", "6"]} alignItems="baseline" mt={["1", "0"]}>
                    <Text fontWeight="bold">{monthName}</Text>

                    <Text fontWeight="bold" px="6rem">{companyCommissions.length} contratos</Text>

                    <Text fontWeight="bold" px="6rem" color="#6E7191">Créditos: {Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(totalMonthAmount)}</Text>
                </Stack>
                <Stack direction={["column", "row"]} spacing={["3", "6"]} alignItems={["flex-end", "center"]}>
                    <Text float="right" textAlign="right" px="40px" color="red.400"><strong>{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(totalMonthAmount)}</strong></Text>
                </Stack>
            </HStack>
                {
                    companyCommissions.map((companyCommission:CompanyCommission) => {
                        return(
                            <AccordionItem display="flex" flexDir="column" paddingX={["4", "8"]} paddingTop="3" bg="white" borderTop="2px" borderTopColor="gray.500" borderBottom="0">
                                {({ isExpanded }) => (
                                    <>
                                        <Stack spacing={["5", ""]} direction={['column', 'row']} justify="space-between" mb="3" alignItems={["", "center"]}>
                                            <HStack spacing={["5", "5"]} justifyContent="space-between">
                                                <HStack spacing={["3", "4"]}>
                                                    <AccordionButton p="0" height="fit-content" w="auto">
                                                        <Flex alignItems="center" justifyContent="center" h={["20px", "24px"]} w={["24px", "30px"]} p="0" borderRadius="full" border="2px" borderColor="red.400" variant="outline">
                                                            {
                                                                !isExpanded ? <StrongPlusIcon stroke="#C30052" fill="none" width="12px" /> :
                                                                    <MinusIcon stroke="#C30052" fill="none" width="12px" />
                                                            }
                                                        </Flex>
                                                    </AccordionButton>
                                                </HStack>

                                                <Stack direction={['column', 'row']} spacing={["1", "4"]}>
                                                    <Stack fontWeight="500" alignItems="center">
                                                        <Text ml="2" color="#6E7191" fontSize="10px">Data da venda</Text>
                                                        <Text ml="2" color="#4e4b66" fontSize="13px">{companyCommission.quota.date_sale}</Text>
                                                    </Stack>
                                                </Stack>
                                            </HStack>
                                            <HStack spacing={["5", "5"]} justifyContent="space-between">
                                                <HStack spacing={["3", "4"]}>
                                                    <Stack fontWeight="500" alignItems="center">
                                                        <Text ml="2" color="#6E7191" fontSize="10px">Parcela</Text>
                                                        <Text ml="2" color="#4e4b66" fontSize="13px">2</Text>
                                                    </Stack>
                                                </HStack>
                                            </HStack>
                                            <HStack spacing={["5", "5"]} justifyContent="space-between" fontSize={["11px", "13px"]}>
                                                <HStack>
                                                    <Stack direction={['column', 'row']} spacing={["1", "4"]}>
                                                        <Stack fontWeight="500" alignItems="center">
                                                            <Text ml="2" color="#6E7191" fontSize="10px">Crédito</Text>
                                                            <Text ml="2" color="#4e4b66" fontSize="13px">R$500.000,00</Text>
                                                        </Stack>
                                                    </Stack>
                                                </HStack>
                                            </HStack>
                                            <Stack direction={['column', 'row']} spacing={["1", "4"]}>
                                                <Stack fontWeight="500" alignItems="center">
                                                    <Text ml="2" color="#6E7191" fontSize="10px">Percentual</Text>
                                                    <Text ml="2" color="#4e4b66" fontSize="13px">3%</Text>
                                                </Stack>
                                            </Stack>
                                            <Stack direction={['column', 'row']} spacing={["1", "4"]}>
                                                <Stack fontWeight="500" alignItems="center">
                                                    <Badge colorScheme='yellow' width="110px" px="27px">Pendente</Badge>
                                                </Stack>
                                                <Stack fontWeight="500" alignItems="center">
                                                    <Text float="right" px="2rem">R$ 1.250,00</Text>
                                                </Stack>
                                            </Stack>
                                        </Stack>

                                        <AccordionPanel flexDir="column" borderTop="2px" borderColor="gray.500" px="0" py="5" fontSize={["11px", "small"]}>
                                            <Stack direction={['column', 'row']} spacing={["5", "4"]} justifyContent="space-between" mb="4">
                                                <HStack spacing="2">
                                                    <strong color="#4e4b66">Percentual:</strong>
                                                    <Text>
                                                        1%
                                                    </Text>
                                                </HStack>
                                                <HStack spacing="4">
                                                    <strong color="#4e4b66">Parcela:</strong>
                                                    <Text>
                                                        Meia Parcela
                                                    </Text>
                                                </HStack>
                                                <HStack spacing="4">
                                                    <strong color="#4e4b66">Vendedor:</strong>
                                                    <Text>
                                                        Robson Seibel
                                                    </Text>
                                                </HStack>

                                                <HStack spacing="2" px="1rem">
                                                    <strong color="#4e4b66">Tabela:</strong>
                                                    <Text>
                                                        071
                                                    </Text>
                                                </HStack>
                                            </Stack>

                                            <Divider mb="3" />

                                            <Stack direction={['column', 'row']} spacing={["5", "4"]} justifyContent="space-between" mb="4">
                                                <HStack spacing="2">
                                                    <strong color="#4e4b66">Contrato:</strong>
                                                    <Text>
                                                        230495
                                                    </Text>
                                                </HStack>
                                                <HStack spacing="4">
                                                    <strong color="#4e4b66">Grupo:</strong>
                                                    <Text>
                                                        1080
                                                    </Text>
                                                </HStack>
                                                <HStack spacing="4">
                                                    <strong color="#4e4b66">Cota:</strong>
                                                    <Text>
                                                        874
                                                    </Text>
                                                </HStack>

                                                <HStack spacing="2" px="1rem">
                                                    <strong color="#4e4b66">Bem:</strong>
                                                    <Text>
                                                        imóvel
                                                    </Text>
                                                </HStack>
                                            </Stack>
                                        </AccordionPanel>
                                    </>
                                )}
                            </AccordionItem>
                        )
                    })
                }
                
            <AccordionItem display="flex" flexDir="column" paddingX={["4", "8"]} paddingTop="3" bg="white" borderTop="2px" borderTopColor="gray.500" borderBottom="0">
                {({ isExpanded }) => (
                    <>
                        <Stack spacing={["5", ""]} direction={['column', 'row']} justify="space-between" mb="3" alignItems={["", "center"]}>
                            <HStack spacing={["5", "5"]} justifyContent="space-between">
                                <HStack spacing={["3", "4"]}>
                                    <AccordionButton p="0" height="fit-content" w="auto">
                                        <Flex alignItems="center" justifyContent="center" h={["20px", "24px"]} w={["24px", "30px"]} p="0" borderRadius="full" border="2px" borderColor="red.400" variant="outline">
                                            {
                                                !isExpanded ? <StrongPlusIcon stroke="#C30052" fill="none" width="12px" /> :
                                                    <MinusIcon stroke="#C30052" fill="none" width="12px" />
                                            }
                                        </Flex>
                                    </AccordionButton>
                                </HStack>

                                <Stack direction={['column', 'row']} spacing={["1", "4"]}>
                                    <Stack fontWeight="500" alignItems="center">
                                        <Text ml="2" color="#6E7191" fontSize="10px">Data da venda</Text>
                                        <Text ml="2" color="#4e4b66" fontSize="13px">22/01/2022</Text>
                                    </Stack>
                                </Stack>
                            </HStack>
                            <HStack spacing={["5", "5"]} justifyContent="space-between">
                                <HStack spacing={["3", "4"]}>
                                    <Stack fontWeight="500" alignItems="center">
                                        <Text ml="2" color="#6E7191" fontSize="10px">Parcela</Text>
                                        <Text ml="2" color="#4e4b66" fontSize="13px">2</Text>
                                    </Stack>
                                </HStack>
                            </HStack>
                            <HStack spacing={["5", "5"]} justifyContent="space-between" fontSize={["11px", "13px"]}>
                                <HStack>
                                    <Stack direction={['column', 'row']} spacing={["1", "4"]}>
                                        <Stack fontWeight="500" alignItems="center">
                                            <Text ml="2" color="#6E7191" fontSize="10px">Crédito</Text>
                                            <Text ml="2" color="#4e4b66" fontSize="13px">R$500.000,00</Text>
                                        </Stack>
                                    </Stack>
                                </HStack>
                            </HStack>
                            <Stack direction={['column', 'row']} spacing={["1", "4"]}>
                                <Stack fontWeight="500" alignItems="center">
                                    <Text ml="2" color="#6E7191" fontSize="10px">Percentual</Text>
                                    <Text ml="2" color="#4e4b66" fontSize="13px">3%</Text>
                                </Stack>
                            </Stack>
                            <Stack direction={['column', 'row']} spacing={["1", "4"]}>
                                <Stack fontWeight="500" alignItems="center">
                                    <Badge colorScheme='green' width="110px" px="20px">Confirmada</Badge>
                                </Stack>
                                <Stack fontWeight="500" alignItems="center">
                                    <Text float="right" px="2rem" color="green.400">R$ 1.250,00</Text>
                                </Stack>
                            </Stack>
                        </Stack>

                        <AccordionPanel flexDir="column" borderTop="2px" borderColor="gray.500" px="0" py="5" fontSize={["11px", "small"]}>
                            <Stack direction={['column', 'row']} spacing={["5", "4"]} justifyContent="space-between" mb="4">
                                <HStack spacing="2">
                                    <strong color="#4e4b66">Percentual:</strong>
                                    <Text>
                                        1%
                                    </Text>
                                </HStack>
                                <HStack spacing="4">
                                    <strong color="#4e4b66">Parcela:</strong>
                                    <Text>
                                        Meia Parcela
                                    </Text>
                                </HStack>
                                <HStack spacing="4">
                                    <strong color="#4e4b66">Vendedor:</strong>
                                    <Text>
                                        Robson Seibel
                                    </Text>
                                </HStack>

                                <HStack spacing="2" px="1rem">
                                    <strong color="#4e4b66">Tabela:</strong>
                                    <Text>
                                        071
                                    </Text>
                                </HStack>
                            </Stack>

                            <Divider mb="3" />

                            <Stack direction={['column', 'row']} spacing={["5", "4"]} justifyContent="space-between" mb="4">
                                <HStack spacing="2">
                                    <strong color="#4e4b66">Contrato:</strong>
                                    <Text>
                                        230495
                                    </Text>
                                </HStack>
                                <HStack spacing="4">
                                    <strong color="#4e4b66">Grupo:</strong>
                                    <Text>
                                        1080
                                    </Text>
                                </HStack>
                                <HStack spacing="4">
                                    <strong color="#4e4b66">Cota:</strong>
                                    <Text>
                                        874
                                    </Text>
                                </HStack>

                                <HStack spacing="2" px="1rem">
                                    <strong color="#4e4b66">Bem:</strong>
                                    <Text>
                                        imóvel
                                    </Text>
                                </HStack>
                            </Stack>
                        </AccordionPanel>
                    </>
                )}
            </AccordionItem>
            <AccordionItem display="flex" flexDir="column" paddingX={["4", "8"]} paddingTop="3" bg="white" borderTop="2px" borderTopColor="gray.500" borderBottom="0">
                {({ isExpanded }) => (
                    <>
                        <Stack spacing={["5", ""]} direction={['column', 'row']} justify="space-between" mb="3" alignItems={["", "center"]}>
                            <HStack spacing={["5", "5"]} justifyContent="space-between">
                                <HStack spacing={["3", "4"]}>
                                    <AccordionButton p="0" height="fit-content" w="auto">
                                        <Flex alignItems="center" justifyContent="center" h={["20px", "24px"]} w={["24px", "30px"]} p="0" borderRadius="full" border="2px" borderColor="red.400" variant="outline">
                                            {
                                                !isExpanded ? <StrongPlusIcon stroke="#C30052" fill="none" width="12px" /> :
                                                    <MinusIcon stroke="#C30052" fill="none" width="12px" />
                                            }
                                        </Flex>
                                    </AccordionButton>
                                </HStack>

                                <Stack direction={['column', 'row']} spacing={["1", "4"]}>
                                    <Stack fontWeight="500" alignItems="center">
                                        <Text ml="2" color="#6E7191" fontSize="10px">Data da venda</Text>
                                        <Text ml="2" color="#4e4b66" fontSize="13px">22/01/2022</Text>
                                    </Stack>
                                </Stack>
                            </HStack>
                            <HStack spacing={["5", "5"]} justifyContent="space-between">
                                <HStack spacing={["3", "4"]}>
                                    <Stack fontWeight="500" alignItems="center">
                                        <Text px="0px" color="red.400" fontSize="13px">Estorno</Text>
                                    </Stack>
                                </HStack>
                            </HStack>
                            <HStack spacing={["5", "5"]} justifyContent="space-between" fontSize={["11px", "13px"]}>
                                <HStack>
                                    <Stack direction={['column', 'row']} spacing={["1", "4"]}>
                                        <Stack fontWeight="500" alignItems="center">
                                            <Text ml="2" color="#6E7191" fontSize="10px">Crédito</Text>
                                            <Text ml="2" color="#4e4b66" fontSize="13px">R$500.000,00</Text>
                                        </Stack>
                                    </Stack>
                                </HStack>
                            </HStack>
                            <Stack direction={['column', 'row']} spacing={["1", "4"]}>
                                <Stack fontWeight="500" alignItems="center">
                                    <Stack fontWeight="500" alignItems="center">
                                        <Text ml="2" color="#6E7191" fontSize="10px">Percentual</Text>
                                        <Text ml="2" color="#4e4b66" fontSize="13px">3%</Text>
                                    </Stack>
                                </Stack>
                            </Stack>
                            <Stack direction={['column', 'row']} spacing={["1", "4"]}>
                                <Stack fontWeight="500" alignItems="center">
                                    <Text float="right" px="2rem" color="red.400">R$ 20.000,00</Text>
                                </Stack>
                            </Stack>
                        </Stack>

                        <AccordionPanel flexDir="column" borderTop="2px" borderColor="gray.500" px="0" py="5" fontSize={["11px", "small"]}>
                            <Stack direction={['column', 'row']} spacing={["5", "4"]} justifyContent="space-between" mb="4">
                                <HStack spacing="2">
                                    <strong color="#4e4b66">Percentual:</strong>
                                    <Text>
                                        1%
                                    </Text>
                                </HStack>
                                <HStack spacing="4">
                                    <strong color="#4e4b66">Parcelas:</strong>
                                    <Text>
                                        4
                                    </Text>
                                </HStack>
                                <HStack spacing="4">
                                    <strong color="#4e4b66">Parcela:</strong>
                                    <Text>
                                        Meia Parcela
                                    </Text>
                                </HStack>

                                <HStack spacing="2" px="1rem">
                                    <strong color="#4e4b66">Restante:</strong>
                                    <Text>
                                        R$ 0,00
                                    </Text>
                                </HStack>
                            </Stack>

                            <Divider mb="3" />

                            <Stack direction={['column', 'row']} spacing={["5", "4"]} justifyContent="space-between" mb="4">
                                <HStack spacing="2">
                                    <strong color="#4e4b66">Contrato:</strong>
                                    <Text>
                                        230495
                                    </Text>
                                </HStack>
                                <HStack spacing="4">
                                    <strong color="#4e4b66">Grupo:</strong>
                                    <Text>
                                        1080
                                    </Text>
                                </HStack>
                                <HStack spacing="4">
                                    <strong color="#4e4b66">Cota:</strong>
                                    <Text>
                                        874
                                    </Text>
                                </HStack>

                                <HStack spacing="2" px="1rem">
                                    <strong color="#4e4b66">Bem:</strong>
                                    <Text>
                                        imóvel
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
        </Accordion>
    )
}