import { Flex, HStack, Stack, Text, Th, Tr } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useProfile } from '../../hooks/useProfile'
import SimpleDonout from '../../components/SimpleDonout'

export default function CommissionsGrafic() {
  const { profile, permissions } = useProfile()

  return (
    <Flex align="center" justify="center">
      <Stack width="100%" min-width="300px" spacing="6" justify="space-between" alignItems="left" bg="white" borderRadius="16px" shadow="xl" px="8" py="8" mt={8}>
        <Text color="#000" fontSize="xl" fontWeight="400">
          Comissões
        </Text>
        <HStack alignItems="center" justify="center" spacing="4">
          <SimpleDonout />
        </HStack>
      </Stack>
    </Flex>
  )
}
