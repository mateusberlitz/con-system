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

    const { data } = await api.get('/quotas_amount', {
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

  const [teamMonthGoal, setTeamMonthGoal] = useState<Goal>()

  const loadTeamGoal = async () => {
    const { data } = await api.get('/goals', {
      params: {
        team_id: (profile && profile.teams.length > 0) ? profile.teams[0].id : 0,
        month: today.getMonth() + 1
      }
    })

    if (data.length > 0) {
      setMonthGoal(data[0])
    }
  }

  const [teamMonthAmount, setTeamMonthAmount] = useState(0)

  const loadTeamMonthAmount = async () => {
    const { data } = await api.get('/month_sales_amount', {
      params: {
        company:
          workingCompany.company && workingCompany.company.id
            ? workingCompany.company?.id.toString()
            : '0',
        team_id: (profile && profile.teams.length > 0) ? profile.teams[0].id : 0,
        month: today.getMonth() + 1
      }
    })

    setTeamMonthAmount(data.total);
  }

  useEffect(() => {
    loadAmount()
    loadMonthAmount()
    loadPendingSales()
    loadMonthGoal()
    loadTeamGoal();
    loadTeamMonthAmount();
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
  const teamPercentOfGoal = teamMonthGoal ? (teamMonthAmount * 100) / teamMonthGoal.value : 0

  return (
    <>
      <ListUserSalesModal
        isOpen={isListUserSalesModalOpen}
        onRequestClose={CloseListUserSalesModal}
      />

      <HStack spacing="8" width="100%">
        <Stack
          spacing="5"
          w="100%"
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

          {
            monthGoal ? (
                <>
                    <HStack>
                        <Text
                        fontSize="2xl"
                        w="100%"
                        fontWeight="500"
                        color="black"
                        >
                            {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL'}).format(monthGoal ? monthGoal.value : 0)}
                        </Text>
                    </HStack>

                    <Stack spacing="1">
                        <Progress value={percentOfGoal} size='xs' colorScheme='blue' />
                    </Stack>

                    <Stack spacing="1">
                    <HStack justifyContent={"space-between"}>
                        <Text
                            display="flex"
                            flex={1}
                            alignItems="center"
                            fontSize="sm"
                            color="gray.600"
                            >
                            Vendido:
                        </Text>
                        <Text
                            display="flex"
                            fontSize="md"
                            color="gray.700"
                        >
                            {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL'}).format(monthAmount)}({percentOfGoal})
                        </Text>
                    </HStack>
                    </Stack>
                </>
            ) : (
                <Text>Meta não encontrada.</Text>
            )
          }
        </Stack>

        <Stack
          spacing="5"
          w="100%"
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

          {
            teamMonthGoal ? (
                <>
                    <HStack>
                        <Text w="100%"  fontSize="2xl" fontWeight="500" color="black">
                            {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL'}).format(teamMonthGoal ? teamMonthGoal.value : 0)}
                        </Text>
                    </HStack>

                    <Stack spacing="1">
                        <Progress value={teamPercentOfGoal} size='xs' colorScheme='red' />
                    </Stack>

                    <Stack spacing="1">
                    <HStack justifyContent={"space-between"}>
                    <Text
                        display="flex"
                        alignItems="center"
                        fontSize="sm"
                        color="gray.600"
                        >
                        Vendido:
                        </Text>
                        <Text
                        display="flex"
                        flex="1"
                        fontSize="md"
                        color="gray.700"
                        >
                        {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL'}).format(teamPercentOfGoal)}
                        </Text>
                    </HStack>
                    </Stack>
                </>
            ) : (
                <Text>Meta não encontrada.</Text>
            )
          }
        </Stack>

        {/* <Stack
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
        </Stack> */}
      </HStack>
    </>
  )
}
