import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function SalesChart({ monthlySales = [] }) {
  const labels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const salesData = new Array(12).fill(0);

  monthlySales.forEach((item) => {
    salesData[item._id - 1] = item.totalSales;
  });

  const data = {
    labels,
    datasets: [
      {
        label: "Monthly Sales",
        data: salesData,
        borderColor: "#0d6efd",
        backgroundColor: "rgba(13,110,253,0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  return (
    <div className="card shadow mt-4">
      <div className="card-header">
        <h4>Monthly Sales</h4>
      </div>

      <div className="card-body">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}

export default SalesChart;