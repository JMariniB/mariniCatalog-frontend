import React, { useState } from "react";
import styles from "./auth.module.scss";
import { RiProductHuntLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import { forgotPassword, validateEmail } from "../../services/authService";
import { toast } from "react-toastify";

const Forgot = () => {
  const [email, setEmail] = useState("");

  const forgot = async (e) => {
    e.preventDefault();
    if (!email) {
      return toast.error("Introduce tu email");
    }
    if (!validateEmail(email)) {
      return toast.error("Introduce un email válido");
    }
    await forgotPassword({ email });
    setEmail("");
  };

  return (
    <div className={styles.auth}>
      <div className={styles.form}>
        <div className={styles.logoWrap}>
          <div className={styles.logoIcon}>
            <RiProductHuntLine />
          </div>
        </div>

        <h2>Recuperar contraseña</h2>
        <p className={styles.subtitle}>
          Introduce tu email y te enviaremos un enlace de recuperación
        </p>

        <form onSubmit={forgot}>
          <input
            type="email"
            placeholder="Correo electrónico"
            required
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit">Enviar enlace</button>

          <div className={styles.links}>
            <Link to="/">Inicio</Link>
            <Link to="/login">Iniciar sesión</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Forgot;
