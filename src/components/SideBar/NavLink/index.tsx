import { Icon, Text, Flex, ChakraProps, Box} from "@chakra-ui/react";
import { ElementType } from "react";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";

import './navlink.css';

interface NavLinkProps extends ChakraProps{
    icon: ElementType;
    children: string;
    color?: string;
    href: string;
}

export function NavLink({icon, color, children, href, ...rest} : NavLinkProps){
    const { pathname } = useLocation();

    let isActive = false;

    if(pathname.startsWith(String(href))){
        isActive = true;
    }

    return (
        <Flex pos="relative" ml={'15px !important'} borderLeftRadius="50px" my="2" w="calc(100% - 15px)" color={isActive ? "gray.800" : "gray.200"} bg={isActive ? "gray.100" : ""} {...rest}>
            <Link to={href}>
                <Flex h="14" alignItems="center" px="7" _hover={{'&>svg': {transform: 'translateX(10px)', transition: 'all 0.3s'}, textDecor: 'none', color: isActive ? 'inherit' : 'white', '&>p': {transform: 'translateX(10px)', transition: 'all 0.3s'}}}>
                    {
                        isActive && (
                            <Box position="absolute" top="-20px" height="20px" width="calc(100% - 28px)" background="gray.100" _before={{content: '""', bg: color, pos: 'absolute', top: 0, right: 0, width: '100%', height: '100%', borderBottomRightRadius: '9px'}}></Box>
                        )
                    }

                    <Icon as={icon} fontSize="20" stroke={isActive ? "gray.800" : "#e2e8f0"} fill={isActive ? "gray.800" : "#e2e8f0"}/>
                    <Text ml="4" fontWeight="medium" fontSize="15px">{children}</Text>

                    {
                        isActive && (
                            <Box position="absolute" bottom="-20px" height="20px" width="calc(100% - 28px)" background="gray.100" _before={{content: '""', bg: color, pos: 'absolute', top: 0, right: 0, width: '100%', height: '100%', borderTopRightRadius: '9px'}}></Box>
                        )
                    }
                </Flex>
            </Link>
        </Flex>
    );
}