import { Text, Stack,Flex, Spinner, HStack, Icon, Tr, Th, FormControl } from "@chakra-ui/react";
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
import { ChangeEvent, useEffect, useState } from "react";
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
import { UserFilterData, useUsers } from "../../hooks/useUsers";
import { ReactSelect, SelectOption } from "../../components/Forms/ReactSelect";
import Select from "react-select";

interface BillsSummaryProps{
    bills?: UseQueryResult<{
        data: any;
        total: number;
    }, unknown>;
    filter?: BillFilterData;
    handleChangeFilter?: (newFilterValue: BillFilterData) => void;
}

interface LeadsReportByMonthProps{
    user: number;
}

export function LeadsReportByMonth(){
    const {profile} = useProfile();
    const workingCompany = useWorkingCompany();
    
    const [filter, setFilter] = useState<LeadsFilterData>(() => {
        const data: LeadsFilterData = {
            user: profile?.id,
            company: workingCompany.company?.id
        };
        
        return data;
    })

    function handleChangeUser(userId: number | string){
        const newFilter = {...filter, user: (typeof userId === 'string' ? parseInt(userId) : userId)};

        setFilter(newFilter);
    }

    const [leadsReport, setLeadsReport] = useState<any>([]);

    const loadReport = async () => {
        // const { data } = await api.get('/monthLeadsReport', { params: {
        //     user: profile?.id,
        //     company: workingCompany.company?.id
        // }});

        const { data } = await api.get('/monthLeadsReport', { params: filter});

        setLeadsReport(data);
    }

    useEffect(() => {
        loadReport();
        console.log(filter);

    }, [filter]);

    const [usersFilter, setUsersFilter] = useState<UserFilterData>(() => {
        const data: UserFilterData = {
            search: '',
            company: workingCompany.company?.id,
            role: 5,
        };
        
        return data;
    })
    
    const { data, isLoading, refetch, error } = useUsers(usersFilter);

    const leadOptions:SelectOption[] = [
        {
            value: "",
            label: "Selecionar Lead"
        }
    ];

    data && data.map((lead: Lead) => {
        leadOptions.push({value: lead.id.toString(), label: lead.name});
    });

    const customStyles = {
        container: (styles:any) => ({ 
            ...styles,
            width: '200px',
            marginBottom: null,
            maxWidth: null,
            zIndex: '999'
        }),
        input: (styles:any) => ({ 
            ...styles ,
            fontSize: "13px",
            paddingLeft: "15px"
        }),
        option: (provided:any, state:any) => ({
          ...provided,
          backgroundColor: state.isSelected ? '#f24e1e' : 'white',
          cursor: state.isDisabled ? 'not-allowed' : 'pointer',
          fontSize: '13px',
          paddingLeft: "15px",
          ':hover': {
            backgroundColor: !state.isSelected ? "#ffefe1" : "#f24e1e",
            color: !state.isSelected ? "#f24e1e" : "#ffffff"
          },
        }),
        control: (styles: any, state: any) => ({ 
            ...styles, 
            backgroundColor: '#f7f7fc' , 
            borderColor: state.isFocused ? "#f24e1e" : "#d9dbe9",
            // ':focus': {
                boxShadow: 0,//state.isFocused ? "0 0 0 1px #f24e1e" : ""
            // },
            ':hover': {
                //border: '2px solid',
                borderColor: state.isFocused ? "#f24e1e" : "#d9dbe9",
            },
            height: '45px',
            borderRadius: '90px'
        }),
        placeholder: (styles: any, state: any) => ({ 
            ...styles,
            paddingLeft: "15px",
            fontSize: '14px',
        }),
        singleValue: (provided:any, state:any) => {
          const opacity = state.isDisabled ? 0.5 : 1;
          const transition = 'opacity 300ms';
          const color = "#14142b";
          const paddingLeft = "15px";
      
          return { ...provided, paddingLeft, opacity, transition, color, fontSize: '14px', };
        }
      }

    return (
        <>
                <Stack mb="14" w="100%" min-width="300px" spacing="6" justify="space-between" alignItems="left" bg="white" borderRadius="16px" shadow="xl" px="8" py="8">
                    <HStack justifyContent="space-between" mb="4">
                        <HStack spacing="2">
                            <Icon as={CalendarIcon} fontSize="20" stroke="#14142b" fill="none"/>

                            <Text fontSize="xl" mb="5" w="100%">Relatório de Leads do vendedor</Text>
                        </HStack>

                        {
                            ( !data ? (
                                <Flex justify="center">
                                    <Text>Nenhum vendedor disponível</Text>
                                </Flex>
                            ) : (
                                // <ReactSelect options={leadOptions}  label="Contato" name="lead" bg="gray.400" variant="outline" _hover={ {bgColor: 'gray.500'} } borderRadius="full"/>
                            
                                <FormControl pos="relative" isInvalid={!!error} w="fit-content">
                                    {/* <Text fontSize="sm" mb="1" display="inline-block">Vendedor</Text> */}

                                    {/* onChange={(event:ChangeEvent<HTMLInputElement>) => handleChangeUser(parseInt(event.target.value))} */}
                                    <Select options={leadOptions} styles={customStyles} onChange={value => handleChangeUser((value ? value.value : ''))}/>
                                </FormControl>
                            ))
                        }
                    </HStack>
                    

                    {/* {   leadsReport.isLoading ? (
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
                    } */}

                    {
                        (leadsReport && leadsReport.length !== 0) && (
                            <Table size="sm" header={[
                                {text: 'Situação', bold: true},
                                {text: 'Janeiro'},
                                {text: 'Fevereiro'},
                                {text: 'Março'},
                                {text: 'Abril'},
                                {text: 'Maio'},
                                {text: 'Junho'},
                                {text: 'Julho'},
                                {text: 'Agosto'},
                                {text: 'Setembro'},
                                {text: 'Outubro'},
                                {text: 'Novembro'},
                                {text: 'Dezembro'},
                                {text: 'Soma da Categoria', bold:true},
                                {text: 'Resultado da Categoria', bold:true},
                            ]}>
                                {
                                    Object.keys(leadsReport).map((status:string, index: number) => {
                                        return (
                                            <Tr>
                                                <Th color={`${leadsReport[status]['color']}.500`} whiteSpace="nowrap" fontSize="sm" bg="white" position="sticky" left="0" key={`${status}`}>{status}</Th>
                                                {
                                                    Object.keys(leadsReport[status]).map((month:string, index:number) => {
                                                        // if(index === 1 || index === 2){
                                                        //     console.log(parseFloat(leads.data?.data[status][column]));
                                                        //     if(leads.data){
                                                        //         leads.data.data[status][column] = parseFloat(leads.data?.data[status][column]).toFixed(2);
                                                        //     }
                                                        // }

                                                        return month !== "total" ? (
                                                            <Th whiteSpace="nowrap" fontWeight="50" key={`${status}-${month}-${leadsReport[status][month]['count']}`}>
                                                                <Stack>
                                                                    <Text color="gray.900" fontWeight="normal">{leadsReport[status][month]['count']} ({leadsReport[status][month]['percent']}%)</Text>
                                                                    {/* <Text>{leadsReport[status][month]['percent']}%</Text> */}
                                                                </Stack>
                                                            </Th>
                                                        ) : (
                                                            <Th whiteSpace="nowrap" fontWeight="50" key={`${status}-${month}-${leadsReport[status][month]['count']}`}>
                                                                <Stack>
                                                                    <Text color="gray.900" fontWeight="normal">{leadsReport[status][month]}</Text>
                                                                </Stack>
                                                            </Th>
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