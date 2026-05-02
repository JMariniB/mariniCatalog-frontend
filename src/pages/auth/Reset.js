import React, { useState } from "react";
import styles from "./auth.module.scss";
import { RiProductHuntLine } from "react-icons/ri";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { resetPassword } from "../../services/authService";

const initialState = {
  password: "",
  password2: "",
};

const Reset = () => {
  const [formData, setformData] = useState(initialState);
  const { password, password2 } = formData;
  const { resetToken } = useParams();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setformData({ ...formData, [name]: value });
  };

  const reset = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      return toast.error("La contraseña debe tener al menos 6 caracteres");
    }
    if (password !== password2) {
      return toast.error("Las contraseñas no coinciden");
    }

    const userData = { password, password2 };
    try {
      const data = await resetPassword(userData, resetToken);
      toast.success(data.message);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className={styles.auth}>
      <div className={styles.form}>
        <div className={styles.logoWrap}>
          <div className={styles.logoIcon}>
            <RiProductHuntLine />
          </div>
        </div>

        <h2>Nueva contraseña</h2>
        <p className={styles.subtitle}>Introduce tu nueva contraseña</p>

        <form onSubmit={reset}>
          <input
            type="password"
            placeholder="Nueva contraseña"
            required
            name="password"
            value={password}
            onChange={handleInputChange}
          />
          <input
            type="password"
            placeholder="Confirmar contraseña"
            required
            name="password2"
            value={password2}
            onChange={handleInputChange}
          />
          <button type="submit">Cambiar contraseña</button>

          <div className={styles.links}>
            <Link to="/">Inicio</Link>
            <Link to="/login">Iniciar sesión</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Reset;
