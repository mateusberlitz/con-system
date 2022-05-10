import { Flex, HStack, Spinner, Stack, Text } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { HasPermission, useProfile } from '../../hooks/useProfile'

import { ReactComponent as ChartBarIcon } from '../../assets/icons/Chart-bar.svg'
import { ReactComponent as Minus } from '../../assets/icons/Minus.svg'
import { ReactComponent as PlusIcon } from '../../assets/icons/Plus.svg'

import { Link } from 'react-router-dom'
import { SellerCommission } from '../../types'
import { useCommissionsSeller } from '../../hooks/useCommissionsSeller'
import { useWorkingCompany } from '../../hooks/useWorkingCompany'
import { useWorkingBranch } from '../../hooks/useWorkingBranch'

export default function CommissionsPaid() {
  const { profile, permissions } = useProfile()
  const workingCompany = useWorkingCompany();
  const workingBranch = useWorkingBranch();

  const isManager = HasPermission(permissions, 'Comercial Completo') && !HasPermission(permissions, 'Comissões Completo');

  const commissionsSeller = useCommissionsSeller({
    is_chargeback: false,
    company: workingCompany.company?.id,
    branch: workingBranch.branch?.id,
    seller_id: !HasPermission(permissions, 'Comissões Completo') && !isManager ? (profile ? profile.id : 0) : undefined,
    team_id: isManager ? (profile && profile.teams.length > 0 ? profile.teams[0].id : undefined) : undefined
  }, 1);

  const totalAmount = commissionsSeller.data?.data.data.reduce((sumAmount: number, useCommissionsSeller: SellerCommission) => {
    console.log(sumAmount, useCommissionsSeller.value)
    return sumAmount + useCommissionsSeller.value;
  }, 0)

  return (
    <Flex align="left" justify="left">
      <Stack w="100%" min-width="300px" spacing="6" justify="space-between" alignItems="left" bg="white" borderRadius="16px" shadow="xl" px="8" py="8" mt={8}>
        <Text color="#000" fontSize="xl" fontWeight="400">
          {HasPermission(permissions, 'Comissões Completo') ? "Comissões Pagas" : "Comissões Recebidas"}
        </Text>
        {
          commissionsSeller.data ? (
        <HStack alignItems="left" justify="left" spacing="4">
          {
            HasPermission(permissions, 'Comissões Completo') ? 
            <Minus width="2.5rem" height="2.5rem" stroke="#F4B740" fill="none" />
            : <PlusIcon width="2.5rem" height="2.5rem" stroke="#00A878" fill="none" />
          }
          <Text color={ HasPermission(permissions, 'Comissões Completo') ? "#F4B740" : "#00A878"} fontSize="24px" fontWeight="600">
            {' '}
            {Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(totalAmount)}
          </Text>
        </HStack>
          ) : (
            <Spinner/>
          )
        }
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
