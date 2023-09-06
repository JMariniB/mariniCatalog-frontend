import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear(); // Obtiene el año actual

  return (
    <div className="--flex-center --py2">
      <p>All Rights Reserved. &copy; MariniCatalog {currentYear}</p>
    </div>
  );
};

export default Footer;
