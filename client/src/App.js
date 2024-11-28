
import React, { useState } from "react";
import Transactions from "./components/Transactions";
import Statistics from "./components/Statistics";
import BarChart from "./components/BarChart";
import PieChart from "./components/PieChart";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import "./App.css";

const App = () => {
  const [month, setMonth] = useState(new Date());

  const formattedMonth = format(month, "yyyy-MM");

  return (
    <div className="app-container">
      <h1 className="dashboard-title" style={{ textAlign: "center" }}>
        Transaction Dashboard
      </h1>
      <div className="month-picker">
        <label htmlFor="month">Select Date: </label>
        <DatePicker
          selected={month}
          onChange={(date) => setMonth(date)}
          dateFormat="yyyy-MM"
          showMonthYearPicker
          className="month-input"
        />
      </div>
      <div className="charts-container">
        <Transactions month={formattedMonth} />
        <Statistics month={formattedMonth} />
        <BarChart month={formattedMonth} />
        <PieChart month={formattedMonth} />
      </div>
    </div>
  );
};

export default App;
