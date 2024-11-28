import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getCombinedData } from "../services/api";
import Transactions from "./Transactions";
import Statistics from "./Statistics";
import BarChart from "./BarChart";
import PieChart from "./PieChart";
import "./CombinedData.css";

const CombinedData = () => {
  const [combinedData, setCombinedData] = useState({});
  const [month, setMonth] = useState("2021-11");
  const [startDate, setStartDate] = useState(new Date());

  useEffect(() => {
    const fetchCombinedData = async () => {
      try {
        const response = await getCombinedData(month);
        setCombinedData(response.data);
      } catch (error) {
        console.error("Error fetching combined data:", error);
      }
    };

    fetchCombinedData();
  }, [month]);

  const handleDateChange = (date) => {
    setStartDate(date);
    const newMonth = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;
    setMonth(newMonth);
  };

  return (
    <div className="combined-data-container">
      <h1>Combined Data</h1>
      <div className="calendar-container">
        <h2>Select a Date</h2>
        <DatePicker
          selected={startDate}
          onChange={handleDateChange}
          dateFormat="yyyy-MM"
          showMonthYearPicker
        />
      </div>
      <Transactions month={month} />
      <Statistics month={month} />
      <BarChart month={month} />
      <PieChart month={month} />
    </div>
  );
};

export default CombinedData;
