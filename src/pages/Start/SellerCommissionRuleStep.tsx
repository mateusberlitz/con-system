import { Accordion, AccordionButton, AccordionItem, AccordionPanel, Box, Flex, Heading, HStack, Icon, Spinner, Stack, Td, Text, Tr } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Board } from "../../components/Board";
import { EditButton } from "../../components/Buttons/EditButton";
import { RemoveButton } from "../../components/Buttons/RemoveButton";
import { api } from "../../services/api";
import { Branch, Company, SellerCommissionRule, SellerCommissionRuleParcel } from "../../types";

import { ReactComponent as LocationIcon } from '../../assets/icons/Location.svg';
import { ReactComponent as CallIcon } from '../../assets/icons/Call.svg';
import { ReactComponent as PlusIcon } from '../../assets/icons/Plus.svg';
import { ReactComponent as MinusIcon } from '../../assets/icons/Minus.svg';
import { ReactComponent as StrongPlusIcon } from '../../assets/icons/StrongPlus.svg';
import { ReactComponent as ForwardArrow } from '../../assets/icons/Forward Arrow.svg'

import { SolidButton } from "../../components/Buttons/SolidButton";
import { NewCompanyModal } from "../configs/Companys/NewCompanyModal";
import { ConfirmCompanyRemoveModal } from "../configs/Companys/ConfirmCompanyRemoveModal";
import { EditCompanyModal } from "../configs/Companys/EditCompanyModal";
import { EditNewSellerRuleParcelFormData, EditSellerRuleParcelModal } from "../configs/SellerCommissionsRules/EditSellerRuleParcelModal";
import { EditNewSellerRuleFormData, EditSellerRuleModal } from "../configs/SellerCommissionsRules/EditSellerRuleModal";
import { NewSellerRuleModal } from "../configs/SellerCommissionsRules/NewSellerRuleModal";
import { ConfirmSellerRuleRemoveModal } from "../configs/SellerCommissionsRules/ConfirmSellerRuleRemoveModal";
import { NewSellerRuleParcelModal } from "../configs/SellerCommissionsRules/NewSellerRuleParcelModal";
import { ConfirmSellerRuleParcelRemoveModal } from "../configs/SellerCommissionsRules/ConfirmSellerRuleParcelRemoveModal";
import { OutlineButton } from "../../components/Buttons/OutlineButton";
import { Table } from "../../components/Table";

interface SellerCommissionStepProps{
    firstSellerCommissionRule?:SellerCommissionRule | undefined;
    setFirstSellerCommissionRule: (sellerCommissionRule: SellerCommissionRule) => void;
    firstCompany: Company | undefined;
    firstBranch: Branch  | undefined;
}

export function SellerCommissionRuleStep({firstSellerCommissionRule, setFirstSellerCommissionRule, firstCompany, firstBranch} : SellerCommissionStepProps){

    const fetchSellerCommissionRule = async () => {
        api.get('/seller-commission-rules').then(response => {
            setFirstSellerCommissionRule(response.data.data[0]);
        });
    }

    useEffect(() => {
        fetchSellerCommissionRule();
    }, []);


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

    return (
        <>
            {
                (firstBranch && firstCompany) && (
                    <NewSellerRuleModal companyId={firstCompany.id} branchId={firstBranch.id} afterCreate={fetchSellerCommissionRule} isOpen={isNewSellerRuleModalOpen} onRequestClose={CloseNewSellerRuleModal}/>
                )
            }
            <EditSellerRuleModal toEditSellerRuleData={sellerSellerRuleData} afterEdit={fetchSellerCommissionRule} isOpen={isEditSellerRuleModalOpen} onRequestClose={CloseEditSellerRuleModal}/>
            <ConfirmSellerRuleRemoveModal toRemoveSellerRuleData={sellerSellerRuleData} afterRemove={fetchSellerCommissionRule} isOpen={isConfirmCompanyRuleRemoveModalOpen} onRequestClose={CloseConfirmSellerRuleRemoveModal}/>

            <NewSellerRuleParcelModal sellerCommissionRuleId={sellerCommissionRuleId} afterCreate={fetchSellerCommissionRule} isOpen={isNewSellerRuleParcelModalOpen} onRequestClose={CloseNewSellerRuleParcelModal}/>
            <EditSellerRuleParcelModal toEditSellerRuleParcelData={editCompanyRuleParcelData} afterEdit={fetchSellerCommissionRule} isOpen={isEditCompanyRuleParcelModalOpen} onRequestClose={CloseEditCompanyRuleParcelModal}/>
            <ConfirmSellerRuleParcelRemoveModal toRemoveSellerRuleParcelData={editCompanyRuleParcelData} afterRemove={fetchSellerCommissionRule} isOpen={isConfirmSellerRuleParcelRemoveModalOpen} onRequestClose={CloseConfirmSellerRuleParcelRemoveModal}/>
        
            {
                firstSellerCommissionRule ? (
                    <Board p="0" pb="8" overflow="hidden">
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

                        {   !firstSellerCommissionRule && (
                                <Flex justify="left" px="8">
                                    <Spinner/>
                                </Flex>
                            ) 
                        }

                        {
                            firstSellerCommissionRule && (
                                    <Accordion w="100%" overflow="hidden" allowMultiple>
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
                                                            <Flex alignItems="center" justifyContent="center" h={["20px", "24px"]} w={["24px", "30px"]} p="0" borderRadius="full" border="2px" borderColor="purple.300">
                                                            { 
                                                                    !isExpanded ? <StrongPlusIcon stroke="#5f2eea" fill="none" width="12px"/> :
                                                                    <MinusIcon stroke="#5f2eea" fill="none" width="12px"/>
                                                            } 
                                                            </Flex>
                                                        </AccordionButton>

                                                        <Text>{firstSellerCommissionRule.name}</Text>

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
                                                            <EditButton onClick={() => OpenEditSellerRuleModal(firstSellerCommissionRule)}></EditButton>
                                                            <RemoveButton onClick={() => OpenConfirmSellerRuleRemoveModal(firstSellerCommissionRule)}/>
                                                        </HStack>
                                                    </Stack>

                                                    <AccordionPanel flexDir="column" borderTop="2px" borderColor="gray.500" px="0" py="5" fontSize={["11px", "small"]}>
                                                        <Stack direction={['column', 'row']} spacing={["5", "4"]} justifyContent="space-between" mb="5">
                                                            <Stack fontSize="sm">
                                                                <Text color="gray.700">Forma de estorno</Text>
                                                                <Text>{firstSellerCommissionRule.chargeback_type.description}</Text>
                                                            </Stack>

                                                            <Stack fontSize="sm">
                                                                <Text color="gray.700">Meia parcela</Text>
                                                                <Text>{firstSellerCommissionRule.half_installment ? "Sim" : "Não"}</Text>
                                                            </Stack>

                                                            <Stack fontSize="sm">
                                                                <Text color="gray.700">Pago na contemplação</Text>
                                                                <Text>{firstSellerCommissionRule.pay_in_contemplation ? "Sim" : "Não"}</Text>
                                                            </Stack>

                                                            <Stack fontSize="sm">
                                                                <Text color="gray.700">Percentual na contemplação</Text>
                                                                <Text>{firstSellerCommissionRule.percentage_paid_in_contemplation}</Text>
                                                            </Stack>
                                                        </Stack>

                                                        <Stack borderTop="2px" borderColor="gray.200" spacing={["5", "4"]} justifyContent="space-between" mb="4" pt="5">
                                                            <HStack justifyContent="space-between" w="100%">
                                                                <Text fontSize="lg">Parcelas</Text>

                                                                <SolidButton
                                                                    onClick={() => OpenNewSellerRuleParcelModal(firstSellerCommissionRule.id)}
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
                                                                    firstSellerCommissionRule.seller_commission_rule_parcels.map((sellerCommissionRuleParcel: SellerCommissionRuleParcel) => {
                                                                        return(
                                                                            <Tr borderTop="1px" borderColor="gray.200">
                                                                                <Td>{sellerCommissionRuleParcel.parcel_number}</Td>
                                                                                <Td>{sellerCommissionRuleParcel.percentage_to_pay}%</Td>
                                                                                <Td>{sellerCommissionRuleParcel.chargeback_percentage}%</Td>
                                                                                <Td>
                                                                                    <HStack>
                                                                                        <EditButton onClick={() => OpenEditCompanyRuleParcelModal({...sellerCommissionRuleParcel, seller_commission_rule_id: firstSellerCommissionRule.id})}/>
                                                                                        <RemoveButton onClick={() => OpenConfirmSellerRuleParcelRemoveModal({...sellerCommissionRuleParcel, seller_commission_rule_id: firstSellerCommissionRule.id})}/>
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
                        }
                    </Board>
                ) : (
                    <Stack spacing="10" border="1px solid" borderColor="gray.200" borderRadius="24" width={["100%", "45%"]} maxW="100%" p="10">
                        <Text fontWeight="700" fontSize="2xl">Cadastre sua primeira regra de pagamento</Text>
            
                        <SolidButton onClick={OpenNewSellerRuleModal} mb="12" color="white" bg="purple.300" icon={PlusIcon} colorScheme="purple">
                            Adicionar regra
                        </SolidButton>
                    </Stack>
                )
            }
        </>
    )
}