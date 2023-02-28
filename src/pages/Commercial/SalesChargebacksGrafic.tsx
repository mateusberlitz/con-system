import { Flex, HStack, Stack, Text, Select as ChakraSelect } from '@chakra-ui/react'
import { useEffect, useState } from 'react';
import ColumnsCharts from '../../components/Grafics/ColumnsCharts';
import { useProfile } from '../../hooks/useProfile'
import { QuotaFilterData, useQuotas } from '../../hooks/useQuotas';
import { useTeams } from '../../hooks/useTeams';
import { useWorkingBranch } from '../../hooks/useWorkingBranch';
import { useWorkingCompany } from '../../hooks/useWorkingCompany';
import { api } from '../../services/api';
import { Quota, Team } from '../../types';

interface SalesChargesGraficsProps{
    isManager?: boolean;
}

export default function SalesChargesGrafics({isManager}: SalesChargesGraficsProps) {
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
            group_by: "month",
        };
        
        return data;
    })

    const [page, setPage] = useState(1);

    const quotas = useQuotas(filterQuotas, page);

    useEffect(() => {
        setFilterQuotas({...filterQuotas, company: workingCompany.company?.id, branch: workingBranch.branch?.id, year: selectedYear});
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
    const [reversalQuotasMonthAmount, setReversalQuotasMonthAmount] = useState([0,0,0,0,0,0,0,0,0,0,0,0]);

    const calculateSoldQuotasMonthAmount = () => {
        const soldQuotas = quotas.data?.data.data;
        const newAmounth = soldQuotasMonthAmount;

        //console.log(soldQuotas);

        Object.keys(soldQuotas).map((month:string) => {
            const amount = soldQuotas[month].reduce((sumAmount:number, quota:Quota) => {
                return sumAmount + quota.credit;
            }, 0);
            newAmounth[parseInt(month) - 1] = amount;
        });

        setSoldQuotasMonthAmount(newAmounth);
    }

    const calculateReversalQuotasMonthAmount = () => {
        const soldQuotas = quotas.data?.data.data;
        const newAmounth = reversalQuotasMonthAmount;

        //console.log(soldQuotas);

        Object.keys(soldQuotas).map((month:string) => {
            const amount = soldQuotas[month].reduce((sumAmount:number, quota:Quota) => {
                return quota.is_chargeback ? sumAmount + quota.credit : 0;
            }, 0);
            newAmounth[parseInt(month) - 1] = amount;
        });

        setReversalQuotasMonthAmount(newAmounth);
    }

    useEffect(() => {
        if(quotas.data?.data){
            calculateSoldQuotasMonthAmount();
            calculateReversalQuotasMonthAmount();
        }
    }, [quotas]);

    useEffect(() => {
        if(!selectedTeamId && profile?.role.id !== 1 && teamsQuery.data?.data.length > 0){
            setSelectedTeamId(teams[0].id);
        }
    }, [teams]);

    return (
      <Stack width="100%"  min-width="300px" h={470} spacing="6" justify="space-between" alignItems="left" bg="white" borderRadius="16px" shadow="xl" px="8" py="8">
            <Stack spacing="8">
                <Text color="#000" fontSize="xl" fontWeight="400">
                    Vendas x estornos
                </Text>
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
                                    teams && teams.map((team: Team) => {
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
            </Stack>
            
            <ColumnsCharts options={{
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
            colors: ["rgba(195, 0, 82, 0.65)", "rgba(32, 151, 237, 0.65)"],
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
                gradientToColors: ["rgba(195, 0, 82, 0)", "rgba(32, 151, 237, 0)"]
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
                    show: false,
                    name: { show: false, fontSize: "16px", color: "#6E7191", fontWeight: 600 },
                    value: { show: false, fontSize: "16px", color: "#6E7191", fontWeight: 600 },
                    total: { show: false, fontSize: "16px", color: "#6E7191", fontWeight: 600 },
                  },
                },
              },
            },
            yaxis: {
                labels: {
                  formatter: function (value) {
                    return Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(value);
                  }
                },
            },
            legend: { show: true },
          }}
          series={[
            {
              name: "Estorno",
              data: reversalQuotasMonthAmount,
            },
            {
              name: "Vendas",
              data: soldQuotasMonthAmount,
            },
          ]}
        />
      </Stack>
  )
}
