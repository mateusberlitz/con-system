import { Flex, HStack, Stack, Text, Th, Tr, Link, Table, Thead, Tbody, Tfoot, TableContainer} from '@chakra-ui/react'
import { useProfile } from '../../hooks/useProfile'
import { ReactComponent as PercentIcon } from '../../assets/icons/percent.svg'
import Badge from '../../components/Badge'
import { SellerCommission } from '../../types'


interface SellerCommissionProps{
  commissionsSeller: SellerCommission[];
  monthName: string;
}

export default function LastComissionsTable({commissionsSeller}: SellerCommissionProps) {
  const { profile, permissions } = useProfile()

  const totalMonthAmount = commissionsSeller.reduce((sumAmount:number, useCommissionsSeller:SellerCommission) => {
    return sumAmount + useCommissionsSeller.value;
  }, 0);


  return (
    <Flex w="100%" align="center" justify="center" width="100%">
      <Stack spacing="8" justify="space-between" alignItems="left" bg="white" borderRadius="16px" shadow="xl" px="8" py="8">
        <HStack align="center" justify="space-between" spacing="4">
          <Text color="#000" fontSize="xl" fontWeight="400">
            Ultimas Comissões
          </Text>
        </HStack>

        <Flex align="center" justify="center" width="100%">
          <TableContainer border="2px solid #D6D8E7" borderRadius={26} width="100%">
            <Table variant='simple' size="md">
              <Thead backgroundColor="#EFF0F7" maxWidth="100%" whiteSpace="nowrap" height={62}>
                <Tr>
                  <Th></Th>
                  <Th></Th>
                  <Th></Th>
                  <Th></Th>
                  <Th isNumeric color="#000" fontSize="13px" px={10}>total:</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr color="gray.800" fontWeight="normal">
                  <Th>
                    <Text fontSize="10px">Grupo-Costa</Text>
                    <Text fontSize="13px">1080-320</Text>
                  </Th>
                  <Th>
                    <Text fontSize="10px">Parcela</Text>
                    <Text fontSize="13px">1</Text>
                  </Th>
                  <Th color="gray.800" fontWeight="normal" fontSize="13px">
                    1%
                  </Th>
                  <Th>
                  {
                    !commissionsSeller.is_chargeback ? (
                      <Badge colorScheme={commissionsSeller.confirmed ? "green" : "yellow"} width="110px" px="27px">{commissionsSeller.confirmed ? "Confirmada" : "Pendente"}</Badge>
                    ) : (
                    <Badge colorScheme="red" width="110px" px="27px">Estorno</Badge>
                        )
                    }
                  </Th>
                  <Th fontWeight="bold" fontSize="13px" textTransform="capitalize" color={commissionsSeller.is_chargeback ? "red.400" : commissionsSeller.confirmed ? "green.400" : "gray.800"}>
                    {Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(totalMonthAmount)}
                  </Th>
                </Tr>
                <Tr>
                  <Th color="gray.800" fontWeight="normal">
                    <Text fontSize="10px">Grupo-Costa</Text>
                    <Text fontSize="13px">1080-320</Text>
                  </Th>
                  <Th color="gray.800" fontWeight="normal">
                    <Text fontSize="10px">Parcela</Text>
                    <Text fontSize="13px">1</Text>
                  </Th>
                  <Th color="gray.800" fontWeight="normal" fontSize="13px">
                    1%
                  </Th>
                  <Th>
                    <Badge colorScheme='yellow'>Pendente</Badge>
                  </Th>
                  <Th color="#00BA88" fontWeight="bold" fontSize="13px" textTransform="capitalize">
                    R$ 1.250,00
                  </Th>
                </Tr>
              <Tr>
                  <Th color="gray.800" fontWeight="normal">
                    <Text fontSize="10px">Grupo-Costa</Text>
                    <Text fontSize="13px">1080-320</Text>
                  </Th>
                  <Th color="gray.800" fontWeight="normal">
                    <Text fontSize="10px">Parcela</Text>
                    <Text fontSize="13px">1</Text>
                  </Th>
                  <Th color="gray.800" fontWeight="normal" fontSize="13px">
                    1%
                  </Th>
                  <Th>
                      <Badge colorScheme="red" px={25}>Estorno</Badge>
                  </Th>
                  <Th color="#C30052" fontWeight="bold" fontSize="13px" textTransform="capitalize">
                    R$ 1.250,00
                  </Th>
                </Tr>
              </Tbody>
              <Tfoot>
              <Tr>
                  <Th color="gray.800" fontWeight="normal">
                    <Text fontSize="10px">Grupo-Costa</Text>
                    <Text fontSize="13px">1080-320</Text>
                  </Th>
                  <Th color="gray.800" fontWeight="normal">
                    <Text fontSize="10px">Parcela</Text>
                    <Text fontSize="13px">1</Text>
                  </Th>
                  <Th color="gray.800" fontWeight="normal" fontSize="13px">
                    1%
                  </Th>
                  <Th>
                    <Badge colorScheme='green'>Pendente</Badge>
                  </Th>
                  <Th color="#00BA88" fontWeight="bold" fontSize="13px" textTransform="capitalize">
                    R$ 1.250,00
                  </Th>
                </Tr>
              </Tfoot>
            </Table>
          </TableContainer>
        </Flex>

        <HStack align="right" justify="right" spacing="4">
          <Link href="/" display="flex" alignItems="center" fontSize="md" color="gray.700" mt={5}>
            <PercentIcon width="20px" stroke="#6e7191" fill="none" />{' '}
            <Text ml="2">Ver relatório</Text>
          </Link>
        </HStack>
      </Stack>
    </Flex>
  )
}
