export const currentDate = new Date();
export const currentMonth = currentDate.getMonth(); // 0부터 11까지의 값
export const currentYear = currentDate.getFullYear();

// 현재 월 이름
export const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];
export const currentMonthName = monthNames[currentMonth];

export const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// 현재 월의 첫 번째 날과 마지막 날
export const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
export const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

// 첫 번째 날의 요일
export const firstDayOfWeek = firstDayOfMonth.getDay();
