import { Flex, Stack, Text } from '@chakra-ui/react'
import { useProfile } from '../../hooks/useProfile'

import { Select } from '../../components/Forms/Selects/Select';
import LineAreaHistory from '../../components/Grafics/LineArea';
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';

export default function SalesHistoryGrafic() {
  const { profile, permissions } = useProfile();

  return (
    <Stack width="100%"  min-width="300px" h="400" spacing="6" justify="space-between" alignItems="left" bg="white" borderRadius="16px" shadow="xl" px="8" py="8" mt={4}>
      <Text color="#000" fontSize="xl" fontWeight="400">
          Histórico de vendas
        </Text>
        <Flex justify="flex-end" align="center">
          <Select
                h="45px"
                name="chargeback_type_id"
                value="0"
                w="90%"
                fontSize="sm"
                focusBorderColor="purple.300"
                bg="gray.400"
                variant="outline"
                _hover={{ bgColor: 'gray.500' }}
                size="lg"
                borderRadius="full"
                placeholder="Equipe"
              > 
            </Select>
            <Select
              h="45px"
              name="chargeback_type_id"
              value="0"
              w="90%"
              fontSize="sm"
              focusBorderColor="purple.300"
              bg="gray.400"
              variant="outline"
              _hover={{ bgColor: 'gray.500' }}
              size="lg"
              borderRadius="full"
              placeholder="Ultimo ano"
            > 
            </Select>
        </Flex>
            <LineAreaHistory 
              options={{
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
                      name: { show: false, fontSize: "16px", fontWeight: 400 },
                      value: { show: false, fontSize: "16px", fontWeight: 400 },
                      total: { show: false, fontSize: "16px", fontWeight: 400 },
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
                data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
              }
            ]}
            />
      </Stack>
  )
}
