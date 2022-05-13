import { Box, SimpleGrid } from "@chakra-ui/react";
import Chart from "react-apexcharts";

const BarCharts = () => {
  const options = {
    labels: ["Investimento", "Imóvel", "Veículo"],
    colors: ["rgba(242, 78, 30, 0.5)", "rgba(242, 78, 30, 0.5)"],
    fill: {
      type: "linear",
      opacity: 0.7,
    },
    dataLabels: { enabled: false },
    plotOptions: {
      bar: { borderRadius: 4, horizontal: true },
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
    legend: { show: false },
  };

  const series = [
    {
      name: "",
      data: [44, 55, 57],
    },
  ];

  return (
    <Box>
      <SimpleGrid columns={[1, 1, 1, 1]} spacing={4}>
        <Box>
          <Chart
            options={options}
            series={series}
            type="bar"
            height="auto"
            width="400"
          />
        </Box>
      </SimpleGrid>
    </Box>
  );
};
export default BarCharts;
