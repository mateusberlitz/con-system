import { checkAuthTimeCookie, deleteAuthTimeCookie, getAuthTimeCookie, setAuthTimeCookie } from "./expireAuthCookie";

export const isAuthenticated = () => {
    if(!checkAuthTimeCookie()){
      logout();
    }

    return localStorage.getItem('@lance/access_token') !== null
};

export const getToken = () => {
    getAuthTimeCookie();

    return localStorage.getItem('@lance/access_token');
};

export const login = (token : string, expires_in : number) => {
  localStorage.setItem('@lance/access_token', token);
  setAuthTimeCookie(expires_in);
};

export const logout = () => {
  deleteAuthTimeCookie();
  localStorage.removeItem('@lance/access_token');
  localStorage.removeItem('@lance/profile');
  localStorage.removeItem('@lance/permissions');

  return true;
};