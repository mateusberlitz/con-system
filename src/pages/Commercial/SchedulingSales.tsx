import { Flex, Stack, Text } from '@chakra-ui/react'
import { Select } from '../../components/Forms/Selects/Select';
import ColumnsChartsSelect from '../../components/Grafics/ColummnsChartsSelect.tsx';
import { useProfile } from '../../hooks/useProfile'

export default function SchedulingSales() {
  const { profile, permissions } = useProfile();
      

  return (
    <Stack width="100%"  h={410}  min-width="300px" spacing="6" justify="space-between" alignItems="left" bg="white" borderRadius="16px" shadow="xl" px="8" py="8">
      <Text color="#000" fontSize="xl" fontWeight="400">
          Agendamentos x vendas
        </Text>
        <Flex justify="flex-end" align="center">
          <Select h="45px" name="chargeback_type_id" value="0" w="90%" fontSize="sm" focusBorderColor="purple.300" bg="gray.400" variant="outline" _hover={{ bgColor: 'gray.500' }} size="lg" borderRadius="full" placeholder="Equipe"> 
          </Select>
            <Select h="45px" name="chargeback_type_id" value="0" w="90%" fontSize="sm" focusBorderColor="purple.300" bg="gray.400" variant="outline" _hover={{ bgColor: 'gray.500' }} size="lg" borderRadius="full" placeholder="Ultimo ano"> 
            </Select>
        </Flex>
        <ColumnsChartsSelect options={{
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
          colors: ["rgba(32, 151, 237, 0.5)", "rgba(0, 186, 136, 0.5)"],
          chart: { toolbar: { show: false }, zoom: { enabled: false } },
          tooltip: { enabled: false },
          fill: {
            opacity: 0.5,
            type: "linear",
            gradient: {
              shade: 'dark',
              type: 'vertical',
              shadeIntensity: 0.5,
              inverseColors: false,
              opacityFrom: 0.5,
              opacityTo: 0.5,
              stops: [0, 100],
              colorStops: [{
                offset: 0,
                color: 'rgba(32, 151, 237, 0.5)',
                opacity: 1
              }, {
                offset: 100,
                color: 'rgba(242, 78, 30, 0)',
                opacity: 0.2
              }]
            }
          },
          grid: { show: false },
          dataLabels: { enabled: false },
          plotOptions: {
            pie: {
              donut: {
                labels: {
                  show: true,
                  name: { show: true, fontSize: "14px", fontWeight: 600 },
                  value: { show: true, fontSize: "14px", fontWeight: 600 },
                  total: { show: true, fontSize: "14px", fontWeight: 600 },
                },
              },
            },
          },
          legend: { show: true },
        }}
        series={
          [
            {
              name: "Net Profit",
              data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
            },
            {
              name: "Revenue",
              data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
            },
          ]
        }
        />
    </Stack>
  )
}
