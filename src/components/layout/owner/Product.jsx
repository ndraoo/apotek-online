import React, { useState, useEffect, useContext, Fragment } from 'react';
import axios from 'axios';
import ProductModal from './productModal.jsx'; 
import { BASE_URL, getConfig } from '../../../services/authService.js';
import Header from './Header.jsx';
import SideBar from './SideBar.jsx';
import Pagination from '../../custom/Pagination.jsx';
import Swal from 'sweetalert2';

const OwnerProducts = () => {
  const [accessToken, setAccessToken] = useState(JSON.parse(localStorage.getItem('currentToken')));
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); 
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [accessToken, currentPage]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/products?page=${currentPage}`, getConfig(accessToken));
      setProducts(response.data.data.data);
      setTotalPages(response.data.data.last_page);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/categories`, getConfig(accessToken));
      setCategories(response.data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${BASE_URL}/products/${id}`, getConfig(accessToken));
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Product has been deleted.',
            customClass: {
                confirmButton: 'bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700',
            },
            buttonsStyling: false,
        })
          fetchProducts();
        } catch (error) {
          console.error('Error deleting product:', error);
          Swal.fire('Error', 'Failed to delete product', 'error');
        }
      }
    });
  };
  

  const handleSave = () => {
    fetchProducts();
  };

  return (
    <div className="flex hv-screen">
    <SideBar />
    <main className="flex-1 p-6 bg-gray-100">
        <Header />
    <div>
      <button onClick={handleAddProduct} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5">
        Add Product
      </button>

      <table className="table-auto w-full mt-4">
        <thead>
          <tr>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Photo</th>
            <th className="px-4 py-2">Price</th>
            <th className="px-4 py-2">Stock</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product) => (
              <tr key={product.id}>
                <td className="border px-4 py-2">{product.name}</td>
                <td className="border px-4 py-2">
                  {product.photo && (
                    <img src={product.photo} alt={product.name} className="w-12 h-12" />
                  )}
                </td>
                <td className="border px-4 py-2">{product.price}</td>
                <td className="border px-4 py-2">{product.stock}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-3 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                    >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center py-4">No products available.</td>
            </tr>
          )}
        </tbody>
      </table>
      {products.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
            />
      )}
    
      {/* Render Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categoryList={categories}
        productData={selectedProduct}
        onSave={handleSave}
        />
        </div>
    </main>
</div>
  );
};

export default OwnerProducts;
