import { Accordion, AccordionButton, AccordionItem, AccordionPanel, Box, Flex, HStack, Spinner, Stack, Td, Text, Tr } from "@chakra-ui/react";
import { Board } from "../../../components/Board";
import { SolidButton } from "../../../components/Buttons/SolidButton";
import { useEffect, useState } from "react";

import { ReactComponent as PlusIcon } from '../../../assets/icons/Plus.svg';
import { ReactComponent as MinusIcon } from '../../../assets/icons/Minus.svg';
import { ReactComponent as StrongPlusIcon } from '../../../assets/icons/StrongPlus.svg';
import { ReactComponent as ForwardArrow } from '../../../assets/icons/Forward Arrow.svg'
import { OutlineButton } from "../../../components/Buttons/OutlineButton";
import { EditButton } from "../../../components/Buttons/EditButton";
import { Table } from "../../../components/Table";
import { RemoveButton } from "../../../components/Buttons/RemoveButton";
import { CompanyCommissionRule, CompanyCommissionRuleParcel, SellerCommissionRule, SellerCommissionRuleParcel } from "../../../types";
import { api } from "../../../services/api";
import { NewSellerRuleModal } from "./NewSellerRuleModal";
import { useParams } from "react-router-dom";
import { EditSellerRuleModal, EditNewSellerRuleFormData } from "./EditSellerRuleModal";
import { NewSellerRuleParcelModal } from "./NewSellerRuleParcelModal";
import { EditSellerRuleParcelModal, EditNewSellerRuleParcelFormData } from "./EditSellerRuleParcelModal";
import { ConfirmSellerRuleParcelRemoveModal } from "./ConfirmSellerRuleParcelRemoveModal";
import { useSellerCommissionRules } from "../../../hooks/useSellerCommissionRules";
import { ConfirmSellerRuleRemoveModal } from "./ConfirmSellerRuleRemoveModal";

interface CompanyParams {
    id: string
}

interface SellerCommissionRulesProps{
    companyId?:number;
    branchId?:number;
}

export function SellerCommissionRules({companyId, branchId}: SellerCommissionRulesProps){
    const sellerRules = useSellerCommissionRules({
        company_id: companyId,
        branch_id: branchId
    });

    const [isNewSellerRuleModalOpen, setIsNewSellerRuleModalOpen] = useState(false);

    function OpenNewSellerRuleModal() {
        setIsNewSellerRuleModalOpen(true)
    }
    function CloseNewSellerRuleModal() {
        setIsNewSellerRuleModalOpen(false)
    }

    const [sellerSellerRuleData, setEditSellerRuleData] = useState<EditNewSellerRuleFormData>(() => {
        const data: EditNewSellerRuleFormData = {
            id: 0,
            name: '',
            company_id: 0,
            branch_id: 0,
            chargeback_type_id: 0,
            half_installment: false,
            pay_in_contemplation: false,
            percentage_paid_in_contemplation: 0,
        };
        
        return data;
    });
    const [isEditSellerRuleModalOpen, setIsEditSellerRuleModalOpen] = useState(false);

    function OpenEditSellerRuleModal(sellerRuleData: EditNewSellerRuleFormData) {
        setIsEditSellerRuleModalOpen(true)
        setEditSellerRuleData(sellerRuleData);
    }
    function CloseEditSellerRuleModal() {
        setIsEditSellerRuleModalOpen(false)
    }

    const [sellerCommissionRuleId, setSellerCommissionRuleId] = useState(1);
    const [isNewSellerRuleParcelModalOpen, setIsNewSellerRuleParcelModalOpen] = useState(false);

    function OpenNewSellerRuleParcelModal(SellerCommissionRuleId: number) {
        setSellerCommissionRuleId(SellerCommissionRuleId);
        setIsNewSellerRuleParcelModalOpen(true)
    }
    function CloseNewSellerRuleParcelModal() {
        setIsNewSellerRuleParcelModalOpen(false)
    }

    const [editCompanyRuleParcelData, setEditSellerRuleParcelData] = useState<EditNewSellerRuleParcelFormData>(() => {
        const data: EditNewSellerRuleParcelFormData = {
            id: 0,
            parcel_number: 0,
            percentage_to_pay: 0,
            chargeback_percentage: 0,
            seller_commission_rule_id: 0
        };
        
        return data;
    });
    const [isEditCompanyRuleParcelModalOpen, setIsEditCompanyRuleParcelModalOpen] = useState(false);

    function OpenEditCompanyRuleParcelModal(sellerRuleParcel: EditNewSellerRuleParcelFormData) {
        setIsEditCompanyRuleParcelModalOpen(true)
        setEditSellerRuleParcelData(sellerRuleParcel);
    }
    function CloseEditCompanyRuleParcelModal() {
        setIsEditCompanyRuleParcelModalOpen(false)
    }

    const [isConfirmSellerRuleParcelRemoveModalOpen, setIsConfirmSellerRuleParcelRemoveModalOpen] = useState(false);

    function OpenConfirmSellerRuleParcelRemoveModal(sellerRuleParcel: EditNewSellerRuleParcelFormData) {
        setIsConfirmSellerRuleParcelRemoveModalOpen(true)
        setEditSellerRuleParcelData(sellerRuleParcel);
    }
    function CloseConfirmSellerRuleParcelRemoveModal() {
        setIsConfirmSellerRuleParcelRemoveModalOpen(false)
    }

    const [isConfirmCompanyRuleRemoveModalOpen, setIsConfirmSellerRuleRemoveModalOpen] = useState(false);

    function OpenConfirmSellerRuleRemoveModal(sellerRule: EditNewSellerRuleFormData) {
        setIsConfirmSellerRuleRemoveModalOpen(true)
        setEditSellerRuleData(sellerRule);
    }
    function CloseConfirmSellerRuleRemoveModal() {
        setIsConfirmSellerRuleRemoveModalOpen(false)
    }

    return(
        <Board p="0" pb="8" overflow="hidden">
            <NewSellerRuleModal companyId={companyId} branchId={branchId} afterCreate={sellerRules.refetch} isOpen={isNewSellerRuleModalOpen} onRequestClose={CloseNewSellerRuleModal}/>
            <EditSellerRuleModal toEditSellerRuleData={sellerSellerRuleData} afterEdit={sellerRules.refetch} isOpen={isEditSellerRuleModalOpen} onRequestClose={CloseEditSellerRuleModal}/>
            <ConfirmSellerRuleRemoveModal toRemoveSellerRuleData={sellerSellerRuleData} afterRemove={sellerRules.refetch} isOpen={isConfirmCompanyRuleRemoveModalOpen} onRequestClose={CloseConfirmSellerRuleRemoveModal}/>

            <NewSellerRuleParcelModal sellerCommissionRuleId={sellerCommissionRuleId} afterCreate={sellerRules.refetch} isOpen={isNewSellerRuleParcelModalOpen} onRequestClose={CloseNewSellerRuleParcelModal}/>
            <EditSellerRuleParcelModal toEditSellerRuleParcelData={editCompanyRuleParcelData} afterEdit={sellerRules.refetch} isOpen={isEditCompanyRuleParcelModalOpen} onRequestClose={CloseEditCompanyRuleParcelModal}/>
            <ConfirmSellerRuleParcelRemoveModal toRemoveSellerRuleParcelData={editCompanyRuleParcelData} afterRemove={sellerRules.refetch} isOpen={isConfirmSellerRuleParcelRemoveModalOpen} onRequestClose={CloseConfirmSellerRuleParcelRemoveModal}/>

            <HStack justifyContent="space-between" p={[4, 4, 9]}>
                <HStack spacing="4">
                    <ForwardArrow stroke="#C30052" fill="none" width="20px"/>
                    <Text fontSize="xl">Regra de comissão de PAGAMENTO</Text>
                </HStack>

                <SolidButton
                    onClick={() => OpenNewSellerRuleModal()}
                    mb="12"
                    color="white"
                    bg="purple.300"
                    icon={PlusIcon}
                    colorScheme="purple"
                >
                    Adicionar regra
                </SolidButton>
            </HStack>

            {   sellerRules.isLoading ? (
                    <Flex justify="left" px="8">
                        <Spinner/>
                    </Flex>
                ) : ( sellerRules.isError ? (
                    <Flex justify="left" mt="4" mb="4" px="8">
                        <Text>Erro listar as regras de comissão da empresa</Text>
                    </Flex>
                ) : (sellerRules.data?.data.length === 0) && (
                    <Flex justify="left" px="8">
                        <Text>Nenhuma regra de comissão da empresa encontrada.</Text>
                    </Flex>
                ) ) 
            }

            {
                (!sellerRules.isLoading && !sellerRules.error) && sellerRules.data?.data.map((rule: SellerCommissionRule) => {
                    return(
                        <Accordion key={rule.id} w="100%" overflow="hidden" spacing="0" allowMultiple>
                            <HStack spacing="8" justify="space-between" paddingX={["4", "8"]} paddingY="3" color="gray.700" fontSize="sm">
                                <Box w="30px"/>

                                <Text>Título</Text>
                                <Text>Status</Text>
                                <Text>Usuários</Text>

                                <Box w="30px"/>
                            </HStack>

                            <AccordionItem display="flex" flexDir="column" paddingX={["4", "8"]} paddingTop="3" bg="white" borderTop="2px" borderTopColor="gray.500" borderBottom="0">
                                {({ isExpanded }) => (
                                    <>
                                        <Stack spacing={["5", ""]} direction={['column', 'row']} justify="space-between" mb="3" alignItems={["", "center"]}>
                                            <AccordionButton p="0" height="50" w="auto">
                                                <Flex alignItems="center" justifyContent="center" h={["20px", "24px"]} w={["24px", "30px"]} p="0" borderRadius="full" border="2px" borderColor="purple.300" variant="outline">
                                                { 
                                                        !isExpanded ? <StrongPlusIcon stroke="#5f2eea" fill="none" width="12px"/> :
                                                        <MinusIcon stroke="#5f2eea" fill="none" width="12px"/>
                                                } 
                                                </Flex>
                                            </AccordionButton>

                                            <Text>{rule.name}</Text>

                                            <Text>Ativa</Text>

                                            <OutlineButton
                                                size="sm"
                                                colorScheme="purple"
                                                h="28px"
                                                px="5"
                                            >
                                                Visualizar
                                            </OutlineButton>

                                            <HStack>
                                                <EditButton onClick={() => OpenEditSellerRuleModal(rule)}></EditButton>
                                                <RemoveButton onClick={() => OpenConfirmSellerRuleRemoveModal(rule)}/>
                                            </HStack>
                                        </Stack>

                                        <AccordionPanel flexDir="column" borderTop="2px" borderColor="gray.500" px="0" py="5" fontSize={["11px", "small"]}>
                                            <Stack direction={['column', 'row']} spacing={["5", "4"]} justifyContent="space-between" mb="5">
                                                <Stack fontSize="sm">
                                                    <Text color="gray.700">Forma de estorno</Text>
                                                    <Text>{rule.chargeback_type.description}</Text>
                                                </Stack>

                                                <Stack fontSize="sm">
                                                    <Text color="gray.700">Meia parcela</Text>
                                                    <Text>{rule.half_installment ? "Sim" : "Não"}</Text>
                                                </Stack>

                                                <Stack fontSize="sm">
                                                    <Text color="gray.700">Pago na contemplação</Text>
                                                    <Text>{rule.pay_in_contemplation ? "Sim" : "Não"}</Text>
                                                </Stack>

                                                <Stack fontSize="sm">
                                                    <Text color="gray.700">Percentual na contemplação</Text>
                                                    <Text>{rule.percentage_paid_in_contemplation}</Text>
                                                </Stack>
                                            </Stack>

                                            <Stack borderTop="2px" borderColor="gray.200" spacing={["5", "4"]} justifyContent="space-between" mb="4" pt="5">
                                                <HStack justifyContent="space-between" w="100%">
                                                    <Text fontSize="lg">Parcelas</Text>

                                                    <SolidButton
                                                        onClick={() => OpenNewSellerRuleParcelModal(rule.id)}
                                                        mb="12"
                                                        color="white"
                                                        bg="purple.300"
                                                        icon={PlusIcon}
                                                        colorScheme="purple"
                                                    >
                                                        Adicionar parcela
                                                    </SolidButton>
                                                </HStack>

                                                <Table
                                                    header={[
                                                    {
                                                        text: 'Número'
                                                    },
                                                    {
                                                        text: 'Percentual a receber'
                                                    },
                                                    {
                                                        text: 'Percentual de estorno'
                                                    },
                                                    {
                                                        text: ''
                                                    }
                                                    ]}
                                                >
                                                    {
                                                        rule.seller_commission_rule_parcels.map((sellerCommissionRuleParcel: SellerCommissionRuleParcel) => {
                                                            return(
                                                                <Tr borderTop="1px" borderColor="gray.200">
                                                                    <Td>{sellerCommissionRuleParcel.parcel_number}</Td>
                                                                    <Td>{sellerCommissionRuleParcel.percentage_to_pay}%</Td>
                                                                    <Td>{sellerCommissionRuleParcel.chargeback_percentage}%</Td>
                                                                    <Td>
                                                                        <HStack>
                                                                            <EditButton onClick={() => OpenEditCompanyRuleParcelModal({...sellerCommissionRuleParcel, seller_commission_rule_id: rule.id})}/>
                                                                            <RemoveButton onClick={() => OpenConfirmSellerRuleParcelRemoveModal({...sellerCommissionRuleParcel, seller_commission_rule_id: rule.id})}/>
                                                                        </HStack>
                                                                    </Td>
                                                                </Tr>
                                                            )
                                                        })
                                                    }
                                                </Table>
                                            </Stack>
                                        </AccordionPanel>
                                    </>
                                )}
                            </AccordionItem>
                        </Accordion>
                    )
                })
            }
        </Board>
    )
}