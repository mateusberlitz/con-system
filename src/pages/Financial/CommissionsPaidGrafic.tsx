import { Flex, Stack, Text, Select as ChakraSelect } from '@chakra-ui/react'
import { useProfile } from '../../hooks/useProfile'

import { Select } from '../../components/Forms/Selects/Select';
import LineAreaHistory from '../../components/Grafics/LineArea';
import { api } from '../../services/api';
import { useEffect, useState } from 'react';
import { CompanyCommissionsFilterData, useCompanyCommissions } from '../../hooks/useCompanyCommissions';
import { useWorkingCompany } from '../../hooks/useWorkingCompany';
import { useWorkingBranch } from '../../hooks/useWorkingBranch';
import { CompanyCommission } from '../../types';
import { useCommissionsSeller } from '../../hooks/useCommissionsSeller';

export default function CommissionsPaidGrafic() {
  const { profile, permissions } = useProfile();

  const workingCompany = useWorkingCompany()
  const workingBranch = useWorkingBranch()

  const dateObject = new Date;

    const [filter, setFilter] = useState<CompanyCommissionsFilterData>(() => {
        const data: CompanyCommissionsFilterData = {
            company_id: workingCompany.company?.id,
            branch_id: workingBranch.branch?.id,
            is_chargeback: false,
            group_by: 'month_number'
        };
    
        return data;
    })

    const commissionsSeller = useCommissionsSeller(filter, 1);

    const [years, setYears] = useState<Number[]>([]);
    const [selectedYear, setSelectedYear] = useState<string>();

    const loadYears = async () => {
        const { data } = await api.get('/seller-commissions-years');

        setSelectedYear(data.length > 0 ? data[data.length - 1].toString() : null);

        setYears(data);
    }

    function handleChangeYear(event:any){
        const newYear = (event?.target.value ? event?.target.value : selectedYear);

        setSelectedYear(newYear);
    }

    useEffect(() => {
        loadYears();
    }, [])

    useEffect(() => {
        setFilter({...filter, year: selectedYear});
    }, [selectedYear])
      
  const [paidCommissionsMonthAmount, setPaidCommissionsMonthAmount] = useState([0,0,0,0,0,0,0,0,0,0,0,0]);

    const calculatePaidCommissionsMonthAmount = () => {
        const commissionsReceivedByMonth = commissionsSeller.data?.data;
        const newReceived = paidCommissionsMonthAmount;

        //console.log(commissionsReceivedByMonth);

        Object.keys(commissionsReceivedByMonth).map((month:string) => {
            const amount = commissionsReceivedByMonth[month].reduce((sumAmount:number, commission:CompanyCommission) => {
                return sumAmount + commission.value;
            }, 0);
            newReceived[parseInt(month) - 1] = amount;
        })

        setPaidCommissionsMonthAmount(newReceived);
    }

    useEffect(() => {
        if(commissionsSeller.data?.data){
            calculatePaidCommissionsMonthAmount();
        }
    }, [commissionsSeller]);

  return (
      <Stack width="100%" min-width="300px" spacing="6" justify="space-between" alignItems="left" bg="white" borderRadius="16px" shadow="xl" px="8" py="8">
        <Text color="#000" fontSize="xl" fontWeight="400">
          Comissões Pagas
        </Text>
        <Flex justify="flex-end" align="center">
            <ChakraSelect onChange={handleChangeYear} defaultValue={dateObject.getFullYear().toString()} h="45px" name="selected_company" maxW="200px" fontSize="sm" focusBorderColor="purple.600" bg="gray.400" variant="filled" _hover={ {bgColor: 'gray.500'} } size="lg" borderRadius="full">
                {
                    years.map((year:Number) => {
                        return (
                            <option key={year.toString()} value={year.toString()}>{year}</option>
                        )
                    })
                }
            </ChakraSelect>
        </Flex>
            <LineAreaHistory options={{
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
              colors: [" rgba(197, 32, 101, 0.5)"],
              chart: { id: 'PaidCommissionsChart', toolbar: { show: false }, zoom: { enabled: false } },
              tooltip: { enabled: true },
              fill: {
                opacity: 0.3,
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
                      color: "rgba(197, 32, 101, 0.5)",
                      opacity: 0.5
                    },
                    {
                      offset: 100,
                      color: "rgba(197, 32, 101, 0)",
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
                name: "Pagas",
                type: "area",
                data: paidCommissionsMonthAmount
              }
            ]} />
      </Stack>
  )
}
