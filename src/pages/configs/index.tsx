import { Flex, Stack, Text } from '@chakra-ui/react'

import { ReactComponent as SettingsIcon } from '../../assets/icons/Settings.svg'
import { ReactComponent as ChartBarIcon } from '../../assets/icons/Chart-bar.svg'
import { ReactComponent as CartIcon } from '../../assets/icons/Cart.svg'
import { ReactComponent as BagIcon } from '../../assets/icons/Bag.svg'

import { Profile } from '../../components/Profile'
import { Alert } from '../../components/Alert'
import { HasPermission, useProfile } from '../../hooks/useProfile'
import { useTenant } from '../../hooks/useTenant'
import { Logo } from '../../components/Logo'
import { Link } from 'react-router-dom'

export default function ConfigHome() {
  const { permissions } = useProfile()
  const { prefix } = useTenant()

  return (
    <Flex direction="column" h="100vh">
      <Alert />

      <Flex
        w="100%"
        my="14"
        maxWidth={1280}
        mx="auto"
        px="6"
        direction="column"
      >
        <Flex w="100%" mb="16">
          <Logo/>

          <Profile />
        </Flex>

        <Stack spacing="7" mb="12">
          <Text color="gray.800">Áreas do sistema:</Text>

          {HasPermission(permissions, 'Configurações') && (
            <Link to={`/empresas`}>
              <Flex
                w="200px"
                borderRadius="4px"
                borderLeft="3px solid"
                borderColor="purple.500"
                fontSize="md"
                bg="white"
                _hover={{ textDecor: 'none', boxShadow: 'md' }}
                px="6"
                py="3"
                boxShadow="sm"
                color="purple.300"
                display="flex"
                direction="row"
              >
                <SettingsIcon stroke="#4e4b66" fill="none" width="20" />
                <Text
                  fontWeight="regular"
                  ml="3"
                  color="gray.800"
                  lineHeight="25px"
                >
                  Configurações
                </Text>
              </Flex>
            </Link>
          )}

          {(HasPermission(permissions, 'Financeiro Limitado') ||
            HasPermission(permissions, 'Financeiro Completo')) && (
            <Link to={`/financeiro`}>
              <Flex
                w="200px"
                borderRadius="4px"
                borderLeft="3px solid"
                borderColor="blue.400"
                fontSize="md"
                bg="white"
                _hover={{ textDecor: 'none', boxShadow: 'md' }}
                px="6"
                py="3"
                boxShadow="sm"
                color="blue.400"
                display="flex"
                direction="row"
              >
                <ChartBarIcon stroke="#4e4b66" fill="none" width="20" />
                <Text
                  fontWeight="regular"
                  ml="3"
                  color="gray.800"
                  lineHeight="25px"
                >
                  Finanças
                </Text>
              </Flex>
            </Link>
          )}

          {HasPermission(permissions, 'Contempladas') && (
            <Link to={`/contempladas`}>
              <Flex
                w="200px"
                borderRadius="4px"
                borderLeft="3px solid"
                borderColor="blue.800"
                fontSize="md"
                bg="white"
                _hover={{ textDecor: 'none', boxShadow: 'md' }}
                px="6"
                py="3"
                boxShadow="sm"
                color="blue.800"
                display="flex"
                direction="row"
              >
                <BagIcon stroke="#4e4b66" fill="none" width="20" />
                <Text
                  fontWeight="regular"
                  ml="3"
                  color="gray.800"
                  lineHeight="25px"
                >
                  Contempladas
                </Text>
              </Flex>
            </Link>
          )}

          {(HasPermission(permissions, 'Comercial Limitado') ||
            HasPermission(permissions, 'Comercial Completo')) && (
              <Link to={`/comercial`}>
                <Flex
                  w="200px"
                  borderRadius="4px"
                  borderLeft="3px solid"
                  borderColor="orange.400"
                  fontSize="md"
                  bg="white"
                  _hover={{ textDecor: 'none', boxShadow: 'md' }}
                  px="6"
                  py="3"
                  boxShadow="sm"
                  color="orange.400"
                  display="flex"
                  direction="row"
                >
                  <CartIcon stroke="#4e4b66" fill="none" width="20" />
                  <Text
                    fontWeight="regular"
                    ml="3"
                    color="gray.800"
                    lineHeight="25px"
                  >
                    Comercial
                  </Text>
                </Flex>
              </Link>
          )}

          {(HasPermission(permissions, 'Comercial Limitado') ||
            HasPermission(permissions, 'Comercial Completo')) && (
              <Link to={`/comissões`}>
                <Flex
                  w="200px"
                  borderRadius="4px"
                  borderLeft="3px solid"
                  borderColor="red.400"
                  fontSize="md"
                  bg="white"
                  _hover={{ textDecor: 'none', boxShadow: 'md' }}
                  px="6"
                  py="3"
                  boxShadow="sm"
                  color="red.400"
                  display="flex"
                  direction="row"
                >
                  <BagIcon stroke="#4e4b66" fill="none" width="20"/>
                  <Text
                    fontWeight="regular"
                    ml="3"
                    color="gray.800"
                    lineHeight="25px"
                  >
                    Comissões
                  </Text>
                </Flex>
              </Link>
          )}
        </Stack>

        {/* <SimpleGrid flex="1" templateColumns="repeat(5, 1fr)" gap="5" minChildWidth="320px" align="flex-start">
                    <GridItem colSpan={2}  p={["4", "6"]}  bg="white" shadow="sm" borderRadius={15} pb="4">
                        <Heading fontSize="xl" fontWeight="500">Saldo das Empresas</Heading>

                        <br/> <br/> <br/> <br/>
                    </GridItem>

                    <GridItem colSpan={3} p={["4", "6"]}  bg="white" shadow="sm" borderRadius={15} pb="4">
                        <Heading fontSize="xl" fontWeight="500">Saldo das Empresas</Heading>
                    </GridItem>
                </SimpleGrid> */}
      </Flex>
    </Flex>
  )
}
