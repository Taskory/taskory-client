import {FaCog, FaQuestionCircle, FaRegCalendarAlt, FaTachometerAlt, FaTasks} from "react-icons/fa";

export const LeftBar = () => {
    return (
        <aside className="bg-white border-r border-gray-200 w-64 flex flex-col justify-between">
            <div>
                <div className="px-4 py-4 flex">
                    <img
                        src="/asset/logo.png"
                        alt="Logo"
                        className="h-8 w-8 mr-2"
                    />
                    <h1 className="text-xl font-bold">TASKFLOWER</h1>
                </div>
                <nav className="flex flex-col px-4">
                    <a href="#" className="flex items-center py-2 text-gray-700 hover:bg-gray-100 rounded">
                        <FaTachometerAlt className="mr-3"/> Dashboard
                    </a>
                    <a href="#" className="flex items-center py-2 text-gray-700 hover:bg-gray-100 rounded">
                        <FaRegCalendarAlt className="mr-3"/> Calendar
                    </a>
                    <a href="#" className="flex items-center py-2 text-gray-700 hover:bg-gray-100 rounded">
                        <FaTasks className="mr-3"/> Tasks
                    </a>

                </nav>
            </div>
            <div className="px-4 py-4">
                <a href="#" className="flex items-center py-2 text-gray-700 hover:bg-gray-100 rounded">
                    <FaCog className="mr-3"/> Settings
                </a>
                <a href="#" className="flex items-center py-2 text-gray-700 hover:bg-gray-100 rounded">
                    <FaQuestionCircle className="mr-3"/> Help & Support
                </a>
            </div>
        </aside>
    );
};