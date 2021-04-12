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
        }
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