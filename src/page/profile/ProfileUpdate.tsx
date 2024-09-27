import React, { useEffect, useState } from "react";
import { CommonLayout } from "../../layout/CommonLayout";
import { useNavigate } from "react-router-dom";
import timezone from "../../constants/timezones.json";
import {requestProfile, requestProfileUpdate, requestUsernameCheck} from "../../api/UserApi";
import {existAuthCookie} from "../../util/CookieUtil";
import {UserInfoInterface} from "../../api/interface/UserInfoInterface";
import {ProfileUpdateRequestInterface} from "../../api/interface/ProfileUpdateRequestInterface";

export const ProfileUpdate: React.FC = () => {
    const [userInfo, setUserInfo] = useState<UserInfoInterface>({
        id: null,
        username: null,
        // email: null,
        // phone: null,
        // address: null,
        timezone: null,
    });
    const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | null>(null);
    const navigate = useNavigate();

    function getEmailLocalPart(email: string | null): string | null {
        if (email) {
            const atIndex = email.indexOf('@');
            if (atIndex === -1) return email;
            return email.substring(0, atIndex);
        } else return email;
    }

    useEffect(() => {
        if (!existAuthCookie()) {
            navigate("/");
        }

        requestProfile().then((result: UserInfoInterface) => {
            setUserInfo({
                id: result.id,
                username: getEmailLocalPart(result.username),
                timezone: result.timezone
            })
        })

    }, [navigate]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserInfo((prevState: UserInfoInterface) => {
            return ({...prevState, [name]: value});
        });
    };

    const handleUsernameCheck = async () => {
        await requestUsernameCheck(userInfo.username as string).then((result) => {
            setIsUsernameAvailable(result);
        })
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isUsernameAvailable) {
            const updateProfileData: ProfileUpdateRequestInterface = {
                username: userInfo.username,
                timezone: userInfo.timezone,
            };
            requestProfileUpdate(updateProfileData).then((result) => {
                alert("success profile update");
                setUserInfo({
                    id: result.id,
                    username: getEmailLocalPart(result.username),
                    timezone: result.zoneId
                })
            });
        } else {
            alert("Please check username.");
        }

    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setUserInfo((prevState: UserInfoInterface) => ({
            ...prevState,
            [name]: value
        }));
    };

    return (
        <CommonLayout>
            <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 bg-white shadow-md rounded-lg">
                <h2 className="text-2xl font-bold mb-6">Update Profile</h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Username</label>
                            <div className="flex">
                                <input
                                    type="text"
                                    name="username"
                                    className="mt-1 p-2 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                    value={userInfo.username || ""}
                                    onChange={handleInputChange}
                                />
                                <button
                                    type="button"
                                    onClick={handleUsernameCheck}
                                    className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >
                                    Check
                                </button>
                            </div>
                            {isUsernameAvailable === null ? null
                                :
                                isUsernameAvailable ? (
                                    <p className="text-green-500">Username is available!</p>
                                ) : (
                                    <p className="text-red-500">Username is already taken.</p>
                                )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                name="email"
                                className="mt-1 p-2 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                // value={userInfo.email || ""}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Phone</label>
                            <input
                                type="tel"
                                name="phone"
                                className="mt-1 p-2 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                // value={userInfo.phone || ""}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Address</label>
                            <input
                                type="text"
                                name="address"
                                className="mt-1 p-2 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                // value={userInfo.address || ""}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Timezone</label>
                            <select
                                name="timezone"
                                className="mt-1 p-2 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                value={userInfo.timezone || ""}
                                onChange={handleSelectChange}
                            >
                                <option value="" disabled>Select Zone ID</option>
                                {Object.entries(timezone.timezone).map(([city, timezone]) => (
                                    <option key={timezone} value={timezone}>{city}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="mt-6">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Update Profile
                        </button>
                    </div>
                </form>
            </div>
        </CommonLayout>
    );
};