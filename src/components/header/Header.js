import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectName, SET_LOGIN } from "../../redux/features/auth/authSlice";
import { logoutUser } from "../../services/authService";
import { HiArrowLeft, HiMenu } from "react-icons/hi";
import { useSidebar } from "../../context/SidebarContext";
import "./Header.scss";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const name = useSelector(selectName);
  const { toggle, isMobile } = useSidebar();

  const logout = async () => {
    await logoutUser();
    await dispatch(SET_LOGIN(false));
    navigate("/login");
  };

  const goBack = () => navigate(-1);

  return (
    <header className="app-header">
      <div className="app-header__left">
        {isMobile && (
          <button className="app-header__icon-btn" onClick={toggle} aria-label="Abrir menú">
            <HiMenu />
          </button>
        )}
        <button className="app-header__icon-btn app-header__back" onClick={goBack} aria-label="Volver">
          <HiArrowLeft />
        </button>
      </div>

      <div className="app-header__user">
        <div className="app-header__avatar">
          {name ? name[0].toUpperCase() : "U"}
        </div>
        <div className="app-header__info">
          <span className="app-header__greeting">Bienvenido</span>
          <span className="app-header__name">{name}</span>
        </div>
      </div>

      <button className="app-header__logout" onClick={logout}>
        Cerrar sesión
      </button>
    </header>
  );
};

export default Header;
