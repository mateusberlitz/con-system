import { Accordion, AccordionButton, AccordionItem, AccordionPanel, Badge as ChakraBadge, Checkbox, Flex, HStack, IconButton, Spinner, Stack, Text, useToast } from "@chakra-ui/react";
import Badge from "../../../components/Badge";
import { OutlineButton } from "../../../components/Buttons/OutlineButton";
import { CompanySelectMaster } from "../../../components/CompanySelect/companySelectMaster";
import { MainBoard } from "../../../components/MainBoard";

import { ReactComponent as PlusIcon } from '../../../assets/icons/Plus.svg';
import { ReactComponent as MinusIcon } from '../../../assets/icons/Minus.svg';
import { ReactComponent as StrongPlusIcon } from '../../../assets/icons/StrongPlus.svg';
import { ReactComponent as CloseIcon } from '../../../assets/icons/Close.svg';


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

export default function Leads(){
    const toast = useToast();
    const { permissions, profile } = useProfile();

    const isManager = HasPermission(permissions, 'Vendas Completo');

    const [statuses, setStatuses] = useState<LeadStatus[]>([]);

    const loadStatuses = async () => {
        const { data } = await api.get('/lead_statuses');

        setStatuses(data);
    }

    useEffect(() => {
        loadStatuses();
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
            start_date: formatYmdDate(new Date().toString()),
            end_date: formatYmdDate(new Date().toString()),
            status: 0,
            user: (isManager ? undefined : profile?.id),
            group_by: '',
        };
        
        return data;
    })

    function handleChangeFilter(newFilter: LeadsFilterData){
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

    const users = useUsers({role: 1});

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

    return (
        <MainBoard sidebar="commercial" header={<CompanySelectMaster />}>
            <NewLeadModal statuses={statuses} origins={origins} afterCreate={leads.refetch} isOpen={isNewLeadModalOpen} onRequestClose={CloseNewPaymentModal}/>
            <EditLeadModal toEditLeadData={toEditLeadData} statuses={statuses} origins={origins} afterEdit={leads.refetch} isOpen={isEditLeadModalOpen} onRequestClose={CloseEditLeadModal}/>
            <DelegateLeadModal toDelegateLeadList={delegateList} toDelegate={delegate} users={users.data} afterDelegate={leads.refetch} isOpen={isDelegateLeadModalOpen} onRequestClose={CloseDelegateLeadModal}/>
            <ConfirmRemoveUserOfLead toRemoveLeadData={removeUserOfLeadData} afterRemove={leads.refetch} isOpen={isRemoveUserOfLeadModalOpen} onRequestClose={CloseRemoveUserOfLeadModal}/>
            <ConfirmLeadRemoveModal toRemoveLeadData={removeLeadData} afterRemove={leads.refetch} isOpen={isRemoveLeadModalOpen} onRequestClose={CloseRemoveLeadModal}/>

            <SolidButton color="white" bg="orange.400" icon={PlusIcon} colorScheme="orange" mb="10" onClick={OpenNewPaymentModal}>
                Adicionar Lead
            </SolidButton>

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
                (!leads.isLoading && !leads.error) && (
                    <Accordion w="100%" border="2px" borderColor="gray.500" borderRadius="26" overflow="hidden" spacing="0" allowMultiple>
                
                        <HStack spacing="8" justify="space-between" paddingX="8" paddingY="3" bg="gray.200">
                            <Text>25 pendentes</Text>

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
                                                        <Text fontSize="10px" color="gray.800">origem</Text>
                                                        <Text fontSize="sm" fontWeight="normal" color="gray.800">{lead.origin?.name}</Text>
                                                    </Stack>

                                                    <Badge colorScheme={lead.status?.color} color="white" bg={`${lead.status?.color}.500`} display="flex" borderRadius="full" px="5" py="0" h="29px" alignItems="center"><Text>{lead.status?.name}</Text></Badge>

                                                    {
                                                        (isManager && !lead.user) && (
                                                            <OutlineButton onClick={() => delegateOne(lead.id)} h="30px" size="sm" fontSize="11" color="orange.400" borderColor="orange.400" colorScheme="orange">
                                                                Delegar
                                                            </OutlineButton>
                                                        )
                                                    }

                                                    {
                                                        (lead.user && isManager && !lead.own) && (
                                                            <HStack>
                                                                <Text fontSize="sm" fontWeight="normal" color="gray.800">{lead.user?.name}</Text>
                                                                <IconButton onClick={() => OpenRemoveUserOfLeadModal({id:lead.id, name: lead.name})} h="24px" w="20px" minW="25px" p="0" float="right" aria-label="Excluir categoria" border="none" icon={ <CloseIcon width="20px" stroke="#C30052" fill="none"/>} variant="outline"/>
                                                            </HStack>
                                                        )
                                                    }
                                                </HStack>

                                                <AccordionPanel flexDir="column" borderTop="2px" borderColor="gray.500" px="0" py="5">
                                                    <HStack justifyContent="space-between" mb="4">
                                                        <Stack fontSize="sm" spacing="3">
                                                            <Text fontWeight="bold">Anotações</Text>

                                                            {
                                                                lead.notes.map((note) => {
                                                                    return(
                                                                        <HStack>
                                                                            <Text color="gray.800" fontWeight="semibold">{formatBRDate(note.created_at)} -</Text>
                                                                            <Text color="gray.800">{note.text}</Text>
                                                                        </HStack>
                                                                    )
                                                                })
                                                            }
                                                        </Stack>

                                                        <HStack spacing="5" alignItems="center">
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