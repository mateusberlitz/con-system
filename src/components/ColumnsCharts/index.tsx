import { Box, SimpleGrid } from "@chakra-ui/react";
import Chart from 'react-apexcharts'

const ColumnsCharts = () => {
    const options = { labels: ["Out", "Nov", "Dez", "Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set"], colors: ["#2097ED", "#C30052"], dataLabels: { enabled: false }, plotOptions: { pie: { donut: { labels: { show: true, name: { show: true, fontSize: '14px', fontWeight: 600 }, value: { show: true, fontSize: '14px', fontWeight: 600 }, total: { show: true, fontSize: '14px', fontWeight: 600 } } } } }, legend: { show: false } };

    const series = [
        {
            "name": "Net Profit",
            "data":  [44, 55, 57, 56, 61, 58, 63, 60, 66]
        },
        {
            "name": "Revenue",
            "data": [76, 85, 101, 98, 87, 105, 91, 114, 94]
        }

    ]

    return (
        <Box>
            <SimpleGrid columns={[1, 1, 1, 1]} spacing={4}>
                <Box>
                    <Chart options={options} series={series} type="bar" height="342px" width="100%"/>
                </Box>
            </SimpleGrid>
        </Box>
    )
}
export default ColumnsCharts