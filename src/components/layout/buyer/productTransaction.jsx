import React, { Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import Footer from './footer.jsx';
import Header from './Header.jsx';
import { BASE_URL, getConfig } from '../../../services/authService';

const ProductTransactions = () => {
  const [detailTransactions, setDetailTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [accessToken, setAccessToken] = useState(JSON.parse(localStorage.getItem('currentToken')));
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [selectedTransaction, setSelectedTransaction] = useState(null); 

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/buyer/products-transactions`, getConfig(accessToken));
        setDetailTransactions(response.data.data); 
      } catch (err) {
        console.log(err)
        setError('Error fetching transactions', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const openModal = (transaction) => {
    setSelectedTransaction(transaction); 
    setIsModalOpen(true); // Buka modal
  };
  
  const closeModal = () => {
    setIsModalOpen(false); // Tutup modal
    setSelectedTransaction(null); 
  };


  // if (loading) return <div>Loading...</div>;
  // if (error) return <div>{error}</div>;

  return (
    <Fragment >
    <Header />
    <section className="bg-white py-8 antialiased white:bg-gray-900 md:py-16">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <div className="mx-auto max-w-5xl">
          <div className="gap-4 lg:flex lg:items-center lg:justify-between">
            <h2 className="text-xl font-semibold text-gray-900 white:text-white sm:text-2xl">
              My Products Transactions
            </h2>
          </div>
          <div className="mt-6 flow-root sm:mt-8">
            <div className="divide-y divide-gray-200 white:divide-gray-700">
              
              {loading ? (
                    <p className="text-gray-500 white:text-gray-400 text-center">Loading...</p>
                  ) : detailTransactions.length > 0 ? (
                detailTransactions.map((transaction) => (
                  <div key={transaction.id} className="relative grid grid-cols-2 gap-4 py-6 sm:grid-cols-4 lg:grid-cols-5">
                    <div className="content-center">
                      <div className="flex items-center gap-2">
                        <svg
                          className="h-4 w-4 text-gray-400"
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
                            d="M4 10h16m-8-3V4M7 7V4m10 3V4M5 20h14a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Zm3-7h.01v.01H8V13Zm4 0h.01v.01H12V13Zm4 0h.01v.01H16V13Zm-8 4h.01v.01H8V17Zm4 0h.01v.01H12V17Zm4 0h.01v.01H16V17Z"
                          />
                        </svg>
                        <p className="text-sm font-medium text-gray-500 white:text-gray-400">
                          {new Date(transaction.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="content-center">
                      <div className="flex items-center justify-end gap-2 sm:justify-start">
                        <p className="text-sm text-gray-500 white:text-gray-400">
                          <span className="font-medium text-gray-900 white:text-white">
                            Product
                          </span>
                          : {transaction.product.name}
                        </p>
                      </div>
                    </div>
                    {
                        transaction.product_transaction.is_paid === 0 ? (
                            <div className="absolute right-0 top-7 content-center sm:relative sm:right-auto sm:top-auto">
                            <span className="inline-flex items-center rounded bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                                Pending
                            </span>
                            </div>
                        ) : (
                            <div className="absolute right-0 top-7 content-center sm:relative sm:right-auto sm:top-auto">
                            <span className="inline-flex items-center rounded bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-700 dark:text-green-200">
                                Success
                            </span>
                            </div>
                        )
                    }
                    <div className="col-span-2 content-center sm:col-span-4 lg:col-span-1">
                      <a
                        href=""
                        className="text-base font-semibold text-gray-900 hover:underline white:text-white"
                      >
                        Total: Rp. {transaction.product.price * transaction.quantity}
                      </a>
                    </div>
                   
 
                    <div className="col-span-2 content-center sm:col-span-1 sm:justify-self-end">
                      <button
                            type="button"
                            onClick={() => openModal(transaction)}
                            className="w-full rounded-lg border border-gray-200 bg-blue-500 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-blue-100 sm:w-auto"
                          >
                            View Details
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 white:text-gray-400">No transactions found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
    {isModalOpen && selectedTransaction && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
            <section className="py-8 bg-white md:py-16 white:bg-gray-900 antialiased max-w-screen-xl px-4 mx-auto 2xl:px-0">
              <div className="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16">
                {/* Image Section */}
                <div className="shrink-0 max-w-md lg:max-w-lg mx-auto">
                <img className="w-1/2 white:hidden" src={selectedTransaction.product_transaction.proof} alt={selectedTransaction.product.name} />
                <img className="w-1/2 hidden white:block" src={selectedTransaction.product_transaction.proof} alt={selectedTransaction.product.name} />
                </div>

                {/* Product Details Section */}
                <div className="mt-6 sm:mt-10 lg:mt-10">
                  <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl white:text-white">
                    {selectedTransaction.product.name}
                  </h1>
                  <div className="mt-4 sm:items-center sm:gap-4 sm:flex">
                    <p className="text-2xl font-extrabold text-gray-900 sm:text-3xl white:text-white">
                      Rp. {selectedTransaction.product.price * selectedTransaction.quantity}
                    </p>
                 
                    <div className="flex items-center gap-2 mt-2 sm:mt-0">
                      {/* Rating Section (Optional) */}
                      <div className="flex items-center gap-1">
                        {/* Add SVG stars if needed */}
                        <p className="text-sm font-medium leading-none text-gray-500 white:text-gray-400">
                          Date
                        </p>
                        <a
                          href="#"
                          className="text-sm font-medium leading-none text-gray-900 underline hover:no-underline white:text-white"
                        >
                          {new Date(selectedTransaction.created_at).toLocaleDateString()}
                        </a>
                      </div>
                    </div>
                  </div>
                  {
                    selectedTransaction.product_transaction.is_paid === 0 ? (
                      <div className="absolute right-0 top-7 content-center sm:relative sm:right-auto sm:top-auto mt-5">
                        Status 
                        <span className="inline-flex items-center rounded bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 grey:bg-gray-700 grey:text-gray-200">
                          Pending
                        </span>
                      </div>
                    ) : (
                        <div className="absolute right-0 top-7 content-center sm:relative sm:right-auto sm:top-auto mt-5">
                         Status 
                          <span className="inline-flex items-center rounded bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 grey:bg-green-700 grey:text-green-200">
                            Success
                          </span>
                        </div>
                      )
                    }

                  <div className="mt-6 sm:gap-4 sm:items-center sm:flex sm:mt-8">
                    {/* Add to Favorites Button */}
                  
                    {/* Add to Cart Button */}
                    <button
                      onClick={closeModal}
                      className="text-white mt-4 sm:mt-0 bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 white:bg-red-600 white:hover:bg-red-700 focus:outline-none white:focus:ring-primary-800 flex items-center justify-center"
                   
                    >
                      Close
                    </button>
                  </div>

                  <hr className="my-6 md:my-8 border-gray-200 white:border-gray-800" />

                  <p className="mb-6 text-gray-500 white:text-gray-400 overflow-y-auto max-h-48">
                   Addres :  {selectedTransaction.product_transaction.address} <br />
                   Post Code : {selectedTransaction.product_transaction.post_code}, {selectedTransaction.product_transaction.city} <br />
                   Phone Number : {selectedTransaction.product_transaction.phone_number}  <br />
                   Notes : {selectedTransaction.product_transaction.notes} 
                  </p>
                </div>
              </div>
            </section>
          </div>
        )}

    <Footer />
    </Fragment>
  );
};

export default ProductTransactions;
