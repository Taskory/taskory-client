import { Link } from "react-router-dom";

export const HomeHeader = () => {
    return (
        <header className="bg-white border-b border-gray-200">
            <div className="container mx-auto py-4 flex justify-between items-center">
                <div className="flex items-center">
                    <img
                        src="/src/asset/img/Logo.png"
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