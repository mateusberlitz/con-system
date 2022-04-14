
import Chart from 'react-apexcharts'

export default function SimpleDonout() {
  const options = { labels: ["Efetivas", "Estornadas", "Pendentes"], colors: ["#00A878", "#C30052", "#F4B740"], dataLabels: { enabled: false }, plotOptions: { pie: { donut: { labels: { show: true, name: { show: true, fontSize: '14px', fontWeight: 600 }, value: { show: true, fontSize: '14px', fontWeight: 600 }, total: { show: true, fontSize: '14px', fontWeight: 600 } } } } }, legend: { show: true } };
  const series = [8, 2, 1]; //our data

  return (
    <div className="donut-chart">
      <Chart options={options} series={series} type="donut" width="400" />
    </div>

      )
}