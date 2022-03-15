import { Accordion, AccordionButton, AccordionItem, AccordionPanel, Divider, Flex, HStack, IconButton, Spinner, Stack, Tbody, Td, Text, Th, Thead, Table, Tr, Link, useToast } from "@chakra-ui/react";
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
import { ReactComponent as BackArrow } from '../../../assets/icons/Back Arrow.svg';

import { OutlineButton } from "../../../components/Buttons/OutlineButton";
import { EditButton } from "../../../components/Buttons/EditButton";
import { RemoveButton } from "../../../components/Buttons/RemoveButton";
import { UseQueryResult } from "react-query";
import { formatBRDate } from "../../../utils/Date/formatBRDate";
import { useState } from "react";
// import { EditQuota, EditQuotaSaleModal } from "./EditSaleModal";
// import { ConfirmPaymentRemoveModal, cancelQuotaSaleData } from "./ConfirmSaleRemoveModal";
import { Router, useHistory } from "react-router";
import { CancelQuotaSaleData, ConfirmQuotaSaleCancelModal } from "./ConfirmQuotaSaleCancelModal";
import { SolidButton } from "../../../components/Buttons/SolidButton";
import { ResumedBill } from "./EditQuotaSale";
import { ConfirmQuotaSaleRemoveModal, RemoveQuotaSaleData } from "./ConfirmQuotaSaleRemoveModal";
import { PayPaymentFormData, PayPaymentModal } from "../../Financial/Payments/PayPaymentModal";
import { ReceiveBillFormData, ReceiveBillModal } from "../../Financial/Bills/ReceiveBillModal";
import { api } from "../../../services/api";
import { showErrors } from "../../../hooks/useErrors";

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

    const [isConfirmQuotaSaleCancelModalOpen, setisConfirmQuotaSaleCancelModalOpen] = useState(false);
    const [cancelQuotaSaleData, setCancelQuotaSaleData] = useState<CancelQuotaSaleData>(() => {

        const data: CancelQuotaSaleData = {
            group: '',
            quota: '',
            id: 0,
        };
        
        return data;
    });

    function OpenConfirmQuotaSaleCancelModal(QuotaData: CancelQuotaSaleData){
        setCancelQuotaSaleData(QuotaData);
        setisConfirmQuotaSaleCancelModalOpen(true);
    }
    function CloseConfirmQuotaSaleCancelModal(){
        setisConfirmQuotaSaleCancelModalOpen(false);
    }

    const [isConfirmQuotaSaleRemoveModalOpen, setisConfirmQuotaSaleRemoveModalOpen] = useState(false);
    const [removeQuotaSaleData, setRemoveQuotaSaleData] = useState<RemoveQuotaSaleData>(() => {

        const data: RemoveQuotaSaleData = {
            group: '',
            quota: '',
            id: 0,
        };
        
        return data;
    });

    function OpenConfirmQuotaSaleRemoveModal(QuotaData: RemoveQuotaSaleData){
        setRemoveQuotaSaleData(QuotaData);
        setisConfirmQuotaSaleRemoveModalOpen(true);
    }
    function CloseConfirmQuotaSaleRemoveModal(){
        setisConfirmQuotaSaleRemoveModalOpen(false);
    }

    const [isReceiveBillModalOpen, setIsReceiveBillModalOpen] = useState(false);
    const [toReceiveBillData, setToReceiveBillData] = useState<ReceiveBillFormData>(() => {

        const data: ReceiveBillFormData = {
            id: 0,
            value: 0,
            paid: 0,
            new_value: '',
            title: '',
        };
        
        return data;
    });

    function OpenReceiveBillModal(billIdAndName: ReceiveBillFormData){
        setToReceiveBillData(billIdAndName);
        setIsReceiveBillModalOpen(true);
    }
    function CloseReceiveBillModal(){
        setIsReceiveBillModalOpen(false);
    }

    const toast = useToast();

    const handleReverseBill = async (billId : number) => {
        try{
            await api.post(`/bills/unreceive/${billId}`);

            toast({
                title: "Sucesso",
                description: `Conta a receber redefinda como não recebida.`,
                status: "success",
                duration: 12000,
                isClosable: true,
            });

            refetchQuotaSales();
        }catch(error: any) {
            showErrors(error, toast);

            if(error.response.data.access){
                history.push('/');
            }
        }
    }

    return (
        <Stack fontSize="13px" spacing="12">
            <ConfirmQuotaSaleCancelModal afterCancel={refetchQuotaSales} toCancelQuotaSaleData={cancelQuotaSaleData} isOpen={isConfirmQuotaSaleCancelModalOpen} onRequestClose={CloseConfirmQuotaSaleCancelModal}/>
            <ConfirmQuotaSaleRemoveModal afterRemove={refetchQuotaSales} toRemoveQuotaSaleData={removeQuotaSaleData} isOpen={isConfirmQuotaSaleRemoveModalOpen} onRequestClose={CloseConfirmQuotaSaleRemoveModal}/>

            <ReceiveBillModal afterReceive={refetchQuotaSales} toReceiveBillData={toReceiveBillData} isOpen={isReceiveBillModalOpen} onRequestClose={CloseReceiveBillModal}/>

            <Accordion w="100%" border="2px" borderColor="gray.500" borderRadius="26" overflow="hidden" spacing="0" allowMultiple>
                <HStack spacing="8" justify="space-between" paddingX="8" paddingY="3" bg="gray.200">
                    <Text fontWeight="extrabold">{totalQuotasCount} COTAS</Text>
                    
                    <Text float="right">TOTAL em entradas: <strong>{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(totalValue)}</strong></Text>
                    <Text float="right">TOTAL em crédito: <strong>{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(totalCredit)}</strong></Text>
                </HStack>

                { quotaSales.map((quotaSale:QuotaSale) => {

                        return (
                            <AccordionItem key={quotaSale.id} display="flex" flexDir="column" paddingX="8" paddingTop="3" bg="white" borderTop="2px" borderTopColor="gray.500" borderBottom="0">
                                {({ isExpanded }) => (
                                    <>
                                        <HStack justify="space-between" mb="3" opacity={quotaSale.cancelled ? 0.5 : 1}>
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
                                                <Text fontSize="12px" color="gray.800">Grupo: <strong>{quotaSale.ready_quota.group}</strong></Text>
                                                <Text fontSize="12px" color="gray.800">Cota: <strong>{quotaSale.ready_quota.quota}</strong></Text>
                                            </Stack>
        
                                            <HStack spacing="5">
                                                {
                                                    quotaSale.cancelled && (
                                                        <HStack>
                                                            <Flex fontWeight="bold" alignItems="center" color="red.400">
                                                                <CloseIcon stroke="#c30052" fill="none" width="16px"/>
                                                                <Text ml="2">Cancelada</Text>
                                                            </Flex>
                                                        </HStack>
                                                    )
                                                    // :(
                                                    //     <OutlineButton disabled={!!quotaSale.cancelled} onClick={() => history.push(`/cadastrar-venda/${quotaSale.id}`)}
                                                    //         h="29px" size="sm" color="green.400" borderColor="green.400" colorScheme="green" fontSize="11">
                                                    //         Receber
                                                    //     </OutlineButton>
                                                    // )
                                                }

                                                <EditButton disabled={!!quotaSale.cancelled} onClick={() => history.push(`editar-venda/${quotaSale.ready_quota.id}/${quotaSale.id}`)}/>
                                            </HStack>
        
                                        </HStack>
        
                                        <AccordionPanel flexDir="column" borderTop="2px" borderColor="gray.500" px="0" py="5" opacity={quotaSale.cancelled ? 0.5 : 1}>
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
                                                    <Text fontSize="10px" color="gray.800">Coordenador</Text>
                                                    <Text fontSize="sm" fontWeight="semibold" color="gray.800">{quotaSale.coordinator ? quotaSale.coordinator : '--'}</Text>
                                                </Stack>

                                                <Stack spacing="0">
                                                    <Text fontSize="10px" color="gray.800">Comissão do coordenador</Text>
                                                    <Text fontSize="sm" fontWeight="semibold" color="gray.800">{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(quotaSale.coordinator_value ? quotaSale.coordinator_value : 0)}</Text>
                                                </Stack>

                                                <Stack spacing="0">
                                                    <Text fontSize="10px" color="gray.800">Supervisor</Text>
                                                    <Text fontSize="sm" fontWeight="semibold" color="gray.800">{quotaSale.supervisor  ? quotaSale.supervisor : '--'}</Text>
                                                </Stack>

                                                <Stack spacing="0">
                                                    <Text fontSize="10px" color="gray.800">Comissão supervisor</Text>
                                                    <Text fontSize="sm" fontWeight="semibold" color="gray.800">{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(quotaSale.supervisor_value ? quotaSale.supervisor_value : 0)}</Text>
                                                </Stack>

                                                <Stack spacing="0">
                                                    <Text fontSize="10px" color="gray.800">Lucro</Text>
                                                    <Text fontSize="sm" fontWeight="semibold" color="gray.800">{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(quotaSale.value - quotaSale.ready_quota.cost - quotaSale.partner_value - (quotaSale.coordinator_value ? quotaSale.coordinator_value : 0) - (quotaSale.supervisor_value ? quotaSale.supervisor_value : 0))}</Text>
                                                </Stack>
                                            </HStack>
        
                                            <HStack mt="4" mb="3" justifyContent="space-between">
                                                <Flex alignItems="center">
                                                    <Text fontWeight="500" mr="2">Descrição: </Text>
                                                    <Text> {quotaSale.description && quotaSale.description}</Text>
                                                </Flex>

                                                <HStack spacing="5" alignItems="center">
                                                    <SolidButton disabled={!!quotaSale.cancelled} colorScheme="red" h="29px" pl="5" pr="5" bg="red.400" minWidth="none" onClick={() => OpenConfirmQuotaSaleCancelModal({ id: quotaSale.id, group: quotaSale.ready_quota.group, quota: quotaSale.ready_quota.quota }) }>
                                                        Cancelar Venda
                                                    </SolidButton>
                                                    <RemoveButton onClick={() => OpenConfirmQuotaSaleRemoveModal({ id: quotaSale.id, group: quotaSale.ready_quota.group, quota: quotaSale.ready_quota.quota }) }/>
                                                </HStack>
                                            </HStack>

                                            <Divider mb="3"/>

                                            <HStack justifyContent="space-between" alignItems="center">
                                                <Table size="sm" variant="simple">
                                                    <Thead>
                                                        <Tr>
                                                            <Th color="gray.900">Valores a receber: </Th>
                                                            <Th></Th>
                                                            <Th></Th>
                                                            <Th></Th>
                                                        </Tr>
                                                    </Thead>
                                                    <Tbody>
                                                        
                                                        {
                                                            quotaSale.bills && quotaSale.bills.map((partial: ResumedBill) => {
                                                                return (
                                                                    <Tr>
                                                                        <Td fontSize="12px">{partial.expire && formatBRDate(partial.expire)}</Td>
                                                                        <Td fontSize="12px">{partial.title}</Td>
                                                                        <Td color="gray.800" fontWeight="semibold" fontSize="12px">{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(partial.value)}</Td>
                                                                        <Td color="gray.800" fontWeight="semibold" fontSize="12px">
                                                                            {
                                                                                partial.status ? (
                                                                                    <HStack>
                                                                                        <Flex fontWeight="bold" alignItems="center" color="green.400">
                                                                                            <CheckIcon stroke="#48bb78" fill="none" width="16px"/>
                                                                                            <Text ml="2">Recebido</Text>
                                                                                        </Flex>

                                                                                        <IconButton onClick={() => handleReverseBill(partial.id)} h="24px" w="20px" minW="25px" p="0" float="right" aria-label="Excluir categoria" border="none" icon={ <RefreshIcon width="20px" stroke="#14142b" fill="none"/>} variant="outline"/>
                                                                                    </HStack>
                                                                                ) : (
                                                                                    <OutlineButton disabled={!!quotaSale.cancelled}
                                                                                        h="29px" size="sm" color="green.400" borderColor="green.400" colorScheme="green" fontSize="11" 
                                                                                        onClick={() => OpenReceiveBillModal({ id: partial.id, title: partial.title , value: partial.value, paid: partial.paid, status: partial.status, new_value: ''})}>
                                                                                        Receber
                                                                                    </OutlineButton>
                                                                                )
                                                                            }
                                                                        </Td>
                                                                    </Tr>
                                                                )
                                                            })
                                                        }
                                                    </Tbody>

                                                    {/* <HStack>
                                                        <Text>Valores pagos: </Text>
                                                        <strong> {Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(payment.paid)}</strong>
                                                    </HStack>

                                                    {
                                                        payment.partial_payments && payment.partial_payments.map((partial: PartialPayment) => {
                                                            return (
                                                                <HStack>
                                                                    <Text>{partial.pay_date && formatBRDate(partial.pay_date.toString())}</Text>
                                                                    <Text color="gray.800" fontWeight="semibold"> {Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(partial.value)}</Text>
                                                                </HStack>
                                                            )
                                                        })
                                                    } */}
                                                </Table>
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