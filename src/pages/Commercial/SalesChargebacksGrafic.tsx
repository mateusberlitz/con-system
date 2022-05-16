import { Flex, HStack, Stack, Text } from '@chakra-ui/react'
import ColumnsCharts from '../../components/Grafics/ColumnsCharts';
import { useProfile } from '../../hooks/useProfile'


export default function SalesChargesGrafics() {
  const { profile, permissions } = useProfile();
      

  return (
      <Stack width="100%"  min-width="300px" h={400} spacing="6" justify="space-between" alignItems="left" bg="white" borderRadius="16px" shadow="xl" px="8" py="8" mt={12}>
        <Text color="#000" fontSize="xl" fontWeight="400">
          Vendas x estornos
        </Text>
            <ColumnsCharts options={{
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
                    name: { show: false, fontSize: "16px", fontWeight: 400 },
                    value: { show: false, fontSize: "16px", fontWeight: 400 },
                    total: { show: false, fontSize: "16px", fontWeight: 400 },
                  },
                },
              },
            },
            legend: { show: true },
          }}
          series={[
            {
              name: "Net Profit",
              data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
            },
            {
              name: "Revenue",
              data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
            },
          ]}
        />
      </Stack>
  )
}
