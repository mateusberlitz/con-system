import { Box, SimpleGrid } from "@chakra-ui/react";
import { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";

interface ColummnsChartProps {
  options: ApexOptions;
  series: ApexOptions['series'];
}

const ColumnsCharts = ({ options, series }: ColummnsChartProps) => {
  return (
    <Box>
      <SimpleGrid columns={[1, 1, 1, 1]} spacing={4}>
        <Box>
          <Chart
            options={options}
            series={series}
            type="bar"
            height="255"
            width={400}
          />
        </Box>
      </SimpleGrid>
    </Box>
  );
};
export default ColumnsCharts;
