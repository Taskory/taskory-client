import {getAuthCookie} from "../util/CookieUtil";
import {API_URL} from "../constants";

export async function requestMonthlyEvents(month: string) {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + getAuthCookie(),
        },
    };

    try {
        const params = new URLSearchParams({month: month});
        const response = await fetch(`${API_URL}/event/?${params.toString()}`, requestOptions);
        if (response.ok) {
            return await response.json();
        }
    } catch (error) {
        console.error(error);
    }
}