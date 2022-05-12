import { Box, SimpleGrid } from "@chakra-ui/react";
import React from "react";
import Chart from 'react-apexcharts'

const LineAreaHistory = () => {
    const options = { labels: ["Out", "Nov", "Dez", "Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set"], colors: ["#F24E1E"], dataLabels: { enabled: false }, plotOptions: { pie: { donut: { labels: { show: true, name: { show: true, fontSize: '14px', fontWeight: 600 }, value: { show: true, fontSize: '14px', fontWeight: 600 }, total: { show: true, fontSize: '14px', fontWeight: 600 } } } } }, legend: { show: true } };

    const series = [
        {
            name: 'TEAM A',
            type: 'area',
            data: [44, 55, 31, 47, 31, 43, 26, 41, 31, 47, 33]
            }
    ]

    return (
        <Box>
            <SimpleGrid columns={[1, 1, 1, 1]} spacing={4}>
                <Box>
                    <Chart options={options} series={series} type="area" width="100%" />
                </Box>
            </SimpleGrid>
        </Box>
    )
}
export default LineAreaHistory