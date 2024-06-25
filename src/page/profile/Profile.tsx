import React, {useEffect, useState} from "react";
import {CommonLayout} from "../../layout/CommonLayout";
import {existAuthCookie} from "../../util/CookieUtil";
import {useNavigate} from "react-router-dom";
import {UserInfoInterface} from "../../api/interface/UserInfoInterface";
import {requestProfile} from "../../api/user/ApiUtil";
import timezone from "../../constants/timezone.json";

export const Profile: React.FC = () => {
    const [userInfo, setUserInfo] = useState<UserInfoInterface>({id: null, username: null, zoneId: null});
    const navigate = useNavigate();

    useEffect(() => {
        if (!existAuthCookie()) {
            navigate("/");
        }

        requestProfile().then((result: UserInfoInterface) => {
            setUserInfo({
                id: result.id,
                username: result.username,
                zoneId: result.zoneId
            })
        })

    }, [navigate]);

    const navigateToProfileUpdate = () => {
        navigate("/profile/update");
    };

    const findCityByZoneId = (zoneId: string | null) => {
        if (zoneId) {
            const timezones = timezone.timezone;
            // Iterate over the keys in the timezone object
            for (const [city, zone] of Object.entries(timezones)) {
                if (zone === zoneId) {
                    return city; // Return the key if the value matches
                }
            }
        }
        return null; // Return null if no matching value is found
    };
    return (
        <CommonLayout>
            <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 bg-white shadow-md rounded-lg">
                <div className="px-4 py-2 flex justify-between items-center">
                    <h2 className="text-2xl font-bold mb-6">Profile</h2>
                    <button className="btn" onClick={navigateToProfileUpdate}>Update</button>
                </div>
                <div className="flex flex-col md:flex-row items-center md:items-start">
                    <img
                        className="w-32 h-32 rounded-full mb-4 md:mb-0"
                        src="https://via.placeholder.com/150"
                        alt="Profile"
                    />
                    <div className="md:ml-6">
                        <h3 className="text-xl font-semibold">{userInfo.username || ""}</h3>
                        <p className="text-gray-600">john.doe@example.com</p>
                    </div>
                </div>

                <div className="mt-6">
                    <h4 className="text-lg font-semibold mb-4">Personal Information</h4>
                    <div className="grid gap-4 py-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Username</label>
                            <p className="mt-1 p-2 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">{userInfo.username || ""}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <p className="mt-1 p-2 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">"john.doe@example.com"</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Phone</label>
                            <p className="mt-1 p-2 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">"+1234567890"</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Address</label>
                            <p className="mt-1 p-2 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">"123 Main St, Anytown, USA"</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Timezone</label>
                            <p className="mt-1 p-2 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">{findCityByZoneId(userInfo.zoneId)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </CommonLayout>
    );
}