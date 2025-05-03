import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "../components";
import { ContactArray } from "../context/Tree234";

const Contactarray = () => {
  const [contactArray, setContactArray] = useState(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/contactlist/contactlist");
        const data = response.data.data;

        // Khởi tạo ContactArray với dữ liệu lấy từ MongoDB
        const newArray = new ContactArray();
        newArray.addFromArray(data);
        setContactArray(newArray);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      }
    };

    fetchContacts();
    console.log(contactArray)
  }, []);

  return (
    <div className="p-6 w-full">
      <Card className="w-full p-6 bg-white shadow-lg rounded-2xl">
        <CardContent>
          <h2 className="text-2xl font-bold mb-6 text-center text-purple-700">Danh sách liên lạc (Mảng thuần túy)</h2>

          <div className="max-h-80 overflow-y-auto">
            {contactArray ? (
              contactArray.getContacts().map((contact, index) => (
                <Card key={index} className="mb-2 p-3 shadow-sm rounded-lg bg-white">
                  <CardContent>
                    <p className="font-semibold text-base">{contact.name}</p>
                    <p className="text-gray-600">{contact.phone}</p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-center text-gray-500">Đang tải danh bạ...</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Contactarray;
