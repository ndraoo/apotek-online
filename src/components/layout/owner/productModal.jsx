import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { BASE_URL, getConfig } from '../../../services/authService.js';
import Swal from 'sweetalert2';
const ProductModal = ({ isOpen, onClose, categoryList = [], productData, onSave }) => {
  const [accessToken, setAccessToken] = useState(JSON.parse(localStorage.getItem('currentToken')));
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    photo: null,
    price: '',
    stock: '',
    about: '',
    category_id: '',
  });
  
  useEffect(() => {
    if (productData) {
      setFormData({
        name: productData.name || '',
        slug: productData.slug || '',
        photo: null,
        price: productData.price || '',
        stock: productData.stock || '',
        about: productData.about || '',
        category_id: productData.category_id || '',
      });
    }
  }, [productData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      photo: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    try {
      if (productData) {
        await axios.put(`${BASE_URL}/products/${productData.id}`, data, getConfig(accessToken));
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Product updated successfully!',
          customClass: {
              confirmButton: 'bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700',
          },
          buttonsStyling: false,
      })
      } else {
        await axios.post(`${BASE_URL}/products`, data, getConfig(accessToken));
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Product added successfully!',
          customClass: {
              confirmButton: 'bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700',
          },
          buttonsStyling: false,
      })
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
      Swal.fire('Error', 'Failed to submit form', 'error');
    }
  };

  return isOpen
        ? ReactDOM.createPortal(
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 relative">
                    <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">&times;</button>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                                placeholder="Product Name"
                            />
                        </div>
                    
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Price</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                                placeholder="Product Price"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Stock</label>
                            <input
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                                placeholder="Product Stock"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">About</label>
                            <textarea
                                name="about"
                                value={formData.about}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                                placeholder="Product Description"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Category</label>
                            <select
                                name="category_id"
                                value={formData.category_id}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                            >
                                <option value="">Select Category</option>
                                {Array.isArray(categoryList.data) && categoryList.data.length > 0 ? (
                                    categoryList.data.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))
                                ) : (
                                    <option value="" disabled>No categories available</option>
                                )}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Photo</label>
                            <input
                                type="file"
                                name="photo"
                                onChange={handleFileChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                                {productData ? 'Update Product' : 'Add Product'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>,
            document.body
        )
        : null;
};

export default ProductModal;
