import { Flex, HStack, Stack, Text } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useProfile } from '../../hooks/useProfile'

import { ReactComponent as ChartBarIcon } from '../../assets/icons/Chart-bar.svg'
import { ReactComponent as Minus } from '../../assets/icons/Minus.svg'

import { Link } from 'react-router-dom'

export default function CommissionsPaid() {
  const { profile, permissions } = useProfile()

  return (
    <Flex align="left" justify="left">
      <Stack w="100%" min-width="300px" spacing="6" justify="space-between" alignItems="left" bg="white" borderRadius="16px" shadow="xl" px="8" py="8" mt={8}>
        <Text color="#000" fontSize="xl" fontWeight="400">
          Comissões Pagas
        </Text>
        <HStack alignItems="left" justify="left" spacing="4">
          <Minus width="2.5rem" height="2.5rem" stroke="#F4B740" fill="none" />
          <Text color="#F4B740" fontSize="24px" fontWeight="600">
            {' '}
            R$ 2.200.500,00
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
