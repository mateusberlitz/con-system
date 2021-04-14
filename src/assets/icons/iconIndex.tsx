interface SVGProps{
    bg?: string;
    color?: string;
    size?: number;
}

export function AlertInfoIcon({color, size, bg = 'none', ...rest} : SVGProps){
    return(
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="11" stroke="#14142B" stroke-width="2"/>
            <path d="M12 7V12" stroke="#14142B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 16V16.5" stroke="#14142B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    )
}

export function MailIcon({color = "000000", size, bg = 'none', ...rest} : SVGProps){
    return(
        <svg width="120" height="120" viewBox="0 0 26 24" fill={bg} xmlns="http://www.w3.org/2000/svg">
            <path d="M1 6C1 4.89543 1.89543 4 3 4H23C24.1046 4 25 4.89543 25 6V19C25 20.1046 24.1046 21 23 21H3C1.89543 21 1 20.1046 1 19V6Z" stroke={color} stroke-width="2" stroke-linejoin="round"/>
            <path d="M2.42131 5.30287C1.91709 4.84067 2.24409 4 2.9281 4H23.0719C23.7559 4 24.0829 4.84067 23.5787 5.30287L15.0272 13.1418C13.8802 14.1931 12.1198 14.1931 10.9728 13.1418L2.42131 5.30287Z" stroke={color} stroke-width="2" stroke-linejoin="round"/>
        </svg>
    )
}

export function ViewIcon({color, size, bg = 'none', ...rest} : SVGProps){
    return(
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.33497 13.2561C0.888345 12.4782 0.888342 11.522 1.33497 10.7441C3.68496 6.65097 7.44378 4 11.6798 4C15.9158 4 19.6746 6.65094 22.0246 10.744C22.4712 11.5219 22.4712 12.4781 22.0246 13.256C19.6746 17.3491 15.9158 20 11.6798 20C7.44377 20 3.68497 17.3491 1.33497 13.2561Z" stroke="#14142B" stroke-width="2"/>
            <circle cx="11.6797" cy="12" r="3" stroke="#14142B" stroke-width="2"/>
        </svg>

    )
}