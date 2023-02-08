import { Flex, Stack, Text, Select as ChakraSelect, HStack, } from '@chakra-ui/react'
import { useProfile } from '../../hooks/useProfile'

import LineAreaHistory from '../../components/Grafics/LineArea';
import { useWorkingCompany } from '../../hooks/useWorkingCompany';
import { useWorkingBranch } from '../../hooks/useWorkingBranch';
import { api } from '../../services/api';
import { useEffect, useState } from 'react';
import { QuotaFilterData, useQuotas } from '../../hooks/useQuotas';
import { useTeams } from '../../hooks/useTeams';
import { Quota, Team } from '../../types';

interface SalesHistoryGraficProps{
    isManager?: boolean;
}

export default function SalesHistoryGrafic({isManager}: SalesHistoryGraficProps) {
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

    const [page, setPage] = useState(1);

    const quotas = useQuotas(filterQuotas, page);

    useEffect(() => {
        setFilterQuotas({...filterQuotas, company: workingCompany.company?.id, branch: workingBranch.branch?.id, year: selectedYear, team_id: selectedTeamId});
    }, [workingCompany, workingBranch, selectedYear]);

    function handleChangeYear(event:any){
        const newYear = (event?.target.value ? event?.target.value : selectedYear);
        setSelectedYear(newYear);
    }

    const teamsQuery = useTeams({
        company: workingCompany.company?.id,
        branch: workingBranch.branch?.id,
    });

    const teams:Team[] = profile?.role.id === 1 ? teamsQuery.data?.data : profile?.teams;

    const [selectedTeamId, setSelectedTeamId] = useState<number>();

    function handleChangeTeam(event:any){
        const newTeam = event?.target.value;

        setSelectedTeamId(newTeam);
    }

    useEffect(() => {
        setFilterQuotas({...filterQuotas, year: selectedYear, team_id: selectedTeamId});
    }, [selectedYear, selectedTeamId])

    const [soldQuotasMonthAmount, setSoldQuotasMonthAmount] = useState([0,0,0,0,0,0,0,0,0,0,0,0]);

    const calculateRoldQuotasMonthAmount = () => {
        const commissionsReceivedByMonth = quotas.data?.data;
        const newAmounth = soldQuotasMonthAmount;

        //console.log(commissionsReceivedByMonth);

        Object.keys(commissionsReceivedByMonth).map((month:string) => {
            const amount = commissionsReceivedByMonth[month].reduce((sumAmount:number, quota:Quota) => {
                return sumAmount + quota.credit;
            }, 0);
            newAmounth[parseInt(month) - 1] = amount;
        });

        setSoldQuotasMonthAmount(newAmounth);
    }

    useEffect(() => {
        if(quotas.data?.data){
            calculateRoldQuotasMonthAmount();
        }
    }, [quotas]);

    useEffect(() => {
        if(!selectedTeamId && profile?.role.id !== 1 && teamsQuery.data?.data.length > 0){
            setSelectedTeamId(teams[0].id);
        }
    }, [teams]);

  return (
    <Stack width="100%"  min-width="300px" h={470} spacing="6" justify="space-between" alignItems="left" bg="white" borderRadius="16px" shadow="xl" px="8" py="8" mt={-0}>
        <Stack spacing="8">
            <Text color="#000" fontSize="xl" fontWeight="400">
                Histórico de vendas
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
        </Stack>
            <LineAreaHistory 
              options={{
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
              colors: ["rgba(242, 78, 30, 1)"],
              chart: { toolbar: { show: false }, zoom: { enabled: false } },
              tooltip: { enabled: false },
              xaxis: {
                axisBorder: {
                  show: true
                },
                axisTicks: {
                  show: false
                }
              },
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
                  colorStops: [
                    { 
                      offset: 0,
                      color: "rgba(242, 78, 30, 0.5)",
                      opacity: 0.5
                    },
                    {
                      offset: 100,
                      color: "rgba(242, 78, 30, 0)",
                      opacity: 0.7
                    }
                  ]
              }
              },
              grid: { show: false },
              dataLabels: { enabled: false },
              plotOptions: {
                pie: {
                  donut: {
                    labels: {
                      show: false,
                      name: { show: false, fontSize: "16px", color: "#6E7191", fontWeight: 600 },
                      value: { show: false, fontSize: "16px", color: "#6E7191", fontWeight: 600 },
                      total: { show: false, fontSize: "16px", color: "#6E7191", fontWeight: 600 },
                    },
                  },
                },
              },
              legend: { show: false },
            }}
            series={[
              {
                name: "Net Profit",
                type: "area",
                data: soldQuotasMonthAmount,
              }
            ]}
            />
      </Stack>
  )
}
