import { Accordion, AccordionButton, AccordionItem, AccordionPanel, Flex, HStack, IconButton, Spinner, Stack, Text } from "@chakra-ui/react";
import { Quota, QuotaSale } from "../../../types";

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
// import { EditQuota, EditQuotaSaleModal } from "./EditSaleModal";
// import { ConfirmPaymentRemoveModal, RemoveQuotaData } from "./ConfirmSaleRemoveModal";
import { Router, useHistory } from "react-router";


interface QuotasListProps{
    quotaSales: QuotaSale[];
    refetchQuotaSales: () => void;
}

export function SalesList({quotaSales, refetchQuotaSales}: QuotasListProps){
    const history = useHistory();

    const totalQuotasCount = quotaSales.reduce((sumAmount:number, quotaSale:QuotaSale) => {
        return sumAmount + 1;
    }, 0);

    const totalValue = quotaSales.reduce((sumAmount:number, quotaSale:QuotaSale) => {
        return sumAmount + quotaSale.value;
    }, 0);

    const totalCredit = quotaSales.reduce((sumAmount:number, quotaSale:QuotaSale) => {
        return sumAmount + quotaSale.value;
    }, 0);

    // const [isEditQuotaSaleModalOpen, setIsEditQuotaSaleModalOpen] = useState(false);
    // const [editQuotaData, setEditQuotaData] = useState<EditQuota>(() => {

    //     const data: EditQuota = {
    //         id: 0,
    //         credit: '',
    //         sold: false,
    //         value: '',
    //         segment: '',
    //         company: 0,
    //         seller: '',
    //         contemplated_type: '',
    //         cost: '',
    //         total_cost: '',
    //         cpf_cnpj: '',
    //         partner: '',
    //         partner_commission: '',
    //         partner_cost: '',
    //         passed_cost: '',
    //         paid_percent: '',
    //         purchase_date: '',
    //         description: '',
    //         group: '',
    //         quota: '',
    //     };
        
    //     return data;
    // });

    // function OpenEditQuotaSaleModal(quotaData: EditQuota){
    //     setEditQuotaData(quotaData);
    //     setIsEditQuotaSaleModalOpen(true);
    // }
    // function CloseEditQuotaSaleModal(){
    //     setIsEditQuotaSaleModalOpen(false);
    // }

    // const [isConfirmQuotaRemoveModalOpen, setisConfirmQuotaRemoveModalOpen] = useState(false);
    // const [removeQuotaData, setRemoveQuotaData] = useState<RemoveQuotaData>(() => {

    //     const data: RemoveQuotaData = {
    //         group: '',
    //         quota: '',
    //         id: 0,
    //     };
        
    //     return data;
    // });

    // function OpenConfirmQuotaRemoveModal(QuotaData: RemoveQuotaData){
    //     setRemoveQuotaData(QuotaData);
    //     setisConfirmQuotaRemoveModalOpen(true);
    // }
    // function CloseConfirmQuotaRemoveModal(){
    //     setisConfirmQuotaRemoveModalOpen(false);
    // }

    return (
        <Stack fontSize="13px" spacing="12">
            {/* <ConfirmPaymentRemoveModal afterRemove={refetchQuotas} toRemoveQuotaData={removeQuotaData} isOpen={isConfirmQuotaRemoveModalOpen} onRequestClose={CloseConfirmQuotaRemoveModal}/> */}

            <Accordion w="100%" border="2px" borderColor="gray.500" borderRadius="26" overflow="hidden" spacing="0" allowMultiple>
                <HStack spacing="8" justify="space-between" paddingX="8" paddingY="3" bg="gray.200">
                    <Text fontWeight="extrabold">{totalQuotasCount} COTAS</Text>
                    
                    <Text float="right">TOTAL em entradas: <strong>{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(totalValue)}</strong></Text>
                    <Text float="right">TOTAL em crédito: <strong>{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(totalCredit)}</strong></Text>
                </HStack>

                { quotaSales.map((quotaSale:QuotaSale) => {
                        // const toEditQuotaData:EditQuota = {
                        //     id: quotaSale.id,
                        //     sold: quotaSale.sold,
                        //     credit: quotaSale.credit.toString().replace('.', ','),
                        //     value: quotaSale.value.toString().replace('.', ','),
                        //     segment: quotaSale.segment,
                        //     company: quotaSale.company.id,
                        //     seller: quotaSale.seller,
                        //     contemplated_type: quotaSale.contemplated_type,
                        //     cost: quotaSale.cost.toString().replace('.', ','),
                        //     total_cost: quotaSale.total_cost.toString().replace('.', ','),
                        //     cpf_cnpj: quotaSale.cpf_cnpj,
                        //     partner: quotaSale.partner,
                        //     partner_commission: quotaSale.partner_commission,
                        //     partner_cost: quotaSale.partner_cost ? quotaSale.partner_cost.toString().replace('.', ',') : '',
                        //     passed_cost: quotaSale.passed_cost ? quotaSale.passed_cost.toString().replace('.', ',') : '',
                        //     purchase_date: quotaSale.purchase_date,
                        //     paid_percent: quotaSale.paid_percent,
                        //     description: quotaSale.description,
                        //     group: quotaSale.group,
                        //     quota: quotaSale.quota,
                        // };

                        console.log(quotaSale.quota);

                        return (
                            <AccordionItem key={quotaSale.id} display="flex" flexDir="column" paddingX="8" paddingTop="3" bg="white" borderTop="2px" borderTopColor="gray.500" borderBottom="0">
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

                                            <Text fontWeight="bold" color="gray.800">{formatBRDate(quotaSale.sale_date)}</Text>

                                            <HStack spacing="4">
                                                <HomeIcon stroke="#4e4b66" fill="none" width="22px"/>

                                                <Stack spacing="0">
                                                    <Text fontSize="10px" color="gray.800">Valor da venda</Text>
                                                    <Text fontSize="sm" fontWeight="bold" color="gray.800">{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(quotaSale.value)}</Text>
                                                </Stack>
                                            </HStack>

                                            <Stack spacing="0">
                                                <Text fontSize="10px" color="gray.800" fontWeight="bold">Valor recebido</Text>
                                                <Text fontSize="sm" fontWeight="bold" color="gray.800">{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(quotaSale.value)}</Text>
                                            </Stack>

                                            <Stack spacing="0">
                                                <Text fontSize="12px" color="gray.800">Grupo: <strong>{quotaSale.quota.group}</strong></Text>
                                                <Text fontSize="12px" color="gray.800">Cota: <strong>{quotaSale.quota.quota}</strong></Text>
                                            </Stack>
        
                                            
                                            <OutlineButton onClick={() => history.push(`/cadastrar-venda/${quotaSale.id}`)}
                                                h="30px" size="sm" color="green.400" borderColor="green.400" colorScheme="green" fontSize="11">
                                                Receber
                                            </OutlineButton>
        
                                        </HStack>
        
                                        <AccordionPanel flexDir="column" borderTop="2px" borderColor="gray.500" px="0" py="5">
                                            <HStack justifyContent="space-between" marginBottom="4">
                                                <Stack spacing="0">
                                                    <Text fontSize="10px" color="gray.800">Valor passado</Text>
                                                    <Text fontSize="sm" fontWeight="semibold" color="gray.800">{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(quotaSale.passed_value ? quotaSale.passed_value : 0)}</Text>
                                                </Stack>

                                                <Stack spacing="0">
                                                    <Text fontSize="10px" color="gray.800">Comissão do parceiro</Text>
                                                    <Text fontSize="sm" fontWeight="semibold" color="gray.800">{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(quotaSale.partner_value ? quotaSale.partner_value : 0)}</Text>
                                                </Stack>

                                                <Stack spacing="0">
                                                    <Text fontSize="10px" color="gray.800">Taxa</Text>
                                                    <Text fontSize="sm" fontWeight="semibold" color="gray.800">{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(quotaSale.tax ? quotaSale.tax : 0)}</Text>
                                                </Stack>

                                                <Stack spacing="0">
                                                    <Text fontSize="10px" color="gray.800">CPF/CNPJ</Text>
                                                    <Text fontSize="sm" fontWeight="semibold" color="gray.800">{quotaSale.cpf_cnpj}</Text>
                                                </Stack>

                                                <Stack spacing="0">
                                                    <Text fontSize="10px" color="gray.800">Vendido por</Text>
                                                    <Text fontSize="sm" fontWeight="semibold" color="gray.800">{quotaSale.seller}</Text>
                                                </Stack>

                                                <Stack spacing="0">
                                                    <Text fontSize="10px" color="gray.800">Comprado por</Text>
                                                    <Text fontSize="sm" fontWeight="semibold" color="gray.800">{quotaSale.buyer}</Text>
                                                </Stack>
                                            </HStack>

                                            <HStack justifyContent="space-between" mb="4">
                                                <Stack spacing="0">
                                                    <Text fontSize="10px" color="gray.800">Lucro</Text>
                                                    <Text fontSize="sm" fontWeight="semibold" color="gray.800">{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(quotaSale.profit ? quotaSale.profit : 0)}</Text>
                                                </Stack>

                                                <Stack spacing="0">
                                                    <Text fontSize="10px" color="gray.800">Coordenador</Text>
                                                    <Text fontSize="sm" fontWeight="semibold" color="gray.800">{quotaSale.coordinator}</Text>
                                                </Stack>
                                            </HStack>
        
                                            <HStack mt="4" mb="3" justifyContent="space-between">
                                                <Flex alignItems="center">
                                                    <Text fontWeight="500" mr="2">Descrição: </Text>
                                                    <Text> {quotaSale.description && quotaSale.description}</Text>
                                                </Flex>

                                                <HStack spacing="5" alignItems="center">
                                                    <EditButton onClick={() => history.push(`editar-venda/${quotaSale.quota.id}/${quotaSale.id}`)}/>
                                                    {/* <RemoveButton onClick={() => OpenConfirmQuotaRemoveModal({ id: quotaSale.id, group: quotaSale.group, quota: quotaSale.quota }) }/> */}
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