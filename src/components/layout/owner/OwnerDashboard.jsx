import { BASE_URL, getConfig } from '../../../services/authService.js'; // Update with your actual path
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SideBar from './SideBar';
import Header from './Header';

const OwnerDashboardPage = () => {
  const [accessToken, setAccessToken] = useState(JSON.parse(localStorage.getItem('currentToken')));
  const [dashboardData, setDashboardData] = useState({
    total: 0,
    product: 0,
    categories: 0,
    productTransaction: 0,
    buyersCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/dashboard`, getConfig(accessToken));
        setDashboardData(response.data.data);
        console.log(response.data.data)
      } catch (err) {
        setError(err);
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="flex hv-screen">
      <SideBar />
      <main className="flex-1 p-6 bg-gray-100">
          <Header />
          <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white shadow-lg rounded-lg p-4">
          <h2 className="text-xl font-semibold">Total Penjualan </h2>
          <p className="text-2xl font-bold">Rp. {dashboardData.total}</p>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-4">
          <h2 className="text-xl font-semibold">Total Products</h2>
          <p className="text-2xl font-bold">{dashboardData.product}</p>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-4">
          <h2 className="text-xl font-semibold">Total Categories</h2>
          <p className="text-2xl font-bold">{dashboardData.categories}</p>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-4">
          <h2 className="text-xl font-semibold">Total Product Transactions</h2>
          <p className="text-2xl font-bold">{dashboardData.productTransaction}</p>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-4">
          <h2 className="text-xl font-semibold">Total Buyers</h2>
          <p className="text-2xl font-bold">{dashboardData.buyersCount}</p>
        </div>
        </div>
      </div>
      </main>
    </div>
  );
}

export default OwnerDashboardPage;



