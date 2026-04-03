import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Navbar from "./components/navbar";
import Landing from "./pages/Landing";

const App = () => {
  return (
    <BrowserRouter>

      {/* <Navbar />  */}

      <div className="pt-20 md:pt-24"> 

        <Routes>
          <Route path="/" element={<Landing />} />
    
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App