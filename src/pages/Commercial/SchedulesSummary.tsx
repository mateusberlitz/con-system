import { Text, Stack,Flex, Spinner, HStack, Icon } from "@chakra-ui/react";
import { UseQueryResult } from "react-query";
import { SolidButton } from "../../components/Buttons/SolidButton";
import { Bill, City, DataOrigin, Lead, LeadStatus, Payment, Schedule } from "../../types";
import { formatDate } from "../../utils/Date/formatDate";
import { formatYmdDate } from "../../utils/Date/formatYmdDate";
import { getDay } from "../../utils/Date/getDay";
import { ReactComponent as EllipseIcon } from '../../assets/icons/Ellipse.svg';
import { ReactComponent as AttachIcon } from '../../assets/icons/Attach.svg';
import { ReactComponent as CheckIcon } from '../../assets/icons/Check.svg';
import { formatBRDate } from "../../utils/Date/formatBRDate";
import { HasPermission, useProfile } from "../../hooks/useProfile";
import { CompanySelect } from "../../components/CompanySelect";
import { BillFilterData } from "../../hooks/useBills";
import { PaymentFilterData, usePayments } from "../../hooks/usePayments";
import { useEffect, useState } from "react";
import { ConfirmLeadRemoveModal, RemoveLeadData } from "./Leads/ConfirmLeadRemoveModal";
import { EditLeadFormData, EditLeadModal } from "./Leads/EditLeadModal";
import { LeadsFilterData, useLeads } from "../../hooks/useLeads";
import { AtSign, CheckSquare } from "react-feather";
import { api } from "../../services/api";

import { ReactComponent as PlusIcon } from '../../assets/icons/Plus.svg';
import { ReactComponent as CalendarIcon } from '../../assets/icons/Calandar.svg';

import { getHour } from "../../utils/Date/getHour";
import { NewLeadModal } from "./Leads/NewLeadModal";
import { EditScheduleFormData, EditScheduleModal } from "./Schedules/EditScheduleModal";
import { ConfirmScheduleRemoveModal, RemoveScheduleData } from "./Schedules/ConfirmScheduleRemoveModal";
import { NewScheduleModal } from "./Schedules/NewScheduleModal";
import { SchedulesFilterData, useSchedules } from "../../hooks/useSchedules";
import { useWorkingCompany } from "../../hooks/useWorkingCompany";

interface BillsSummaryProps{
    bills?: UseQueryResult<{
        data: any;
        total: number;
    }, unknown>;
    filter?: BillFilterData;
    handleChangeFilter?: (newFilterValue: BillFilterData) => void;
}

export function SchedulesSummary(){
    const {profile} = useProfile();
    const workingCompany = useWorkingCompany();
    
    const [leads, setLeads] = useState<Lead[]>([]);

    const loadLeads = async () => {
        if(profile){
            const { data } = await api.get('/leads', {params: {
                user: profile.id
            }});
    
            setLeads(data);
        }
    }

    const [cities, setCities] = useState<City[]>([]);

    const loadCities = async () => {
        if(profile){
            const { data } = await api.get('/cities', {params: {
                user: profile.id
            }});
    
            setCities(data);
        }
    }

    useEffect(() => {
        loadCities();
        loadLeads();
    }, []);

    const [isNewScheduleModalOpen, setIsNewScheduleModalOpen] = useState(false);

    function OpenNewScheduleModal(){
        setIsNewScheduleModalOpen(true);
    }
    function CloseNewScheduleModal(){
        setIsNewScheduleModalOpen(false);
    }

    const [isEditScheduleModalOpen, setIsEditScheduleModalOpen] = useState(false);
    const [toEditScheduleData, setToEditScheduleData] = useState<EditScheduleFormData>(() => {

        const data: EditScheduleFormData = {
            datetime: '',
            id: 0,
            city: '',
            lead: 0,
        };
        
        return data;
    });

    function OpenEditScheduleModal(scheduleData : EditScheduleFormData){
        setToEditScheduleData(scheduleData);
        setIsEditScheduleModalOpen(true);
    }
    function CloseEditScheduleModal(){
        setIsEditScheduleModalOpen(false);
    }


    const [isRemoveScheduleModalOpen, setIsRemoveScheduleModalOpen] = useState(false);
    const [removeScheduleData, setRemoveScheduleData] = useState<RemoveScheduleData>(() => {

        const data: RemoveScheduleData = {
            id: 0,
        };
        
        return data;
    });

    function OpenRemoveScheduleModal(scheduleData : RemoveScheduleData){
        setRemoveScheduleData(scheduleData);
        setIsRemoveScheduleModalOpen(true);
    }
    function CloseRemoveScheduleModal(){
        setIsRemoveScheduleModalOpen(false);
    }

    const todayDateObject = new Date();

    const [filter, setFilter] = useState<SchedulesFilterData>(() => {
        const data: SchedulesFilterData = {
            company: workingCompany.company?.id,
            start_date: formatYmdDate(todayDateObject.toString()),
            //end_date: formatYmdDate(endDate.toDateString()),
            user: profile ? profile?.id : 0,
        };
        
        return data;
    })

    const schedules = useSchedules(filter, 1);

    const pendingSchedulesCount = schedules.data?.data.reduce((sumAmount:number, schedule: Schedule) => {
        const scheduleDate = new Date(schedule.datetime);

        if(scheduleDate >= todayDateObject){
            return sumAmount + 1;
        }
    }, 0)

    return (
        <>
            <NewScheduleModal cities={cities} leads={leads} afterCreate={schedules.refetch} isOpen={isNewScheduleModalOpen} onRequestClose={CloseNewScheduleModal}/>
            <EditScheduleModal leads={leads} afterEdit={schedules.refetch} isOpen={isEditScheduleModalOpen} onRequestClose={CloseEditScheduleModal} toEditScheduleData={toEditScheduleData}/>
            <ConfirmScheduleRemoveModal afterRemove={schedules.refetch} isOpen={isRemoveScheduleModalOpen} onRequestClose={CloseRemoveScheduleModal} toRemoveScheduleData={removeScheduleData}/>

                <Stack w="100%" min-width="300px" spacing="6" justify="space-between" alignItems="left" bg="white" borderRadius="16px" shadow="xl" px="8" py="8">
                    <HStack justifyContent="space-between" mb="4">
                        <HStack spacing="2">
                            <Icon as={CalendarIcon} fontSize="20" stroke="#14142b" fill="none"/>

                            <Text fontSize="xl" mb="5" w="100%">Meus Agendamentos</Text>
                        </HStack>

                        <SolidButton onClick={OpenNewScheduleModal} color="white" bg="orange.400" height="32px" icon={PlusIcon} colorScheme="orange" fontSize="12px">
                            Adicionar
                        </SolidButton>
                    </HStack>
                    

                    {   schedules.isLoading ? (
                            <Flex justify="left">
                                <Spinner/>
                            </Flex>
                        ) : ( schedules.isError ? (
                            <Flex justify="left" mt="4" mb="4">
                                <Text>Erro listar os agendamentos</Text>
                            </Flex>
                        ) : (schedules.data?.data.length === 0) && (
                            <Flex justify="left">
                                <Text>Nenhum agendamento encontrado.</Text>
                            </Flex>
                        ) ) 
                    }
                    
                    {
                        (!schedules.isLoading && !schedules.error) && (

                            <Stack w="100%" border="2px" borderColor="gray.500" borderRadius="26" overflow="hidden" spacing="0" allowMultiple>
                                <HStack spacing="8" justify="space-between" paddingX="8" paddingY="3" bg="gray.200">
                                    <HStack fontSize="sm" spacing="4">
                                        <Text>{schedules.data?.data.length} leads</Text>
                                        <Text fontWeight="bold">{pendingSchedulesCount ? pendingSchedulesCount : 0} visitas em breve</Text>
                                    </HStack>
                                </HStack>

                                {
                                    schedules.data?.data.map((schedule: Schedule) => {
                                        const date = new Date(schedule.datetime);

                                        const scheduleColor = (date.toDateString() == todayDateObject.toDateString() ? 'yellow' : date < new Date() ? 'red' : 'gray');

                                        return (
                                            <HStack spacing="6" justifyContent="space-between" key={schedule.id} paddingX="8" bg="white" py="3" borderTop="2px" borderTopColor="gray.500" borderBottom="0">
                                                <Stack spacing="0">
                                                    <Text fontSize="10px" color={`${scheduleColor}.800`}>{formatBRDate(schedule.datetime)}</Text>
                                                    <Text fontSize="sm" fontWeight="normal" color={`${scheduleColor}.800`}>{getHour(schedule.datetime)}</Text>
                                                </Stack>
                                                
                                                <Stack cursor={profile && profile.id === schedule.user.id ? 'pointer' : 'default'} key={`${schedule.city}-${schedule.user.name}-${schedule.datetime}`} spacing="0"  color={`${scheduleColor}.800`} p="1" textTransform="capitalize" borderRadius="4px" fontSize="11px" mb="3px">
                                                    <Text fontWeight="normal">{schedule.lead ? schedule.lead.name : ""}</Text>
                                                    <Text fontWeight="bold">{schedule.city}</Text>
                                                </Stack>
                                            </HStack>
                                        )
                                    })
                                }
                            </Stack>
                        )
                    }    
            </Stack>
        </>
    )
}