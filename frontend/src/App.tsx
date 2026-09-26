import { Route, Routes } from "react-router-dom";

import "./index.css";

import { AuthProvider } from "@/context/AuthContext";
import Header from "@/components/layout/header/Header";
import Footer from "@/components/layout/footer/Footer";
import AccountPage from "@/pages/account/AccountPage";
import AccountLayout from "@/pages/account/AccountLayout";
import OrdersPage from "@/pages/account/orders/OrdersPage";
import ServersPage from "./pages/account/servers/ServersPage";
import HomePage from "@/pages/home/HomePage";
import TariffsPage from "@/pages/tariffs/TariffsPage";
import TariffDetailPage from "./pages/tariff-detail/TariffDetailPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import CartPage from "./pages/cart/CartPage";


function App() {
  return (
    <>
       <AuthProvider>
            <Header />
            <div className="app-content">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/tariffs" element={<TariffsPage />} />
                <Route
                    path="/tariffs/:id"
                    element={<TariffDetailPage />}
                />
                <Route
                    path="/cart"
                    element={<CartPage />}
                />
                <Route path="/account" element={<AccountLayout />}>
                    <Route index element={<AccountPage />} />
                    <Route path="orders" element={<OrdersPage />} />
                    <Route path="servers" element={<ServersPage />} />
                </Route>
              </Routes>
            </div>
            

            <Footer />
        </AuthProvider>
    </>
  );
}

export default App;