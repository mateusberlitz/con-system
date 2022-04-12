import { Flex, HStack, Stack, Text, Th, Tr, Td, Link, Table, Thead, Tbody, Tfoot, TableCaption, TableContainer} from '@chakra-ui/react'
import Badge from '../../components/Badge'
import { useProfile } from '../../hooks/useProfile'
// import { Link } from 'react-router-dom'

export default function CargeBacks() {
  const { profile, permissions } = useProfile()

  return (
    <Flex align="center" justify="center">
      <Stack w="100%" min-width="300px" spacing="6" justify="space-between" alignItems="left" bg="white" borderRadius="16px" shadow="xl" px="8" py="8" mt={8}>
        <HStack align="center" justify="space-between" spacing="4">
          <Text color="#000" fontSize="xl" fontWeight="400">
            Estornos
          </Text>
        </HStack>
        <Flex align="center" justify="center">
        <TableContainer border="2px solid #D6D8E7" borderRadius={15}>
          <Table variant='simple' size="md">
            <Thead backgroundColor="#EFF0F7" maxWidth="100%" whiteSpace="nowrap">
              <Tr>
                <Th></Th>
                <Th></Th>
                <Th></Th>
                <Th isNumeric>total:</Th>
              </Tr>
            </Thead>
            <Tbody>
            <Tr>
              <Th color="gray.800" fontWeight="normal">
                <Text fontSize="8px">Data</Text>
                <Text fontSize="11px">22/01/2022</Text>
              </Th>
              <Th color="gray.800" fontWeight="normal">
                <Text fontSize="8px">Grupo-Costa</Text>
                <Text fontSize="11px">1080-320</Text>
              </Th>
              <Th color="gray.800" fontWeight="normal" fontSize="sm">
                <Text fontSize="8px">Cliente</Text>
                <Text fontSize="11px">João Garcia</Text>
              </Th>
              <Th color="green.700" fontWeight="normal" fontSize="11px" textTransform="capitalize">
                R$ 1.250,00
              </Th>
            </Tr>
            <Tr>
              <Th color="gray.800" fontWeight="normal">
                <Text fontSize="8px">Data</Text>
                <Text fontSize="11px">22/01/2022</Text>
              </Th>
              <Th color="gray.800" fontWeight="normal">
                <Text fontSize="8px">Grupo-Costa</Text>
                <Text fontSize="11px">1080-320</Text>
              </Th>
              <Th color="gray.800" fontWeight="normal" fontSize="11px">
                <Text fontSize="8px">Cliente</Text>
                <Text fontSize="11px">João Garcia</Text>
              </Th>
              <Th color="green.700" fontWeight="normal" fontSize="11px" textTransform="capitalize">
                R$ 1.250,00
              </Th>
            </Tr>
            <Tr>
              <Th color="gray.800" fontWeight="normal">
                <Text fontSize="8px">Data</Text>
                <Text fontSize="11px">22/01/2022</Text>
              </Th>
              <Th color="gray.800" fontWeight="normal">
                <Text fontSize="8px">Grupo-Costa</Text>
                <Text fontSize="11px">1080-320</Text>
              </Th>
              <Th color="gray.800" fontWeight="normal" fontSize="11px">
                <Text fontSize="8px">Cliente</Text>
                <Text fontSize="11px">João Garcia</Text>
              </Th>
              <Th color="green.700" fontWeight="normal" fontSize="11px" textTransform="capitalize">
                R$ 1.250,00
              </Th>
            </Tr>
            </Tbody>
            <Tfoot>
            <Tr>
              <Th color="gray.800" fontWeight="normal">
                <Text fontSize="8px">Data</Text>
                <Text fontSize="11px">22/01/2022</Text>
              </Th>
              <Th color="gray.800" fontWeight="normal">
                <Text fontSize="8px">Grupo-Costa</Text>
                <Text fontSize="11px">1080-320</Text>
              </Th>
              <Th color="gray.800" fontWeight="normal" fontSize="11px">
                <Text fontSize="8px">Cliente</Text>
                <Text fontSize="11px">João Garcia</Text>
              </Th>
              <Th
                color="green.700"
                fontWeight="normal"
                fontSize="11px"
                textTransform="capitalize"
              >
                R$ 1.250,00
              </Th>
            </Tr>
            </Tfoot>
          </Table>
        </TableContainer>
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