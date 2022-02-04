import { Text, Stack,Flex, Spinner, HStack, Icon, Tr, Th } from "@chakra-ui/react";
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
import { ReactComponent as SearchIcon } from '../../assets/icons/Search.svg';

import { getHour } from "../../utils/Date/getHour";
import { NewLeadModal } from "./Leads/NewLeadModal";
import { EditScheduleFormData, EditScheduleModal } from "./Schedules/EditScheduleModal";
import { ConfirmScheduleRemoveModal, RemoveScheduleData } from "./Schedules/ConfirmScheduleRemoveModal";
import { NewScheduleModal } from "./Schedules/NewScheduleModal";
import { SchedulesFilterData, useSchedules } from "../../hooks/useSchedules";
import { useWorkingCompany } from "../../hooks/useWorkingCompany";
import { EditButton } from "../../components/Buttons/EditButton";
import { RemoveButton } from "../../components/Buttons/RemoveButton";
import { Table } from "../../components/Table";

interface BillsSummaryProps{
    bills?: UseQueryResult<{
        data: any;
        total: number;
    }, unknown>;
    filter?: BillFilterData;
    handleChangeFilter?: (newFilterValue: BillFilterData) => void;
}

export function LeadsReport(){
    const {profile} = useProfile();
    const workingCompany = useWorkingCompany();
    
    const [filter, setFilter] = useState<LeadsFilterData>(() => {
        const data: LeadsFilterData = {
            user: profile?.id,
            group_by: 'origin',
        };
        
        return data;
    })

    function handleChangeFilter(newFilter: LeadsFilterData){
        setFilter(newFilter);
    }

    const leads = useLeads(filter, 1);

    return (
        <>
                <Stack w="100%" min-width="300px" spacing="6" justify="space-between" alignItems="left" bg="white" borderRadius="16px" shadow="xl" px="8" py="8">
                    <HStack justifyContent="space-between" mb="4">
                        <HStack spacing="2">
                            <Icon as={CalendarIcon} fontSize="20" stroke="#14142b" fill="none"/>

                            <Text fontSize="xl" mb="5" w="100%">Leads por origem</Text>
                        </HStack>
                    </HStack>
                    

                    {   leads.isLoading ? (
                            <Flex justify="left">
                                <Spinner/>
                            </Flex>
                        ) : ( leads.isError ? (
                            <Flex justify="left" mt="4" mb="4">
                                <Text>Erro listar os leads</Text>
                            </Flex>
                        ) : (leads.data?.data.length === 0) && (
                            <Flex justify="left">
                                <Text>Nenhum lead encontrado.</Text>
                            </Flex>
                        ) ) 
                    }

                    {
                        (!leads.isLoading && !leads.error && leads.data?.data.length !== 0) && (
                            <Table header={[
                                {text: 'Origem', bold: true},
                                {text: 'Leads'},
                                {text: 'Percentagem'},
                                {text: 'Conversão'},
                            ]}>
                                {
                                    Object.keys(leads.data?.data).map((origin:string, index: number) => {
                                        return(
                                            <Tr>
                                                {
                                                    Object.keys(leads.data?.data[origin]).map((column:string, index:number) => {
                                                        // if(index === 1 || index === 2){
                                                        //     console.log(parseFloat(leads.data?.data[origin][column]));
                                                        //     if(leads.data){
                                                        //         leads.data.data[origin][column] = parseFloat(leads.data?.data[origin][column]).toFixed(2);
                                                        //     }
                                                        // }

                                                        return index === 0 ?  (
                                                            <Th color="gray.900" fontSize="sm" position="sticky" left="0" key={`${origin}-${column}-${leads.data?.data[origin][column]}`}>{leads.data?.data[origin][column]}</Th>
                                                        )
                                                        : (
                                                            <Th whiteSpace="nowrap" fontWeight="50" key={`${origin}-${column}-${leads.data?.data[origin][column]}`}>{leads.data?.data[origin][column]}</Th>
                                                        )
                                                    })
                                                }
                                            </Tr>
                                        )
                                    })
                                }
                            </Table>
                        )
                    }
            </Stack>
        </>
    )
}