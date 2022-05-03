import { Flex, HStack, Stack, Text, Spinner } from '@chakra-ui/react'
import { useProfile } from '../../hooks/useProfile'

import { ReactComponent as PlusIcon } from '../../assets/icons/Plus.svg'
import { ReactComponent as ChartBarIcon } from '../../assets/icons/Chart-bar.svg'

import { Link } from 'react-router-dom'
import { CompanyCommission } from '../../types'
import { useCompanyCommissions } from '../../hooks/useCompanyCommissions'


export default function CommissionsReceived() {
  const { profile, permissions } = useProfile()

  const commissionsSeller = useCompanyCommissions({
    is_chargeback: false
  }, 1);

  const totalAmount = commissionsSeller.data?.data.data.reduce((sumAmount: number, commissionsReceived: CompanyCommission) => {
    console.log(sumAmount, commissionsReceived.value)
    return sumAmount + commissionsReceived.value;
  }, 0)


  return (
    <Flex align="left" justify="left">
      <Stack w="100%" min-width="300px" spacing="6" justify="space-between" alignItems="left" bg="white" borderRadius="16px" shadow="xl" px="8" py="8" mt={8}>
        <Text color="#000" fontSize="xl" fontWeight="400">
          Comissões Recebidas
        </Text>
        {
          commissionsSeller.data ? (
            <HStack alignItems="left" justify="left" spacing="4">
            <PlusIcon width="2.5rem" height="2.5rem" stroke="#00A878" fill="none" />
            <Text color="#00A878" fontSize="24px" fontWeight="600">
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
