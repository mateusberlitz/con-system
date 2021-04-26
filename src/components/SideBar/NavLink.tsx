import { Icon, Link, Text, LinkProps} from "@chakra-ui/react";
import { ElementType } from "react";
import { useLocation } from "react-router";

interface NavLinkProps extends LinkProps{
    icon: ElementType;
    children: string;
    href: string;
}

export function NavLink({icon, children, href, ...rest} : NavLinkProps){
    const { pathname } = useLocation();

    let isActive = false;

    if(pathname.startsWith(String(href)) || pathname.startsWith(String(rest.as))){
        isActive = true;
    }

    return (
        <Link href={href} display="flex" h="16" alignItems="center" w="100%" {...rest} px="7" color={isActive ? "white" : "gray.200"} bg={isActive ? "rgba(0,0,0,0.2)" : ""} _hover={{textDecor: 'none', bg: 'rgba(0,0,0,0.2)'}} >
            <Icon as={icon} fontSize="20" stroke={isActive ? "#ffffff" : "#e2e8f0"} fill="none"/>
            <Text ml="4" fontWeight="medium">{children}</Text>
        </Link>
            
    );
}