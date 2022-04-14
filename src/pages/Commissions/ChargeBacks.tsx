import { Flex, HStack, Stack, Text, Th, Tr, Td, Link, Table, Thead, Tbody, Tfoot, TableCaption, TableContainer} from '@chakra-ui/react'
import Badge from '../../components/Badge'
import { useProfile } from '../../hooks/useProfile'
// import { Link } from 'react-router-dom'

export default function CargeBacks() {
  const { profile, permissions } = useProfile()

  return (
    <Flex align="center" justify="center">
      <Stack width="100%" min-width="300px" spacing="6" justify="space-between" alignItems="left" bg="white" borderRadius="16px" shadow="xl" px="8" py="8" mt={8}>
        <HStack align="center" justify="space-between" spacing="4">
          <Text color="#000" fontSize="xl" fontWeight="400">
            Estornos
          </Text>
        </HStack>
        <Flex align="center" justify="center" min-width="100%">
        <TableContainer border="2px solid #D6D8E7" borderRadius={26}>
          <Table variant='simple' size="sm" height="280px">
            <Thead backgroundColor="#EFF0F7" whiteSpace="nowrap"  height="62px">
              <Tr>
                <Th></Th>
                <Th></Th>
                <Th></Th>
                <Th isNumeric color="#000" fontSize="13px">total:</Th>
              </Tr>
            </Thead>
            <Tbody>
            <Tr>
              <Th color="gray.800" fontWeight="normal">
                <Text fontSize="10px">Data</Text>
                <Text fontSize="13px">22/01/2022</Text>
              </Th>
              <Th color="gray.800" fontWeight="normal">
                <Text fontSize="10px">Grupo-Costa</Text>
                <Text fontSize="13px">1080-320</Text>
              </Th>
              <Th color="gray.800" fontWeight="normal" fontSize="sm">
                <Text fontSize="10px">Cliente</Text>
                <Text fontSize="13px">João Garcia</Text>
              </Th>
              <Th color="green.700" fontWeight="normal" fontSize="13px" textTransform="capitalize">
                R$ 1.250,00
              </Th>
            </Tr>
            <Tr>
              <Th color="gray.800" fontWeight="normal">
                <Text fontSize="10px">Data</Text>
                <Text fontSize="13px">22/01/2022</Text>
              </Th>
              <Th color="gray.800" fontWeight="normal">
                <Text fontSize="10px">Grupo-Costa</Text>
                <Text fontSize="13px">1080-320</Text>
              </Th>
              <Th color="gray.800" fontWeight="normal" fontSize="13px">
                <Text fontSize="10px">Cliente</Text>
                <Text fontSize="13px">João Garcia</Text>
              </Th>
              <Th color="green.700" fontWeight="normal" fontSize="13px" textTransform="capitalize">
                R$ 1.250,00
              </Th>
            </Tr>
            <Tr>
              <Th color="gray.800" fontWeight="normal">
                <Text fontSize="10px">Data</Text>
                <Text fontSize="13px">22/01/2022</Text>
              </Th>
              <Th color="gray.800" fontWeight="normal">
                <Text fontSize="10px">Grupo-Costa</Text>
                <Text fontSize="13px">1080-320</Text>
              </Th>
              <Th color="gray.800" fontWeight="normal" fontSize="13px">
                <Text fontSize="10px">Cliente</Text>
                <Text fontSize="13px">João Garcia</Text>
              </Th>
              <Th color="green.700" fontWeight="normal" fontSize="13px" textTransform="capitalize">
                R$ 1.250,00
              </Th>
            </Tr>
            </Tbody>
            <Tfoot>
            <Tr height="50px">
              <Th color="gray.800" fontWeight="normal">
                <Text fontSize="10px">Data</Text>
                <Text fontSize="13px">22/01/2022</Text>
              </Th>
              <Th color="gray.800" fontWeight="normal">
                <Text fontSize="10px">Grupo-Costa</Text>
                <Text fontSize="13px">1080-320</Text>
              </Th>
              <Th color="gray.800" fontWeight="normal" fontSize="13px">
                <Text fontSize="10px">Cliente</Text>
                <Text fontSize="13px">João Garcia</Text>
              </Th>
              <Th
                color="green.700"
                fontWeight="normal"
                fontSize="13px"
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
