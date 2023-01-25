import { Flex, Stack, Text, Select as ChakraSelect } from '@chakra-ui/react'
import { useProfile } from '../../hooks/useProfile'

import { Select } from '../../components/Forms/Selects/Select';
import LineAreaHistory from '../../components/Grafics/LineArea';
import { CompanyCommissionsFilterData, useCompanyCommissions } from '../../hooks/useCompanyCommissions';
import { useWorkingCompany } from '../../hooks/useWorkingCompany';
import { useEffect, useState } from 'react';
import { useWorkingBranch } from '../../hooks/useWorkingBranch';
import { api } from '../../services/api';

export default function CommissionsReceivedGrafic() {
  const { profile, permissions } = useProfile();
      
  const workingCompany = useWorkingCompany()
  const workingBranch = useWorkingBranch()

  const dateObject = new Date;

    const [filter, setFilter] = useState<CompanyCommissionsFilterData>(() => {
        const data: CompanyCommissionsFilterData = {
            company_id: workingCompany.company?.id,
            branch_id: workingBranch.branch?.id,
            is_chargeback: false,
            year: dateObject.getFullYear().toString(),
            group_by: 'month'
        };
    
        return data;
    })

    const commissionsSeller = useCompanyCommissions(filter, 1);

    const [years, setYears] = useState<Number[]>([]);
    const [selectedYear, setSelectedYear] = useState<string>(dateObject.getFullYear().toString());

    const loadYears = async () => {
        const { data } = await api.get('/company-commissions-years');

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

    console.log(filter);

  return (
      <Stack width="100%" min-width="300px" spacing="6" justify="space-between" alignItems="left" bg="white" borderRadius="16px" shadow="xl" px="8" py="8" mt={8}>
        <Text color="#000" fontSize="xl" fontWeight="400">
          Comissões Recebidas
        </Text>
        <Flex justify="flex-end" align="center">
            {/* <Select h="45px" name="chargeback_type_id" value="0" w="90%" fontSize="sm" focusBorderColor="purple.300" bg="gray.400" variant="outline" _hover={{ bgColor: 'gray.500' }} size="lg" borderRadius="full" placeholder="Equipe"> 
            </Select> */}
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
                "Out",
                "Nov",
                "Dez",
                "Jan",
                "Fev",
                "Mar",
                "Abr",
                "Mai",
                "Jun",
                "Jul",
                "Ago",
                "Set",
              ],
              colors: [" rgba(0, 186, 136, 0.5)"],
              chart: { toolbar: { show: false }, zoom: { enabled: false } },
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
                      color: " rgba(0, 186, 136, 0.5)",
                      opacity: 0.5
                    },
                    {
                      offset: 100,
                      color: " rgba(0, 186, 136, 0)",
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
                data: [0, 100, 200, 300, 400, 500, 600]
              }
            ]} />
      </Stack>
  )
}
