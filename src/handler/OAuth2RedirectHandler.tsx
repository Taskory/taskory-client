import React, {useEffect} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {setAuthCookie} from "../util/CookieUtil";

export const OAuth2RedirectHandler: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

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
      if (forbidden) {
        navigate("/register", {state: {data: forbidden}});
      } else {
        navigate("/");
      }
    } else if (error) {
      navigate("/");
      console.log(error);
    } else {
      throw new Error("OAuth error")
    }
  });

  return (
    <></>
  );
};
