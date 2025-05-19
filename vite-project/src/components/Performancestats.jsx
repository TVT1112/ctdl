import React, { useState, useEffect } from "react";
import { Card, CardContent } from "./index";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

const Performancestats = ({
  treeTime,
  arrayTime,
  treeSearchTime,
  arraySearchTime,
  treeDeleteTime,
  arrayDeleteTime,
}) => {
  const [addData, setAddData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [deleteData, setDeleteData] = useState([]);

  useEffect(() => {
    if (treeTime !== null && arrayTime !== null) {
      setAddData([
        { structure: "Cây 2-3-4", time: parseFloat(treeTime) },
        { structure: "Mảng", time: parseFloat(arrayTime) },
      ]);
    }
    if (treeSearchTime !== null && arraySearchTime !== null) {
      setSearchData([
        { structure: "Cây 2-3-4", time: parseFloat(treeSearchTime) },
        { structure: "Mảng", time: parseFloat(arraySearchTime) },
      ]);
    }
    if (treeDeleteTime !== null && arrayDeleteTime !== null) {
      setDeleteData([
        { structure: "Cây 2-3-4", time: parseFloat(treeDeleteTime) },
        { structure: "Mảng", time: parseFloat(arrayDeleteTime) },
      ]);
    }
  }, [
    treeTime,
    arrayTime,
    treeSearchTime,
    arraySearchTime,
    treeDeleteTime,
    arrayDeleteTime,
  ]);

  const renderChart = (title, data, color, unit = "giây") => (
    <div className="mb-6">
      <h4 className="text-md font-semibold text-center mb-2 text-indigo-700">{title}</h4>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="structure" />
          <YAxis label={{ value: unit, angle: -90, position: "insideLeft" }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="time" fill={color} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <Card className="bg-purple-50 p-4 rounded-xl shadow-md mt-4">
      <CardContent>
        <h3 className="text-lg font-semibold mb-4 text-purple-700 text-center">
          Hiệu suất thao tác
        </h3>
        {renderChart("Thời gian thêm", addData, "#8884d8")}
        {renderChart("Thời gian tìm kiếm", searchData, "#82ca9d")}
        {renderChart("Thời gian xóa", deleteData, "#ffc658")}
      </CardContent>
    </Card>
  );
};

export default Performancestats;