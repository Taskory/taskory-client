import React, { useState } from "react";

export const Temp = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <button
                className="btn btn-primary"
                onClick={() => setIsModalOpen(true)}
            >
                Open Modal
            </button>

            {/* 첫 번째 모달 */}
            {isModalOpen && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h2 className="text-lg font-bold">First Modal</h2>
                        <p>This is the first modal.</p>
                        <div className="modal-action">
                            <button
                                className="btn"
                                onClick={() => setIsSecondModalOpen(true)}
                            >
                                Open Second Modal
                            </button>
                            <button
                                className="btn"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 두 번째 모달 */}
            {isSecondModalOpen && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h2 className="text-lg font-bold">Second Modal</h2>
                        <p>This is the second modal.</p>
                        <div className="modal-action">
                            <button
                                className="btn"
                                onClick={() => setIsSecondModalOpen(false)}
                            >
                                Close Second Modal
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
