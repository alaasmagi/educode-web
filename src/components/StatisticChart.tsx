import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const data = [
  { attendancedate: "Jan", Students: 20 },
  { attendancedate: "Feb", Students: 20 },
  { attendancedate: "Mar", Students: 10 },
  { attendancedate: "Apr", Students: 40 },
  { attendancedate: "May", Students: 30 },
  { attendancedate: "May", Students: 180 },
];

const StatisticChart = () => {
  return (
    <ResponsiveContainer width="100%" height={500}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="attendancedate" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="Students" fill="#4492EA" barSize={50} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default StatisticChart;
