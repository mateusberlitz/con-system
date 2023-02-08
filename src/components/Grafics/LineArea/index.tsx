import { Box, SimpleGrid } from "@chakra-ui/react";
import apexchart, { ApexOptions } from "apexcharts";
import { useEffect, useState } from "react";
import Chart from "react-apexcharts";

interface LineAreaProps {
  options: ApexOptions
  series: ApexOptions['series']
}

const LineAreaHistory = ({ options, series }: LineAreaProps) => {
    const [componentSeries, setComponentSeries] = useState<ApexOptions['series']>(series);

    useEffect(() => {
        setComponentSeries(series);
        if(options.chart && options.chart.id){
            apexchart.exec(options.chart.id, 'updateSeries', series);
        }
    }, [series]);

    //console.log(componentSeries);

    return (
        <Box>
            <SimpleGrid columns={[1, 1, 1, 1]} spacing={4}>
                <Box>
                    {
                        componentSeries && (
                            <Chart
                                options={options}
                                series={componentSeries}
                                type="area"
                                height="200"
                                width={400}
                            />
                        )
                    }
                </Box>
            </SimpleGrid>
        </Box>
    );
};
export default LineAreaHistory;
