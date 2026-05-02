import React from "react";
import Footer from "../footer/Footer";
import Header from "../header/Header";

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <div className="page-content">
        {children}
      </div>
      <Footer />
    </>
  );
};

export default Layout;
