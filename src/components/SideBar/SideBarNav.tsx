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
import { ReactComponent as ScrollIcon } from '../../assets/icons/Scroll.svg';
import { ReactComponent as PrinterIcon } from '../../assets/icons/Printer.svg';
import { ReactComponent as FolderIcon } from '../../assets/icons/Folder.svg';
import { ReactComponent as BagIcon } from '../../assets/icons/Bag.svg';
import { ReactComponent as AtsignIcon } from '../../assets/icons/At-sign.svg';
import { ReactComponent as CalendarIcon } from '../../assets/icons/Calandar.svg';

import LogoBranco from '../../assets/icons/Logo-Branco.svg';
import { HasPermission, useProfile } from "../../hooks/useProfile";

interface SideBarNavProps{
    desk: string;
}

export function SideBarNav({ desk }: SideBarNavProps){
    const { permissions } = useProfile();

    return desk === 'configs' ? (
        <Stack spacing="2" align="flex-start" h="100vh" bg="purple.300" borderBottomRightRadius="10px" borderTopRightRadius="10px">
            <Img src={LogoBranco} px="7" mt="9" mb="14" />

            {
                HasPermission(permissions, 'Usuários') && (
                    <NavLink color="purple.300" href="/usuarios" icon={ProfileIcon}>Usuários</NavLink>
                )
            }
            {
                HasPermission(permissions, 'Usuários') && (
                    <>
                        <NavLink color="purple.300" href="/empresas" icon={HomeIcon}>Empresas</NavLink> 
                        <NavLink color="purple.300" href="/permissoes" icon={ConfigureIcon}>Permissões</NavLink>
                    </>
                )
            }

            <Link mt="24" href="/home" display="flex" h="16" alignItems="center" w="100%" px="7" color="white" _hover={{textDecor: 'none'}} >
                <Icon as={BackArrowIcon} fontSize="20" stroke="#ffffff" fill="none"/>
                <Text ml="4" fontWeight="medium">Início</Text>
            </Link>
        </Stack>
    ) : (desk === 'financial' ? (
        <Stack spacing="2" align="flex-start" h="100vh" bg="blue.400" borderBottomRightRadius="10px" borderTopRightRadius="10px">
            <Img src={LogoBranco} px="7" mt="9" mb="14" />

            <NavLink href="/financeiro" icon={ChartPieIcon} color="blue.400">Dashboard</NavLink> 
            <NavLink href="/pagamentos" icon={CardIcon} color="blue.400">Pagamentos</NavLink>

            {
                HasPermission(permissions, 'Financeiro Completo') && (
                    <>
                        <NavLink href="/receber" icon={TagIcon} color="blue.400">Contas a Receber</NavLink>
                        <NavLink href="/fluxo" icon={ChartBarIcon} color="blue.400">Fluxo de Caixa</NavLink>
                        <NavLink href="/caixa" icon={PrinterIcon} color="blue.400">Caixa</NavLink>
                        <NavLink href="/relatorios" icon={ScrollIcon} color="blue.400">Relatórios</NavLink>
                    </>
                )
            }

            {
                (HasPermission(permissions, 'Usuários') || HasPermission(permissions, 'Configurações') || HasPermission(permissions, 'Contempladas')) && (
                    <Link mt="30px" position="absolute" bottom="24px" alignItems="center" href="/home" display="flex" h="16" w="100%" px="7" color="white" _hover={{textDecor: 'none'}} >
                        <Icon as={BackArrowIcon} fontSize="20" stroke="#ffffff" fill="none"/>
                        <Text ml="4" fontWeight="medium">Tela inicial</Text>
                    </Link>
                )
            }
        </Stack>
    ) : (desk === 'commercial' ? (
        <Stack spacing="2" align="flex-start" h="100vh" bg="orange.400" borderBottomRightRadius="10px" borderTopRightRadius="10px">
            <Img src={LogoBranco} px="7" mt="9" mb="14" />

            <NavLink href="/comercial" icon={ChartPieIcon} color="orange.400">Dashboard</NavLink> 
            <NavLink href="/leads" icon={AtsignIcon} color="orange.400">Leads</NavLink>
            <NavLink href="/agenda" icon={CalendarIcon} color="orange.400">Agendamentos</NavLink>
            <NavLink href="/team" icon={CalendarIcon} color="orange.400">Equipe</NavLink>
            {/* <NavLink href="/calculadora" icon={ConfigureIcon}>Calculadora</NavLink> */}
            

            {
                (HasPermission(permissions, 'Vendas Completo')) && (
                    <NavLink href="/vendedores" icon={ProfileIcon} color="orange.400">Vendedores</NavLink>
                )
            }

            {
                (HasPermission(permissions, 'Usuários') || HasPermission(permissions, 'Configurações') || HasPermission(permissions, 'Contempladas')) && (
                    <Link mt="30px" position="absolute" bottom="24px" alignItems="center" href="/home" display="flex" h="16" w="100%" px="7" color="white" _hover={{textDecor: 'none'}} >
                        <Icon as={BackArrowIcon} fontSize="20" stroke="#ffffff" fill="none"/>
                        <Text ml="4" fontWeight="medium">Tela inicial</Text>
                    </Link>
                )
            }
        </Stack>
    ) : (
        <Stack spacing="2" align="flex-start" h="100vh" bg="blue.800" borderBottomRightRadius="10px" borderTopRightRadius="10px">
            <Img src={LogoBranco} px="7" mt="9" mb="14" />

            {/* <NavLink href="/financeiro" icon={ChartPieIcon}>Dashboard</NavLink>  */}
            <NavLink href="/contempladas" icon={FolderIcon} stroke="#ffffff" fill="none" color="blue.800">Estoque</NavLink>
            <NavLink href="/venda-contempladas" icon={BagIcon} fill="none" color="blue.800">Vendas</NavLink>
            <NavLink href="/relatorio-contempladas" icon={ScrollIcon} fill="none" color="blue.800">Relatório</NavLink>
            {
                (HasPermission(permissions, 'Usuários') || HasPermission(permissions, 'Configurações') || HasPermission(permissions, 'Contempladas')) && (
                    <Link mt="30px" position="absolute" bottom="24px" alignItems="center" href="/home" display="flex" h="16" w="100%" px="7" color="white" _hover={{textDecor: 'none'}} >
                        <Icon as={BackArrowIcon} fontSize="20" stroke="#ffffff" fill="none"/>
                        <Text ml="4" fontWeight="medium">Tela inicial</Text>
                    </Link>
                )
            }
        </Stack>
    )));
}