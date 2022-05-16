import { Stack, Text } from "@chakra-ui/react";
import BarCharts from "../../components/Grafics/BarCharts";
import { useProfile } from "../../hooks/useProfile";

export default function PurchasedSements() {
  const { profile, permissions } = useProfile();

  return (
    <Stack width="100%" h={400} min-width="300px" spacing="6" justify="space-between" alignItems="left" bg="white" borderRadius="16px" shadow="xl" px="8" py="8" mt={8}>
      <Text color="#000" fontSize="xl" fontWeight="400">
        Segmentos mais comprados
      </Text>
      <BarCharts
        options={{
          colors: ["", ""],
          chart: {
            stacked: true,
            type: 'bar',
            height: 430
          },
          fill: {
            type: 'gradient',
            gradient: {
              shade: 'dark',
              type: 'vertical',
              shadeIntensity: 0.5,
              inverseColors: false,
              opacityFrom: 1,
              opacityTo: 1,
              stops: [0, 100],
              colorStops: [{
                offset: 0,
                color: 'rgba(242, 78, 30, 0.5)',
                opacity: 1
              }, {
                offset: 100,
                color: 'rgba(242, 78, 30, 0)',
                opacity: 0.2
              }]
            }
          },
          plotOptions: {
            bar: {
              borderRadius: 4,
              horizontal: true,
            }
          },
          dataLabels: {
            enabled: false,
          },
          xaxis: {
            categories: ["Investimento", "Imóvel", "Veículo"]
          }
        }}
        series={[
          {
            name: "",
            data: [44, 55, 57],
          },
        ]}
      />
    </Stack>
  );
}
