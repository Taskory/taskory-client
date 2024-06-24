import Cookies from 'js-cookie';


// 쿠키를 가져오는 함수
export const getAuthCookie = () => {
  return Cookies.get("token");
};

// 쿠키를 설정하는 함수
export const setAuthCookie = (value: string, options?: Cookies.CookieAttributes): void => {
  Cookies.set("token", value, options);
};

// 쿠키를 삭제하는 함수
export const removeAuthCookie = (options?: Cookies.CookieAttributes): void => {
  Cookies.remove("token", options);
};

// 쿠키가 존재하는지 확인하는 함수
export const existAuthCookie = (): boolean => {
  return !!Cookies.get("token");
}
