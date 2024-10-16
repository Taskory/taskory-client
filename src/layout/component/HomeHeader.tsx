import {Link, useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {getAuthCookie} from "../../util/CookieUtil";

export const HomeHeader = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (getAuthCookie()) {
            navigate("/dashboard");
        }
    }, [navigate]);
    return (
        <header className="bg-white border-b border-gray-200">
            <div className="container mx-auto py-4 flex justify-between items-center">
                <div className="flex items-center">
                    <img
                        src="/asset/img/logo.png"
                        alt="Logo"
                        className="h-8 w-8 mr-2"
                    />
                    <h1 className="text-xl font-bold">TASKFLOWER</h1>
                </div>
                <div>
                    <Link to="/login">
                        <button className="bg-blue-500 text-white px-4 py-2 rounded">
                            Login
                        </button>
                    </Link>
                </div>
            </div>
        </header>
    );
};