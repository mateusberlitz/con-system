interface setCookieProps{
    expires_in: number;
}

export function setAuthTimeCookie(expires_in: number){
    const date = new Date();
    date.setTime(date.getTime() + (expires_in*1000));
    //date.setTime(date.getTime() + (60*1000));

    document.cookie = `expireAuth; expires=${date.toUTCString()}; path=/`;
    return document.cookie;
}

export function getAuthTimeCookie(){
    const decodedCookie = decodeURIComponent(document.cookie);
    const slicedCookie = decodedCookie.split(';');

    for(var i = 0; i < slicedCookie.length; i++){
        var cookiePart = slicedCookie[i];

        if(cookiePart === "expireAuth"){
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