import { Flex, HStack, Stack, Text, Th, Tr, Link } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useProfile } from '../../hooks/useProfile'
import { Table } from '../../components/Table'
import { ReactComponent as PercentIcon } from '../../assets/icons/percent.svg'

export default function LastComissionsTable() {
  const { profile, permissions } = useProfile()

  return (
    <Flex>
      <Stack
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
        <HStack align="center" justify="space-between" spacing="4">
          <Text color="gray.700" fontSize="xl" fontWeight="normal">
            Ultimas Comissões
          </Text>
        </HStack>
        <Flex align="center" justify="center">
          <Table header={[]} mt={6}>
            <Tr>
              <Th color="gray.800" fontWeight="normal">
                <Text fontSize="10px">Grupo-Costa</Text>
                <Text fontSize="sm">1080-320</Text>
              </Th>
              <Th color="gray.800" fontWeight="normal">
                <Text fontSize="10px">Parcela</Text>
                <Text fontSize="sm">1</Text>
              </Th>
              <Th color="gray.800" fontWeight="normal" fontSize="sm">
                1%
              </Th>
              <Th
                color="gray.700"
                fontWeight="normal"
                fontSize="sm"
                textTransform="capitalize"
              >
                Pendente
              </Th>
              <Th
                color="green.700"
                fontWeight="normal"
                fontSize="sm"
                textTransform="capitalize"
              >
                R$ 1.250,00
              </Th>
            </Tr>
            <Tr>
              <Th color="gray.800" fontWeight="normal">
                <Text fontSize="10px">Grupo-Costa</Text>
                <Text fontSize="sm">1080-320</Text>
              </Th>
              <Th color="gray.800" fontWeight="normal">
                <Text fontSize="10px">Parcela</Text>
                <Text fontSize="sm">1</Text>
              </Th>
              <Th color="gray.800" fontWeight="normal" fontSize="sm">
                1%
              </Th>
              <Th
                color="gray.700"
                fontWeight="normal"
                fontSize="sm"
                textTransform="capitalize"
              >
                Pendente
              </Th>
              <Th
                color="green.700"
                fontWeight="normal"
                fontSize="sm"
                textTransform="capitalize"
              >
                R$ 1.250,00
              </Th>
            </Tr>
            <Tr>
              <Th color="gray.800" fontWeight="normal">
                <Text fontSize="10px">Grupo-Costa</Text>
                <Text fontSize="sm">1080-320</Text>
              </Th>
              <Th color="gray.800" fontWeight="normal">
                <Text fontSize="10px">Parcela</Text>
                <Text fontSize="sm">4</Text>
              </Th>
              <Th color="gray.800" fontWeight="normal" fontSize="sm">
                1%
              </Th>
              <Th
                color="red.700"
                fontWeight="normal"
                textAlign="center"
                fontSize="sm"
                textTransform="capitalize"
              >
                Estorno
              </Th>
              <Th
                color="red.700"
                fontWeight="normal"
                fontSize="sm"
                textTransform="capitalize"
              >
                R$ 1.250,00
              </Th>
            </Tr>
            <Tr>
              <Th color="gray.800" fontWeight="normal">
                <Text fontSize="10px">Grupo-Costa</Text>
                <Text fontSize="sm">1080-320</Text>
              </Th>
              <Th color="gray.800" fontWeight="normal">
                <Text fontSize="10px">Parcela</Text>
                <Text fontSize="sm">2</Text>
              </Th>
              <Th color="gray.800" fontWeight="normal" fontSize="sm">
                0,9%
              </Th>
              <Th
                color="green.700"
                textAlign="center"
                fontWeight="normal"
                fontSize="sm"
                textTransform="capitalize"
              >
                Confirmada
              </Th>
              <Th
                color="green.700"
                fontWeight="normal"
                fontSize="sm"
                textTransform="capitalize"
              >
                R$ 1.250,00
              </Th>
            </Tr>
          </Table>
        </Flex>
        <HStack align="right" justify="right" spacing="4">
          <Link
            href="/"
            display="flex"
            alignItems="center"
            fontSize="md"
            color="gray.700"
          >
            <PercentIcon width="20px" stroke="#6e7191" fill="none" />{' '}
            <Text ml="2">Ver relatório</Text>
          </Link>
        </HStack>
      </Stack>
    </Flex>
  )
}
