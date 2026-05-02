import React from "react";
import "./Footer.scss";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <p>© {currentYear} MariniCatalog — Todos los derechos reservados</p>
    </footer>
  );
};

export default Footer;
