import React from "react";
import {CommonLayout} from "../../layout/CommonLayout";
import {getAuthCookie} from "../../util/CookieUtil";

export const Profile: React.FC = () => {
    console.log(getAuthCookie());
    
    return (
        <CommonLayout>
            <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 bg-white shadow-md rounded-lg">
                <h2 className="text-2xl font-bold mb-6">Profile</h2>

                <div className="flex flex-col md:flex-row items-center md:items-start">
                    <img
                        className="w-32 h-32 rounded-full mb-4 md:mb-0"
                        src="https://via.placeholder.com/150"
                        alt="Profile"
                    />
                    <div className="md:ml-6">
                        <h3 className="text-xl font-semibold">John Doe</h3>
                        <p className="text-gray-600">john.doe@example.com</p>
                    </div>
                </div>

                <div className="mt-6">
                    <h4 className="text-lg font-semibold mb-4">Personal Information</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input
                                type="text"
                                className="mt-1 p-2 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                value="John Doe"
                                readOnly
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                className="mt-1 p-2 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                value="john.doe@example.com"
                                readOnly
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Phone</label>
                            <input
                                type="tel"
                                className="mt-1 p-2 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                value="+1234567890"
                                readOnly
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Address</label>
                            <input
                                type="text"
                                className="mt-1 p-2 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                value="123 Main St, Anytown, USA"
                                readOnly
                            />
                        </div>
                    </div>
                </div>
            </div>
        </CommonLayout>
    );
}