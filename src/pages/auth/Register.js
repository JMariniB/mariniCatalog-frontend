import React, { useState } from "react";
import styles from "./auth.module.scss";
import { RiProductHuntLine } from "react-icons/ri";
import { toast } from "react-toastify";
import { registerUser, validateEmail } from "../../services/authService";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { SET_LOGIN, SET_NAME } from "../../redux/features/auth/authSlice";
import Loader from "../../components/loader/Loader";

const initialState = {
  name: "",
  email: "",
  password: "",
  password2: "",
  invitationPwd: "",
};

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setformData] = useState(initialState);
  const { name, email, password, password2, invitationPwd } = formData;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setformData({ ...formData, [name]: value });
  };

  const register = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !invitationPwd) {
      return toast.error("Todos los campos son obligatorios");
    }
    if (password.length < 6) {
      return toast.error("La contraseña debe tener al menos 6 caracteres");
    }
    if (!validateEmail(email)) {
      return toast.error("Introduce un email válido");
    }
    if (password !== password2) {
      return toast.error("Las contraseñas no coinciden");
    }

    const userData = { name, email, password, invitationPwd };
    setIsLoading(true);
    try {
      const data = await registerUser(userData);
      await dispatch(SET_LOGIN(true));
      await dispatch(SET_NAME(data.name));
      navigate("/dashboard");
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.auth}>
      {isLoading && <Loader />}
      <div className={styles.form}>
        <div className={styles.logoWrap}>
          <div className={styles.logoIcon}>
            <RiProductHuntLine />
          </div>
        </div>

        <h2>Crear cuenta</h2>
        <p className={styles.subtitle}>Completa el formulario para registrarte</p>

        <form onSubmit={register}>
          <input
            type="text"
            placeholder="Nombre"
            required
            name="name"
            value={name}
            onChange={handleInputChange}
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            required
            name="email"
            value={email}
            onChange={handleInputChange}
          />
          <input
            type="password"
            placeholder="Contraseña"
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
          <input
            type="text"
            placeholder="Código de invitación"
            required
            name="invitationPwd"
            value={invitationPwd}
            onChange={handleInputChange}
          />
          <button type="submit">Crear cuenta</button>
        </form>

        <span className={styles.register}>
          <Link to="/">Inicio</Link>
          <p>¿Ya tienes cuenta?</p>
          <Link to="/login">Iniciar sesión</Link>
        </span>
      </div>
    </div>
  );
};

export default Register;
