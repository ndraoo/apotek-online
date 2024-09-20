import { BrowserRouter, Route, Routes } from "react-router-dom"
import Login from "./components/auth/Login.jsx"
import Register from "./components/auth/Register"
import { useEffect, useState } from "react"
import { getConfig, BASE_URL } from "./services/authService.js"
import { AuthContext } from './context/authContext.js'
import axios from "axios"
import RoleProtectedRoute from './components/ProtectedRoute.jsx';
import OwnerDashboardPage from "./pages/ownerDashboard.jsx"
// import Header from "./components/layout/owner/Header.jsx"
import Home from "./components/Home.jsx"
import Product from "./components/layout/buyer/Product.jsx"
import Cart from "./components/layout/buyer/Cart.jsx"
import ProductTransactions from "./components/layout/buyer/productTransaction.jsx"
import OwnerProducts from "./components/layout/owner/Product.jsx"
import OwnerProductTransactions from "./components/layout/owner/productTransaction.jsx"
import Categories from "./components/layout/owner/Categories.jsx"

function App() {
  const [accessToken, setAccessToken] = useState(JSON.parse(localStorage.getItem('currentToken')));
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentlyLoggedInUser = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/user`, getConfig(accessToken));
        setCurrentUser(response.data.user);
      } catch (error) {
        if (error?.response?.status === 401) {
          localStorage.removeItem('currentToken');
          setCurrentUser(null);
          setAccessToken(null);
        }
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (accessToken) {
      fetchCurrentlyLoggedInUser();
    } else {
      setIsLoading(false);
    }
  }, [accessToken]);

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, currentUser, setCurrentUser }}>
      <BrowserRouter>
        {isLoading ? (
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        </div>
        
        ) : (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/product" element={<Product />} />

            {/* Rute yang dilindungi berdasarkan peran */}
            <Route
              path="/owner/dashboard"
              element={
                <RoleProtectedRoute allowedRoles={['owner']}>
                  <OwnerDashboardPage />
                </RoleProtectedRoute>
              }
            />
              <Route
              path="/owner/product"
              element={
                <RoleProtectedRoute allowedRoles={['owner']}>
                  <OwnerProducts />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/owner/categories"
              element={
                <RoleProtectedRoute allowedRoles={['owner']}>
                  <Categories />
                </RoleProtectedRoute>
              }
            />
              <Route
              path="/owner/transactions-order"
              element={
                <RoleProtectedRoute allowedRoles={['owner']}>
                  <OwnerProductTransactions />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/cart"
              element={
                <RoleProtectedRoute allowedRoles={['buyer']}>
                  <Cart />
                </RoleProtectedRoute>
              }
            />
            <Route
             path="/product/transactions"
             element={
               <RoleProtectedRoute allowedRoles={['buyer']}>
                 <ProductTransactions />
               </RoleProtectedRoute>
             }
           />
         </Routes>
        )}
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;

     