import { Flex, HStack, Stack, Text, Accordion, AccordionItem, AccordionButton, AccordionPanel, Divider } from '@chakra-ui/react'
import { useProfile } from '../../../hooks/useProfile'

import { ReactComponent as MinusIcon } from '../../../assets/icons/Minus.svg';
import { ReactComponent as StrongPlusIcon } from '../../../assets/icons/StrongPlus.svg';

import Badge from '../../../components/Badge'
import { formatBRDate } from '../../../utils/Date/formatBRDate';
import {  Contract } from "../../../types";
import { EditQuotaFormData } from './EditQuotaModal';
import { EditButton } from '../../../components/Buttons/EditButton';
import { RemoveButton } from '../../../components/Buttons/RemoveButton';
import { RemoveSaleData } from './ConfirmContractRemoveModal';

interface CommissionsContractProps{
    commissionsContract: Contract[];
    OpenEditQuotaModal: (quotaFormData:EditQuotaFormData) => void;
    OpenRemoveQuotaModal: (quotaFormData:RemoveSaleData) => void;
    totalCount: number;
    totalCredit: number;
}


export default function CommissionsContracts({commissionsContract, OpenEditQuotaModal, OpenRemoveQuotaModal, totalCount, totalCredit}: CommissionsContractProps) {
    const { profile, permissions } = useProfile()

    const totalMonthAmount = commissionsContract.reduce((sumAmount:number, commissionsContract:Contract) => {
        if(commissionsContract.quota){
            return sumAmount + commissionsContract.quota.credit;
        }

        return 0;
    }, 0);

    return (
        <Accordion w="100%" border="2px" borderColor="gray.500" borderRadius="26" overflow="hidden" allowMultiple>
            <HStack spacing="8" justify="space-between" paddingX={["4", "8"]} paddingY="3" bg="gray.200">
                <Stack direction={["column", "row"]} spacing={["4", "6"]} alignItems="baseline" mt={["1", "0"]}>
                    <Text fontWeight="bold" fontSize="11px">Data inicial e final</Text>

                    <Text fontWeight="bold" px="6rem">{totalCount} contratos</Text>

                    <Text fontWeight="bold" px="2rem" color="#6E7191">Créditos: {Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(totalCredit)}</Text>
                </Stack>
                {/* <Stack direction={["column", "row"]} spacing={["3", "6"]} alignItems={["flex-end", "center"]}>

                    <Text float="right" textAlign="right" px="40px" color="red.400"><strong>{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(totalMonthAmount)}</strong></Text>
                </Stack> */}
            </HStack>
            {
                    commissionsContract.map((commissionsContract:Contract) => {
             return commissionsContract.quota && (
             <>
            <AccordionItem key={commissionsContract.id} display="flex" flexDir="column" paddingX={["4", "8"]} paddingTop="3" bg="white" borderTop="2px" borderTopColor="gray.500" borderBottom="0">
                {({ isExpanded }) => (
                    <>
                        <Stack spacing={["5", ""]} direction={['column', 'row']} justify="space-between" mb="3" alignItems={["", "center"]}>
                            <HStack spacing={["5", "5"]} justifyContent="space-between">
                                <HStack spacing={["3", "4"]}>
                                    <AccordionButton p="0" height="fit-content" w="auto">
                                        <Flex alignItems="center" justifyContent="center" h={["20px", "24px"]} w={["24px", "30px"]} p="0" borderRadius="full" border="2px" borderColor="red.400">
                                            {
                                                !isExpanded ? <StrongPlusIcon stroke="#C30052" fill="none" width="12px" /> :
                                                    <MinusIcon stroke="#C30052" fill="none" width="12px" />
                                            }
                                        </Flex>
                                    </AccordionButton>
                                </HStack>

                                <Stack direction={['column', 'row']} spacing={["1", "4"]}>
                                    <Stack fontWeight="500" alignItems="center">
                                        <Text ml="2" color="#000" fontSize="13px">{commissionsContract.number_contract}</Text>
                                    </Stack>
                                </Stack>
                            </HStack>
                            <HStack spacing={["5", "5"]} justifyContent="space-between">
                                <HStack spacing={["3", "4"]}>
                                    <Stack fontWeight="500" alignItems="center">
                                        <Text ml="2" color="#6E7191" fontSize="10px">Data da venda</Text>
                                        <Text ml="2" color="#4e4b66" fontSize="13px">{formatBRDate(commissionsContract.quota.date_sale)}</Text>
                                    </Stack>
                                </HStack>
                            </HStack>
                            <HStack spacing={["5", "5"]} justifyContent="space-between" fontSize={["11px", "13px"]}>
                                <HStack>
                                    <Stack direction={['column', 'row']} spacing={["1", "4"]}>
                                        <Stack fontWeight="500" alignItems="center">
                                            <Text ml="2" color="#6E7191" fontSize="10px">Bem</Text>
                                            <Text ml="2" color="#4e4b66" fontSize="13px">{commissionsContract.quota.consortium_type.description}</Text>
                                        </Stack>
                                    </Stack>
                                </HStack>
                            </HStack>
                            <Stack direction={['column', 'row']} spacing={["1", "4"]}>
                                <Stack fontWeight="500" alignItems="center">
                                    <Text ml="2" color="#6E7191" fontSize="10px">Grupo-Cota</Text>
                                    <Text ml="2" color="#4e4b66" fontSize="13px">{commissionsContract.quota.group} - {commissionsContract.quota.quota}</Text>
                                </Stack>
                            </Stack>
                            <HStack spacing={["5", "5"]} justifyContent="space-between" fontSize={["11px", "13px"]}>
                                <HStack>
                                    <Stack direction={['column', 'row']} spacing={["1", "4"]}>
                                        <Stack fontWeight="500" alignItems="center">
                                            <Text ml="2" color="#6E7191" fontSize="10px">Vendedor</Text>
                                            <Text ml="2" color="#4e4b66" fontSize="13px">{commissionsContract.quota.seller && `${commissionsContract.quota.seller.name} ${commissionsContract.quota.seller?.last_name}`}</Text>
                                        </Stack>
                                    </Stack>
                                </HStack>
                            </HStack>
                            <Stack direction={['column', 'row']} spacing={["1", "4"]}>
                                <Stack fontWeight="500" alignItems="center" justifyContent={"center"}>
                                {
                                    !commissionsContract.quota.is_chargeback ? (
                                        <Badge colorScheme={commissionsContract.quota.active ? "green" : "yellow"} width="110px" px="20px">{commissionsContract.quota.active ? "Confirmado" : "Pendente"}</Badge>
                                    ) : (
                                        <Badge colorScheme="red" width="110px" px="27px">Estorno</Badge>
                                    )
                                }
                                </Stack>
                                <Stack fontWeight="500" alignItems="center">
                                    <Text float="right" px="2rem">Crédito</Text>
                                    <Text float="right" px="2rem">{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(commissionsContract.quota.credit)}</Text>
                                </Stack>
                            </Stack>
                        </Stack>

                        <AccordionPanel flexDir="column" borderTop="2px" borderColor="gray.500" px="0" py="5" fontSize={["11px", "small"]}>
                            <Stack direction={['column', 'row']} spacing={["5", "4"]} justifyContent="space-between" mb="4">
                                <HStack spacing="4">
                                    <strong color="#4e4b66">Cliente:</strong>
                                    <Text>
                                    {commissionsContract.quota.customer.name}
                                    </Text>
                                </HStack>

                                <HStack spacing="2" px="1rem">
                                    <strong color="#4e4b66">Parcelas pagas:</strong>
                                    <Text>
                                    {commissionsContract.quota.installments_paid}
                                    </Text>
                                </HStack>

                                <HStack spacing="2" px="1rem">
                                    <strong color="#4e4b66">Contemplação:</strong>
                                    <Text>
                                    {commissionsContract.quota.date_contemplation ? commissionsContract.quota.date_contemplation : '--'}
                                    </Text>
                                </HStack>

                                <HStack spacing="2" px="1rem">
                                    <strong color="#4e4b66">Versão:</strong>
                                    <Text>
                                    {commissionsContract.quota.version}
                                    </Text>
                                </HStack>
                            </Stack>

                            {
                                commissionsContract.quotas.map((quota) => {
                                    return(
                                        <Stack key={quota.id}>
                                            <Divider mb="3" />

                                            <Stack color="gray.500" direction={['column', 'row']} spacing={["5", "4"]} justifyContent="space-between" mb="4">
                                                <HStack spacing="2">
                                                    <strong color="#A0A3BD">Grupo-Cota:</strong>
                                                    <Text>
                                                    {commissionsContract.quota.group}
                                                    </Text>
                                                </HStack>
                                                <HStack spacing="4">
                                                    <strong color="#A0A3BD">Cliente:</strong>
                                                    <Text>
                                                        {commissionsContract.quota.customer.name}
                                                    </Text>
                                                </HStack>
                                                <HStack spacing="4">
                                                    <strong color="#A0A3BD">Bem:</strong>
                                                    <Text>
                                                    {commissionsContract.quota.consortium_type.description}
                                                    </Text>
                                                </HStack>

                                                <HStack spacing="2" px="1rem">
                                                    <strong color="#A0A3BD">Crédito:</strong>
                                                    <Text>
                                                    {Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(commissionsContract.quota.credit)}
                                                    </Text>
                                                </HStack>
                                            </Stack>
                                        </Stack>
                                    )
                                })
                            }
                            <HStack justifyContent={"end"}>
                                <EditButton onClick={() => OpenEditQuotaModal({consortium_type_id: commissionsContract.quota.consortium_type.id.toString(), credit: commissionsContract.quota.credit.toFixed(2).replace(".", ","), group:commissionsContract.quota.group, quota:commissionsContract.quota.quota, id: commissionsContract.quota.id, date_sale: commissionsContract.quota.date_sale })} />
                                <RemoveButton onClick={() => OpenRemoveQuotaModal({ id: commissionsContract.id, quota: commissionsContract.quota.quota, group:commissionsContract.quota.group }) }/>
                            </HStack>
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