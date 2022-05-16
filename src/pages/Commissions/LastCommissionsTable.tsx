import { Flex, HStack, Stack, Text, Th, Tr, Link, Table, Thead, Tbody, Tfoot, TableContainer, Spinner} from '@chakra-ui/react'
import { HasPermission, useProfile } from '../../hooks/useProfile'
import { ReactComponent as PercentIcon } from '../../assets/icons/percent.svg'
import Badge from '../../components/Badge'
import { useWorkingCompany } from '../../hooks/useWorkingCompany'
import { useWorkingBranch } from '../../hooks/useWorkingBranch'
import { useState } from 'react'
import { CommissionsSellerFilterData, useCommissionsSeller } from '../../hooks/useCommissionsSeller'
import { SellerCommission } from '../../types'



export default function LastComissionsTable() {
  const { profile, permissions } = useProfile()

  const workingCompany = useWorkingCompany()
  const workingBranch = useWorkingBranch()

  const isManager = HasPermission(permissions, 'Comercial Completo') && !HasPermission(permissions, 'Comissões Completo');

  const [filter, setFilter] = useState<CommissionsSellerFilterData>(() => {
    const data: CommissionsSellerFilterData = {
      search: '',
      company: workingCompany.company?.id,
      branch: workingBranch.branch?.id,
      seller_id: !HasPermission(permissions, 'Comissões Completo') && !isManager ? (profile ? profile.id : 0) : undefined,
      team_id: isManager ? (profile && profile.teams.length > 0 ? profile.teams[0].id : undefined) : undefined
    };
    return data;
  });

  const commissionsSeller = useCommissionsSeller(filter, 1)

  const totalAmount = commissionsSeller.data?.data.data.reduce((sumAmount: number, useCommissionsSeller: SellerCommission) => {
    console.log("lastCommissions",sumAmount, useCommissionsSeller.value)
    return sumAmount + useCommissionsSeller.value;
  }, 0)

      return (
          <Stack min-width="300px" spacing="6" justify="space-between" alignItems="left" bg="white" borderRadius="16px" shadow="xl" py="8">
            <HStack align="center" justify="space-between" spacing="4">
              <Text color="#000" ml={2} fontSize="xl" fontWeight="400">
                Ultimas Comissões
              </Text>
            </HStack>spacing="8" justify="space-between" alignItems="left" bg="white"

            <Flex align="center" justify="center" width="100%">
              <TableContainer border="2px solid #D6D8E7" borderRadius={26} width="100%">
                <Table variant='simple' size="md">
                  <Thead backgroundColor="#EFF0F7" maxWidth="100%" whiteSpace="nowrap" height={62}>
    
                    <Tr>
                      <Th></Th>
                      <Th></Th>
                      {/* <Th></Th> */}
                      <Th></Th>
                      <Th isNumeric color="#000" fontSize="13px" px={10}> {Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(totalAmount)}</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                  {   commissionsSeller.isLoading ? (
                            <Flex align="center" justify="center">
                                <Spinner/>
                            </Flex>
                        ) : ( commissionsSeller.isError ? (
                            <Flex align="center" justify="center" mt="4" mb="4">
                                <Text>Erro listar ultimas commissões</Text>
                            </Flex>
                        ) : (commissionsSeller.data?.data.length === 0) && (
                            <Flex align="center" justify="center">
                                <Text>Nenhuma lista de commissões encontradas</Text>
                            </Flex>
                        ) ) 
                    }
                {
                    (!commissionsSeller.isError && !commissionsSeller.isLoading) && commissionsSeller.data?.data.data.map((commissionsSeller: SellerCommission) => {
                      console.log(commissionsSeller);
                        return (
                        <>
                          <Tr>
                            <Th color="gray.800" fontWeight="normal">
                              <Text fontSize="10px">Grupo-Cota</Text>
                              <Text fontSize="13px">{commissionsSeller.quota.group} - {commissionsSeller.quota.quota}</Text>
                            </Th>
                            {/* <Th color="gray.800" fontWeight="normal">
                              <Text fontSize="10px">Parcela</Text>
                              <Text fontSize="13px">{commissionsSeller.seller_commission_rule_parcel.parcel_number}</Text>
                            </Th> */}
                            <Th color="gray.800" fontWeight="normal" fontSize="13px">
                              {commissionsSeller.seller_commission_rule_parcel.percentage_to_pay}%
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
                              {Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(commissionsSeller.value)}
                            </Th>
                          </Tr>
                        </>
                        )
                      })
                    }
                  </Tbody>
                </Table>
              </TableContainer>
            </Flex>
        
    
            <HStack align="right" justify="right" spacing="4" ml={4}>
              <Link href="/" display="flex" alignItems="center" fontSize="md" ml={4} color="gray.700" mt={5}>
                <PercentIcon width="20px" stroke="#6e7191" fill="none" />{' '}
                <Text ml={4}>Ver relatório</Text>
              </Link>
            </HStack>
          </Stack>
      )
  }

