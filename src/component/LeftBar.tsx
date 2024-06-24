import React from 'react';
import { Link } from 'react-router-dom';

interface LeftBarLinkProps {
    opened: boolean;
    name: string;
}

const LeftBarLink: React.FC<LeftBarLinkProps> = ({ opened, name }) => {
    return (
        <Link to={'/' + name}>
            <div className="flex items-center py-2 text-gray-700 hover:bg-gray-100 rounded">
                <img
                    src={'/asset/img/leftbar/' + name + '.svg'}
                    alt={name}
                    className="h-8 w-8 mr-2"
                />
                {!opened && name}
            </div>
        </Link>
    );
};

interface LeftBarProps {
    isOpened: boolean;
    toggle: () => void;
}

export const LeftBar: React.FC<LeftBarProps> = ({ isOpened, toggle }) => {
    return (
        <aside
            className={`transition-width duration-300 ease-in-out bg-white border-r border-gray-200 flex flex-col justify-between fixed top-0 left-0 h-full ${
                isOpened ? 'w-24' : 'w-72'
            }`}
        >
            <div>
                <div className="px-4 py-4 flex items-center justify-between">
                    <Link to={'/'}>
                        <div className="flex items-center">
                            <img src="/src/asset/img/Logo.png" alt="Logo" className="h-8 w-8 mr-2 fixed" />
                            {!isOpened && <h1 className="text-xl font-bold ml-10">TASKFLOWER</h1>}
                        </div>
                    </Link>
                    <button onClick={toggle}>
                        <img src="/src/asset/img/leftbar/Menu.svg" alt="Menu" className="h-6 w-6 ml-2"/>
                    </button>
                </div>
                <nav className="flex flex-col px-4">
                    <LeftBarLink opened={isOpened} name={'Dashboard'} />
                    <LeftBarLink opened={isOpened} name={'Report'} />
                    <LeftBarLink opened={isOpened} name={'Calendar'} />
                    <LeftBarLink opened={isOpened} name={'Task'} />
                    <LeftBarLink opened={isOpened} name={'Routine'} />
                </nav>
            </div>
            <div className="px-4 py-4">
                <LeftBarLink opened={isOpened} name={'Setting'} />
            </div>
        </aside>
    );
};
