import { Accordion, AccordionButton, AccordionItem, AccordionPanel, Flex, HStack, IconButton, Spinner, Stack, Text } from "@chakra-ui/react";
import { Quota } from "../../../types";

import { ReactComponent as PlusIcon } from '../../../assets/icons/Plus.svg';
import { ReactComponent as MinusIcon } from '../../../assets/icons/Minus.svg';
import { ReactComponent as StrongPlusIcon } from '../../../assets/icons/StrongPlus.svg';
import { ReactComponent as EllipseIcon } from '../../../assets/icons/Ellipse.svg';
import { ReactComponent as TagIcon } from '../../../assets/icons/Tag.svg';
import { ReactComponent as CheckIcon } from '../../../assets/icons/Check.svg';
import { ReactComponent as FileIcon } from '../../../assets/icons/File.svg';
import { ReactComponent as CloseIcon } from '../../../assets/icons/Close.svg';
import { ReactComponent as RefreshIcon } from '../../../assets/icons/Refresh.svg';
import { ReactComponent as HomeIcon } from '../../../assets/icons/Home.svg';
import { OutlineButton } from "../../../components/Buttons/OutlineButton";
import { EditButton } from "../../../components/Buttons/EditButton";
import { RemoveButton } from "../../../components/Buttons/RemoveButton";
import { UseQueryResult } from "react-query";
import { formatBRDate } from "../../../utils/Date/formatBRDate";
import { useState } from "react";
import { EditQuota, EditQuotaModal } from "./EditQuotaModal";
import { ConfirmPaymentRemoveModal, RemoveQuotaData } from "./ConfirmQuotaRemoveModal";
import { Router, useHistory } from "react-router";


interface QuotasListProps{
    quotas: Quota[];
    refetchQuotas: () => void;
}

export function QuotasList({quotas, refetchQuotas}: QuotasListProps){
    const history = useHistory();

    const totalQuotasCount = quotas.reduce((sumAmount:number, quota:Quota) => {
        return sumAmount + 1;
    }, 0);

    const totalRealtyCost = quotas.reduce((sumAmount:number, quota:Quota) => {
        if(quota.segment === "Imóvel"){
            return sumAmount + quota.cost;
        }

        return sumAmount;
    }, 0);

    const totalVehicleCost = quotas.reduce((sumAmount:number, quota:Quota) => {
        if(quota.segment === "Veículo"){
            return sumAmount + quota.cost;
        }

        return sumAmount;
    }, 0);

    const totalRealtyCredit = quotas.reduce((sumAmount:number, quota:Quota) => {
        if(quota.segment === "Imóvel"){
            return sumAmount + quota.credit;
        }

        return sumAmount;
    }, 0);

    const totalVehicleCredit = quotas.reduce((sumAmount:number, quota:Quota) => {
        if(quota.segment === "Veículo"){
            return sumAmount + quota.credit;
        }

        return sumAmount;
    }, 0);

    const totalRealtyCount = quotas.reduce((sumAmount:number, quota:Quota) => {
        if(quota.segment === "Imóvel"){
            return sumAmount + 1;
        }

        return sumAmount;
    }, 0);

    const totalVehicleCount = quotas.reduce((sumAmount:number, quota:Quota) => {
        if(quota.segment === "Veículo"){
            return sumAmount + 1;
        }

        return sumAmount;
    }, 0);

    const [isEditQuotaModalOpen, setIsEditQuotaModalOpen] = useState(false);
    const [editQuotaData, setEditQuotaData] = useState<EditQuota>(() => {

        const data: EditQuota = {
            id: 0,
            credit: '',
            sold: false,
            value: '',
            segment: '',
            company: 0,
            seller: '',
            contemplated_type: '',
            cost: '',
            total_cost: '',
            cpf_cnpj: '',
            partner: '',
            partner_commission: '',
            partner_cost: '',
            passed_cost: '',
            paid_percent: '',
            purchase_date: '',
            description: '',
            group: '',
            quota: '',
        };
        
        return data;
    });

    function OpenEditQuotaModal(quotaData: EditQuota){
        setEditQuotaData(quotaData);
        setIsEditQuotaModalOpen(true);
    }
    function CloseEditQuotaModal(){
        setIsEditQuotaModalOpen(false);
    }

    const [isConfirmQuotaRemoveModalOpen, setisConfirmQuotaRemoveModalOpen] = useState(false);
    const [removeQuotaData, setRemoveQuotaData] = useState<RemoveQuotaData>(() => {

        const data: RemoveQuotaData = {
            group: '',
            quota: '',
            id: 0,
        };
        
        return data;
    });

    function OpenConfirmQuotaRemoveModal(QuotaData: RemoveQuotaData){
        setRemoveQuotaData(QuotaData);
        setisConfirmQuotaRemoveModalOpen(true);
    }
    function CloseConfirmQuotaRemoveModal(){
        setisConfirmQuotaRemoveModalOpen(false);
    }

    return (
        <Stack fontSize="13px" spacing="12">
            <EditQuotaModal toEditQuotaData={editQuotaData} afterEdit={refetchQuotas} isOpen={isEditQuotaModalOpen} onRequestClose={CloseEditQuotaModal}/>
            <ConfirmPaymentRemoveModal afterRemove={refetchQuotas} toRemoveQuotaData={removeQuotaData} isOpen={isConfirmQuotaRemoveModalOpen} onRequestClose={CloseConfirmQuotaRemoveModal}/>

            <Accordion w="100%" border="2px" borderColor="gray.500" borderRadius="26" overflow="hidden" spacing="0" allowMultiple>
                <HStack spacing="8" justify="space-between" paddingX="8" paddingY="3" bg="gray.200">
                    <Text fontWeight="extrabold">{totalQuotasCount} COTAS</Text>

                    <HStack spacing="6">
                        <Text fontWeight="semibold" color="gray.800">{totalRealtyCount} Imóveis</Text>
                        <Text fontWeight="semibold" color="gray.800">{totalVehicleCount} Veículos</Text>
                    </HStack>

                    <HStack spacing="7">
                        <Stack spacing="1">
                            <Text fontSize="10px" fontWeight="semibold">CUSTO total de Imóveis:</Text>
                            <Text float="right" fontWeight="bold">{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(totalRealtyCost)}</Text>
                        </Stack>

                        <Stack spacing="1">
                            <Text fontSize="10px" fontWeight="semibold">CUSTO total de Veículos:</Text>
                            <Text float="right" fontWeight="bold">{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(totalVehicleCost)}</Text>
                        </Stack>
                    </HStack>

                    <HStack spacing="7">
                        <Stack spacing="1">
                            <Text fontSize="10px" fontWeight="semibold">Total em CRÉDITO de Imóveis:</Text>
                            <Text float="right" fontWeight="bold">{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(totalRealtyCredit)}</Text>
                        </Stack>

                        <Stack spacing="1">
                            <Text fontSize="10px" fontWeight="semibold">Total em CRÉDITO de  Veículos:</Text>
                            <Text float="right" fontWeight="bold">{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(totalVehicleCredit)}</Text>
                        </Stack>
                    </HStack>
                </HStack>

                { quotas.map((quota:Quota) => {
                        const toEditQuotaData:EditQuota = {
                            id: quota.id,
                            sold: quota.sold,
                            credit: quota.credit.toString().replace('.', ','),
                            value: quota.value ? quota.value.toString().replace('.', ',') : '',
                            segment: quota.segment,
                            company: quota.company.id,
                            seller: quota.seller,
                            contemplated_type: quota.contemplated_type,
                            cost: quota.cost.toString().replace('.', ','),
                            total_cost: quota.total_cost.toString().replace('.', ','),
                            cpf_cnpj: quota.cpf_cnpj,
                            partner: quota.partner,
                            partner_commission: quota.partner_commission,
                            partner_cost: quota.partner_cost ? quota.partner_cost.toString().replace('.', ',') : '',
                            passed_cost: quota.passed_cost ? quota.passed_cost.toString().replace('.', ',') : '',
                            purchase_date: quota.purchase_date,
                            paid_percent: quota.paid_percent,
                            description: quota.description,
                            group: quota.group,
                            quota: quota.quota,
                        };

                        return (
                            <AccordionItem key={quota.id} display="flex" flexDir="column" paddingX="8" paddingTop="3" bg="white" borderTop="2px" borderTopColor="gray.500" borderBottom="0">
                                {({ isExpanded }) => (
                                    <>
                                        <HStack justify="space-between" mb="3">
                                            <AccordionButton p="0" height="fit-content" w="auto">
                                                <Flex alignItems="center" justifyContent="center" h="24px" w="30px" p="0" borderRadius="full" border="2px" borderColor="blue.800" variant="outline">
                                                { 
                                                        !isExpanded ? <StrongPlusIcon stroke="#2a4365" fill="none" width="12px"/> :
                                                        <MinusIcon stroke="#2a4365" fill="none" width="12px"/>
                                                } 
                                                </Flex>
                                            </AccordionButton>

                                            <Text fontWeight="bold" color="gray.800">{formatBRDate(quota.purchase_date)}</Text>

                                            <HStack spacing="4" opacity={quota.sold ? 0.5 : 1}>
                                                <HomeIcon stroke="#4e4b66" fill="none" width="22px"/>

                                                <Stack spacing="0">
                                                    <Text fontSize="10px" color="gray.800">Crédito</Text>
                                                    <Text fontSize="sm" fontWeight="bold" color="gray.800">{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(quota.credit)}</Text>
                                                </Stack>
                                            </HStack>

                                            <Stack spacing="0" opacity={quota.sold ? 0.5 : 1}>
                                                <Text fontSize="10px" color="gray.800" fontWeight="bold">Entrada</Text>
                                                <Text fontSize="sm" fontWeight="bold" color="gray.800">{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(quota.value ? quota.value : 0)}</Text>
                                            </Stack>

                                            <Stack spacing="0" opacity={quota.sold ? 0.5 : 1}>
                                                <Text fontSize="12px" color="gray.800">Grupo: <strong>{quota.group}</strong></Text>
                                                <Text fontSize="12px" color="gray.800">Cota: <strong>{quota.quota}</strong></Text>
                                            </Stack>

                                            <Stack spacing="0" opacity={quota.sold ? 0.5 : 1}>
                                                <Text fontSize="10px" color="gray.800">Custo</Text>
                                                <Text fontSize="sm" fontWeight="normal" color="gray.800">{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(quota.cost)}</Text>
                                            </Stack>

                                            <Stack spacing="0" opacity={quota.sold ? 0.5 : 1}>
                                                <Text fontSize="10px" color="gray.800" fontWeight="bold">Custo Total</Text>
                                                <Text fontSize="sm" fontWeight="normal" color="gray.800">{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(quota.total_cost)}</Text>
                                            </Stack>
        
                                            {
                                                quota.sold ? (
                                                    <HStack>
                                                        <Flex fontWeight="bold" alignItems="center" color="green.400">
                                                            <CheckIcon stroke="#48bb78" fill="none" width="16px"/>
                                                            <Text ml="2">Vendida</Text>
                                                        </Flex>
        
                                                        {/* <IconButton onClick={() => handleReversePayment(payment.id)} h="24px" w="20px" minW="25px" p="0" float="right" aria-label="Excluir categoria" border="none" icon={ <RefreshIcon width="20px" stroke="#14142b" fill="none"/>} variant="outline"/> */}
                                                    </HStack>
                                                ) : (
                                                    <OutlineButton isDisabled={quota.sold} onClick={() => history.push(`/cadastrar-venda/${quota.id}`)}
                                                        h="30px" size="sm" color="green.400" borderColor="green.400" colorScheme="green" fontSize="11">
                                                        Vender
                                                    </OutlineButton>
                                                )
                                            }
        
                                        </HStack>
        
                                        <AccordionPanel flexDir="column" borderTop="2px" borderColor="gray.500" px="0" py="5">
                                            <HStack justifyContent="space-between" marginBottom="4">
                                                <Stack spacing="0" opacity={quota.sold ? 0.5 : 1}>
                                                    <Text fontSize="10px" color="gray.800">Custo Parceiro</Text>
                                                    <Text fontSize="sm" fontWeight="semibold" color="gray.800">{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(quota.partner_cost ? quota.partner_cost : 0)}</Text>
                                                </Stack>

                                                <Stack spacing="0" opacity={quota.sold ? 0.5 : 1}>
                                                    <Text fontSize="10px" color="gray.800">Taxa</Text>
                                                    <Text fontSize="sm" fontWeight="semibold" color="gray.800">{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(quota.tax ? quota.tax : 0)}</Text>
                                                </Stack>

                                                <Stack spacing="0" opacity={quota.sold ? 0.5 : 1}>
                                                    <Text fontSize="10px" color="gray.800">Comprado de</Text>
                                                    <Text fontSize="sm" fontWeight="semibold" color="gray.800">{quota.seller ? quota.seller : ''}</Text>
                                                </Stack>

                                                <Stack spacing="0" opacity={quota.sold ? 0.5 : 1}>
                                                    <Text fontSize="10px" color="gray.800">CPF/CNPJ</Text>
                                                    <Text fontSize="sm" fontWeight="semibold" color="gray.800">{quota.cpf_cnpj}</Text>
                                                </Stack>

                                                <Stack spacing="0" opacity={quota.sold ? 0.5 : 1}>
                                                    <Text fontSize="10px" color="gray.800">% paga pelo crédito</Text>
                                                    <Text fontSize="sm" fontWeight="semibold" color="gray.800">{quota.paid_percent}</Text>
                                                </Stack>
                                            </HStack>

                                            <HStack justifyContent="space-between" mb="4">
                                                <Stack spacing="0" opacity={quota.sold ? 0.5 : 1}>
                                                    <Text fontSize="10px" color="gray.800">Custo Passado</Text>
                                                    <Text fontSize="sm" fontWeight="semibold" color="gray.800">{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(quota.passed_cost ? quota.passed_cost : 0)}</Text>
                                                </Stack>

                                                <Stack spacing="0" opacity={quota.sold ? 0.5 : 1}>
                                                    <Text fontSize="10px" color="gray.800">Parceiro</Text>
                                                    <Text fontSize="sm" fontWeight="semibold" color="gray.800">{quota.partner ? quota.partner : '--'}</Text>
                                                </Stack>

                                                <Stack spacing="0" opacity={quota.sold ? 0.5 : 1}>
                                                    <Text fontSize="10px" color="gray.800">Percentual do parceiro</Text>
                                                    <Text fontSize="sm" fontWeight="semibold" color="gray.800">{quota.partner_commission ? `${quota.partner_commission}%` : '--'}</Text>
                                                </Stack>

                                                <Stack spacing="0" opacity={quota.sold ? 0.5 : 1}>
                                                    <Text fontSize="10px" color="gray.800">Custo do Parceiro</Text>
                                                    <Text fontSize="sm" fontWeight="semibold" color="gray.800">{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(quota.partner_cost ? quota.partner_cost : 0)}</Text>
                                                </Stack>

                                                <Stack spacing="0" opacity={quota.sold ? 0.5 : 1}>
                                                    <Text fontSize="10px" color="gray.800">Contemplado por</Text>
                                                    <Text fontSize="sm" fontWeight="semibold" color="gray.800">{quota.contemplated_type}</Text>
                                                </Stack>
                                            </HStack>
        
                                            <HStack mt="4" mb="3" justifyContent="space-between">
                                                <Flex alignItems="center">
                                                    <Text fontWeight="500" mr="2">Descrição: </Text>
                                                    <Text> {quota.description && quota.description}</Text>
                                                </Flex>

                                                <HStack spacing="5" alignItems="center">
                                                    <EditButton onClick={() => OpenEditQuotaModal(toEditQuotaData)}/>
                                                    <RemoveButton onClick={() => OpenConfirmQuotaRemoveModal({ id: quota.id, group: quota.group, quota: quota.quota }) }/>
                                                </HStack>
                                            </HStack>
        
                                        </AccordionPanel>
                                    </>
                                )}
                            </AccordionItem>
                        )
                    })
                }
                
            </Accordion>
        </Stack>
    )
}