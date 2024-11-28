import React, { useState, useEffect } from "react";
import { getBarChartData } from "../services/api";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./BarChart.css";



ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({ month }) => {
  const [barChartData, setBarChartData] = useState([]);

  useEffect(() => {
    const fetchBarChartData = async () => {
      try {
        const response = await getBarChartData(month);
        setBarChartData(response.data);
      } catch (error) {
        console.error("Error fetching bar chart data:", error);
      }
    };
    fetchBarChartData();
  }, [month]);

  const data = {
    labels: barChartData.map((data) => data.range),
    datasets: [
      {
        label: "Price Range",
        data: barChartData.map((data) => data.count),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  return (
    <div className="barchart-container">
      <h2>Bar Chart</h2>
      <div className="barchart-wrapper">
        {barChartData.length > 0 ? (
          <Bar data={data} />
        ) : (
          <p>No data available for this month</p>
        )}
      </div>
    </div>
  );
};

export default BarChart;
