import { Accordion, AccordionButton, AccordionItem, AccordionPanel, Badge as ChakraBadge, Checkbox, Flex, HStack, Stack, Text } from "@chakra-ui/react";
import Badge from "../../../components/Badge";
import { OutlineButton } from "../../../components/Buttons/OutlineButton";
import { CompanySelectMaster } from "../../../components/CompanySelect/companySelectMaster";
import { MainBoard } from "../../../components/MainBoard";

import { ReactComponent as PlusIcon } from '../../../assets/icons/Plus.svg';
import { ReactComponent as MinusIcon } from '../../../assets/icons/Minus.svg';
import { ReactComponent as StrongPlusIcon } from '../../../assets/icons/StrongPlus.svg';
import { HasPermission, useProfile } from "../../../hooks/useProfile";
import { EditButton } from "../../../components/Buttons/EditButton";
import { RemoveButton } from "../../../components/Buttons/RemoveButton";

export default function Leads(){
    const { permissions } = useProfile();

    const isManager = HasPermission(permissions, 'Vendas Completo');

    return (
        <MainBoard sidebar="commercial" header={<CompanySelectMaster />}>
            <Accordion w="100%" border="2px" borderColor="gray.500" borderRadius="26" overflow="hidden" spacing="0" allowMultiple>
                
                <HStack spacing="8" justify="space-between" paddingX="8" paddingY="3" bg="gray.200">
                    <Text>25 pendentes</Text>

                    {
                        isManager && (
                            <OutlineButton h="30px" size="sm" fontSize="11" color="orange.400" borderColor="orange.400" colorScheme="orange">
                                Delegar selecionados
                            </OutlineButton>
                        )
                    }
                </HStack>

                <AccordionItem display="flex" flexDir="column" paddingX="8" paddingTop="3" bg="white" borderTop="2px" borderTopColor="gray.500" borderBottom="0">
                    {({ isExpanded }) => (
                        <>
                            <HStack justify="space-between" mb="3">
                                <AccordionButton p="0" height="fit-content" w="auto">
                                    <Flex alignItems="center" justifyContent="center" h="24px" w="30px" p="0" borderRadius="full" border="2px" borderColor="orange.400" variant="outline">
                                    { 
                                            !isExpanded ? <StrongPlusIcon stroke="#f24e1e" fill="none" width="12px"/> :
                                            <MinusIcon stroke="#f24e1e" fill="none" width="12px"/>
                                    } 
                                    </Flex>
                                </AccordionButton>

                                {/* <ControlledCheckbox label="Pendência" control={control} defaultIsChecked={toEditPaymentData.pendency} name="pendency" error={formState.errors.pendency}/> */}
                                {
                                    isManager && (
                                        <>
                                            <Checkbox label="" name="delegate"/>
                                        </>
                                    )
                                }
                                
                                <Stack spacing="0">
                                    <Text fontSize="10px" color="gray.800">16:30</Text>
                                    <Text fontSize="sm" fontWeight="normal" color="gray.800">12/07/2021</Text>
                                </Stack>

                                <Stack spacing="0">
                                    <Text fontSize="sm" fontWeight="bold" color="gray.800">Anderson Pereira</Text>
                                    <Text fontSize="11px" fontWeight="normal" color="gray.800">(51) 9 9109-0100</Text>
                                </Stack>

                                <Stack spacing="0">
                                    <Text fontSize="sm" fontWeight="normal" color="gray.800">Dois Irmãos</Text>
                                    <Text fontSize="11px" fontWeight="normal" color="gray.800">RS</Text>
                                </Stack>

                                <Text fontSize="sm" fontWeight="normal" color="gray.800">Veículo - R$50.000,00</Text>

                                <Text fontSize="sm" fontWeight="normal" color="gray.800">Site</Text>

                                <Badge colorScheme="purple" color="white" bg="purple.500" display="flex" borderRadius="full" px="5" py="0" h="29px" alignItems="center"><Text>Novo!</Text></Badge>

                                <OutlineButton h="30px" size="sm" fontSize="11" color="orange.400" borderColor="orange.400" colorScheme="orange">
                                    Delegar
                                </OutlineButton>
                            </HStack>

                            <AccordionPanel flexDir="column" borderTop="2px" borderColor="gray.500" px="0" py="5">
                                <HStack justifyContent="space-between" mb="4">
                                    <Stack fontSize="sm" spacing="3">
                                        <Text fontWeight="bold">Anotações</Text>

                                        <HStack>
                                            <Text color="gray.800" fontWeight="semibold">12/05/2020 -</Text>
                                            <Text color="gray.800">Não tem interesse no momento, pediu para ligar em Novembro.</Text>
                                        </HStack>

                                        <HStack>
                                            <Text color="gray.800" fontWeight="semibold">12/05/2020 -</Text>
                                            <Text color="gray.800">Não tem interesse no momento, pediu para ligar em Novembro.</Text>
                                        </HStack>

                                        <HStack>
                                            <Text color="gray.800" fontWeight="semibold">12/05/2020 -</Text>
                                            <Text color="gray.800">Não tem interesse no momento, pediu para ligar em Novembro.</Text>
                                        </HStack>
                                    </Stack>

                                    <HStack spacing="5" alignItems="center">
                                        <EditButton/>
                                        <RemoveButton/>
                                    </HStack>
                                </HStack>
                            </AccordionPanel>
                        </>
                    )}
                </AccordionItem>
            </Accordion>
        </MainBoard>
    )
}