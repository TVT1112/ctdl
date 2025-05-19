import React, { useState, useEffect } from "react";
import { Tree, TreeNode } from "react-organizational-chart";
import { Card, Button } from "../components";

const TreeVisualization = ({ steps }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [inputStep, setInputStep] = useState("");

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

  const handleStepSearch = () => {
    const stepNum = parseInt(inputStep);
    if (!isNaN(stepNum) && stepNum >= 1 && stepNum <= steps.length) {
      setCurrentStep(stepNum - 1);
      setIsPlaying(false); // Tạm dừng tự động khi tìm kiếm tay
    } else {
      alert(`Vui lòng nhập bước từ 1 đến ${steps.length}`);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 rounded-lg shadow-md max-w-full overflow-x-auto">
      <h2 className="text-lg font-bold mb-4">Quá trình thêm vào cây (tự động)</h2>

      {/* Cây bọc trong khung cuộn nếu rộng quá */}
      <div className="w-full overflow-auto mb-4">
        <Tree
          label={<Card className="p-2 bg-green-300 rounded">Root</Card>}
          lineWidth={"2px"}
          lineColor={"#ccc"}
          lineBorderRadius={"10px"}
        >
          <div className="inline-block whitespace-nowrap">{renderTree(steps[currentStep])}</div>
        </Tree>
      </div>

      {/* Điều khiển */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-4 py-2 rounded font-semibold ${isPlaying ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"} text-white`}
          >
            {isPlaying ? "Tạm dừng" : "Tiếp tục"}
          </Button>

          <input
            type="number"
            value={inputStep}
            onChange={(e) => setInputStep(e.target.value)}
            placeholder={`Tới bước (1-${steps.length})`}
            className="border rounded px-2 py-1 w-36 text-sm"
          />
          <Button
            onClick={handleStepSearch}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
          >
            Đi đến bước
          </Button>
        </div>

        <p className="mt-2 text-sm text-gray-600 italic">
          Bước {currentStep + 1} / {steps.length} ({isPlaying ? "đang chạy" : "tạm dừng"})
        </p>
      </div>
    </div>
  );
};

export default TreeVisualization;
