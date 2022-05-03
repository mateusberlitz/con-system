import { Flex, HStack, Stack, Text } from '@chakra-ui/react'
import { useProfile } from '../../hooks/useProfile'

import { ReactComponent as PlusIcon } from '../../assets/icons/Plus.svg'
import { ReactComponent as ChartBarIcon } from '../../assets/icons/Chart-bar.svg'

import { Link } from 'react-router-dom'
import { SellerCommission } from '../../types'

interface CommissionsReceivedProps {
  monthName: string;
  commissionsReceived: SellerCommission[];
}

export default function CommissionsReceived({monthName: string, commissionsReceived}: CommissionsReceivedProps) {
  const { profile, permissions } = useProfile()

  const totalMonthAmount = commissionsReceived.reduce((sumAmount: number, commissionsReceived: SellerCommission) => {
    console.log(sumAmount, commissionsReceived.value)
    return sumAmount + commissionsReceived.value;
  }, 0)


  return (
    <Flex align="left" justify="left">
      <Stack w="100%" min-width="300px" spacing="6" justify="space-between" alignItems="left" bg="white" borderRadius="16px" shadow="xl" px="8" py="8" mt={8}>
        <Text color="#000" fontSize="xl" fontWeight="400">
          Comissões Recebidas
        </Text>
        <HStack alignItems="left" justify="left" spacing="4">
          <PlusIcon width="2.5rem" height="2.5rem" stroke="#00A878" fill="none" />
          <Text color="#00A878" fontSize="24px" fontWeight="600">
          {Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(totalMonthAmount)}
          </Text>
        </HStack>
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
