import React, {useRef} from "react";
import {useLocation, useNavigate} from "react-router-dom";

export const LogoBtn = () => {
    const navigate = useRef(useNavigate());
  const location = useLocation();
  
  // 현재 경로를 '/'로 나누어 첫 번째 경로 이름 추출
  const firstPath = location.pathname.split('/')[1] || "Home";
  
  const navigateToHome = () => {
    navigate.current("/");
  };
  
  return (
    <div className="flex items-center" onClick={navigateToHome}>
      <img className="mr-2 h-8 w-auto" src={"/asset/img/logo.png"} alt={"Logo"}/>
      <p className="font-semibold">{firstPath.toUpperCase()}</p>
    </div>
  );
};