import { Text, Stack, HStack, Icon } from '@chakra-ui/react'
import { Goal, Lead, Sales, Schedule } from '../../../types'
import { useProfile } from '../../../hooks/useProfile'
import { useState } from 'react'

import { LeadsFilterData, useLeads } from '../../../hooks/useLeads'
import { api } from '../../../services/api'

import { ReactComponent as CalendarIcon } from '../../../assets/icons/Calandar.svg'
import { useSchedules } from '../../../hooks/useSchedules'
import { useWorkingCompany } from '../../../hooks/useWorkingCompany'
import { useWorkingBranch } from '../../../hooks/useWorkingBranch'

interface LeadsReportByUserProps {
  filter: LeadsFilterData
}

interface groupedLeadsByStatus {
  [status: string]: Lead[]
}

export function LeadsReportByUser({ filter }: LeadsReportByUserProps) {
  const { profile } = useProfile()
  const workingCompany = useWorkingCompany()
  const workingBranch = useWorkingBranch()
  const today = new Date()

  const leads = useLeads(filter, 1)

  let leadsByStatus: groupedLeadsByStatus = {}

  leadsByStatus = leads.data?.data.reduce((groups: any, lead: Lead) => {
    const group: Lead[] =
      Object.keys(leadsByStatus).length === 0 ? [] : groups[lead.status.name]

    group.push(lead)
    groups[lead.status.name] = group

    return groups
  }, {})

  const [monthAmount, setMonthAmount] = useState(0)

  const loadMonthAmount = async () => {
    const { data } = await api.get('/month_sales_amount', {
      params: {
        company:
          workingCompany.company && workingCompany.company.id
            ? workingCompany.company?.id.toString()
            : '0',
        branch: workingBranch.branch?.id,
        user: profile ? profile.id : 0,
        month: today.getMonth() + 1
      }
    })

    setMonthAmount(data.total)
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

  const percentOfGoal = monthGoal ? (monthAmount * 100) / monthGoal.value : 0

  const schedules = useSchedules(
    {
      user: filter.user,
      start_date: filter.start_date,
      end_date: filter.end_date
    },
    1
  )

  const completedSchedules = schedules.data?.data.filter(
    (schedule: Schedule) => schedule.status == true
  ).length
  const pendingSchedules = schedules.data?.data.filter(
    (schedule: Schedule) => schedule.status == false
  ).length

  const saledSchedules = schedules.data?.data.filter(
    (schedule: Schedule) => schedule.sold == true
  ).length

  return (
    <>
      <Stack
        mb="14"
        w="100%"
        min-width="300px"
        spacing="6"
        justify="space-between"
        alignItems="left"
        bg="white"
        borderRadius="16px"
        shadow="xl"
        px={[5, 5, 8]}
        py={[5, 5, 8]}
      >
        <HStack justifyContent="space-between" mb="4">
          <HStack spacing="2">
            <Icon
              as={CalendarIcon}
              fontSize="20"
              stroke="#14142b"
              fill="none"
            />

            <Text fontSize="xl" mb="5" w="100%">
              Relatório de Leads do vendedor
            </Text>
          </HStack>
        </HStack>

        <Stack justify="space-between" direction={['column', 'column', 'row']}>
          <HStack
            spacing="5"
            w={['100%', '100%', '60%']}
            flexWrap={'wrap'}
            mb="6"
          >
            {leadsByStatus &&
              Object.keys(leadsByStatus).map(
                (status: string, index: number) => {
                  console.log(leadsByStatus[status].length)
                  return (
                    <HStack key={status}>
                      <Text color="gray.700">{status}:</Text>
                      <Text>{leadsByStatus[status].length}</Text>
                    </HStack>
                  )
                }
              )}
          </HStack>

          {/* <Divider orientation='vertical' /> */}

          {/* borderLeft="2px solid" borderColor="gray.200" */}
          <Stack
            w={['100%', '100%', '40%']}
            py="5"
            px="6"
            bg="gray.100"
            borderRadius="10"
          >
            <HStack>
              <Text color="gray.700">Visitas pendentes: </Text>{' '}
              <Text>{pendingSchedules}</Text>
            </HStack>
            <HStack>
              <Text color="gray.700">Visitas concluídas:</Text>
              <Text>{completedSchedules}</Text>
            </HStack>
            <HStack>
              <Text color="gray.700">Fechamentos: </Text>{' '}
              <Text>{saledSchedules}</Text>
            </HStack>
            <HStack>
              <Text color="gray.700">Conclusão da meta: </Text>
              <Text>{percentOfGoal}%</Text>
            </HStack>
          </Stack>
        </Stack>
      </Stack>
    </>
  )
}
