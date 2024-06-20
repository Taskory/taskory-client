import React, {useState} from "react";
import {Link} from "react-router-dom";

interface LeftBarLinkProps {
    opened: boolean,
    name: string
}

const LeftBarLink:React.FC<LeftBarLinkProps> = (props: LeftBarLinkProps) => {
    return (
        <Link to={"/" + props.name}>
            <div className="flex items-center py-2 text-gray-700 hover:bg-gray-100 rounded">
                <img
                    src={"/asset/left-bar/" + props.name + ".png"}
                    alt={props.name}
                    className={`h-8 w-8 mr-2`}
                />
                {!props.opened && props.name}
            </div>
        </Link>
    );
}

export const LeftBar = () => {
    const [isOpened, setOpened] = useState(false);

    const toggleSidebar = () => {
        setOpened(!isOpened);
    };
    return (
        <aside
            className={`transition-width duration-300 ease-in-out bg-white border-r border-gray-200 flex flex-col justify-between ${
                isOpened ? "w-20" : "w-72"
            }`}
        >
            <div>
                <div className="px-4 py-4 flex items-center justify-between">
                    <Link to={"/"}>
                        <div className="flex items-center">
                            <img
                                src="/asset/logo.png"
                                alt="Logo"
                                className={`h-8 w-8 mr-2`}
                            />
                            {!isOpened && (

                                <h1 className="text-xl font-bold">TASKFLOWER</h1>
                            )}
                        </div>
                    </Link>
                    <button className="btn btn-primary" onClick={toggleSidebar}>
                        {isOpened ? ">" : "<"}
                    </button>
                </div>
                <nav className="flex flex-col px-4">
                    <LeftBarLink opened={isOpened} name={"Dashboard"}/>
                    <LeftBarLink opened={isOpened} name={"Report"}/>
                    <LeftBarLink opened={isOpened} name={"Calendar"}/>
                    <LeftBarLink opened={isOpened} name={"Task"}/>
                    <LeftBarLink opened={isOpened} name={"Routine"}/>
                </nav>
            </div>
            <div className="px-4 py-4">
                <LeftBarLink opened={isOpened} name={"Setting"}/>
                <LeftBarLink opened={isOpened} name={"Help & Support"}/>
            </div>
        </aside>
    );
};