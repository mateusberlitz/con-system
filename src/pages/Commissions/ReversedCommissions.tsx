import { Flex, HStack, Spinner, Stack, Text, Th, Tr } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useProfile } from '../../hooks/useProfile'

import { ReactComponent as PlusIcon } from '../../assets/icons/Plus.svg'
import { ReactComponent as ChartBarIcon } from '../../assets/icons/Chart-bar.svg'

import { Link } from 'react-router-dom'
import { useCommissionsSeller } from '../../hooks/useCommissionsSeller'
import { CompanyCommission, SellerCommission } from '../../types'
import { useCompanyCommissions } from '../../hooks/useCompanyCommissions'

export default function ReversedCommissions() {
  const { profile, permissions } = useProfile()

  const commissionsCompany = useCompanyCommissions({
    is_chargeback: true,
    }, 1);

  const totalAmount = commissionsCompany.data?.data.data.reduce((sumAmount: number, useCompanyCommissions: CompanyCommission) => {
    console.log(sumAmount, useCompanyCommissions.value)
    return sumAmount + useCompanyCommissions.value;
  }, 0)

  return (
    <Flex align="left" justify="left">
      <Stack w="100%" min-width="300px" spacing="6" justify="space-between" alignItems="left" bg="white" borderRadius="16px" shadow="xl" px="8" py="8" mt={8}>
        <Text color="#000" fontSize="xl" fontWeight="400">
          Comissões estornadas
        </Text>
        {
          commissionsCompany.data ? (
        <HStack alignItems="left" justify="left" spacing="4">
          <PlusIcon width="2.5rem" height="2.5rem" stroke="#C30052" fill="none" />
          <Text color="#C30052" fontSize="24px" fontWeight="600">
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
