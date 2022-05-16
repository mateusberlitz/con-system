import { Box, SimpleGrid } from "@chakra-ui/react";
import Chart from "react-apexcharts";

interface ColumnsChartsSelectProps {
  options: {
    labels: string[];
    colors: string[];
    chart: { toolbar: { show: boolean }; zoom: { enabled: boolean } };
    tooltip: { enabled: boolean };
    fill: {
      opacity: number;
      type: string;
      gradient: {
        shade: string,
        type: string,
        shadeIntensity: number,
        inverseColors: boolean,
        opacityFrom: number,
        opacityTo: number,
        stops: number[],
        colorStops: [{
          offset: number,
          color: string,
          opacity: number
        }, {
          offset: number,
          color: string,
          opacity: number
        }]
      }
    };
    grid: { show: boolean };
    dataLabels: { enabled: boolean };
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: boolean;
            name: { show: boolean; fontSize: string; fontWeight: number };
            value: { show: boolean; fontSize: string; fontWeight: number };
            total: { show: boolean; fontSize: string; fontWeight: number };
          };
        };
      };
    };
    legend: { show: boolean };
  };
  series: [
    {
      name: string;
      data: number[];
    },
    {
      name: string;
      data: number[];
    }
  ];
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
