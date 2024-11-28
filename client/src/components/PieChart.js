import React, { useState, useEffect } from "react";
import { getPieChartData } from "../services/api";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import "./PieChart.css";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ month }) => {
  const [pieChartData, setPieChartData] = useState([]);

  useEffect(() => {
    const fetchPieChartData = async () => {
      try {
        const response = await getPieChartData(month);
        setPieChartData(response.data);
      } catch (error) {
        console.error("Error fetching pie chart data:", error);
      }
    };
    fetchPieChartData();
  }, [month]);

  const data = {
    labels: pieChartData.map((data) => data.category),
    datasets: [
      {
        data: pieChartData.map((data) => data.count),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#FF6384",
          "#36A2EB",
        ],
      },
    ],
  };

  return (
    <div className="piechart-container">
      <h2>Pie Chart</h2>
      <div className="piechart-wrapper">
        {pieChartData.length > 0 ? (
          <Pie data={data} />
        ) : (
          <p>No data available for this month</p>
        )}
      </div>
    </div>
  );
};

export default PieChart;
