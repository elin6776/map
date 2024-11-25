import React, { useEffect, useState } from "react";
import teaData from "./tea_consumption.json";
import './App.css';

const Heatmap = () => {
  const [monthlyData, setMonthlyData] = useState({});
  const [hoveredTotal, setHoveredTotal] = useState(null);

  const getColorForValue = (value) => {
    const colors = [
      "rgba(255, 255, 255, 1)", 
      "rgba(153, 255, 153, 1)",
      "rgba(102, 204, 102, 1)", 
      "rgba(0, 158, 0, 1)",    
      "rgba(0, 100, 0, 1)"     
    ];
    
    return colors[Math.min(value, colors.length - 1)];
  };

  useEffect(() => {
    const allMonths = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const groupedData = teaData.reduce((acc, entry) => {
      const parsedDate = new Date(entry.date);
      if (isNaN(parsedDate)) {
        console.warn("Invalid date:", entry.date);
        return acc;
      }
      const month = parsedDate.toLocaleString("default", { month: "long", timeZone: "UTC" });
      if (!allMonths.includes(month)) return acc;
      if (!acc[month]) acc[month] = [];
      acc[month].push({
        date: entry.date,
        teas: entry.teas,
        total: Object.values(entry.teas).reduce((sum, value) => sum + value, 0),
      });
      return acc;
    }, {});

    const completeData = allMonths.reduce((acc, month) => {
      acc[month] = groupedData[month] || [];
      return acc;
    }, {});

    setMonthlyData(completeData);
  }, []);

  return (
    <div className="heatmap-container">
      <div>
        <h1>Tea Consumption Heatmap (2023)</h1>
        <div className="month-grid">
          {Object.entries(monthlyData).map(([month, entries]) => (
            <div key={month} className="month-container">
              <h2>{month}</h2>
              {entries.length > 0 ? (
                <div class="grid">
                  {entries.map((row, rowIndex) => (
                    <div
                      key={rowIndex}
                      className="tea-box"
                      style={{
                        backgroundColor: getColorForValue(row.total),
                        opacity: hoveredTotal === null || hoveredTotal === row.total ? 1 : 0.3,
                      }}
                      onMouseEnter={() => setHoveredTotal(row.total)}
                      onMouseLeave={() => setHoveredTotal(null)} 
                      tooltip={`Date: ${row.date}\n${Object.entries(row.teas)
                        .map(([teaName, teaValue]) => `${teaName}: ${teaValue}`)
                        .join('\n')}`}
                    ></div>
                  ))}
                </div>
              ) : (
                <p>No data available for {month}.</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Heatmap;
