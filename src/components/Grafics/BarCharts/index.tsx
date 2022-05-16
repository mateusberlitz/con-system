import { Box, SimpleGrid } from "@chakra-ui/react";
import Chart from "react-apexcharts";

interface BarChartProps {
  options: {
    colors: string[];
    chart: {
      stacked: boolean;
      type: 'bar' | 'line' | 'area' | 'histogram' | 'pie' | 'radialBar',
      height: number
    },
    fill: {
      type: 'gradient' | 'solid' | 'pattern' | 'gradientPath',
      gradient: {
        shade: 'dark' | 'light',
        type: 'horizontal' | 'vertical',
        shadeIntensity: number,
        inverseColors: boolean,
        opacityFrom: number,
        opacityTo: number,
        stops: number[],
        colorStops: {
          offset: number,
          color: string,
          opacity: number
        }[]
      },
    },
    plotOptions: {
      bar: {
        borderRadius: number,
        horizontal: boolean,
      }
    },
    dataLabels: {
      enabled: boolean,
    },
    xaxis: {
      categories: string[]
    }
  };
  legend?: { show: boolean };
  series: [
    {
      name: string;
      data: number[];
    }
  ];
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
