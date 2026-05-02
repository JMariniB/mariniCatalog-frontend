import React from "react";
import { RiProductHuntLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import "./Home.scss";
import { ShowOnLogin, ShowOnLogout } from "../../components/protect/HiddenLink";

const Home = () => {
  return (
    <div className="home">
      {/* Navbar */}
      <nav className="home-nav">
        <div className="home-nav__logo">
          <RiProductHuntLine className="home-nav__icon" />
          <span>MariniCatalog</span>
        </div>
        <ul className="home-nav__links">
          <ShowOnLogout>
            <li>
              <Link to="/register" className="home-nav__link">
                Registrarse
              </Link>
            </li>
          </ShowOnLogout>
          <ShowOnLogout>
            <li>
              <Link to="/login" className="home-nav__btn">
                Iniciar sesión
              </Link>
            </li>
          </ShowOnLogout>
          <ShowOnLogin>
            <li>
              <Link to="/dashboard" className="home-nav__btn">
                Ir al panel
              </Link>
            </li>
          </ShowOnLogin>
        </ul>
      </nav>

      {/* Hero */}
      <section className="home-hero">
        <div className="home-hero__content">
          <div className="home-hero__badge">Gestión de inventario</div>
          <h1 className="home-hero__title">
            Controla tu stock<br />
            <span>en tiempo real</span>
          </h1>
          <p className="home-hero__desc">
            Plataforma de gestión de catálogo integrada con Amazon para
            controlar y administrar tus productos del almacén de forma fácil
            e intuitiva.
          </p>

          <div className="home-hero__actions">
            <ShowOnLogout>
              <Link to="/login" className="home-btn home-btn--primary">
                Empezar ahora
              </Link>
              <Link to="/register" className="home-btn home-btn--ghost">
                Crear cuenta
              </Link>
            </ShowOnLogout>
            <ShowOnLogin>
              <Link to="/dashboard" className="home-btn home-btn--primary">
                Ir al panel →
              </Link>
            </ShowOnLogin>
          </div>

          <div className="home-hero__stats">
            <StatItem num="100%" text="Control de stock" />
            <StatItem num="Amazon" text="Integración directa" />
            <StatItem num="Real-time" text="Actualización en vivo" />
          </div>
        </div>

        <div className="home-hero__visual">
          <div className="home-hero__graphic">
            <div className="hero-card hero-card--1">
              <div className="hero-card__icon">📦</div>
              <div>
                <p className="hero-card__label">Total Artículos</p>
                <p className="hero-card__value">1,248</p>
              </div>
            </div>
            <div className="hero-card hero-card--2">
              <div className="hero-card__icon">💰</div>
              <div>
                <p className="hero-card__label">Valor del stock</p>
                <p className="hero-card__value">$24,590</p>
              </div>
            </div>
            <div className="hero-card hero-card--3">
              <div className="hero-card__icon">✅</div>
              <div>
                <p className="hero-card__label">Publicados</p>
                <p className="hero-card__value">845</p>
              </div>
            </div>
            <div className="hero-orb hero-orb--1" />
            <div className="hero-orb hero-orb--2" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="home-features">
        <div className="home-features__grid">
          <Feature icon="🔍" title="Filtros avanzados" desc="Filtra por columna, ubicación, estado o precio con un solo clic." />
          <Feature icon="📊" title="Dashboard en vivo" desc="Estadísticas de inventario actualizadas en tiempo real." />
          <Feature icon="📥" title="Importar CSV" desc="Carga masiva de productos desde ficheros CSV de Amazon." />
          <Feature icon="🏪" title="Ubicaciones" desc="Gestiona ubicaciones de almacén desde B001 hasta SOLD." />
        </div>
      </section>

      <footer className="home-footer">
        <p>© {new Date().getFullYear()} MariniCatalog — Todos los derechos reservados</p>
      </footer>
    </div>
  );
};

const StatItem = ({ num, text }) => (
  <div className="home-stat">
    <span className="home-stat__num">{num}</span>
    <span className="home-stat__text">{text}</span>
  </div>
);

const Feature = ({ icon, title, desc }) => (
  <div className="feature-card">
    <div className="feature-card__icon">{icon}</div>
    <h4 className="feature-card__title">{title}</h4>
    <p className="feature-card__desc">{desc}</p>
  </div>
);

export default Home;
