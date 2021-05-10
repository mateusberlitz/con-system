import { extendTheme } from '@chakra-ui/react';

export const theme = extendTheme({
    colors: {
        gray: {
            "900": "#14142B",
            "800": "#4E4B66",
            "700": "#6E7191",
            "600": "#A0A3BD", 
            "500": "#D9DBE9",
            "400": "#EFF0F6",
            "100": "#F7F7FC",
            "50" : "#FCFCFC",  
        },
        purple: {
            "400": "#2A00A2",
            "300": "#5F2EEA",
            "200": "#BCA4FF",
            "100": "#E4DAFF",
        },
        blue: {
            "500": "#0096B7",
            "400": "#2097ED",
            "300": "#1CC8EE",
            "200": "#82E9FF",
            "100": "#DEF9FF",
        },
        red: {
            "400": "#C30052",
            "300": "#ED2E7E",
            "200": "#FF84B7",
            "100": "#FFDFED",
        },
        orange: {
            "400": "#F24E1E",
        },
    },
    fonts: {
        heading: 'Poppins',
        body: 'Poppins'
    },
    styles: {
        global: {
            body: {
                bg: 'gray.100',
                color: 'gray.900'
            }
        }
    }
})