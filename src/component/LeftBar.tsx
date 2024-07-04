import React from 'react';
import { Link } from 'react-router-dom';
import { useSidebarStateContext } from "../context/SidebarStateContext";

interface LeftBarLinkProps {
    opened: boolean;
    name: string;
}

const LeftBarLink: React.FC<LeftBarLinkProps> = ({ opened, name }) => {
    return (
        <Link to={`/${name}`}>
            <div className="flex items-center py-2 text-gray-700 hover:bg-gray-100 rounded">
                <img
                    src={`/asset/img/leftbar/${name}.svg`}
                    alt={name}
                    className="h-8 w-8 mr-2 ml-2"
                />
                {opened && <span>{name}</span>}
            </div>
        </Link>
    );
};

export const LeftBar: React.FC = () => {
    const { isLeftbarOpened} = useSidebarStateContext();
    return (
        <aside className={`transition-all duration-300 ease-in-out bg-white border-r border-gray-200 flex flex-col justify-between fixed top-0 left-0 h-full ${isLeftbarOpened ? 'w-leftbarOpened' : 'w-leftbarClosed'}`}>
            <div>
                <div className="px-4 py-4 flex items-center justify-between">
                    <Link to="/">
                        <div className="flex items-center">
                            <img src="/asset/img/Logo.png" alt="Logo" className="h-10 w-10 ml-2 mr-2" />
                            {isLeftbarOpened && <h1 className="text-xl font-bold">TASKFLOWER</h1>}
                        </div>
                    </Link>
                </div>
                <nav className="flex flex-col px-4">
                    <LeftBarLink opened={isLeftbarOpened} name="Dashboard" />
                    <LeftBarLink opened={isLeftbarOpened} name="Report" />
                    <LeftBarLink opened={isLeftbarOpened} name="Calendar" />
                    <LeftBarLink opened={isLeftbarOpened} name="Task" />
                    <LeftBarLink opened={isLeftbarOpened} name="Routine" />
                </nav>
            </div>
            <div className="px-4 py-4">
                <LeftBarLink opened={isLeftbarOpened} name="Setting" />
            </div>
        </aside>
    );
};
