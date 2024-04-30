import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./LandingPage/LandingPage";
import Login from "./Login/Login";
import Register from './Register/Register'
import Home from "./Home/Home";
import Tenant from "./Tenant/Tenant";
import MaintenanceRequests from "./MaintenanceRequests/MaintenanceRequests";
import Detail from "./Detail/Detail";
import Technician from "./Technician/Technician";
import Main from "./Payments/Main";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/add-tenant" element={<Tenant />} />
          <Route path="/detail/:propertyId" element={<Detail />} />
          <Route path="/maintenance-requests" element={<MaintenanceRequests />} />
          <Route path="/Technician" element={<Technician />} />
          <Route path="/Payments" element={<Main />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
