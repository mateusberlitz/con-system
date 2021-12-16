import { Accordion, AccordionButton, AccordionItem, AccordionPanel, Badge as ChakraBadge, Checkbox, Divider, Flex, HStack, IconButton, Spinner, Stack, Text, useToast } from "@chakra-ui/react";
import Badge from "../../../components/Badge";
import { OutlineButton } from "../../../components/Buttons/OutlineButton";
import { CompanySelectMaster } from "../../../components/CompanySelect/companySelectMaster";
import { MainBoard } from "../../../components/MainBoard";

import { ReactComponent as PlusIcon } from '../../../assets/icons/Plus.svg';
import { ReactComponent as MinusIcon } from '../../../assets/icons/Minus.svg';
import { ReactComponent as StrongPlusIcon } from '../../../assets/icons/StrongPlus.svg';
import { ReactComponent as CloseIcon } from '../../../assets/icons/Close.svg';
import { ReactComponent as EditIcon } from '../../../assets/icons/Edit.svg';


import { HasPermission, useProfile } from "../../../hooks/useProfile";
import { EditButton } from "../../../components/Buttons/EditButton";
import { RemoveButton } from "../../../components/Buttons/RemoveButton";
import { SolidButton } from "../../../components/Buttons/SolidButton";
import { ChangeEvent, useState } from "react";
import { formatYmdDate } from "../../../utils/Date/formatYmdDate";
import { LeadsFilterData, useLeads } from "../../../hooks/useLeads";
import { DataOrigin, Lead, LeadStatus } from "../../../types";
import { api } from "../../../services/api";
import { useEffect } from "react";
import { NewLeadModal } from "./NewLeadModal";
import { formatBRDate } from "../../../utils/Date/formatBRDate";
import { getHour } from "../../../utils/Date/getHour";
import { EditLeadFormData, EditLeadModal } from "./EditLeadModal";
import { ConfirmLeadRemoveModal, RemoveLeadData } from "./ConfirmLeadRemoveModal";
import { useUsers } from "../../../hooks/useUsers";
import { DelegateLeadModal } from "./DelegateLeadModal";
import { ConfirmRemoveUserOfLead } from "./ConfirmRemoveUserOfLead";
import { ChangeLeadStatusModal, EditLeadStatusFormData } from "./ChangeLeadStatusModal";
import { AddLeadNoteModal, toAddLeadNoteData } from "./AddLeadNoteModal";
import { NewSaleModal, toAddSaleLeadData } from "../Sales/NewSaleModal";
import { EditSaleFormData, EditSaleModal } from "../Sales/EditSaleModal";
import { ConfirmSaleRemoveModal, RemoveSaleData } from "../Sales/ConfirmSaleRemoveModal";
import { SearchLeads } from "./SearchLeads";
import { LeadsReportByMonth } from "../LeadsReportByMonth";
import { LeadsReportByUser } from "./LeadsReportByUser";

export default function Leads(){
    const toast = useToast();
    const { permissions, profile } = useProfile();

    const isManager = HasPermission(permissions, 'Vendas Completo');

    const [statuses, setStatuses] = useState<LeadStatus[]>([]);

    const loadStatuses = async () => {
        const { data } = await api.get('/lead_statuses');

        setStatuses(data);
    }

    const checkPendingLeads = async () => {
        await api.post('/leads/check');
    }

    useEffect(() => {
        loadStatuses();
        checkPendingLeads();
    }, []);


    const [origins, setOrigins] = useState<DataOrigin[]>([]);

    const loadOrigins = async () => {
        const { data } = await api.get('/data_origins');

        setOrigins(data);
    }

    useEffect(() => {
        loadOrigins();
    }, []);

    const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState(false);

    function OpenNewPaymentModal(){
        setIsNewLeadModalOpen(true);
    }
    function CloseNewPaymentModal(){
        setIsNewLeadModalOpen(false);
    }

    const [filter, setFilter] = useState<LeadsFilterData>(() => {
        const data: LeadsFilterData = {
            search: '',
            //start_date: formatYmdDate(new Date().toString()),
            //end_date: formatYmdDate(new Date().toString()),
            status: 0,
            user: (isManager ? undefined : profile?.id),
            group_by: '',
        };
        
        return data;
    })

    function handleChangeFilter(newFilter: LeadsFilterData){
        newFilter.user = (isManager ? (newFilter.user ? newFilter.user : undefined) : profile?.id);
        setFilter(newFilter);
    }

    const leads = useLeads(filter, 1);

    const [isEditLeadModalOpen, setIsEditLeadModalOpen] = useState(false);

    const [toEditLeadData, setToEditLeadData] = useState<EditLeadFormData>(() => {

        const data: EditLeadFormData = {
            id: 0,
            name: '',
            email: '',
            phone: '',
            company: 0,
            accept_newsletter: 0,
            user: 0,
            status: 0,
            birthday: '',
            cnpj: '',
            cpf: '',
            origin: 0,
            address: '',
            address_code: '',
            address_country: '',
            address_uf: '',
            address_city: '',
            address_number: '',
        };
        
        return data;
    });

    function OpenEditLeadModal(leadData : EditLeadFormData){
        setToEditLeadData(leadData);
        setIsEditLeadModalOpen(true);
    }
    function CloseEditLeadModal(){
        setIsEditLeadModalOpen(false);
    }

    const [isRemoveLeadModalOpen, setIsRemoveLeadModalOpen] = useState(false);
    const [removeLeadData, setRemoveLeadData] = useState<RemoveLeadData>(() => {

        const data: RemoveLeadData = {
            name: '',
            id: 0,
        };
        
        return data;
    });

    function OpenRemoveLeadModal(leadData : RemoveLeadData){
        setRemoveLeadData(leadData);
        setIsRemoveLeadModalOpen(true);
    }
    function CloseRemoveLeadModal(){
        setIsRemoveLeadModalOpen(false);
    }

    const users = useUsers({role: 5});

    const [delegateList, setDelegateList] = useState<number[]>([]);
    const [delegate, setDelegate] = useState(0);
    const [isDelegateLeadModalOpen, setIsDelegateLeadModalOpen] = useState(false);

    function CloseDelegateLeadModal(){
        setIsDelegateLeadModalOpen(false);
        setDelegate(0);
    }

    const handleSelect = (event: ChangeEvent<HTMLInputElement>) => {
        console.log(event.target?.value, event.target?.checked);
        if(event.target?.checked){
            setDelegateList([...delegateList, parseInt(event.target?.value)]);
        }else{
            setDelegateList(delegateList.filter((leadId) => leadId !== parseInt(event.target?.value)));
        }
    }

    const delegateSelected = () => {
        if(delegateList.length > 0){
            setIsDelegateLeadModalOpen(true);
            return;
        }

        toast({
            title: "Ops",
            description: `Nenhum lead selecionado.`,
            status: "warning",
            duration: 12000,
            isClosable: true,
        });

        console.log(delegateList);
    }

    const delegateOne = (id: number) => {
        setDelegate(id);
        setIsDelegateLeadModalOpen(true);
    }

    const [isRemoveUserOfLeadModalOpen, setIsRemoveUserOfLeadModalOpen] = useState(false);
    const [removeUserOfLeadData, setRemoveUserOfLeadData] = useState<RemoveLeadData>(() => {

        const data: RemoveLeadData = {
            name: '',
            id: 0,
        };
        
        return data;
    });

    function OpenRemoveUserOfLeadModal(leadData : RemoveLeadData){
        setRemoveUserOfLeadData(leadData);
        setIsRemoveUserOfLeadModalOpen(true);
    }
    function CloseRemoveUserOfLeadModal(){
        setIsRemoveUserOfLeadModalOpen(false);
    }

    const [isEditLeadStatusModalOpen, setIsEditLeadStatusModalOpen] = useState(false);
    const [toEditLeadStatusData, setToEditLeadStatusData] = useState<EditLeadStatusFormData>(() => {

        const data: EditLeadStatusFormData = {
            name: '',
            id: 0,
            status: 0,
        };
        
        return data;
    });

    function OpenEditLeadStatusOfLeadModal(leadData : EditLeadStatusFormData){
        setToEditLeadStatusData(leadData);
        setIsEditLeadStatusModalOpen(true);
    }
    function CloseEditLeadStatusOfLeadModal(){
        setIsEditLeadStatusModalOpen(false);
    }

    const [isAddLeadNoteModalOpen, setIsAddLeadNoteModalOpen] = useState(false);
    const [toAddLeadNoteData, setToAddLeadNoteData] = useState<toAddLeadNoteData>(() => {

        const data: toAddLeadNoteData = {
            name: '',
            id: 0,
        };
        
        return data;
    });

    function OpenAddLeadNoteModal(leadData : toAddLeadNoteData){
        setToAddLeadNoteData(leadData);
        setIsAddLeadNoteModalOpen(true);
    }
    function CloseAddLeadNoteModal(){
        setIsAddLeadNoteModalOpen(false);
    }


    const [isNewSaleModalOpen, setIsNewSaleModalOpen] = useState(false);
    const [addSaleToLeadData, setAddSaleToLeadData] = useState<toAddSaleLeadData>(() => {

        const data: toAddSaleLeadData = {
            name: '',
            id: 0,
        };
        
        return data;
    });

    function OpenNewSaleModal(leadData : toAddSaleLeadData){
        setAddSaleToLeadData(leadData);
        setIsNewSaleModalOpen(true);
    }
    function CloseNewSaleModal(){
        setIsNewSaleModalOpen(false);
    }

    const [isEditSaleModalOpen, setIsEditSaleModalOpen] = useState(false);
    const [editSaleFormData, setEditSaleFormData] = useState<EditSaleFormData>(() => {

        const data: EditSaleFormData = {
            id: 0,
            value: '',
            group: '',
            quota: '',
            contract: '',
            segment: '',
            date: '',
        };
        
        return data;
    });

    function OpenEditSaleModal(leadData : EditSaleFormData){
        setEditSaleFormData(leadData);
        setIsEditSaleModalOpen(true);
    }
    function CloseNewEditModal(){
        setIsEditSaleModalOpen(false);
    }

    const [isConfirmSaleRemoveModalOpen, setIsConfirmSaleRemoveModalOpen] = useState(false);
    const [removeSaleFormData, setRemoveSaleFormData] = useState<RemoveSaleData>(() => {

        const data: RemoveSaleData = {
            id: 0,
            group: '',
            quota: '',
        };
        
        return data;
    });

    function OpenRemoveSaleModal(leadData : RemoveSaleData){
        setRemoveSaleFormData(leadData);
        setIsConfirmSaleRemoveModalOpen(true);
    }
    function CloseRemoveEditModal(){
        setIsConfirmSaleRemoveModalOpen(false);
    }

    const pendingLeadsCount = leads.data?.data.reduce((sumAmount:number, lead: Lead) => {
        if(lead.status && lead.status.name === "Pendente"){
            return sumAmount + 1;
        }
    }, 0)

    return (
        <MainBoard sidebar="commercial" header={<CompanySelectMaster />}>
            <NewLeadModal statuses={statuses} origins={origins} afterCreate={leads.refetch} isOpen={isNewLeadModalOpen} onRequestClose={CloseNewPaymentModal}/>
            <EditLeadModal toEditLeadData={toEditLeadData} statuses={statuses} origins={origins} afterEdit={leads.refetch} isOpen={isEditLeadModalOpen} onRequestClose={CloseEditLeadModal}/>
            <ChangeLeadStatusModal toEditLeadStatusData={toEditLeadStatusData} statuses={statuses} afterEdit={leads.refetch} isOpen={isEditLeadStatusModalOpen} onRequestClose={CloseEditLeadStatusOfLeadModal}/>
            <AddLeadNoteModal toAddLeadNoteData={toAddLeadNoteData} afterEdit={leads.refetch} isOpen={isAddLeadNoteModalOpen} onRequestClose={CloseAddLeadNoteModal}/>
            <DelegateLeadModal toDelegateLeadList={delegateList} toDelegate={delegate} users={users.data} afterDelegate={leads.refetch} isOpen={isDelegateLeadModalOpen} onRequestClose={CloseDelegateLeadModal}/>
            <ConfirmRemoveUserOfLead toRemoveLeadData={removeUserOfLeadData} afterRemove={leads.refetch} isOpen={isRemoveUserOfLeadModalOpen} onRequestClose={CloseRemoveUserOfLeadModal}/>
            <ConfirmLeadRemoveModal toRemoveLeadData={removeLeadData} afterRemove={leads.refetch} isOpen={isRemoveLeadModalOpen} onRequestClose={CloseRemoveLeadModal}/>
            
            <NewSaleModal toAddLeadData={addSaleToLeadData} afterCreate={leads.refetch} isOpen={isNewSaleModalOpen} onRequestClose={CloseNewSaleModal}/>
            <EditSaleModal toEditSaleData={editSaleFormData} afterEdit={leads.refetch} isOpen={isEditSaleModalOpen} onRequestClose={CloseNewEditModal}/>
            <ConfirmSaleRemoveModal toRemoveSaleData={removeSaleFormData} afterRemove={leads.refetch} isOpen={isConfirmSaleRemoveModalOpen} onRequestClose={CloseRemoveEditModal}/>



            <SolidButton color="white" bg="orange.400" icon={PlusIcon} colorScheme="orange" mb="10" onClick={OpenNewPaymentModal}>
                Adicionar Lead
            </SolidButton>

            <SearchLeads filter={filter} handleSearchLeads={handleChangeFilter} origins={origins} statuses={statuses}/>

            {   leads.isLoading ? (
                    <Flex justify="center">
                        <Spinner/>
                    </Flex>
                ) : ( leads.isError ? (
                    <Flex justify="center" mt="4" mb="4">
                        <Text>Erro listar os leads</Text>
                    </Flex>
                ) : (leads.data?.data.length === 0) && (
                    <Flex justify="center">
                        <Text>Nenhuma lead encontrado.</Text>
                    </Flex>
                ) ) 
            }

            {
                filter && (
                    <LeadsReportByUser filter={filter}/>
                )
            }

            {
                (!leads.isLoading && !leads.error) && (
                    <Accordion w="100%" border="2px" borderColor="gray.500" borderRadius="26" overflow="hidden" spacing="0" allowMultiple>
                
                        <HStack spacing="8" justify="space-between" paddingX="8" paddingY="3" bg="gray.200">
                            <HStack fontSize="sm" spacing="4">
                                <Text>{leads.data?.data.length} leads</Text>
                                <Text fontWeight="bold">{pendingLeadsCount ? pendingLeadsCount : 0} pendentes</Text>
                            </HStack>

                            {
                                isManager && (
                                    <OutlineButton onClick={() => delegateSelected()} h="30px" size="sm" fontSize="11" color="orange.400" borderColor="orange.400" colorScheme="orange">
                                        Delegar selecionados
                                    </OutlineButton>
                                )
                            }
                        </HStack>

                        {
                            leads.data?.data.map((lead: Lead) => {
                                const leadToEditData:EditLeadFormData = {
                                    id: lead.id,
                                    name: lead.name,
                                    email: lead.email,
                                    phone: lead.phone,
                                    company: lead.company.id,
                                    accept_newsletter: lead.accept_newsletter,
                                    user: lead.user?.id,
                                    status: lead.status?.id,
                                    birthday: lead.birthday,
                                    cnpj: lead.cnpj,
                                    cpf: lead.cpf,
                                    origin: lead.origin?.id,

                                    address: lead.address,
                                    address_code: lead.address_code,
                                    address_country: lead.address_country,
                                    address_uf: lead.address_uf,
                                    address_city: lead.address_city,
                                    address_number: lead.address_number,

                                    recommender: lead.recommender,
                                    commission: lead.commission,

                                    value: lead.value ? lead.value.toString().replace('.', ',') : '',
                                    segment: lead.segment,
                                }

                                return (
                                    <AccordionItem key={lead.id} display="flex" flexDir="column" paddingX="8" paddingTop="3" bg="white" borderTop="2px" borderTopColor="gray.500" borderBottom="0">
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
                                                        (isManager && !lead.user) && (
                                                            <>
                                                                <Checkbox label="" name="delegate" checked={delegateList.includes(lead.id)} value={lead.id} onChange={handleSelect}/>
                                                            </>
                                                        )
                                                    }
                                                    
                                                    <Stack spacing="0">
                                                        <Text fontSize="10px" color="gray.800">{getHour(lead.created_at)}</Text>
                                                        <Text fontSize="sm" fontWeight="normal" color="gray.800">{formatBRDate(lead.created_at)}</Text>
                                                    </Stack>

                                                    <Stack spacing="0">
                                                        <Text fontSize="sm" fontWeight="bold" color="gray.800">{lead.name}</Text>
                                                        <Text fontSize="11px" fontWeight="normal" color="gray.800">{lead.phone}</Text>
                                                    </Stack>

                                                    <Stack spacing="0">
                                                        <Text fontSize="sm" fontWeight="normal" color="gray.800">{lead.address_city}</Text>
                                                        <Text fontSize="sm" fontWeight="normal" color="gray.800">{lead.address_uf}</Text>
                                                    </Stack>

                                                    {/* <Text fontSize="sm" fontWeight="normal" color="gray.800">Veículo - R$50.000,00</Text> */}

                                                    <Stack spacing="0">
                                                        <Text fontSize="10px" color="gray.800">Pretensão</Text>
                                                        <Text fontSize="sm" fontWeight="normal" color="gray.800">{lead?.segment} - {lead.value ? Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(lead.value) : ''}</Text>
                                                    </Stack>

                                                    <Stack spacing="0">
                                                        <Text fontSize="10px" color="gray.800">origem</Text>
                                                        <Text fontSize="sm" fontWeight="normal" color="gray.800">{lead.origin?.name}</Text>
                                                    </Stack>

                                                    <Stack spacing="0">
                                                        {
                                                            lead.latest_returned && (
                                                                <Text fontSize="10px" color="gray.800">de: {lead.latest_returned.user.name}</Text>
                                                            )
                                                        }
                                                        <Badge cursor="pointer" colorScheme={lead.status?.color} color="white" bg={`${lead.status?.color}.500`} display="flex" borderRadius="full" px="5" py="0" h="29px" alignItems="center"
                                                            onClick={() => OpenEditLeadStatusOfLeadModal({id:lead.id, status: lead.status ? lead.status.id : 0, name:lead.name})}
                                                            >
                                                                <Text>{lead.status?.name}</Text>
                                                        </Badge>
                                                    </Stack> 

                                                    {
                                                        (isManager && !lead.user) && (
                                                            <OutlineButton onClick={() => delegateOne(lead.id)} h="30px" size="sm" fontSize="11" color="orange.400" borderColor="orange.400" colorScheme="orange">
                                                                Delegar
                                                            </OutlineButton>
                                                        )
                                                    }

                                                    {
                                                        (lead.user && isManager) && (
                                                            <HStack>
                                                                <Text fontSize="sm" fontWeight="normal" color="gray.800">{lead.user?.name}</Text>

                                                                {
                                                                    !lead.own && (
                                                                        <IconButton onClick={() => OpenRemoveUserOfLeadModal({id:lead.id, name: lead.name})} h="24px" w="20px" minW="25px" p="0" float="right" aria-label="Excluir categoria" border="none" icon={ <CloseIcon width="20px" stroke="#C30052" fill="none"/>} variant="outline"/>
                                                                    )
                                                                }
                                                            </HStack>
                                                        )
                                                    }
                                                </HStack>

                                                <AccordionPanel flexDir="column" borderTop="2px" borderColor="gray.500" px="1" py="5">
                                                    <HStack justifyContent="space-between" mb="4">
                                                        <Stack fontSize="sm" spacing="3">
                                                            <Text fontWeight="bold">Anotações</Text>

                                                            {
                                                                lead.notes.map((note) => {
                                                                    return(
                                                                        <HStack key={note.id}>
                                                                            <Text color="gray.800" fontWeight="semibold">{formatBRDate(note.created_at)} - {note.status ? `${note.status.name} - ` : ''}</Text>
                                                                            <Text color="gray.800">{note.text}</Text>
                                                                        </HStack>
                                                                    )
                                                                })
                                                            }

                                                            <OutlineButton onClick={() => {OpenAddLeadNoteModal({id: lead.id, name: lead.name})}} icon={EditIcon} h="30px" px="3" variant="outline" size="sm" fontSize="11" color="orange.400" border="none" colorScheme="orange">
                                                                Anotar
                                                            </OutlineButton>

                                                            <Text fontWeight="bold">Vendas</Text>

                                                            {
                                                                lead.sales && lead.sales.map((sale) => {
                                                                    const leadSalesData:EditSaleFormData = {
                                                                        id: sale.id,
                                                                        value: sale.value.toString().replace('.', ','),
                                                                        contract: sale.contract,
                                                                        group: sale.group,
                                                                        quota: sale.quota,
                                                                        segment: sale.segment,
                                                                        date: sale.date,
                                                                    }

                                                                    return(
                                                                        <HStack key={sale.id}>
                                                                            <Text color="gray.800" fontWeight="normal">{formatBRDate(sale.date)}: </Text>
                                                                            <Text>{sale.group}-{sale.quota} | </Text>
                                                                            <Text fontWeight="semibold">{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(sale.value)}</Text>
                                                                            <Text fontWeight="normal">Comissão esperada: <strong>{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(sale.commission)}</strong></Text>
                                                                            
                                                                            <IconButton onClick={() => OpenEditSaleModal(leadSalesData)} h="24px" w="23px" p="0" float="right" aria-label="Alterar venda" border="none" icon={ <EditIcon width="20px" stroke="#d69e2e" fill="none"/>} variant="outline"/>
                                                                            <IconButton onClick={() => OpenRemoveSaleModal({id: sale.id, group: sale.group, quota: sale.quota})} h="24px" w="23px" p="0" float="right" aria-label="Excluir venda" border="none" icon={ <CloseIcon width="20px" stroke="#C30052" fill="none"/>} variant="outline"/>
                                                                            {/* <EditButton onClick={() => OpenEditSaleModal(leadSalesData)}/> */}
                                                                        </HStack>
                                                                    )
                                                                })
                                                            }

                                                            <OutlineButton onClick={() => {OpenNewSaleModal({id: lead.id, name: lead.name})}} icon={PlusIcon} h="30px" px="3" variant="outline" size="sm" fontSize="11" color="green.400" border="none" colorScheme="green">
                                                                Cadastrar venda
                                                            </OutlineButton>
                                                        </Stack>

                                                        <HStack spacing="5" alignItems="center" h="40px">
                                                            <Divider orientation="vertical"/> 

                                                            <EditButton onClick={() => OpenEditLeadModal(leadToEditData)}/>

                                                            {
                                                                (isManager || lead.user) && (
                                                                    <RemoveButton onClick={() => OpenRemoveLeadModal({name: lead.name, id: lead.id})}/>
                                                                )
                                                            }
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
                )
            }
        </MainBoard>
    )
}