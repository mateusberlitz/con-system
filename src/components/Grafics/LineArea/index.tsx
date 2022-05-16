import { Box, SimpleGrid } from "@chakra-ui/react";
import { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";

interface LineAreaProps {
  options: ApexOptions
  series: ApexOptions['series']
}

const LineAreaHistory = ({ options, series }: LineAreaProps) => {
  return (
    <Box>
      <SimpleGrid columns={[1, 1, 1, 1]} spacing={4}>
        <Box>
          <Chart
            options={options}
            series={series}
            type="area"
            height="200"
            width={400}
          />
        </Box>
      </SimpleGrid>
    </Box>
  );
};
export default LineAreaHistory;
