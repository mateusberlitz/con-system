import { getPrefix } from "./tenantApi";

export function setAuthTimeCookie(expires_in: number){
    const date = new Date();
    date.setTime(date.getTime() + (expires_in*1000));
    //date.setTime(date.getTime() + (60*1000));

    //document.cookie = `expireAuth; expires=${date.toUTCString()}; path=/`;
    document.cookie = `value=expireAuth; max-age=${expires_in}; path=/${getPrefix()}`;
    //console.log(document.cookie);
    return document.cookie;
}

export function getAuthTimeCookie(){
    const decodedCookie = decodeURIComponent(document.cookie);
    const slicedCookie = decodedCookie.split(';');

    for(var i = 0; i < slicedCookie.length; i++){
        var cookiePart = slicedCookie[i];

        cookiePart = cookiePart.replace(/\s/g, '');

        if(cookiePart === "expireAuth" || cookiePart === "value=expireAuth"){
            return cookiePart;
        }
    }

    return "";
}

export function checkAuthTimeCookie(){
    const cookie = getAuthTimeCookie();

    if(cookie === ""){
        return false;
    }else{
        return true;
    }
}

export function deleteAuthTimeCookie(){
    if(decodeURIComponent(document.cookie) === "expireAuth"){
        const date = new Date();
        date.setTime(date.getTime() - 1000);

        document.cookie = `expireAuth; expires=${date.toUTCString()}; path=/`;
    }
}