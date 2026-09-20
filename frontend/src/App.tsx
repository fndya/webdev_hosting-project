import { Route, Routes } from "react-router-dom";

import "./index.css";

import Header from "@/components/layout/header/Header";
import Footer from "@/components/layout/footer/Footer";
import HomePage from "@/pages/home/HomePage";
import TariffsPage from "@/pages/tariffs/TariffsPage";

function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tariffs" element={<TariffsPage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;