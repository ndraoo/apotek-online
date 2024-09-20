import React, { useEffect, useState, Fragment, useContext } from "react";
import axios from 'axios';
import Header from "./Header.jsx";
import Footer from "./footer.jsx";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/authContext.js';
import { getConfig, BASE_URL } from '../../../services/authService.js';
import Pagination from '../../custom/Pagination.jsx';
import Swal from "sweetalert2";

const Product = () => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const { accessToken } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); 
  const [totalPages, setTotalPages] = useState(1);

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [currentPage]); // Fetch products when currentPage changes

  useEffect(() => {
    fetchProducts(selectedCategories.length > 0 ? selectedCategories.join(',') : null);
  }, [selectedCategories]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/guest/categories`);
      setCategories(response.data.data.data);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  const fetchProducts = async (categoryId = null) => {
    try {
      const url = categoryId
        ? `${BASE_URL}/guest/product?category=${categoryId}&page=${currentPage}`
        : `${BASE_URL}/guest/product?page=${currentPage}`;
      const response = await axios.get(url);
      setProducts(response.data.data.data);
      setTotalPages(response.data.data.last_page); // Update total pages from API response
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prevSelectedCategories) =>
      prevSelectedCategories.includes(categoryId)
        ? prevSelectedCategories.filter(id => id !== categoryId)
        : [...prevSelectedCategories, categoryId]
    );
  };

  const handleAddToCart = async (product) => {
    try {
      const response = await axios.post(`${BASE_URL}/cart/add`, {
        product_id: product.id,
        quantity: quantity
      }, getConfig(accessToken));
      Swal.fire({
        icon: 'success',
        title: 'Order placed successfully',
        text: response.data.message,
      });
      alert(response.data.message);
      navigate('/cart');
    } catch (error) {
      if (error.response.status === 401) {
        navigate('/login');
      } else {
        alert('Something went wrong, please try again.');
      }
    }
  };

  return (
    <Fragment>
      <Header setProducts={setProducts} />
      <div className="container pb-16 flex mt-5">
        {/* Sidebar */}
        <aside className="w-1/4 bg-white shadow-xl rounded p-4">
          <h3 className="text-xl font-medium text-gray-800 mb-4">CATEGORIES</h3>
          <ul className="space-y-2">
            {categories && Array.isArray(categories) ? (
              categories.map((category) => (
                <li key={category.id}>
                  <label
                    className={`flex items-center py-2 px-4 hover:bg-gray-100 transition w-full text-left ${
                      selectedCategories.includes(category.id) ? "bg-gray-200" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category.id)}
                      onChange={() => handleCategoryChange(category.id)}
                      class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 white:focus:ring-blue-600 white:ring-offset-gray-800 focus:ring-2 white:bg-gray-700 white:border-gray-600 mr-5"

                    />
                    <img src={category.icon} alt={category.name} className="w-5 h-5 mr-2" />
                    <span className="text-gray-700">{category.name}</span>
                  </label>
                </li>
              ))
            ) : (
              <li>Data kategori tidak tersedia</li>
            )}
          </ul>
        </aside>

        {/* Products Section */}
        <div className="w-3/4 pl-6">
          <h2 className="text-2xl font-medium text-gray-800 uppercase mb-6">Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.length > 0 ? (
              products.map((product) => (
                <div key={product.id} className="bg-white shadow-xl rounded overflow-hidden group">
                  <div className="relative">
                    <img src={product.photo} alt={product.name} className="w-full" />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center 
                        justify-center gap-2 opacity-0 group-hover:opacity-100 transition">
                      <button
                        onClick={() => handleViewProduct(product)}
                        className="text-white text-lg w-9 h-8 rounded-full bg-primary flex items-center justify-center hover:bg-gray-800 transition"
                        title="view product"
                      >
                        <i className="fa-solid fa-magnifying-glass"></i>
                      </button>
                    </div>
                  </div>
                  <div className="pt-4 pb-3 px-4">
                  <button onClick={() => handleViewProduct(product)}>
                  <h4 className="uppercase font-medium text-xl mb-2 text-gray-800 hover:text-primary transition">
                        {product.name}
                      </h4>
                    </button>
                    <div className="flex items-baseline mb-1 space-x-2">
                      <p className="text-xl text-primary font-semibold">Rp. {product.price}</p>
                    </div>
                    <div className="flex items-center">
                      <div className="text-xs text-gray-500 ml-3">
                        In Stock: {product.stock}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="block w-full py-1 text-center text-white bg-primary border border-primary rounded-b hover:bg-transparent hover:text-primary transition"
                  >
                    Add to Cart
                  </button>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-4">
                No products available.
              </div>
            )}
          </div>
          {products.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
            />
          )}
        </div>

        {isModalOpen && selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <section className="py-8 bg-white md:py-16 white:bg-gray-900 antialiased max-w-screen-xl px-4 mx-auto 2xl:px-0">
            <div className="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16">
              {/* Image Section */}
              <div className="shrink-0 max-w-md lg:max-w-lg mx-auto">
                <img className="w-1/2 white:hidden" src={selectedProduct.photo} alt={selectedProduct.name} />
                <img className="w-1/2 hidden white:block" src={selectedProduct.photo} alt={selectedProduct.name} />
              </div>

              {/* Product Details Section */}
              <div className="mt-6 sm:mt-10 lg:mt-10">
                <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl white:text-white">
                  {selectedProduct.name}
                </h1>
                <div className="mt-4 sm:items-center sm:gap-4 sm:flex">
                  <p className="text-2xl font-extrabold text-gray-900 sm:text-3xl white:text-white">
                    Rp. {selectedProduct.price}
                  </p>

                  <div className="flex items-center gap-2 mt-2 sm:mt-0">
                    {/* Rating Section (Optional) */}
                    <div className="flex items-center gap-1">
                      {/* Add SVG stars if needed */}
                      <p className="text-sm font-medium leading-none text-gray-500 white:text-gray-400">
                        (5.0)
                      </p>
                      <a
                        href="#"
                        className="text-sm font-medium leading-none text-gray-900 underline hover:no-underline white:text-white"
                        >
                        345 Reviews
                      </a>
                    </div>
                  </div>
                </div>

                <div className="mt-6 sm:gap-4 sm:items-center sm:flex sm:mt-8">
                  {/* Add to Favorites Button */}
                  <button
                  onClick={() => handleAddToCart(selectedProduct)} 
                  className="text-white mt-4 sm:mt-0 bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 white:bg-red-600 white:hover:bg-red-700 focus:outline-none white:focus:ring-primary-800 flex items-center justify-center"
                   
                    >
                      <svg
                        className="w-5 h-5 -ms-2 me-2"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 4h1.5L8 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm.75-3H7.5M11 7H6.312M17 4v6m-3-3h6"
                        />
                      </svg>
                      Add To Cart
                    </button>

                  {/* Add to Cart Button */}
                  <button
                      onClick={closeModal}
                      className="text-white mt-4 sm:mt-0 bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 white:bg-gray-600 white:hover:bg-red-700 focus:outline-none white:focus:ring-primary-800 flex items-center justify-center"
                   
                    >
                      Close
                    </button>
              </div>

                <hr className="my-6 md:my-8 border-gray-200 white:border-gray-800" />

                <p className="mb-6 text-gray-500 white:text-gray-400 overflow-y-auto max-h-48">
                  {selectedProduct.about}
                </p>

              </div>
            </div>
          </section>
        </div>
      )}
      </div>
      <Footer />
    </Fragment>
  );
};

export default Product;
