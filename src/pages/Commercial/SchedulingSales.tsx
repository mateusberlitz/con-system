import { Flex, HStack, Stack, Select as ChakraSelect, Text, ChakraProps } from '@chakra-ui/react'
import { useEffect, useState } from 'react';
import { Select } from '../../components/Forms/Selects/Select';
import ColumnsChartsSelect from '../../components/Grafics/ColummnsChartsSelect.tsx';
import { useProfile } from '../../hooks/useProfile'
import { QuotaFilterData, useQuotas } from '../../hooks/useQuotas';
import { SchedulesFilterData, useSchedules } from '../../hooks/useSchedules';
import { useTeams } from '../../hooks/useTeams';
import { useWorkingBranch } from '../../hooks/useWorkingBranch';
import { useWorkingCompany } from '../../hooks/useWorkingCompany';
import { api } from '../../services/api';
import { Quota, Team } from '../../types';

interface SchedulingSalesProps extends ChakraProps{
    isManager?: boolean;
}

export default function SchedulingSales({isManager, ...rest}: SchedulingSalesProps) {
    const { profile, permissions } = useProfile();
    const workingCompany = useWorkingCompany();
    const workingBranch = useWorkingBranch();
    const dateObject = new Date;

    const [years, setYears] = useState<Number[]>([]);
    const [selectedYear, setSelectedYear] = useState<string>(dateObject.getFullYear().toString());

    const loadYears = async () => {
        const { data } = await api.get('/quotas-years');

        setYears(data);

        setSelectedYear(data[data.length - 1].toString());
    }

    useEffect(() => {
        loadYears();
    }, [])

    const [filterQuotas, setFilterQuotas] = useState<QuotaFilterData>(() => {
        const data: QuotaFilterData = {
            company: workingCompany.company?.id,
            branch: workingBranch.branch?.id,
            year: dateObject.getFullYear().toString(),
            seller_id: !isManager ? profile?.id : undefined,
        };
        
        return data;
    })

    const [filterSchedules, setFilterSchedules] = useState<SchedulesFilterData>(() => {
        const data: SchedulesFilterData = {
            company: workingCompany.company?.id,
            branch: workingBranch.branch?.id,
            year: dateObject.getFullYear().toString(),
            user: !isManager ? profile?.id : undefined,
        };
        
        return data;
    });


    const [page, setPage] = useState(1);

    const quotas = useQuotas(filterQuotas, page);
    const schedules = useSchedules(filterSchedules, page);
    const [selectedTeamId, setSelectedTeamId] = useState<number>();

    useEffect(() => {
        setFilterQuotas({...filterQuotas, company: workingCompany.company?.id, branch: workingBranch.branch?.id, year: selectedYear, team_id: selectedTeamId});
        setFilterSchedules({...filterQuotas, company: workingCompany.company?.id, branch: workingBranch.branch?.id, year: selectedYear, team_id: selectedTeamId});
    }, [workingCompany, workingBranch, selectedYear, selectedTeamId]);

    function handleChangeYear(event:any){
        const newYear = (event?.target.value ? event?.target.value : selectedYear);
        setSelectedYear(newYear);
    }

    const teamsQuery = useTeams({
        company: workingCompany.company?.id,
        branch: workingBranch.branch?.id,
    });

    const teams:Team[] = profile?.role.id === 0 ? teamsQuery.data?.data : profile?.teams;

    function handleChangeTeam(event:any){
        const newTeam = event?.target.value;

        setSelectedTeamId(newTeam);
    }

    useEffect(() => {
        setFilterQuotas({...filterQuotas, year: selectedYear, team_id: selectedTeamId});
        setFilterSchedules({...filterQuotas, year: selectedYear, team_id: selectedTeamId});
    }, [selectedYear, selectedTeamId])

    const [soldQuotasMonthAmount, setSoldQuotasMonthAmount] = useState([0,0,0,0,0,0,0,0,0,0,0,0]);
    const [schedulesMonthAmount, setSchedulesMonthAmount] = useState([0,0,0,0,0,0,0,0,0,0,0,0]);

    const calculateSoldQuotasMonthAmount = () => {
        const quotasCreditByMonth = quotas.data?.data;
        const newAmounth = soldQuotasMonthAmount;

        //console.log(commissionsReceivedByMonth);

        Object.keys(quotasCreditByMonth).map((month:string) => {
            const amount = quotasCreditByMonth[month].reduce((sumAmount:number, quota:Quota) => {
                return sumAmount + quota.credit;
            }, 0);
            newAmounth[parseInt(month) - 1] = amount;
        });

        setSoldQuotasMonthAmount(newAmounth);
    }

    const calculateSchedulesMonthAmount = () => {
        const schedulesByMonth = quotas.data?.data;
        const newAmounth = schedulesMonthAmount;

        //console.log(commissionsReceivedByMonth);

        Object.keys(schedulesByMonth).map((month:string) => {
            const amount = schedulesByMonth[month].length

            newAmounth[parseInt(month) - 1] = amount;
        });

        setSchedulesMonthAmount(newAmounth);
    }

    useEffect(() => {
        if(quotas.data?.data){
            calculateSoldQuotasMonthAmount();
        }
    }, [quotas]);

    useEffect(() => {
        if(schedules.data?.data){
            calculateSchedulesMonthAmount();
        }
    }, [schedules]);

    useEffect(() => {
        if(!selectedTeamId && profile?.role.id !== 1 && teamsQuery.data?.data.length > 0){
            setSelectedTeamId(teams[0].id);
        }
    }, [teams]);

  return (
    <Stack width="100%" h={450} min-width="300px" spacing="6" justify="space-between" alignItems="left" bg="white" borderRadius="16px" shadow="xl" px="8" py="8" {...rest}>
      <Text color="#000" fontSize="xl" fontWeight="400">
          Agendamentos x vendas
        </Text>
        <Flex justify="flex-end" align="center">
            <HStack spacing="3" w="100%">
                {
                    (isManager || profile?.role.id === 1) && (
                        <ChakraSelect
                            onChange={handleChangeTeam} 
                            defaultValue={selectedTeamId}
                            h="45px"
                            name="team_id"
                            w="90%"
                            fontSize="sm"
                            focusBorderColor="purple.300"
                            bg="gray.400"
                            variant="outline"
                            _hover={{ bgColor: 'gray.500' }}
                            size="lg"
                            borderRadius="full"
                        > 
                            {
                                (profile && profile.role.id === 1) && (<option value="">Todas equipes</option>)
                            }
                            {
                                teams.map((team: Team) => {
                                    return (
                                        <option key={team.id} value={team.id}>{team.name}</option>
                                    )
                                })
                            }
                        </ChakraSelect>
                    )
                }

                <ChakraSelect onChange={handleChangeYear} defaultValue={selectedYear} h="45px" name="year" maxW="200px" fontSize="sm" focusBorderColor="purple.600" bg="gray.400" variant="filled" _hover={ {bgColor: 'gray.500'} } size="lg" borderRadius="full">
                    {
                        years.map((year:Number) => {
                            return (
                                <option key={year.toString()} value={year.toString()}>{year}</option>
                            )
                        })
                    }
                </ChakraSelect>
            </HStack>
        </Flex>
        <ColumnsChartsSelect options={{
          labels: [
            "Jan",
            "Fev",
            "Mar",
            "Abr",
            "Mai",
            "Jun",
            "Jul",
            "Ago",
            "Set",
            "Out",
            "Nov",
            "Dez",
          ],
          colors: ["rgba(32, 151, 237, 0.65)", "rgba(0, 186, 136, 0.65)"],
          chart: { toolbar: { show: false }, zoom: { enabled: false } },
          tooltip: { enabled: true },
          fill: {
            opacity: 1,
            type: "gradient",
            gradient: {
              type: "vertical",
              shadeIntensity: 1,
              inverseColors: false,
              opacityFrom: 1,
              opacityTo: 1,
              stops: [0, 100],
              gradientToColors: ["rgba(0, 186, 136, 0)", "rgba(32, 151, 237, 0)"]
            }
          },
          grid: { show: false },
          xaxis: {
            axisBorder: {
              show: true
            },
            axisTicks: {
              show: false
            }
          },
          dataLabels: { enabled: false },
          plotOptions: {
            pie: {
              donut: {
                labels: {
                  show: true,
                  name: { show: false, fontSize: "16px", color: "#6E7191", fontWeight: 600 },
                  value: { show: false, fontSize: "16px", color: "#6E7191", fontWeight: 600 },
                  total: { show: false, fontSize: "16px", color: "#6E7191", fontWeight: 600 },
                },
              },
            },
          },
          legend: { show: true },
        }}
        series={
          [
            {
              name: "Vendas",
              data: soldQuotasMonthAmount,
            },
            {
              name: "Agendamentos",
              data: schedulesMonthAmount,
            },
          ]
        }
        />
    </Stack>
  )
}
