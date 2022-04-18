import { Flex, HStack, Stack, Text, Th, Tr, Td, Link, Table, Thead, Tbody, Tfoot, TableContainer} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useProfile } from '../../hooks/useProfile'
import { ReactComponent as PercentIcon } from '../../assets/icons/percent.svg'
import Badge from '../../components/Badge'

export default function ChargeBacks() {
  const { profile, permissions } = useProfile()

  return (
    <Flex align="center" justify="center">
      <Stack min-width="300px" spacing="6" justify="space-between" alignItems="left" bg="white" borderRadius="16px" shadow="xl" px="8" py="8" mt={8}>
        <HStack align="center" justify="space-between" spacing="4">
          <Text color="#000" fontSize="xl" fontWeight="400" mb={5}>
            Ultimas Comissões
          </Text>
        </HStack>
        <Flex align="center" justify="center" height="250px">
        <TableContainer border="2px solid #D6D8E7" borderRadius={26}>
          <Table variant='simple' size="md">
            <Thead backgroundColor="#EFF0F7" maxWidth="100%" whiteSpace="nowrap" height={62}>
              <Tr>
                <Th></Th>
                <Th></Th>
                <Th></Th>
                <Th></Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr color="gray.800" fontWeight="normal">
                <Th>
                  <Text fontSize="10px">Data</Text>
                  <Text fontSize="13px">22/01/2022</Text>
                </Th>
                <Th>
                  <Text fontSize="10px">Grupo-Cota</Text>
                  <Text fontSize="13px">180-320</Text>
                </Th>
                <Th>
                  <Text fontSize="10px">Cliente</Text>
                  <Text fontSize="13px">João Garcia</Text>
                </Th>
                <Th color="#C30052" fontWeight="bold" fontSize="13px" textTransform="capitalize">
                  R$ 500,00
                </Th>
              </Tr>
              <Tr color="gray.800" fontWeight="normal">
                <Th>
                  <Text fontSize="10px">Data</Text>
                  <Text fontSize="13px">22/01/2022</Text>
                </Th>
                <Th>
                  <Text fontSize="10px">Grupo-Cota</Text>
                  <Text fontSize="13px">180-320</Text>
                </Th>
                <Th>
                  <Text fontSize="10px">Cliente</Text>
                  <Text fontSize="13px">João Garcia</Text>
                </Th>
                <Th color="#C30052" fontWeight="bold" fontSize="13px" textTransform="capitalize">
                  R$ 500,00
                </Th>
              </Tr>
              <Tr color="gray.800" fontWeight="normal">
                <Th>
                  <Text fontSize="10px">Data</Text>
                  <Text fontSize="13px">22/01/2022</Text>
                </Th>
                <Th>
                  <Text fontSize="10px">Grupo-Cota</Text>
                  <Text fontSize="13px">180-320</Text>
                </Th>
                <Th>
                  <Text fontSize="10px">Cliente</Text>
                  <Text fontSize="13px">João Garcia</Text>
                </Th>
                <Th color="#C30052" fontWeight="bold" fontSize="13px" textTransform="capitalize">
                  R$ 500,00
                </Th>
              </Tr>
            </Tbody>
            <Tfoot>
            <Tr color="gray.800" fontWeight="normal">
                <Th>
                  <Text fontSize="10px">Data</Text>
                  <Text fontSize="13px">22/01/2022</Text>
                </Th>
                <Th>
                  <Text fontSize="10px">Grupo-Cota</Text>
                  <Text fontSize="13px">180-320</Text>
                </Th>
                <Th>
                  <Text fontSize="10px">Cliente</Text>
                  <Text fontSize="13px">João Garcia</Text>
                </Th>
                <Th color="#C30052" fontWeight="bold" fontSize="13px" textTransform="capitalize">
                  R$ 500,00
                </Th>
              </Tr>
            </Tfoot>
          </Table>
        </TableContainer>

        </Flex>
        <HStack align="right" justify="right" spacing="4" mt={5}>
          <Link href="/" display="flex" alignItems="center" fontSize="md" color="gray.700" mt={5}>
            <PercentIcon width="20px" stroke="#6e7191" fill="none" />{' '}
            <Text ml="2">Ver todos estornos</Text>
          </Link>
        </HStack>
      </Stack>
    </Flex>
  )
}