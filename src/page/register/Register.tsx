import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { requestProfile, requestProfileUpdate, requestUsernameCheck } from "../../api/UserApi";
import { existAuthCookie } from "../../util/CookieUtil";
import { UserInfoInterface } from "../../api/interface/UserInfoInterface";
import { ProfileUpdateRequestInterface } from "../../api/interface/ProfileUpdateRequestInterface";
import { HomeLayout } from "../../layout/HomeLayout";

export const Register: React.FC = () => {
    const [userInfo, setUserInfo] = useState<UserInfoInterface>({
        id: null,
        username: null,
    });
    const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | null>(null);
    const [loading, setLoading] = useState<boolean>(false); // State for API loading status
    const navigate = useNavigate();

    // Extract the local part of an email
    const getEmailLocalPart = useCallback((email: string | null): string | null => {
        if (!email) return null;
        const atIndex = email.indexOf("@");
        return atIndex === -1 ? email : email.substring(0, atIndex);
    }, []);

    // Fetch the user profile when the component mounts
    useEffect(() => {
        if (!existAuthCookie()) {
            navigate("/");
            return;
        }

        const fetchProfile = async () => {
            try {
                const result = await requestProfile();
                setUserInfo({
                    id: result.id,
                    username: getEmailLocalPart(result.username),
                });
            } catch (error) {
                console.error("Failed to fetch profile:", error);
            }
        };

        fetchProfile();
    }, [navigate, getEmailLocalPart]);

    // Handle input changes to update the userInfo state
    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const { name, value } = e.target;
            setUserInfo((prevState) => ({ ...prevState, [name]: value }));
        },
        []
    );

    // Check username availability
    const handleUsernameCheck = useCallback(async () => {
        if (!userInfo.username) return;

        setLoading(true); // Start loading state
        try {
            const result = await requestUsernameCheck(userInfo.username as string);
            setIsUsernameAvailable(result);
        } catch (error) {
            console.error("Username check failed:", error);
        } finally {
            setLoading(false); // Stop loading state
        }
    }, [userInfo.username]);

    // Handle form submission to update the profile
    const handleSubmit = useCallback(
        async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            if (!isUsernameAvailable) {
                alert("Please check the username.");
                return;
            }

            const updateProfileData: ProfileUpdateRequestInterface = {
                username: userInfo.username,
            };

            try {
                const result = await requestProfileUpdate(updateProfileData);
                alert("Profile updated successfully!");
                setUserInfo({
                    id: result.id,
                    username: getEmailLocalPart(result.username),
                });
                navigate("/dashboard");
            } catch (error) {
                console.error("Profile update failed:", error);
                alert("Failed to update profile.");
            }
        },
        [isUsernameAvailable, userInfo.username, getEmailLocalPart, navigate]
    );

    return (
        <HomeLayout>
            <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 bg-white shadow-md rounded-lg">
                <h2 className="text-2xl font-bold mb-6">Update Profile</h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4">
                        {/* Username Input */}
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
                                    disabled={loading}
                                >
                                    {loading ? "Checking..." : "Check"}
                                </button>
                            </div>
                            {isUsernameAvailable !== null && (
                                <p className={`text-sm ${isUsernameAvailable ? "text-green-500" : "text-red-500"}`}>
                                    {isUsernameAvailable ? "Username is available!" : "Username is already taken."}
                                </p>
                            )}
                        </div>

                        {/* Email Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                name="email"
                                className="mt-1 p-2 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* Phone Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Phone</label>
                            <input
                                type="tel"
                                name="phone"
                                className="mt-1 p-2 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* Address Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Address</label>
                            <input
                                type="text"
                                name="address"
                                className="mt-1 p-2 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
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
        </HomeLayout>
    );
};
