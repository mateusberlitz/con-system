import { Text, Stack, HStack, Progress, Flex } from '@chakra-ui/react'

import { useWorkingCompany } from '../../hooks/useWorkingCompany'
import { useEffect, useState } from 'react'
import { api } from '../../services/api'

import { ReactComponent as ScrollIcon } from '../../assets/icons/Scroll.svg'
import { ReactComponent as Forward} from '../../assets/icons/Forward.svg'
import { ListUserSalesModal } from './ListUserSalesModal'
import { useProfile } from '../../hooks/useProfile'
import { Goal } from '../../types'
import { useTenant } from '../../hooks/useTenant'

interface CashSummaryFilter {
  company: number | undefined
}

export function CurrentGoal() {
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

      <HStack spacing="8" width="100%">
        <Stack
          spacing="5"
          minWidth="300px"
          justify="space-between"
          alignItems="left"
          bg="white"
          borderRadius="16px"
          shadow="xl"
          px="8"
          py="8"
        >
          <Text fontSize="xl" w="100%">
            Meta Atual
          </Text>

          <HStack>
            <Text
              fontSize="2xl"
              w="100%"
              fontWeight="500"
              color="black"
              >
                  R$200.000,00
            </Text>
          </HStack>

          <Stack spacing="1">
          <Progress value={20} size='xs' colorScheme='blue' />
          </Stack>

          <Stack spacing="1">
           <HStack>
           <Text
              href="/"
              display="flex"
              flex={1}
              alignItems="center"
              fontSize="sm"
              color="gray.600"
            >
              Vendido:
            </Text>
            <Text
              href="/"
              display="flex"
              flex={1}
              fontSize="md"
              color="gray.700"
            >
              R$188.000,00
            </Text>
           </HStack>
          </Stack>
        </Stack>

        <Stack
          spacing="5"
          w="100%"
          minWidth="300px"
          justify="space-between"
          alignItems="left"
          bg="white"
          borderRadius="16px"
          shadow="xl"
          px="8"
          py="8"
        >
          <HStack>
            <Text fontSize="xl" w="100%">
              Meta da Equipe
            </Text>
          </HStack>

          <HStack>
            <Text w="100%"  fontSize="2xl" fontWeight="500" color="black">
                 R$5.000.000,00
            </Text>
          </HStack>

          <Stack spacing="1">
            <Progress value={20} size='xs' colorScheme='red' />
          </Stack>

          <Stack spacing="1">
           <HStack>
           <Text
              href="/"
              display="flex"
              flex="1"
              alignItems="center"
              fontSize="sm"
              color="gray.600"
            >
              Vendido:
            </Text>
            <Text
              href="/"
              display="flex"
              flex="1"
              fontSize="md"
              color="gray.700"
            >
              R$800.000,00
            </Text>
           </HStack>
          </Stack>
        </Stack>

        <Stack
          spacing="5"
          w="100%"
          minWidth="300px"
          justify="space-between"
          alignItems="left"
          bg="white"
          borderRadius="16px"
          shadow="xl"
          px="8"
          py="8"
        >
          <Text fontSize="xl" w="100%"  mb={6}>
            Atividades do dia
          </Text>
        
        <Flex>
          <Text
            fontSize="2xl"
            w="100%"
            fontWeight="bold"
            color='green.400'
          >
            1054
          </Text>
        </Flex>
         
          <Text
            onClick={() => OpenListUserSalesModal()}
            cursor="pointer"
            display="flex"
            alignItems="center"
            fontSize="xl"
            color="gray.700"
          >
            <Text ml="2">Acima da média</Text>
          </Text>
        </Stack>
      </HStack>
    </>
  )
}
