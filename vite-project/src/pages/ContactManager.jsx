import React, { useEffect, useState } from 'react';
import { Contactarray, ContactList, UploadContacts } from '../components';
import axios from 'axios';
import PerformanceComparisonPage from './PerformanceComparisonPage';

const ContactManager = () => {
  const [btn, setbtn]= useState(true)

  return (
    <div>
      <button
    onClick={() => setbtn(true)}
    className={`px-5 py-2 rounded-xl font-semibold shadow-md transition duration-300 
      ${btn ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-blue-100'}`}
  >
     Cây 2-3-4
  </button>

  <button
    onClick={() => setbtn(false)}
    className={`px-5 py-2 rounded-xl font-semibold shadow-md transition duration-300 
      ${!btn ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-green-100'}`}
  >
    Mảng
  </button>
  <UploadContacts />
      {btn?<ContactList /> :<Contactarray/>}
        {/* Truyền fetchContacts */}

  <PerformanceComparisonPage/>
    </div>
  );
};

export default ContactManager;
