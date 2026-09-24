import { Route, Routes } from "react-router-dom";

import "./index.css";

import Header from "@/components/layout/header/Header";
import Footer from "@/components/layout/footer/Footer";
import HomePage from "@/pages/home/HomePage";
import TariffsPage from "@/pages/tariffs/TariffsPage";
import TariffDetailPage from "./pages/tariff-detail/TariffDetailPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/tariffs" element={<TariffsPage />} />
        <Route
          path="/tariffs/:id"
          element={<TariffDetailPage />}
        />
      </Routes>
      <Footer />
    </>
  );
}

export default App;