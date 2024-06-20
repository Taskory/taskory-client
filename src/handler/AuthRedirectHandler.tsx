import {useNavigate} from "react-router-dom";
import Cookies from "js-cookie";
import {useEffect} from "react";

export const AuthRedirectHandler = () => {
    const navigate = useNavigate();

    // temp token
    Cookies.set('token', "temp token");
    const token = Cookies.get('token'); // Get the token from cookies

    useEffect(() => {
        if (token) {
            navigate('/dashboard'); // Redirect to dashboard if token exists
        }
    }, [token, navigate]);

    return null;
};