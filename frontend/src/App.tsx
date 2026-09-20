import { Route, Routes } from "react-router-dom";

import "./index.css";

import Header from "@/components/layout/Header";
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
    </>
  );
}

export default App;