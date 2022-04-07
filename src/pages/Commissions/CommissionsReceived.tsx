import { Flex, HStack, Stack, Text } from '@chakra-ui/react'
import { useProfile } from '../../hooks/useProfile'

import { ReactComponent as PlusIcon } from '../../assets/icons/Plus.svg'
import { ReactComponent as ChartBarIcon } from '../../assets/icons/Chart-bar.svg'

import { Link } from 'react-router-dom'

export default function CommissionsReceived() {
  const { profile, permissions } = useProfile()

  return (
    <Flex>
      <Stack
        w="634px"
        min-width="300px"
        spacing="6"
        justify="space-between"
        alignItems="left"
        bg="white"
        borderRadius="16px"
        shadow="xl"
        px="8"
        py="8"
        mt={8}
      >
        <Text color="gray.700" fontSize="xl" fontWeight="normal">
          Comissões Recebidas
        </Text>
        <HStack alignItems="center" justify="center" spacing="4">
          <PlusIcon width="4rem" height="4rem" stroke="#00A878" fill="none" />
          <Text color="#00A878" fontSize="2rem">
            R$ 1.200.500,00
          </Text>
        </HStack>
        <HStack align="left" justify="left" spacing="4">
          <ChartBarIcon width="20px" stroke="#6e7191" fill="none" />{' '}
          <Link to="/">
            <Text fontSize="md" color="gray.700" ml="2">
              Ver relatório
            </Text>
          </Link>
        </HStack>
      </Stack>
    </Flex>
  )
}
