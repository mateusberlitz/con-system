import { Icon, Link, Text, LinkProps} from "@chakra-ui/react";
import { ElementType } from "react";
import { useLocation } from "react-router";

interface NavLinkProps extends LinkProps{
    icon: ElementType;
    children: string;
    color?: string;
    href: string;
}

export function NavLink({icon, color, children, href, ...rest} : NavLinkProps){
    const { pathname } = useLocation();

    let isActive = false;

    if(pathname.startsWith(String(href)) || pathname.startsWith(String(rest.as))){
        isActive = true;
    }

    return (
        <Link href={href} pos="relative" ml={'15px !important'} borderLeftRadius="50px" my="2" display="flex" h="14" alignItems="center" w="calc(100% - 15px)" {...rest} px="7" color={isActive ? "gray.800" : "gray.200"} bg={isActive ? "gray.100" : ""} _hover={{'&>svg': {ml: '10px', transition: 'all 0.3s'}, textDecor: 'none', color: isActive ? 'inherit' : 'white', ml:"10px"}} >
            {
                isActive && (
                    <Text position="absolute" top="-20px" height="20px" width="calc(100% - 28px)" background="gray.100" _before={{content: '""', bg: color, pos: 'absolute', top: 0, right: 0, width: '100%', height: '100%', borderBottomRightRadius: '9px'}}></Text>
                )
            }

            <Icon as={icon} fontSize="20" stroke={isActive ? "gray.800" : "#e2e8f0"} fill={isActive ? "gray.800" : "#e2e8f0"}/>
            <Text ml="4" fontWeight="medium" fontSize="15px">{children}</Text>

            {
                isActive && (
                    <Text position="absolute" bottom="-20px" height="20px" width="calc(100% - 28px)" background="gray.100" _before={{content: '""', bg: color, pos: 'absolute', top: 0, right: 0, width: '100%', height: '100%', borderTopRightRadius: '9px'}}></Text>
                )
            }
        </Link>
    );
}