import React, { useContext, useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

import { useSelector } from "react-redux";
import { DashBoadContext } from "../../pages/Dashboard";
import { COLORS } from "../../functions/functions";

const PieRechartComponent = () => {
  const { sales } = useSelector((state) => state.sales);
  const [dataSale, setDataSale] = useState([]);
  const { month, year } = useContext(DashBoadContext);

  useEffect(() => {
    const groupSales = sales.reduce((acc, curr) => {
      let queryFound = false;

      if (!year && !queryFound) {
        const selectedYear = new Date(curr.createdAt).toLocaleString("fr-FR", {
          year: "numeric",
        }); // Get selectedYear name
        let sumLineSale = curr.LineSale.reduce(
          (accVal, currVal) => accVal + currVal.qty * currVal.price,
          0
        );
        const existingRow = acc.find((row) => row.name === selectedYear);
        if (existingRow) {
          existingRow.value += sumLineSale;
        } else {
          acc.push({ name: selectedYear, value: sumLineSale });
        }
        queryFound = true;
      }
      if (!month && !queryFound) {
        const selectedMonth = new Date(curr.createdAt).toLocaleString("fr-FR", {
          month: "long",
        }); // Get selectedMonth name
        let sumLineSale = curr.LineSale.reduce(
          (accVal, currVal) => accVal + currVal.qty * currVal.price,
          0
        );
        const existingRow = acc.find((row) => row.name === selectedMonth);
        if (existingRow) {
          existingRow.value += sumLineSale;
        } else {
          acc.push({ name: selectedMonth, value: sumLineSale });
        }
        queryFound = true;
      }
      if (!queryFound) {
        const selectedDay = new Date(curr.createdAt).toLocaleString("fr-FR", {
          day: "numeric",
        }); // Get selectedDay name
        let sumLineSale = curr.LineSale.reduce(
          (accVal, currVal) => accVal + currVal.qty * currVal.price,
          0
        );
        const existingRow = acc.find((row) => row.name === selectedDay);
        if (existingRow) {
          existingRow.value += sumLineSale;
        } else {
          acc.push({ name: selectedDay, value: sumLineSale });
        }
      }

      return acc;
    }, []);

    setDataSale(groupSales);
  }, [sales, month, year]);

  const pieData = dataSale;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active) {
      return (
        <div
          className="custom-tooltip"
          style={{
            backgroundColor: "#ffff",
            padding: "5px",
            border: "1px solid #cccc",
          }}
        >
          <label>{`${payload[0].name} : ${payload[0].value} MRU`}</label>
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <h1 className="text-xl font-bold xl:text-3xl">Statistiques des ventes</h1>
      <div className="w-full flex justify-center items-center">
        <PieChart width={730} height={300}>
          <Pie
            data={pieData}
            color="#000000"
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={120}
            fill="#8884d8"
          >
            {pieData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </div>
    </>
  );
};

export default PieRechartComponent;
