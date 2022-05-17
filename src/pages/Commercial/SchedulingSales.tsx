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
          colors: ["rgba(0, 186, 136, 0.65)", "rgba(32, 151, 237, 0.65)"],
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
              name: "Net Profit",
              data: [0, 100, 200, 300, 400, 500, 600],
            },
            {
              name: "Revenue",
              data: [0, 100, 200, 300, 400, 500, 600],
            },
          ]
        }
        />
    </Stack>
  )
}
