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
      sorted.forEach((item) => {
        sorted.find((contact) => contact.name === item.name); // thao tác lặp tìm để sinh thời gian
      });
      const endArray = Date.now();
      setArrayTime(((endArray - startArray) / 1000).toFixed(4));
      setArrayData(sorted);

      // ======== TÌM KIẾM ========
      const target = data[Math.floor(Math.random() * data.length)];

      const startTreeSearch = Date.now();
      tree.search(target.name);
      const endTreeSearch = Date.now();
      setTreeSearchTime(((endTreeSearch - startTreeSearch) / 1000).toFixed(4));

      const startArraySearch = Date.now();
      sorted.find((c) => c.name === target.name);
      const endArraySearch = Date.now();
      setArraySearchTime(((endArraySearch - startArraySearch) / 1000).toFixed(4));

      // ======== XÓA ========
      const treeForDelete = new Tree234();
      data.forEach((c) => treeForDelete.insert(c.name, c.phone));
      const startTreeDelete = Date.now();
      treeForDelete.delete(target.name); // đảm bảo Tree234 có phương thức delete
      const endTreeDelete = Date.now();
      setTreeDeleteTime(((endTreeDelete - startTreeDelete) / 1000).toFixed(4));

      const startArrayDelete = Date.now();
      const filtered = sorted.filter((c) => c.name !== target.name);
      const endArrayDelete = Date.now();
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
          <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">So sánh hiệu suất giữa Cây 2-3-4 và Mảng</h2>
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
