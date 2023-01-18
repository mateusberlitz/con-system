import { Box, Icon, Stack, Text } from '@chakra-ui/react'
import { NavLink } from './NavLink'

import { ReactComponent as HomeIcon } from '../../assets/icons/Home.svg';
import { ReactComponent as ProfileIcon } from '../../assets/icons/Profile.svg';
import { ReactComponent as ConfigureIcon } from '../../assets/icons/Configure.svg';
import { ReactComponent as BackArrowIcon } from '../../assets/icons/Back Arrow.svg';
import { ReactComponent as ChartPieIcon } from '../../assets/icons/Chart-pie.svg';
import { ReactComponent as CardIcon } from '../../assets/icons/Card.svg';
import { ReactComponent as TagIcon } from '../../assets/icons/Tag.svg';
import { ReactComponent as ChartBarIcon } from '../../assets/icons/Chart-bar.svg';
import { ReactComponent as ScrollIcon } from '../../assets/icons/Scroll.svg';
import { ReactComponent as PrinterIcon } from '../../assets/icons/Printer.svg';
import { ReactComponent as FolderIcon } from '../../assets/icons/Folder.svg';
import { ReactComponent as BagIcon } from '../../assets/icons/Bag.svg';
import { ReactComponent as AtsignIcon } from '../../assets/icons/At-sign.svg';
import { ReactComponent as CalendarIcon } from '../../assets/icons/Calandar.svg';
import { ReactComponent as PercentIcon } from '../../assets/icons/percent.svg';


import LogoBranco from '../../assets/icons/Logo-Branco.svg'
import { HasPermission, useProfile } from '../../hooks/useProfile'
import { useTenant } from '../../hooks/useTenant'
import { Link } from 'react-router-dom'
import { Logo } from '../Logo'
import { Users } from 'react-feather';

interface SideBarNavProps{
    desk: "configs" | "financial" | "commercial" | "quotas" | "commissions";
}

export function SideBarNav({ desk }: SideBarNavProps) {
  const { permissions } = useProfile()
  const { prefix } = useTenant()

  return desk === 'configs' ? (
    <Stack
      spacing="2"
      align="flex-start"
      h="100vh"
      bg="purple.300"
      borderBottomRightRadius="10px"
      borderTopRightRadius="10px"
    >
      <Logo isWhite={true} pl="5"/>

      {HasPermission(permissions, 'Usuários') && (
        <NavLink color="purple.300" href={`/usuarios`} icon={ProfileIcon}>
          Usuários
        </NavLink>
      )}
      {HasPermission(permissions, 'Usuários') && (
        <>
          <NavLink color="purple.300" href={`/empresas`} icon={HomeIcon}>
            Empresas
          </NavLink>
          <NavLink color="purple.300" href={`/permissoes`} icon={ConfigureIcon}>
            Permissões
          </NavLink>
        </>
      )}

      <Link to={`/home`}>
        <Box
          mt="24"
          display="flex"
          h="16"
          alignItems="center"
          w="100%"
          px="7"
          color="white"
          _hover={{ textDecor: 'none' }}
        >
          <Icon as={BackArrowIcon} fontSize="20" stroke="#ffffff" fill="none" />
          <Text ml="4" fontWeight="medium">
            Início
          </Text>
        </Box>
      </Link>
    </Stack>
  ) : desk === 'financial' ? (
    <Stack
      spacing="2"
      align="flex-start"
      h="100vh"
      bg="blue.400"
      borderBottomRightRadius="10px"
      borderTopRightRadius="10px"
    >
      <Logo isWhite={true} pl="5"/>

      <NavLink href={`/financeiro`} icon={ChartPieIcon} color="blue.400">
        Dashboard
      </NavLink>
      <NavLink href={`/pagamentos`} icon={CardIcon} color="blue.400">
        Pagamentos
      </NavLink>

      {HasPermission(permissions, 'Financeiro Completo') && (
        <>
          <NavLink href={`/receber`} icon={TagIcon} color="blue.400">
            Contas a Receber
          </NavLink>
          <NavLink href={`/fluxo`} icon={ChartBarIcon} color="blue.400">
            Fluxo de Caixa
          </NavLink>
          <NavLink href={`/caixa`} icon={PrinterIcon} color="blue.400">
            Caixa
          </NavLink>
          <NavLink href={`/relatorios`} icon={ScrollIcon} color="blue.400">
            Relatórios
          </NavLink>
        </>
      )}

      {(HasPermission(permissions, 'Usuários') ||
        HasPermission(permissions, 'Configurações') ||
        HasPermission(permissions, 'Contempladas')) && (
        <Link to={`/home`}>
          <Box
            mt="24"
            display="flex"
            h="16"
            alignItems="center"
            w="100%"
            px="7"
            color="white"
            _hover={{ textDecor: 'none' }}
          >
            <Icon
              as={BackArrowIcon}
              fontSize="20"
              stroke="#ffffff"
              fill="none"
            />
            <Text ml="4" fontWeight="medium">
              Início
            </Text>
          </Box>
        </Link>
      )}
    </Stack>
  ) : desk === 'commercial' ? (
    <Stack
      spacing="2"
      align="flex-start"
      h="100vh"
      bg="orange.400"
      borderBottomRightRadius="10px"
      borderTopRightRadius="10px"
    >
      <Logo isWhite={true} pl="5"/>

      <NavLink href={`/comercial`} icon={ChartPieIcon} color="orange.400">
        Dashboard
      </NavLink>
      <NavLink href={`/leads`} icon={AtsignIcon} color="orange.400">
        Leads
      </NavLink>
      <NavLink href={`/agenda`} icon={CalendarIcon} color="orange.400">
        Agendamentos
      </NavLink>
      <NavLink href={`/clientes`} icon={Users} color="orange.400" isFeatherIcon={true}>
        Clientes
      </NavLink>
      {HasPermission(permissions, 'Comercial Completo') && (
        <NavLink href={`/team`} icon={ProfileIcon} color="orange.400">
          Equipe
        </NavLink>
      )}
      {/* <NavLink href="/calculadora" icon={ConfigureIcon}>Calculadora</NavLink> */}

      {HasPermission(permissions, 'Vendas Completo') && (
        <NavLink href={`/vendedores`} icon={ProfileIcon} color="orange.400">
          Vendedores
        </NavLink>
      )}

      {(HasPermission(permissions, 'Usuários') ||
        HasPermission(permissions, 'Configurações') ||
        HasPermission(permissions, 'Contempladas')||
        HasPermission(permissions, 'Comissões Vendedor')||
        HasPermission(permissions, 'Comissões Completo')||
        HasPermission(permissions, 'Comissões Gerente')) && (
        <Link to={`/home`}>
          <Box
            mt="24"
            display="flex"
            h="16"
            alignItems="center"
            w="100%"
            px="7"
            color="white"
            _hover={{ textDecor: 'none' }}
          >
            <Icon
              as={BackArrowIcon}
              fontSize="20"
              stroke="#ffffff"
              fill="none"
            />
            <Text ml="4" fontWeight="medium">
              Início
            </Text>
          </Box>
        </Link>
      )}
    </Stack>
  ) : desk === 'commissions' ? (
    <Stack
      spacing="2"
      align="flex-start"
      h="100vh"
      bg="red.400"
      borderBottomRightRadius="10px"
      borderTopRightRadius="10px"
    >
      <Logo isWhite={true} pl="5"/>

      <NavLink href={`/comissões`} icon={ChartPieIcon} color="red.400">
        Dashboard
      </NavLink>
      <NavLink href={`/comissões-vendedores`} icon={PercentIcon} color="red.400">
        Comissões de vendedor
      </NavLink>
      {HasPermission(permissions, 'Comissões Completo') && (
        <NavLink href={`/comissões-empresa`} icon={HomeIcon} color="red.400">
          Comissões da empresa
        </NavLink>
      )}
      <NavLink href={`/contratos`} icon={FolderIcon} color="red.400">
        Contratos
      </NavLink>

      {HasPermission(permissions, 'Comissões Completo') && (
        <NavLink href={`/relatorio-comissões`} icon={ScrollIcon} color="red.400">
          Relatórios
        </NavLink>
      )}
      {/* <NavLink href="/calculadora" icon={ConfigureIcon}>Calculadora</NavLink> */}

      {HasPermission(permissions, 'Vendas Completo') && (
        <NavLink href={`/vendedores`} icon={ProfileIcon} color="red.400">
          Vendedores
        </NavLink>
      )}

      {(HasPermission(permissions, 'Usuários') ||
        HasPermission(permissions, 'Configurações') ||
        HasPermission(permissions, 'Contempladas') ||
        HasPermission(permissions, 'Comissões Vendedor')||
        HasPermission(permissions, 'Comissões Completo')||
        HasPermission(permissions, 'Comissões Gerente')) && (
        <Link to={`/home`}>
          <Box
            mt="24"
            display="flex"
            h="16"
            alignItems="center"
            w="100%"
            px="7"
            color="white"
            _hover={{ textDecor: 'none' }}
          >
            <Icon
              as={BackArrowIcon}
              fontSize="20"
              stroke="#ffffff"
              fill="none"
            />
            <Text ml="4" fontWeight="medium">
              Início
            </Text>
          </Box>
        </Link>
      )}
    </Stack>
  ) : (
    <Stack
      spacing="2"
      align="flex-start"
      h="100vh"
      bg="blue.800"
      borderBottomRightRadius="10px"
      borderTopRightRadius="10px"
    >
      <Logo isWhite={true} pl="5"/>

      {/* <NavLink href="/financeiro" icon={ChartPieIcon}>Dashboard</NavLink>  */}
      <NavLink
        href={`/contempladas`}
        icon={FolderIcon}
        stroke="#ffffff"
        fill="none"
        color="blue.800"
      >
        Estoque
      </NavLink>
      <NavLink
        href={`/venda-contempladas`}
        icon={BagIcon}
        fill="none"
        color="blue.800"
      >
        Vendas
      </NavLink>
      <NavLink
        href={`/relatorio-contempladas`}
        icon={ScrollIcon}
        fill="none"
        color="blue.800"
      >
        Relatório
      </NavLink>
      {(HasPermission(permissions, 'Usuários') ||
        HasPermission(permissions, 'Configurações') ||
        HasPermission(permissions, 'Contempladas')||
        HasPermission(permissions, 'Comissões Vendedor')||
        HasPermission(permissions, 'Comissões Completo')||
        HasPermission(permissions, 'Comissões Gerente')) && (
        <Link to={`/home`}>
          <Box
            mt="24"
            display="flex"
            h="16"
            alignItems="center"
            w="100%"
            px="7"
            color="white"
            _hover={{ textDecor: 'none' }}
          >
            <Icon
              as={BackArrowIcon}
              fontSize="20"
              stroke="#ffffff"
              fill="none"
            />
            <Text ml="4" fontWeight="medium">
              Início
            </Text>
          </Box>
        </Link>
      )}
    </Stack>
  )
}
