import React, { useState, useEffect } from "react";
import { Tree, TreeNode } from "react-organizational-chart";
import { Card, Button } from "../components";

const TreeVisualization = ({ steps }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!steps.length || !isPlaying) return;

    const timer = setTimeout(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 1000);

    return () => clearTimeout(timer);
  }, [currentStep, isPlaying, steps.length]);

  if (!steps.length) return <p className="text-center text-gray-500">Chưa có dữ liệu</p>;

  const renderTree = (node) => {
    if (!node) return null;
    return (
      <TreeNode label={<Card className="p-2 bg-blue-200 rounded">{node.keys.map(k => k.name).join(", ")}</Card>}>
        {node.children.map((child, index) => (
          <React.Fragment key={index}>{renderTree(child)}</React.Fragment>
        ))}
      </TreeNode>
    );
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-4">Quá trình thêm vào cây (tự động)</h2>

      <Tree label={<Card className="p-2 bg-green-300 rounded">Root</Card>}>
        {renderTree(steps[currentStep])}
      </Tree>

      <div className="mt-4">
        <Button
          onClick={() => setIsPlaying(!isPlaying)}
          className={`px-4 py-2 rounded font-semibold ${isPlaying ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"} text-white`}
        >
          {isPlaying ? "Tạm dừng" : "Tiếp tục"}
        </Button>
      </div>

      <p className="mt-2 text-sm text-gray-600 italic">
        Bước {currentStep + 1} / {steps.length} ({isPlaying ? "đang chạy" : "tạm dừng"})
      </p>
    </div>
  );
};

export default TreeVisualization;
