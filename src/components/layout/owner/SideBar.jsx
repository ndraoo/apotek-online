import React, { useContext } from "react";
import { BASE_URL, getConfig } from '../../../services/authService.js'
import { AuthContext } from '../../../context/authContext.js'

import axios from 'axios'
import Swal from "sweetalert2"

function SideBar() {
    const [open, setOpen] = React.useState(0);
 
  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value);
  };

  const { accessToken, setAccessToken, currentUser, setCurrentUser} = useContext(AuthContext)

  const logoutUser = async () => {
      try {
          const response = await axios.post(`${BASE_URL}/logout`, null, getConfig(accessToken))
          localStorage.removeItem('currentUser')
          localStorage.removeItem('currentToken')
          setCurrentUser(null)
          setAccessToken('')
          Swal.fire({
              icon: 'success',
              title: 'Success',
              text: response.data.message,
              customClass: {
                  confirmButton: 'bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700',
              },
              buttonsStyling: false,
          })
      } catch (error) {
          if (error?.response?.status === 401) {
              localStorage.removeItem('currentToken')
              localStorage.removeItem('currentUser')
              setCurrentUser(null)
              setAccessToken('')
          }
          console.log(error)
      }
  }

  return (
<div className="min-h-screen flex flex-row bg-gray-100">
  <div className="flex flex-col w-56 bg-white rounded-r-3xl overflow-hidden">
    <div className="flex items-center justify-center h-20 shadow-md">
      <h1 className="text-3xl uppercase text-indigo-500">Apotek </h1>
    </div>
    <ul className="flex flex-col py-4">
      <li>
        <a href="/owner/dashboard" className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800">
          <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400"><i className="bx bx-home"></i></span>
          <span className="text-sm font-medium">Dashboard</span>
        </a>
      </li>
      <li>
        <a href="/owner/categories" className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800">
          <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400"><i className="bx bx-music"></i></span>
          <span className="text-sm font-medium">Categories</span>
        </a>
      </li>
      <li>
        <a href="/owner/product" className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800">
          <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400"><i className="bx bx-drink"></i></span>
          <span className="text-sm font-medium">Products</span>
        </a>
      </li>
      <li>
        <a href="/owner/transactions-order" className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800">
          <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400"><i className="bx bx-shopping-bag"></i></span>
          <span className="text-sm font-medium">Transactions Orders</span>
        </a>
      </li>
      <li>
        <a href="#" className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800">
          <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400"><i className="bx bx-chat"></i></span>
          <span className="text-sm font-medium">Chat Buyer</span>
        </a>
      </li>
      {
         currentUser ? 
        <li>
          <a href="#" className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800">
            <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400"><i className="bx bx-user"></i></span>
            <span className="text-sm font-medium">{currentUser?.name}</span>
          </a>
        </li>
        :
        <>
        </>
     }
     
      <li>
        <button onClick={() => logoutUser()} className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800">
          <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400"><i className="bx bx-log-out"></i></span>
          <span className="text-sm font-medium">Logout</span>
        </button>
      </li>
    </ul>
  </div>
</div>
  )
}

export default SideBar;
