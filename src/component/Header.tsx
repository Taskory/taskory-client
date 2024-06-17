import {FaBell, FaUserCircle} from "react-icons/fa";

export const Header = () => {
    return (
        <header className="bg-white border-b border-gray-200 px-4 py-2 flex justify-between items-center">
            <div className="flex items-center">
                <input
                    type="text"
                    placeholder="Search"
                    className="border rounded px-4 py-2 mr-4"
                />
            </div>
            <div className="flex items-center">
                <FaBell className="text-gray-600 mr-4"/>
                <FaUserCircle className="text-gray-600"/>
            </div>
        </header>
    );
};