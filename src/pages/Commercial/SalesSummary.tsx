import { Text, Stack, HStack } from '@chakra-ui/react'

import { useWorkingCompany } from '../../hooks/useWorkingCompany'
import { useEffect, useState } from 'react'
import { api } from '../../services/api'

import { ReactComponent as ScrollIcon } from '../../assets/icons/Scroll.svg'
import { ListUserSalesModal } from './ListUserSalesModal'
import { useProfile } from '../../hooks/useProfile'
import { Goal } from '../../types'
import { useTenant } from '../../hooks/useTenant'

interface RemoveTaskData {
  id: number
}

interface CashSummaryFilter {
  company: number | undefined
}

export function SalesSummary() {
  const workingCompany = useWorkingCompany()
  const { profile } = useProfile()
  const { prefix } = useTenant()

  const [amount, setAmount] = useState(0)

  const today = new Date()

  const loadAmount = async () => {
    const filterAmount: CashSummaryFilter = {
      company: workingCompany.company?.id
    }

    const { data } = await api.get('/sales_amount', {
      params: {
        company:
          workingCompany.company && workingCompany.company.id
            ? workingCompany.company?.id.toString()
            : '0',
        user: profile ? profile.id : 0,
        month: today.getMonth() + 1
      }
    })

    setAmount(data.total)
  }

  const [monthAmount, setMonthAmount] = useState(0)

  const loadMonthAmount = async () => {
    const { data } = await api.get('/month_sales_amount', {
      params: {
        company:
          workingCompany.company && workingCompany.company.id
            ? workingCompany.company?.id.toString()
            : '0',
        user: profile ? profile.id : 0,
        month: today.getMonth() + 1
      }
    })

    setMonthAmount(data.total)
  }

  const [pendingSales, setPendingSales] = useState(0)

  const loadPendingSales = async () => {
    const { data } = await api.get('/pendingSales', {
      params: {
        user: profile ? profile.id : 0,
        month: today.getMonth() + 1,
        year: today.getFullYear()
      }
    })

    setPendingSales(data.total)
  }

  const [monthGoal, setMonthGoal] = useState<Goal>()

  const loadMonthGoal = async () => {
    const { data } = await api.get('/goals', {
      params: {
        user: profile ? profile.id : 0,
        month: today.getMonth() + 1
      }
    })

    if (data.length > 0) {
      setMonthGoal(data[0])
    }
  }

  useEffect(() => {
    loadAmount()
    loadMonthAmount()
    loadPendingSales()
    loadMonthGoal()
  }, [workingCompany])

  const [isListUserSalesModalOpen, setIsListUserSalesModalOpen] =
    useState(false)

  function OpenListUserSalesModal() {
    setIsListUserSalesModalOpen(true)
    console.log(isListUserSalesModalOpen)
  }
  function CloseListUserSalesModal() {
    setIsListUserSalesModalOpen(false)
  }

  const percentOfGoal = monthGoal ? (monthAmount * 100) / monthGoal.value : 0

  return (
    <>
      <ListUserSalesModal
        isOpen={isListUserSalesModalOpen}
        onRequestClose={CloseListUserSalesModal}
      />

      <Stack spacing="8" width="100%">
        <Stack spacing="5" w="100%" minWidth="300px" justify="space-between" alignItems="left" bg="white" borderRadius="16px" shadow="xl" px="8" py="8">
          <Text fontSize="xl" w="100%">
            Seu Mês
          </Text>

          <HStack>
            <Text fontSize="2xl" w="100%" fontWeight="bold" color={
                percentOfGoal !== 100
                  ? percentOfGoal > 60
                    ? 'yellow.400'
                    : percentOfGoal > 30
                    ? 'orange.400'
                    : 'red.400'
                  : 'green.400'
              }
            >
              {Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(monthAmount)}
            </Text>
            <Text display="flex" alignItems="center" fontSize="sm" color="gray.600">
              {percentOfGoal}%
            </Text>
          </HStack>

          <Stack spacing="1">
            <Text href="/caixa" display="flex" alignItems="center" fontSize="sm" color="gray.600">
              Pendência de venda
            </Text>
            <Text href="/caixa" display="flex" alignItems="center" fontSize="md" color="gray.700">
              {Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(pendingSales)}
            </Text>
          </Stack>
        </Stack>

        <Stack spacing="5" w="100%" minWidth="300px" justify="space-between" alignItems="left" bg="white" borderRadius="16px" shadow="xl" px="8" py="8">
          <HStack>
            <Text fontSize="xl" w="100%">
              Meta do mês
            </Text>
            <Text href="/caixa" display="flex" alignItems="center" fontSize="sm" color="gray.600">
              {monthGoal ? '' : 'Indefinida'}
            </Text>
          </HStack>

          <HStack>
            <Text fontSize="xl" w="100%" fontWeight="semibold" color="gray.800">
              {Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(monthGoal ? monthGoal.value : 0)}
            </Text>
          </HStack>

          <Stack spacing="1">
            <Text href="/caixa" display="flex" alignItems="center" fontSize="sm" color="gray.600">
              Visitas
            </Text>
            <Text href="/caixa" display="flex" alignItems="center" fontSize="md" color="gray.700">
              {monthGoal?.visits}
            </Text>
          </Stack>

          <Stack spacing="1">
            <Text href="/caixa" display="flex" alignItems="center" fontSize="sm" color="gray.600">
              Fechamentos
            </Text>
            <Text href="/caixa" display="flex" alignItems="center" fontSize="md" color="gray.700">
              {monthGoal?.sales}
            </Text>
          </Stack>
        </Stack>

        <Stack spacing="5" w="100%" minWidth="300px" justify="space-between" alignItems="left" bg="white" borderRadius="16px" shadow="xl" px="8" py="8">
          <Text fontSize="xl" w="100%">
            Total de vendas
          </Text>

          <Text fontSize="2xl" w="100%" fontWeight="bold" color={amount > 0 ? 'green.400' : 'red.400'}>
            {Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(amount)}
          </Text>

          <Text onClick={() => OpenListUserSalesModal()} cursor="pointer" display="flex" alignItems="center" fontSize="md" color="gray.700">
            <ScrollIcon width="20px" stroke="#6e7191" fill="#6e7191" />{' '}
            <Text ml="2">Ver histórico de vendas</Text>
          </Text>
        </Stack>
      </Stack>
    </>
  )
}
