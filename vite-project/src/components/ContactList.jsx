import React, { useState, useEffect } from "react";
import { Card, CardContent, Button, Input } from "../components";
import axios from "axios";
import { Tree234 } from "../context/Tree234";
import TreeVisualization from "./TreeVisualization";

const ContactList = () => {
  const [tree, setTree] = useState(new Tree234());
  const [contacts, setContacts] = useState([]);
  const [contactArray, setContactArray] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  const fetchContacts = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/contactlist/contactlist");
      const data = response.data.data;

      const newTree = new Tree234();
      data.forEach((contact) => newTree.insert(contact.name, contact.phone));
      setTree(newTree);
      console.log(newTree)
      setContacts(newTree.inorder(newTree.root));

      const sortedArray = [...data].sort((a, b) => a.name.localeCompare(b.name));
      setContactArray(sortedArray);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
    }
  };

  const addContact = async () => {
    if (!name || !phone) return;
    const newContact = { name, phone };
  
    const newTree = new Tree234();
    newTree.root = JSON.parse(JSON.stringify(tree.root));
    newTree.steps = [...tree.steps];
    newTree.insert(newContact.name, newContact.phone);
  
    setTree(newTree);
    setContacts(newTree.inorder(newTree.root));
    setName("");
    setPhone("");
  
    // Nếu vẫn muốn thêm lên server
    /*
    try {
      await axios.post("http://localhost:4000/api/contactlist/add", newContact);
      window.location.reload(); // Thêm dòng này để load lại trang sau khi thêm xong
    } catch (error) {
      console.error("Lỗi khi thêm liên lạc:", error);
    }
    */
  };

  const searchInTree = () => {
    if (!searchName) return;
  
    const result = tree.search(searchName);
    if (!result) {
      setSearchResult(null);
      return;
    }
  
    // Lấy thêm _id từ MongoDB (dùng contactArray)
    const fullResult = contactArray.find(
      (c) => c.name === result.name && c.phone === result.phone
    );
  
    setSearchResult(fullResult || result); // Ưu tiên bản có _id
  };

  const handleDeleteFromTree = async () => {
    if (!searchResult || !searchResult._id) return;
  
    try {
      const response = await fetch(
        `http://localhost:4000/api/contactlist/delete/${searchResult._id}`,
        { method: "DELETE" }
      );
  
      const result = await response.json();
      if (result.success) {
        // Cập nhật lại contactArray (xóa khỏi mảng)
        const updatedContacts = contactArray.filter(
          (c) => c._id !== searchResult._id
        );
        setContactArray(updatedContacts);
  
        // Dựng lại cây mới từ contactArray đã cập nhật
        const newTree = new Tree234();
        updatedContacts.forEach((c) => newTree.insert(c.name, c.phone));
        setTree(newTree);
        setContacts(newTree.inorder(newTree.root));
  
        // Clear giao diện
        setSearchResult(null);
        setSearchName("");
        alert("Đã xóa liên hệ khỏi hệ thống.");
      } else {
        alert("Không thể xóa liên hệ từ server.");
      }
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
      alert("Đã xảy ra lỗi khi xóa.");
    }
  };
  
  

  useEffect(() => {
    fetchContacts();
   
  }, []);

  return (
    <div className="p-6 w-full">

      {/* Danh sách liên hệ */}
      <div className="mt-8 bg-gray-50 p-4 rounded-xl shadow-inner">
            <h3 className="text-lg font-semibold mb-4 text-gray-700 text-center">Danh sách liên lạc (Cây 2-3-4)</h3>
            <div className="max-h-80 overflow-y-auto">
              {contacts.map((contact, index) => (
                <Card key={index} className="mb-2 p-3 shadow-sm rounded-lg bg-white">
                  <CardContent>
                    <p className="font-semibold text-base">{contact.name}</p>
                    <p className="text-gray-600">{contact.phone}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>


      <Card className="w-full p-6 bg-white shadow-lg rounded-2xl">
        <CardContent>
          <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Quản lý danh bạ (Cây 2-3-4)</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Form thêm */}
            <div className="bg-blue-50 p-4 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold mb-3 text-blue-600">Thêm liên hệ</h3>
              <Input
                placeholder="Tên"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mb-2 px-3 py-2 border rounded-md"
              />
              <Input
                placeholder="Số điện thoại"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full mb-4 px-3 py-2 border rounded-md"
              />
              <Button
                onClick={addContact}
                className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700"
              >
                Thêm liên hệ
              </Button>
            </div>

            {/* Tìm kiếm */}
            <div className="bg-green-50 p-4 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold mb-3 text-green-600">Tìm kiếm trong cây</h3>
              <Input
                placeholder="Nhập tên cần tìm"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="w-full mb-4 px-3 py-2 border rounded-md"
              />
              <Button
                onClick={searchInTree}
                className="w-full bg-green-600 text-white font-bold py-2 rounded-lg hover:bg-green-700"
              >
                Tìm trong cây
              </Button>

              {searchResult ? (
                <Card className="mt-4 p-3 shadow-md rounded-lg bg-green-100">
                  <CardContent>
                    <p className="font-semibold text-lg">{searchResult.name}</p>
                    <p className="text-gray-700">{searchResult.phone}</p>
                    <Button
                      onClick={handleDeleteFromTree}
                      className="mt-3 bg-red-600 text-white font-bold py-1 px-3 rounded hover:bg-red-700"
                    >
                      Xóa liên hệ này
                    </Button>
                  </CardContent>
                </Card>
              ) : searchName ? (
                <p className="text-center mt-4 text-red-500 font-medium">Không tìm thấy liên hệ.</p>
              ) : null}

            </div>
          </div>

          

          {/* Visualization */}
          <div className="mt-8 bg-yellow-50 p-4 rounded-xl shadow-inner">
            <h3 className="text-lg font-semibold mb-4 text-yellow-700 text-center">Cây 2-3-4 Visualization</h3>
            <TreeVisualization steps={tree.getSteps()} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactList;
