import React from "react";
import { Chart } from "react-google-charts";

const options = {
    title: "Warehouse % of Target",
    titleTextStyle: {
        fontSize: 10,
        fontWeight: 400,
    },
    is3D: false, // Disable 3D effect
    slices: [
        { color: "#76C7C0" },
        { color: "#A7D79B" },
        { color: "#FFD97D" },
        { color: "#FFA600" },
        { color: "#FF7C43" },
        { color: "#D62728" },
    ],
    chartArea: { width: "100%", height: "120px" },
    legend: {
        position: "right",
        alignment: "start",
        textStyle: {
            fontSize: 9,
            bold: 400,
        },
    },
    tooltip: { isHtml: true },
};

const WarehouseChart = ({ warehouseChartData, chartEvents }) => {
    return (
        <div style={{ width: "265px", margin: "auto" }}>
            <Chart
                chartType="PieChart"
                width="265px"
                data={warehouseChartData}
                chartEvents={chartEvents}
                options={options}
            />
        </div>
    );
};

export default WarehouseChart;