import { Icon, Img, Link, Stack, Text } from "@chakra-ui/react";
import { NavLink } from "./NavLink";

import { ReactComponent as HomeIcon } from '../../assets/icons/Home.svg';
import { ReactComponent as ProfileIcon } from '../../assets/icons/Profile.svg';
import { ReactComponent as ConfigureIcon } from '../../assets/icons/Configure.svg';
import { ReactComponent as BackArrowIcon } from '../../assets/icons/Back Arrow.svg';

import LogoBranco from '../../assets/icons/Logo-Branco.svg';


export function SideBarNav(){
    return (
        <Stack spacing="0" align="flex-start" h="100vh" bg="purple.300">
            <Img src={LogoBranco} px="7" mt="9" mb="14" />

            <NavLink href="/empresas" icon={HomeIcon}>Empresas</NavLink> 
            <NavLink href="/usuarios" icon={ProfileIcon}>Usuários</NavLink>
            <NavLink href="/permissoes" icon={ConfigureIcon}>Permissões</NavLink>

            <Link mt="24" href="/home" display="flex" h="16" alignItems="center" w="100%" px="7" color="white" _hover={{textDecor: 'none'}} >
                <Icon as={BackArrowIcon} fontSize="20" stroke="#ffffff" fill="none"/>
                <Text ml="4" fontWeight="medium">Início</Text>
            </Link>
        </Stack>
    );
}