import React, { Fragment, useState, useEffect } from "react";
import axios from "axios";
import Header from "./Header";
import Footer from "./footer";
import { BASE_URL, getConfig } from "../../../services/authService.js";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Cart = () => {
    const [formData, setFormData] = useState({
        address: "",
        post_code: "",
        phone_number: "",
        proof: null,
        city: "",
        notes: ""
    });

    const [cartItems, setCartItems] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [accessToken, setAccessToken] = useState(JSON.parse(localStorage.getItem('currentToken')));
    const Navigate = useNavigate();
    // const [currentUser, setCurrentUser] = useState(null);
    
    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/cart`, getConfig(accessToken));
                const cartItems = response.data.data;

                if (Array.isArray(cartItems)) {
                    setCartItems(cartItems); 

                    const total = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
                    setTotalAmount(total);
                } else {
                    setCartItems([]);
                }
                
            } catch (error) {
                console.error("Failed to fetch cart items", error);
            }
        };
        
        fetchCartItems();
    }, [accessToken]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            proof: e.target.files[0]
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formDataToSend = new FormData();
        for (const key in formData) {
            console.log(key, formData[key]); 
            formDataToSend.append(key, formData[key]);
        }

        try {
            const response = await axios.post(`${BASE_URL}/cart/checkout`, formDataToSend, getConfig(accessToken));
            Swal.fire({
                icon: 'success',
                title: 'Order placed successfully',
                text: response.data.message,
            });
            Navigate('/')
            setCartItems([]);
        } catch (error) {
            setLoading(false)
            if (error?.response?.status === 422) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: Object.values(error.response.data.errors).join(', '),
                    customClass: {
                        confirmButton: 'bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700',
                    },
                    buttonsStyling: false,
                })
            } else {
                console.error("Error placing order", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Order failed',
                    text: error.response?.data?.message 
                });
            }
        } finally {
            setLoading(false);
        }
    };
    const handleRemoveFromCart = async (productId) => {
        try {
          await axios.post(`${BASE_URL}/cart/remove`, { product_id: productId }, getConfig(accessToken));
          
          setCartItems((prevItems) => prevItems.filter(item => item.product_id !== productId));
          
          const updatedTotal = cartItems
            .filter(item => item.product_id !== productId)
            .reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
          
          setTotalAmount(updatedTotal);
      
          Swal.fire({
            icon: 'success',
            title: 'Item removed',
            text: 'The item has been removed from your cart.',
            customClass: {
                confirmButton: 'bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700',
            },
            buttonsStyling: false,
          });
        } catch (error) {
            setLoading(false);
            if (error.response && error.response.status === 422) {
                console.log("Validation errors: ", error.response.data.errors);
                Swal.fire({
                    icon: 'error',
                    title: 'Validation Error',
                    text: Object.values(error.response.data.errors).join(', '),
                    customClass: {
                        confirmButton: 'bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700',
                    },
                    buttonsStyling: false,
                });
            } else {
                console.error("Error placing order", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Order failed',
                    text: error.response?.data?.message || "An unknown error occurred",
                });
            }
        }        
      };

      const handleIncreaseQuantity = async (productId) => {
        const updatedItems = cartItems.map(item => 
            item.product_id === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
        setCartItems(updatedItems);

        const total = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
        setTotalAmount(total);

        try {
            await axios.post(`${BASE_URL}/cart/update`, {
                product_id: productId,
                quantity: 1,  // 1 for increase
            }, getConfig(accessToken));
        } catch (error) {
            console.error("Failed to increase quantity", error);
        }
    };
    
    const handleDecreaseQuantity = async (productId) => {
        const item = cartItems.find(item => item.product_id === productId);
        if (item.quantity > 1) {
            const updatedItems = cartItems.map(item => 
                item.product_id === productId ? { ...item, quantity: item.quantity - 1 } : item
            );
            setCartItems(updatedItems);

            const total = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
            setTotalAmount(total);
            try {
                await axios.post(`${BASE_URL}/cart/update`, {
                    product_id: productId,
                    quantity: -1,  // -1 for decrease
                }, getConfig(accessToken));
            } catch (error) {
                console.error("Failed to decrease quantity", error);
            }
        }
    };
        
    return (
        <Fragment>
            <Header />
            <div className="container grid grid-cols-12 items-start pb-16 pt-4 gap-6">
                {/* Checkout Section */}
                <div className="col-span-8 border border-gray-200 p-4 rounded">
                    <h3 className="text-lg font-medium capitalize mb-4">Checkout</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="address" className="text-gray-600">
                                        Street address <span className="text-primary">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        id="address"
                                        className="input-box"
                                        value={formData.address}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="post_code" className="text-gray-600">
                                        Post Code <span className="text-primary">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="post_code"
                                        id="post_code"
                                        className="input-box"
                                        value={formData.post_code}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="phone_number" className="text-gray-600">
                                    Phone number <span className="text-primary">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="phone_number"
                                    id="phone_number"
                                    className="input-box"
                                    value={formData.phone_number}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="city" className="text-gray-600">
                                    City <span className="text-primary">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="city"
                                    id="city"
                                    className="input-box"
                                    value={formData.city}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="proof" className="text-gray-600">
                                    Proof of payment <span className="text-primary">*</span>
                                </label>
                                <input
                                    type="file"
                                    name="proof"
                                    id="proof"
                                    className="input-box"
                                    onChange={handleFileChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="notes" className="text-gray-600">Notes</label>
                                <textarea
                                    name="notes"
                                    id="notes"
                                    className="input-box"
                                    value={formData.notes}
                                    onChange={handleChange}
                                />
                            </div>
                            {/* Move button out of the form to avoid re-render issues */}
                            <button
                                type="submit"
                                className="block w-full py-3 px-4 text-center text-white bg-primary border border-primary rounded-md hover:bg-transparent hover:text-primary transition font-medium"
                            >
                                {loading ? "Placing order..." : "Place Order"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Order Summary Section */}
                <div className="col-span-4 border border-gray-200 p-4 rounded">
                    <h4 className="text-gray-800 text-lg mb-4 font-medium uppercase">Order Summary</h4>
                    <div className="space-y-2">
                        {Array.isArray(cartItems) && cartItems.length > 0 ? (
                            cartItems.map(item => (
                                <div key={item.product_id} className="flex justify-between">
                                    <div>
                                        <h5 className="text-gray-800 font-medium">{item.product.name}</h5>
                                    </div>
                                    <div className="flex items-center">
                                        <button 
                                            className="text-gray-500 hover:text-gray-700 font-semibold"
                                            onClick={() => handleDecreaseQuantity(item.product_id)}
                                        >
                                            -
                                        </button>
                                        <p className="mx-2">{item.quantity}</p>
                                        <button 
                                            className="text-gray-500 hover:text-gray-700 font-semibold"
                                            onClick={() => handleIncreaseQuantity(item.product_id)}
                                        >
                                            +
                                        </button>
                                    </div>
                                    <p className="text-gray-800 font-medium">
                                    Rp. {item.product.price * item.quantity}
                                    </p>
                                    <button 
                                    className="text-red-500 hover:text-red-700 font-semibold"
                                    onClick={() => handleRemoveFromCart(item.product_id)}
                                    >
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-800 font-medium">No items in cart.</p>
                        )}
                        <div className="flex justify-between text-gray-800 font-medium py-3 uppercase">
                            <p className="font-semibold">Total</p>
                            <p>Rp. {totalAmount}</p>
                        </div>
                        <div className="flex justify-between text-gray-800 font-medium py-3 uppercase">
                            <p className="font-semibold">BCA / ATAS NAMA INDRA</p>
                            <p>098765432</p>
                        </div>
                    </div>
                </div>
            </div>     
            <Footer />
        </Fragment>
    );
};

export default Cart;
