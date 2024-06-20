import React from "react";

interface RightBarProps {
    isOpened: boolean;
    toggle: () => void;
}

export const RightBar: React.FC<RightBarProps> = ({ isOpened, toggle }) => {
    return (
        <>
            <aside className="bg-gray-100">
                <div className="btn btn-sm" onClick={toggle}>
                    temp
                </div>
            </aside>
            <aside className={`bg-white border-l border-gray-200 w-64 p-4 ${isOpened ? '' : 'hidden'}`}>
                <div className="mb-6">
                    <h2 className="text-xl font-bold mb-2">January</h2>
                    <div className="text-gray-600">Calendar widget here</div>
                </div>
                <div className="mb-6">
                    <h2 className="text-xl font-bold mb-2">Today</h2>
                    <ul>
                        <li className="flex justify-between text-gray-700 mb-2">
                            <span>Daily Standup</span> <span>08:00</span>
                        </li>
                        <li className="flex justify-between text-gray-700 mb-2">
                            <span>Budget Review</span> <span>09:00</span>
                        </li>
                        <li className="flex justify-between text-gray-700 mb-2">
                            <span>Sasha Jay 121</span> <span>10:00</span>
                        </li>
                        <li className="flex justify-between text-gray-700 mb-2">
                            <span>Web Team Progress Update</span> <span>11:00</span>
                        </li>
                        <li className="flex justify-between text-gray-700 mb-2">
                            <span>Social team briefing</span> <span>12:00</span>
                        </li>
                    </ul>
                </div>
                <div className="mb-6">
                    <h2 className="text-xl font-bold mb-2">Tomorrow</h2>
                    <ul>
                        <li className="flex justify-between text-gray-700 mb-2">
                            <span>Daily Standup</span> <span>13:00</span>
                        </li>
                        <li className="flex justify-between text-gray-700 mb-2">
                            <span>Tech Standup</span> <span>14:00</span>
                        </li>
                        <li className="flex justify-between text-gray-700 mb-2">
                            <span>Developer Progress</span> <span>15:00</span>
                        </li>
                    </ul>
                </div>
                <div>
                    <h2 className="text-xl font-bold mb-2">Vacations</h2>
                    <ul>
                        <li className="flex justify-between text-gray-700 mb-2">
                            <span>Bahamas</span> <span>01-02 to 14-02</span>
                        </li>
                    </ul>
                </div>
            </aside>
        </>
    );
};