import React from "react";
import Navbar from "../Navbar/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const MainLayout = ({ children }: any) => {
  return (
    <div>
      <Navbar />
      {children}
      <ToastContainer />
    </div>
  );
};

export default MainLayout;
