import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectName, SET_LOGIN } from "../../redux/features/auth/authSlice";
import { logoutUser } from "../../services/authService";
import { FaArrowLeft } from "react-icons/fa"; // Importa el icono de flecha

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const name = useSelector(selectName);

  const logout = async () => {
    await logoutUser();
    await dispatch(SET_LOGIN(false));
    navigate("/login");
  };

  const goBack = () => {
    // Utiliza la función goBack para regresar al último sitio visitado
    navigate(-1);
  };

  return (
    <div className="--pad header">
      <div className="--flex-between">
      <button onClick={goBack} className="--btn --btn-primary">
          <FaArrowLeft />   
        </button>
        <h3>
          <span className="--fw-thin">Welcome, </span>
          <span className="--color-danger">{name}</span>
        </h3>
        <button onClick={logout} className="--btn --btn-danger">
          Logout
        </button>
      </div>
      <hr />
    </div>
  );
};

export default Header;
