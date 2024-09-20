import React, { useState,useContext } from "react";
import { BASE_URL, getConfig } from '../../../services/authService.js'
import { AuthContext } from '../../../context/authContext.js'
import axios from 'axios'
import Swal from "sweetalert2"

const Header = ({ setProducts }) => {
    const { accessToken, setAccessToken, currentUser, setCurrentUser} = useContext(AuthContext)
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.get(`${BASE_URL}/product/search`, {
            params: { query: searchQuery }
          });
          setProducts(response.data.data);
        } catch (error) {
          console.error('Failed to search products', error);
        }
      };
      
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
        <>
        <header className="py-4 shadow-sm bg-white">
            <div className="container flex items-center justify-between">
                <a href="/">
                    {/* <img src="public/buyer/images/logo.svg" alt="Logo" className="w-32" /> */}
                    <h1 className="w-32 ">APOTEK ONLINE</h1>
                </a>
                <form onSubmit={handleSearch}>
                <div className="w-full max-w-xl relative flex">
                    <span className="absolute left-4 top-3 text-lg text-gray-400">
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </span>
                    <input type="text" name="search" id="search"  
                           value={searchQuery}
                           onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full border border-primary border-r-0 pl-12 py-3 pr-3 rounded-l-md focus:outline-none hidden md:flex"
                        placeholder="search" />
                    <button
                        className="bg-primary border border-primary text-white px-8 rounded-r-md hover:bg-transparent hover:text-primary transition hidden md:flex">Search</button>
                </div>
                </form>
    
                <div className="flex items-center space-x-4">
                    <a href="/cart" className="text-center text-gray-700 hover:text-primary transition relative">
                        <div className="text-2xl">
                            <i className="fa-solid fa-bag-shopping"></i>
                        </div>
                        <a href="/cart"> <div className="text-xs leading-3">Cart</div></a>
                        <div
                            className="absolute -right-3 -top-1 w-5 h-5 rounded-full flex items-center justify-center bg-primary text-white text-xs">
                        2</div>
                    </a>
                    <div className="text-center text-gray-700 hover:text-primary transition relative">
                        {
                            currentUser ? 
                            <>
                            <div className="text-2xl">
                                <i className="fa-regular fa-user"></i>
                            </div>
                            <div className="text-xs leading-3">{currentUser?.name}</div>
                            </>
                            :
                            <>

                            </>
                        }
                    </div>
                </div>
            </div>
        </header>
    
        <nav className="bg-gray-800">
            <div className="container flex">
                <div className="px-8 py-4 bg-primary md:flex items-center cursor-pointer relative group hidden">
                    <span className="text-white">
                        <i className="fa-solid fa-bars"></i>
                    </span>
                    <span className="capitalize ml-2 text-white hidden">All Categories</span>
    
                    
                </div>
    
                <div className="flex items-center justify-between flex-grow md:pl-12 py-5">
                    <div className="flex items-center space-x-6 capitalize">
                        <a href="/" className="text-gray-200 hover:text-white transition">Home</a>
                        <a href="/product" className="text-gray-200 hover:text-white transition">Product</a>
                        {
                        accessToken ?
                        <>

                        <a href="/product/transactions" className="text-gray-200 hover:text-white transition">Products Transactions</a>
                        </> 
                        : 
                        <>
                        </>
                        }
                        <a href="#" className="text-gray-200 hover:text-white transition">Contact us</a>
                    </div>
                    {
                    accessToken ?
                    <>
                     <button className="text-gray-200 hover:text-white transition" onClick={() => logoutUser()}>
                        Logout
                    </button>
                    </> 
                    : 
                    <>
                    <a href="/login" className="text-gray-200 hover:text-white transition">Login</a>
                    </>
                    }
                </div>
            </div>
        </nav>
        </>
    )
}
export default Header