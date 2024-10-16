import React from "react";
import {useNavigate} from "react-router-dom";

interface SelectItemProps {
    src: string;
    label: string;
    path: string;
    isOpen: boolean;
}


export const SelectItem: React.FC<SelectItemProps> = ({ src, label, path, isOpen }) => {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(path)}
            className="flex items-center p-2 cursor-pointer hover:bg-gray-200"
        >
            <img className="mr-2" src={src} alt={label}/>
            {isOpen && <span>{label}</span>}
        </div>
    );
};
