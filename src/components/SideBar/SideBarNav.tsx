import { Icon, Img, Link, Stack, Text } from "@chakra-ui/react";
import { NavLink } from "./NavLink";

import { ReactComponent as HomeIcon } from '../../assets/icons/Home.svg';
import { ReactComponent as ProfileIcon } from '../../assets/icons/Profile.svg';
import { ReactComponent as ConfigureIcon } from '../../assets/icons/Configure.svg';
import { ReactComponent as BackArrowIcon } from '../../assets/icons/Back Arrow.svg';
import { ReactComponent as ChartPieIcon } from '../../assets/icons/Chart-pie.svg';
import { ReactComponent as CardIcon } from '../../assets/icons/Card.svg';
import { ReactComponent as TagIcon } from '../../assets/icons/Tag.svg';
import { ReactComponent as ChartBarIcon } from '../../assets/icons/Chart-bar.svg';
import { ReactComponent as SettingsIcon } from '../../assets/icons/Settings.svg';

import LogoBranco from '../../assets/icons/Logo-Branco.svg';
import { HasPermission, useProfile } from "../../hooks/useProfile";

interface SideBarNavProps{
    desk: string;
}

export function SideBarNav({ desk }: SideBarNavProps){
    const { permissions } = useProfile();

    return desk === 'configs' ? (
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
    ) : (
        <Stack spacing="0" align="flex-start" h="100vh" bg="blue.400">
            <Img src={LogoBranco} px="7" mt="9" mb="14" />

            <NavLink href="/financeiro" icon={ChartPieIcon}>Dashboard</NavLink> 
            <NavLink href="/pagamentos" icon={CardIcon}>Pagamentos</NavLink>

            {
                HasPermission(permissions, 'Financeiro Completo') && (
                    <>
                        <NavLink href="/receber" icon={TagIcon}>Contas a Receber</NavLink>
                        <NavLink href="/caixa" icon={ChartBarIcon}>Fluxo de Caixa</NavLink>
                    </>
                )
            }

            {
                (HasPermission(permissions, 'Usuários') || HasPermission(permissions, 'Configurações')) && (
                    <Link mt="30px" position="absolute" bottom="24px" alignItems="center" href="/home" display="flex" h="16" w="100%" px="7" color="white" _hover={{textDecor: 'none'}} >
                        <Icon as={SettingsIcon} fontSize="20" stroke="#ffffff" fill="none"/>
                        <Text ml="4" fontWeight="medium">Configurações</Text>
                    </Link>
                )
            }
        </Stack>
    );
}