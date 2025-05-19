import React, { useState, useEffect } from "react";
import { Tree234 } from "../context/Tree234";
import { Performancestats } from "../components";
import { Card, CardContent } from "../components";
import axios from "axios";

const PerformanceComparisonPage = () => {
  const [treeData, setTreeData] = useState([]);
  const [arrayData, setArrayData] = useState([]);
  const [treeTime, setTreeTime] = useState(null);
  const [arrayTime, setArrayTime] = useState(null);
  const [treeSearchTime, setTreeSearchTime] = useState(null);
  const [arraySearchTime, setArraySearchTime] = useState(null);
  const [treeDeleteTime, setTreeDeleteTime] = useState(null);
  const [arrayDeleteTime, setArrayDeleteTime] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/contactlist/contactlist");
      const data = response.data.data;

      // ======== CÂY 2-3-4 ========
      const tree = new Tree234();
      const startTree = Date.now();
      data.forEach((contact) => tree.insert(contact.name, contact.phone));
      const endTree = Date.now();
      setTreeTime(((endTree - startTree) / 1000).toFixed(4));
      setTreeData(tree.inorder(tree.root));

      // ======== MẢNG ========
      const startArray = Date.now();
      const sorted = [...data].sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""));
      // Đo thời gian sắp xếp, không bao gồm thao tác tìm kiếm không cần thiết
      const endArray = Date.now();
      setArrayTime(((endArray - startArray) / 1000).toFixed(4));
      setArrayData(sorted);

      // ======== TÌM KIẾM (Lặp nhiều lần để đo rõ hơn) ========
      const target = data[Math.floor(Math.random() * data.length)];
      const numSearches = 10000; // Tăng số lần lặp

      const startTreeSearch = Date.now();
      for (let i = 0; i < numSearches; i++) tree.search(target.name);
      const endTreeSearch = Date.now();
      setTreeSearchTime(((endTreeSearch - startTreeSearch) / 1000).toFixed(4));

      const startArraySearch = Date.now();
      for (let i = 0; i < numSearches; i++) sorted.find((c) => c.name === target.name);
      const endArraySearch = Date.now();
      setArraySearchTime(((endArraySearch - startArraySearch) / 1000).toFixed(4));

      // ======== XÓA ========
      const treeForDelete = new Tree234();
      data.forEach((c) => treeForDelete.insert(c.name, c.phone));
      const startTreeDelete = Date.now();
      treeForDelete.delete(target.name);
      const endTreeDelete = Date.now();
      console.log("Thời gian xóa Cây (trước toFixed):", (endTreeDelete - startTreeDelete) / 1000); // <--- THÊM Ở ĐÂY
      setTreeDeleteTime(((endTreeDelete - startTreeDelete) / 1000).toFixed(4));

      const startArrayDelete = Date.now();
      let tempArray = [...sorted];
      const startIndexToDelete = tempArray.findIndex(c => c.name === target.name);
      if (startIndexToDelete !== -1) {
        tempArray.splice(startIndexToDelete, 1);
      }
      const endArrayDelete = Date.now();
      console.log("Thời gian xóa Mảng (trước toFixed):", (endArrayDelete - startArrayDelete) / 1000); // <--- THÊM Ở ĐÂY
      setArrayDeleteTime(((endArrayDelete - startArrayDelete) / 1000).toFixed(4));


    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6 w-full">
      <Card className="w-full p-6 bg-white shadow-lg rounded-2xl">
        <CardContent>
          <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
            So sánh hiệu suất giữa Cây 2-3-4 và Mảng
          </h2>
          <Performancestats
            data={treeData}
            treeTime={treeTime}
            arrayTime={arrayTime}
            treeSearchTime={treeSearchTime}
            arraySearchTime={arraySearchTime}
            treeDeleteTime={treeDeleteTime}
            arrayDeleteTime={arrayDeleteTime}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceComparisonPage;