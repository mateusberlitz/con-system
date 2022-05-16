import { Box, SimpleGrid } from "@chakra-ui/react";
import { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";

interface ColumnsChartsSelectProps {
  options: ApexOptions
  series: ApexOptions['series']
}

const ColumnsChartsSelect = ({ options, series }: ColumnsChartsSelectProps) => {
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
export default ColumnsChartsSelect;
