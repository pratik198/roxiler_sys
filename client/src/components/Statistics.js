import React, { useState, useEffect } from "react";
import { getStatistics } from "../services/api";
import "./Statistics.css";

const Statistics = ({ month }) => {
  const [statistics, setStatistics] = useState({});

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await getStatistics(month);
        setStatistics(response.data);
      } catch (error) {
        console.error("Error fetching statistics:", error);
      }
    };
    fetchStatistics();
  }, [month]);

  return (
    <div className="statistics-container">
      <h2>Statistics - {month}</h2>
      {statistics ? (
        <ul>
          <li>Total Sale Amount: ${statistics.totalSaleAmount}</li>
          <li>Sold Items: {statistics.soldItems}</li>
          <li>Not Sold Items: {statistics.notSoldItems}</li>
        </ul>
      ) : (
        <p>No statistics available</p>
      )}
    </div>
  );
};

export default Statistics;
