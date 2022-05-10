
import Chart from 'react-apexcharts'

interface CommissionDonutsProps{
  confirmedCommissions: number;
  chargeBackCommissions: number;
  pendingCommissions: number
}

export default function SimpleDonout({confirmedCommissions, chargeBackCommissions, pendingCommissions} : CommissionDonutsProps) {
  const options = { labels: ["Efetivas", "Estornadas", "Pendentes"], colors: ["#00A878", "#C30052", "#F4B740"], dataLabels: { enabled: false }, plotOptions: { pie: { donut: { labels: { show: true, name: { show: true, fontSize: '14px', fontWeight: 600 }, value: { show: true, fontSize: '14px', fontWeight: 600 }, total: { show: true, fontSize: '14px', fontWeight: 600 } } } } }, legend: { show: true } };
  const series = [confirmedCommissions, chargeBackCommissions, pendingCommissions]; //our data

  return (
    <div className="donut-chart">
      <Chart options={options} series={series} type="donut" width="400" />
    </div>

      )
}