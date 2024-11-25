import React, {useEffect, useRef} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {setAuthCookie} from "../util/CookieUtil";
import {useAuthContext} from "../context/data/AuthContext";

export const OAuth2RedirectHandler: React.FC = () => {
  const {setAuthToken} = useAuthContext();
  const location = useLocation();
  const navigate = useRef(useNavigate());

  const getUrlParameter = (name: string): string | undefined => {
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? undefined : decodeURIComponent(results[1].replace(/\+/g, ' '));
  };

  useEffect(() => {
    const token = getUrlParameter("token");
    const forbidden = getUrlParameter("forbidden");
    const error = getUrlParameter("error");

    if (token) {
      setAuthCookie(token);
      setAuthToken(token);
      if (forbidden) {
        navigate.current("/register", {state: {data: forbidden}});
      } else {
        navigate.current("/dashboard");
      }
    } else if (error) {
      navigate.current("/");
      console.log(error);
    } else {
      throw new Error("OAuth error")
    }
  });

  return (
    <></>
  );
};
