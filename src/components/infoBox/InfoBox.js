import React from "react";
import "./InfoBox.scss";

const InfoBox = ({ bgColor, title, count, icon }) => {
  return (
    <div className={`info-box ${bgColor}`}>
      <div className="info-box__body">
        <div className="info-box__text">
          <p className="info-box__title">{title}</p>
          <h3 className="info-box__count">{count}</h3>
        </div>
        <div className="info-box__icon-wrap">{icon}</div>
      </div>
      <div className="info-box__decoration" />
    </div>
  );
};

export default InfoBox;
