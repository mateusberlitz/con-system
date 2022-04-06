
import Chart from 'react-apexcharts'

export default function SimpleDonout() {
  const options = { labels: ["Efetivas", "Estornadas", "Pendentes"] };
  const series = [4, 3, 6]; //our data

  return (
    <div className="donut-chart">
      <Chart options={options} series={series} type="donut" width="500" />
    </div>

      )
}