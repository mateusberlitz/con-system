import axios from "axios";

export const getApiUrl = () => {
    const prefix = getPrefix();
    return process.env.NODE_ENV === 'production' ? `${process.env.REACT_APP_API_URL}${prefix}/` : `${process.env.REACT_APP_API_LOCAL_URL}${prefix}/`;
};

export const getPrefix = () => {
    return window.location.pathname.split('/')[1];
}

export const setPrefix = (prefix: string) => {
  localStorage.setItem('@system/prefix', prefix);
}

export const checkIfPrefixIsTenant = async () => {
    const apiUrl = process.env.NODE_ENV === 'production' ? `${process.env.REACT_APP_API_URL}system/` : `${process.env.REACT_APP_API_LOCAL_URL}system/`;

    const { data } = await axios.get(`${apiUrl}check_tenant/${getPrefix()}`);
}