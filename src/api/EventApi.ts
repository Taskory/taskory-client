import {getAuthCookie} from "../util/CookieUtil";
import {API_URL} from "../constants";

export async function requestMonthlyEvents(date: Date) {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getAuthCookie()}`, // 비동기 함수 await 추가
        },
    };

    try {
        const startDateParam = `startDate=${getMonthFirstDate(date)}`;
        const dueDateParam = `dueDate=${getMonthFinalDate(date)}`;
        const response = await fetch(`${API_URL}/event?${startDateParam}&${dueDateParam}`, requestOptions);
        if (response.ok) {
            return await response.json();
        } else {
            console.error('Failed to fetch events:', response.statusText);
        }
    } catch (error) {
        console.error('Error during fetch:', error);
    }
}
function getMonthFirstDate(date: Date): string {
    const tempDate = new Date(date.getFullYear(), date.getMonth(), 1);
    const year = tempDate.getFullYear();
    const month = String(tempDate.getMonth() + 1).padStart(2, '0'); // 월을 2자리로 맞춤
    const day = String(tempDate.getDate()).padStart(2, '0'); // 일을 2자리로 맞춤
    return `${year}-${month}-${day}`;
}

function getMonthFinalDate(date: Date): string {
    const tempDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const year = tempDate.getFullYear();
    const month = String(tempDate.getMonth() + 1).padStart(2, '0'); // 월을 2자리로 맞춤
    const day = String(tempDate.getDate()).padStart(2, '0'); // 일을 2자리로 맞춤
    return `${year}-${month}-${day}`;
}