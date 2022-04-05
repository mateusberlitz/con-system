import { Box, Flex, FormLabel, HStack, Stack, Switch, Text } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { CompanySelectMaster } from '../../components/CompanySelect/companySelectMaster'
import { MainBoard } from '../../components/MainBoard'
import { useProfile } from '../../hooks/useProfile'
import { TaskFilterData, useTasks } from '../../hooks/useTasks'
import { useWorkingBranch } from '../../hooks/useWorkingBranch'
import { useWorkingCompany } from '../../hooks/useWorkingCompany'
import { TasksSummary } from '../Financial/TasksSummary'
import { LeadsReport } from './LeadsReport'
import { LeadsReportByMonth } from './LeadsReportByMonth'
import { LeadsSummary } from './LeadsSummary'
import { SalesSummary } from './SalesSummary'
import { SchedulesSummary } from './SchedulesSummary'

export default function Commercial() {
  const { profile, permissions } = useProfile()
  const workingCompany = useWorkingCompany()
  const workingBranch = useWorkingBranch()

  const [page, setPage] = useState(1)

  const handleChangePage = (page: number) => {
    setPage(page)
  }

  const [tasksFilter, setTasksFilter] = useState<TaskFilterData>(() => {
    const data: TaskFilterData = {
      search: '',
      company: workingCompany.company?.id,
      branch: workingBranch.branch?.id,
      author: profile ? profile.id : 0
    }

    return data
  })

  const tasks = useTasks(tasksFilter, page);

  const [isManager, setIsManager] = useState(true);

  useEffect(() => {
    setTasksFilter({
      ...tasksFilter,
      company: workingCompany.company?.id,
      branch: workingBranch.branch?.id
    })
  }, [workingCompany, workingBranch]);

  //left={isManager ? "8px" : "auto"} right={!isManager ? "8px" : "auto"}

  return (
    <MainBoard sidebar="commercial" header={<CompanySelectMaster />}>
      <Stack fontSize="13px" spacing="12">

        <Flex alignItems="center" h="45px" bg="gray.200" borderRadius="full" w="180px" pos="relative" cursor="pointer" onClick={() => setIsManager(!isManager)}>
          <Box h="32px" w={isManager ? "77px" : "73px"} bg="orange.400" pos="absolute" transform={isManager ? "translateX(8px)" : "translateX(98px)"} transition={"all ease 0.3s"} borderRadius="full"/>

          <HStack justifyContent="space-between" w="100%" px="5" pos="absolute">
            <Text color={isManager ? "white" : "auto"} transition={"all ease 0.3s"}>Gerente</Text>
            <Text color={!isManager ? "white" : "auto"} transition={"all ease 0.3s"}>Pessoal</Text>
          </HStack>
        </Flex>

        <Stack
          direction={['column', 'column', 'row']}
          spacing="8"
          alignItems="flex-start"
        >
          {/* PAGAMENTOS */}
          <Stack spacing="8" w={['100%', '100%', '55%']}>
            <LeadsSummary />
          </Stack>

          {/* TAREFAS */}
          <Stack spacing="8" w={['100%', '100%', '45%']}>
            <TasksSummary
              tasks={tasks}
              page={page}
              setPage={handleChangePage}
            />
          </Stack>
        </Stack>

        <Stack
          direction={['column', 'column', 'row']}
          spacing="8"
          alignItems="flex-start"
        >
          {/* PAGAMENTOS */}
          <Stack spacing="8" w={['100%', '100%', '65%']}>
            <SchedulesSummary />
          </Stack>

          {/* TAREFAS */}
          <Stack spacing="8" w={['100%', '100%', '35%']}>
            <SalesSummary />
          </Stack>
        </Stack>

        <HStack spacing="8" alignItems="flex-start">
          {/* PAGAMENTOS */}
          <Stack spacing="8" w="100%">
            <LeadsReport />
          </Stack>
        </HStack>

        <LeadsReportByMonth />
      </Stack>
    </MainBoard>
  )
}
