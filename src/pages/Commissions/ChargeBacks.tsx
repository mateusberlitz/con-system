import { Flex, HStack, Stack, Text, Th, Tr } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useProfile } from '../../hooks/useProfile'
import { Table } from '../../components/Table'
import { Link } from 'react-router-dom'

export default function CargeBacks() {
  const { profile, permissions } = useProfile()

  return (
    <Flex align="center" justify="center">
      <Stack
        w="100%"
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
            Estornos
          </Text>
        </HStack>
        <Flex align="center" justify="center">
          <Table header={[]} mt={6}>
            <Tr>
              <Th color="gray.800" fontWeight="normal">
                <Text fontSize="10px">Data</Text>
                <Text fontSize="sm">22/01/2022</Text>
              </Th>
              <Th color="gray.800" fontWeight="normal">
                <Text fontSize="10px">Grupo-Costa</Text>
                <Text fontSize="sm">1080-320</Text>
              </Th>
              <Th color="gray.800" fontWeight="normal" fontSize="sm">
                <Text fontSize="10px">Cliente</Text>
                <Text fontSize="sm">João Garcia</Text>
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
                <Text fontSize="10px">Data</Text>
                <Text fontSize="sm">22/01/2022</Text>
              </Th>
              <Th color="gray.800" fontWeight="normal">
                <Text fontSize="10px">Grupo-Costa</Text>
                <Text fontSize="sm">1080-320</Text>
              </Th>
              <Th color="gray.800" fontWeight="normal" fontSize="sm">
                <Text fontSize="10px">Cliente</Text>
                <Text fontSize="sm">João Garcia</Text>
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
                <Text fontSize="10px">Data</Text>
                <Text fontSize="sm">22/01/2022</Text>
              </Th>
              <Th color="gray.800" fontWeight="normal">
                <Text fontSize="10px">Grupo-Costa</Text>
                <Text fontSize="sm">1080-320</Text>
              </Th>
              <Th color="gray.800" fontWeight="normal" fontSize="sm">
                <Text fontSize="10px">Cliente</Text>
                <Text fontSize="sm">João Garcia</Text>
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
                <Text fontSize="10px">Data</Text>
                <Text fontSize="sm">22/01/2022</Text>
              </Th>
              <Th color="gray.800" fontWeight="normal">
                <Text fontSize="10px">Grupo-Costa</Text>
                <Text fontSize="sm">1080-320</Text>
              </Th>
              <Th color="gray.800" fontWeight="normal" fontSize="sm">
                <Text fontSize="10px">Cliente</Text>
                <Text fontSize="sm">João Garcia</Text>
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
          <Link to="/">
            <Text
              display="flex"
              alignItems="center"
              fontSize="md"
              color="gray.700"
              ml="2"
            >
              Ver todos estornos
            </Text>
          </Link>
        </HStack>
      </Stack>
    </Flex>
  )
}
