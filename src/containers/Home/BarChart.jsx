import { Typography } from "@mui/material";
import React from "react";
import ReactApexChart from "react-apexcharts";

const BarChart = ({ BarChartData, xAxis, yAxis, labelName }) => {
  const colors = [
    "#FF5733",
    "#33FF57",
    "#3357FF",
    "#FF33A8",
    "#FFD700",
    "#00FFFF",
    "#FF8C00",
    "#8A2BE2",
  ];
  const colors1 = [
    "#8A2BE2",
    "#FF8C00",
    "#00FFFF",
    "#FFD700",
    "#FF33A8",
    "#3357FF",
    "#33FF57",
    "#FF5733",
  ];

 
  

  const labels = BarChartData.map((item) => item[xAxis]);
  const salesData = BarChartData.map((item) => item[yAxis]);

  const chartOptions = {
    chart: {
      height: 350,
      type: "bar",
      events: {
        click: function (chart, w, e) {
          // console.log(chart, w, e);
        },
      },
    },
    colors:labelName == 'Inspection by Technician'?colors:colors1 ,
    plotOptions: {
      bar: {
        columnWidth: "80%",
        distributed: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    xaxis: {
      categories: labels,
      labels: {
        style: {
          fontSize: "12px", // Reduce font size
          overflow: "hidden",
          textOverflow: "ellipsis",
        },
        
      },
    },
  };

  const seriesData = [
    {
      name: labelName, // Assign label name to series
      data: salesData,
    },
  ];

  return (
    <div style={{ maxWidth: "600px", width: "100%", margin: "auto", textAlign: "center" }}>
    
      <Typography variant="h6" fontWeight="bold" mb={2} mr={6}>
      {labelName}
      </Typography>
      <div id="chart">
        <ReactApexChart
          options={chartOptions}
          series={seriesData}
          type="bar"
          height={350}
        />
      </div>
    </div>
  );
};

export default BarChart;
