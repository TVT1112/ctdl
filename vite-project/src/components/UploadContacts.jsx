import React, { useState } from "react";
import * as XLSX from "xlsx";
import { Button, Input } from ".";

const UploadContacts = ({ onUpload }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Vui lòng chọn một file Excel!");
      return;
    }

    const allowedExtensions = [".xlsx", ".xls"];
    const fileExtension = file.name.slice(((file.name.lastIndexOf(".") - 1) >>> 0) + 2);

    if (!allowedExtensions.includes(`.${fileExtension}`)) {
      alert("File không đúng định dạng Excel (.xlsx hoặc .xls)!");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      let parsedData = XLSX.utils.sheet_to_json(sheet).map(row => ({
        name: row["Name"]?.toString().trim() || "Không có tên",
        phone: row["Phone"]?.toString().trim() || "Không có số"
      }));

      if (parsedData.length === 0) {
        alert("File không có dữ liệu hợp lệ!");
        return;
      }

      try {
        const response = await fetch("http://localhost:4000/api/contactlist/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(parsedData),
        });

        if (response.ok) {
          alert("Nhập danh bạ thành công!");
          if (onUpload) onUpload();
        } else {
          alert("Lỗi khi nhập dữ liệu!");
        }
      } catch (error) {
        console.error("Lỗi khi gửi yêu cầu:", error);
        alert("Có lỗi xảy ra!");
      }
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="w-full flex justify-center items-center py-6">
      <div className="w-full md:w-1/2 bg-white p-6 shadow-lg rounded-xl">
        <h2 className="text-xl font-bold mb-4 text-center text-blue-700">Nhập danh sách liên lạc từ Excel</h2>
        <Input type="file" accept=".xlsx, .xls" onChange={handleFileChange} className="mb-4" />
        <Button onClick={handleUpload} className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700">
          Tải lên
        </Button>
      </div>
    </div>
  );
};

export default UploadContacts;
