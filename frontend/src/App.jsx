import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import MainLayout from "./layouts/MainLayout";
import Signup from './pages/Signup';
import MedicineDelivery from "./pages/MedicineDelivery";
import Contact from "./pages/ContactPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <MainLayout
              showNavbar={true}
              showSidebar={false}
              isFullHeighted={false}
            >
              <Landing />
            </MainLayout>
          }
        />
 
                  <Route
          path="/about"
          element={
            <MainLayout
              showNavbar={true}
              showSidebar={false}
              isFullHeighted={false}
            >
              <div className=".box w-full h-screen mt-24 grid place-items-center">
                <h1 className="poppins-bold text-3xl">About</h1>
              </div>
            </MainLayout>
          }
        />

                <Route
          path="/contact"
          element={
            <MainLayout
              showNavbar={false}
              showSidebar={true}
              isFullHeighted={true}
            >
              <Contact />
            </MainLayout>
          }
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;