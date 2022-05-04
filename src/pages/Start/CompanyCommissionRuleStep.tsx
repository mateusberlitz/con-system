import { Accordion, AccordionButton, AccordionItem, AccordionPanel, Box, Flex, Heading, HStack, Icon, Stack, Td, Text, Tr } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Board } from "../../components/Board";
import { EditButton } from "../../components/Buttons/EditButton";
import { RemoveButton } from "../../components/Buttons/RemoveButton";
import { api } from "../../services/api";
import { Branch, Company, CompanyCommissionRule, CompanyCommissionRuleParcel } from "../../types";

import { ReactComponent as LocationIcon } from '../../assets/icons/Location.svg';
import { ReactComponent as CallIcon } from '../../assets/icons/Call.svg';
import { ReactComponent as PlusIcon } from '../../assets/icons/Plus.svg';
import { ReactComponent as MinusIcon } from '../../assets/icons/Minus.svg';
import { ReactComponent as StrongPlusIcon } from '../../assets/icons/StrongPlus.svg';
import { ReactComponent as BackArrow } from '../../assets/icons/Back Arrow.svg';

import { SolidButton } from "../../components/Buttons/SolidButton";
import { NewCompanyModal } from "../configs/Companys/NewCompanyModal";
import { ConfirmCompanyRemoveModal } from "../configs/Companys/ConfirmCompanyRemoveModal";
import { EditCompanyModal } from "../configs/Companys/EditCompanyModal";
import { EditCompanyRuleModal, EditNewCompanyRuleFormData } from "../configs/Companys/CompanyPage/CompanyRules/EditCompanyRuleModal";
import { EditCompanyRuleParcelModal, EditNewCompanyRuleParcelFormData } from "../configs/Companys/CompanyPage/CompanyRules/EditCompanyRuleParcelModal";
import { NewCompanyRuleModal } from "../configs/Companys/CompanyPage/CompanyRules/NewCompanyRuleModal";
import { NewCompanyRuleParcelModal } from "../configs/Companys/CompanyPage/CompanyRules/NewCompanyRuleParcelModal";
import { ConfirmCompanyRuleParcelRemoveModal } from "../configs/Companys/CompanyPage/CompanyRules/ConfirmCompanyRuleParcelRemoveModal";
import { Table } from "../../components/Table";

interface CompanyCommissionRuleStepProps{
    companyCommissionRule?:CompanyCommissionRule | undefined;
    setCompanyCommissionRule: (companyCommissionsRule: CompanyCommissionRule) => void;
}

export function CompanyCommissionRuleStep({companyCommissionRule, setCompanyCommissionRule} : CompanyCommissionRuleStepProps){

    const fetchCompanyCommissionRule = async () => {
        api.get('/company-commission-rules').then(response => {
            console.log(response);
            setCompanyCommissionRule(response.data.data[0]);
        });
    }

    useEffect(() => {
        fetchCompanyCommissionRule();
    }, []);


    const [isNewCompanyRuleModalOpen, setIsNewCompanyRuleModalOpen] = useState(false);

    function OpenNewCompanyRuleModal() {
        setIsNewCompanyRuleModalOpen(true)
    }
    function CloseNewCompanyRuleModal() {
        setIsNewCompanyRuleModalOpen(false)
    }

    const [editCompanyRuleData, setEditCompanyRuleData] = useState<EditNewCompanyRuleFormData>(() => {
        const data: EditNewCompanyRuleFormData = {
            id: 0,
            name: '',
            company_id: 0,
            chargeback_type_id: 0,
            half_installment: false,
            pay_in_contemplation: false,
            percentage_paid_in_contemplation: 0,
        };
        
        return data;
    });
    const [isEditCompanyRuleModalOpen, setIsEditCompanyRuleModalOpen] = useState(false);

    function OpenEditCompanyRuleModal(companyRuleData: EditNewCompanyRuleFormData) {
        setIsEditCompanyRuleModalOpen(true)
        setEditCompanyRuleData(companyRuleData);
    }
    function CloseEditCompanyRuleModal() {
        setIsEditCompanyRuleModalOpen(false)
    }

    const [companyCommissionRuleId, setCompanyCommissionRuleId] = useState(1);
    const [isNewCompanyRuleParcelModalOpen, setIsNewCompanyRuleParcelModalOpen] = useState(false);

    function OpenNewCompanyRuleParcelModal(companyCommissionRuleId: number) {
        setCompanyCommissionRuleId(companyCommissionRuleId);
        setIsNewCompanyRuleParcelModalOpen(true)
    }
    function CloseNewCompanyRuleParcelModal() {
        setIsNewCompanyRuleParcelModalOpen(false)
    }

    const [editCompanyRuleParcelData, setEditCompanyRuleParcelData] = useState<EditNewCompanyRuleParcelFormData>(() => {
        const data: EditNewCompanyRuleParcelFormData = {
            id: 0,
            parcel_number: 0,
            percentage_to_pay: 0,
            chargeback_percentage: 0,
            company_commission_rule_id: companyCommissionRule ? companyCommissionRule.id : 0
        };
        
        return data;
    });
    const [isEditCompanyRuleParcelModalOpen, setIsEditCompanyRuleParcelModalOpen] = useState(false);

    function OpenEditCompanyRuleParcelModal(companyRuleData: EditNewCompanyRuleParcelFormData) {
        setIsEditCompanyRuleParcelModalOpen(true)
        setEditCompanyRuleParcelData(companyRuleData);
    }
    function CloseEditCompanyRuleParcelModal() {
        setIsEditCompanyRuleParcelModalOpen(false)
    }

    const [isConfirmCompanyRuleParcelRemoveModalOpen, setIsConfirmCompanyRuleParcelRemoveModalOpen] = useState(false);

    function OpenConfirmCompanyRuleParcelRemoveModal(companyRuleData: EditNewCompanyRuleParcelFormData) {
        setIsConfirmCompanyRuleParcelRemoveModalOpen(true)
        setEditCompanyRuleParcelData(companyRuleData);
    }
    function CloseConfirmCompanyRuleParcelRemoveModal() {
        setIsConfirmCompanyRuleParcelRemoveModalOpen(false)
    }


    return (
        <>
            <NewCompanyRuleModal afterCreate={() => fetchCompanyCommissionRule()} isOpen={isNewCompanyRuleModalOpen} onRequestClose={CloseNewCompanyRuleModal}/>
            <EditCompanyRuleModal toEditCompanyRuleData={editCompanyRuleData} afterEdit={() => fetchCompanyCommissionRule()} isOpen={isEditCompanyRuleModalOpen} onRequestClose={CloseEditCompanyRuleModal}/>

            <NewCompanyRuleParcelModal companyCommissionRuleId={companyCommissionRuleId} afterCreate={() => fetchCompanyCommissionRule()} isOpen={isNewCompanyRuleParcelModalOpen} onRequestClose={CloseNewCompanyRuleParcelModal}/>
            <EditCompanyRuleParcelModal toEditCompanyRuleParcelData={editCompanyRuleParcelData} afterEdit={() => fetchCompanyCommissionRule()} isOpen={isEditCompanyRuleParcelModalOpen} onRequestClose={CloseEditCompanyRuleParcelModal}/>
            <ConfirmCompanyRuleParcelRemoveModal toRemoveCompanyRuleParcelData={editCompanyRuleParcelData} afterRemove={() => fetchCompanyCommissionRule()} isOpen={isConfirmCompanyRuleParcelRemoveModalOpen} onRequestClose={CloseConfirmCompanyRuleParcelRemoveModal}/>
        
            {
                companyCommissionRule ? (
                    <Board p="0" overflow="hidden">
                        <HStack justifyContent="space-between" p={[4, 4, 9]}>
                            <HStack spacing="4">
                                <BackArrow stroke="#00A878" fill="none" width="20px"/>
                                <Text fontSize="xl">Regra de comissão de RECEBIMENTO</Text>
                            </HStack>

                            {
                                !companyCommissionRule && (
                                    <SolidButton
                                        onClick={() => OpenNewCompanyRuleModal()}
                                        mb="12"
                                        color="white"
                                        bg="purple.300"
                                        icon={PlusIcon}
                                        colorScheme="purple"
                                    >
                                        Adicionar regra
                                    </SolidButton>
                                )
                            }
                        </HStack>

                        {
                            !companyCommissionRule ? (
                                <Text p="8">Adicione a regra principal</Text>
                            ): (
                                <Accordion w="100%" overflow="hidden" spacing="0" allowMultiple>
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

                                                    <Text>{companyCommissionRule.name}</Text>

                                                    <Text>Ativa</Text>

                                                    <EditButton onClick={() => OpenEditCompanyRuleModal(companyCommissionRule)}></EditButton>
                                                </Stack>

                                                <AccordionPanel flexDir="column" borderTop="2px" borderColor="gray.500" px="0" py="5" fontSize={["11px", "small"]}>
                                                    <Stack direction={['column', 'row']} spacing={["5", "4"]} justifyContent="space-between" mb="5">
                                                        <Stack fontSize="sm">
                                                            <Text color="gray.700">Forma de estorno</Text>
                                                            <Text>{companyCommissionRule.chargeback_type.description}</Text>
                                                        </Stack>

                                                        <Stack fontSize="sm">
                                                            <Text color="gray.700">Meia parcela</Text>
                                                            <Text>{companyCommissionRule.half_installment ? "Sim" : "Não"}</Text>
                                                        </Stack>

                                                        <Stack fontSize="sm">
                                                            <Text color="gray.700">Pago na contemplação</Text>
                                                            <Text>{companyCommissionRule.pay_in_contemplation ? "Sim" : "Não"}</Text>
                                                        </Stack>

                                                        <Stack fontSize="sm">
                                                            <Text color="gray.700">Percentual na contemplação</Text>
                                                            <Text>{companyCommissionRule.percentage_paid_in_contemplation}</Text>
                                                        </Stack>
                                                    </Stack>

                                                    <Stack borderTop="2px" borderColor="gray.200" spacing={["5", "4"]} justifyContent="space-between" mb="4" pt="5">
                                                        <HStack justifyContent="space-between" w="100%">
                                                            <Text fontSize="lg">Parcelas</Text>

                                                            <SolidButton
                                                                onClick={() => OpenNewCompanyRuleParcelModal(companyCommissionRule.id)}
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
                                                                companyCommissionRule.company_commission_rule_parcels.map((companyCommissionRuleParcel: CompanyCommissionRuleParcel) => {
                                                                    return(
                                                                        <Tr borderTop="1px" borderColor="gray.200">
                                                                            <Td>{companyCommissionRuleParcel.parcel_number}</Td>
                                                                            <Td>{companyCommissionRuleParcel.percentage_to_pay}%</Td>
                                                                            <Td>{companyCommissionRuleParcel.chargeback_percentage}%</Td>
                                                                            <Td>
                                                                                <HStack>
                                                                                    <EditButton onClick={() => OpenEditCompanyRuleParcelModal({...companyCommissionRuleParcel, company_commission_rule_id: companyCommissionRule.id})}/>
                                                                                    <RemoveButton onClick={() => OpenConfirmCompanyRuleParcelRemoveModal({...companyCommissionRuleParcel, company_commission_rule_id: companyCommissionRule.id})}/>
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
                        <Text fontWeight="700" fontSize="2xl">Cadastre sua primeira regra de recebimento</Text>
            
                        <SolidButton onClick={OpenNewCompanyRuleModal} mb="12" color="white" bg="purple.300" icon={PlusIcon} colorScheme="purple">
                            Adicionar regra
                        </SolidButton>
                    </Stack>
                )
            }
            
        </>
    )
}