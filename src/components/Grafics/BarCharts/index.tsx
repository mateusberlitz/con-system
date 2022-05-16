import { Box, SimpleGrid } from "@chakra-ui/react";
import { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";

interface BarChartProps {
  options: ApexOptions,
  legend?: { show: boolean };
  series: ApexOptions['series']
}

const BarCharts = ({ options, series }: BarChartProps) => {
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
