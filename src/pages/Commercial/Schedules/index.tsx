import { SolidButton } from '../../../components/Buttons/SolidButton'
import { CompanySelectMaster } from '../../../components/CompanySelect/companySelectMaster'
import { MainBoard } from '../../../components/MainBoard'

import { ReactComponent as PlusIcon } from '../../../assets/icons/Plus.svg'
import { ReactComponent as BackIcon } from '../../../assets/icons/Back.svg'
import { ReactComponent as ForwardIcon } from '../../../assets/icons/Forward.svg'

import { Board } from '../../../components/Board'
import {
  Flex,
  HStack,
  IconButton,
  Spinner,
  Stack,
  Text,
  Th,
  Tr
} from '@chakra-ui/react'
import { Input } from '../../../components/Forms/Inputs/Input'
import { SchedulesTable } from '../../../components/Table/SchedulesTable'
import { hours } from './HoursOfADay'
import { useEffect, useState } from 'react'
import { NewScheduleModal } from './NewScheduleModal'
import { City, Lead } from '../../../types'
import { useProfile } from '../../../hooks/useProfile'
import { api } from '../../../services/api'
import { SchedulesFilterData, useSchedules } from '../../../hooks/useSchedules'
import { useWorkingCompany } from '../../../hooks/useWorkingCompany'
import { formatYmdDate } from '../../../utils/Date/formatYmdDate'
import { ScheduleRow } from './ScheduleRow'
import { EditScheduleFormData, EditScheduleModal } from './EditScheduleModal'
import {
  ConfirmScheduleRemoveModal,
  RemoveScheduleData
} from './ConfirmScheduleRemoveModal'
import {
  CompleteScheduleFormData,
  CompleteScheduleModal
} from './CompleteScheduleModal'
import { useWorkingBranch } from '../../../hooks/useWorkingBranch'

export default function Schedules() {
  const workingCompany = useWorkingCompany()
  const workingBranch = useWorkingBranch()
  const [isNewScheduleModalOpen, setIsNewScheduleModalOpen] = useState(false)
  const { profile, permissions } = useProfile()

  const [leads, setLeads] = useState<Lead[]>([])

  const loadLeads = async () => {
    if (profile) {
      const { data } = await api.get('/leads', {
        params: {
          user: profile.id
        }
      })

      setLeads(data)
    }
  }

  const [cities, setCities] = useState<City[]>([])

  const loadCities = async () => {
    if (profile) {
      const { data } = await api.get('/cities', {
        params: {
          user: profile.id
        }
      })

      setCities(data)
    }
  }

  useEffect(() => {
    loadCities()
    loadLeads()
  }, [])

  function OpenNewScheduleModal() {
    setIsNewScheduleModalOpen(true)
  }
  function CloseNewScheduleModal() {
    setIsNewScheduleModalOpen(false)
  }

  const [isEditScheduleModalOpen, setIsEditScheduleModalOpen] = useState(false)
  const [toEditScheduleData, setToEditScheduleData] =
    useState<EditScheduleFormData>(() => {
      const data: EditScheduleFormData = {
        datetime: '',
        id: 0,
        city: '',
        lead: 0
      }

      return data
    })

  function OpenEditScheduleModal(scheduleData: EditScheduleFormData) {
    setToEditScheduleData(scheduleData)
    setIsEditScheduleModalOpen(true)
  }
  function CloseEditScheduleModal() {
    setIsEditScheduleModalOpen(false)
  }

  const [isRemoveScheduleModalOpen, setIsRemoveScheduleModalOpen] =
    useState(false)
  const [removeScheduleData, setRemoveScheduleData] =
    useState<RemoveScheduleData>(() => {
      const data: RemoveScheduleData = {
        id: 0
      }

      return data
    })

  function OpenRemoveScheduleModal(scheduleData: RemoveScheduleData) {
    setRemoveScheduleData(scheduleData)
    setIsRemoveScheduleModalOpen(true)
  }
  function CloseRemoveScheduleModal() {
    setIsRemoveScheduleModalOpen(false)
  }

  const [isCompleteScheduleModalOpen, setIsCompleteScheduleModalOpen] =
    useState(false)
  const [completeScheduleData, setCompleteScheduleData] =
    useState<CompleteScheduleFormData>(() => {
      const data: CompleteScheduleFormData = {
        id: 0
      }

      return data
    })

  function OpenCompleteScheduleModal(scheduleData: CompleteScheduleFormData) {
    setCompleteScheduleData(scheduleData)
    setIsCompleteScheduleModalOpen(true)
  }
  function CloseCompleteScheduleModal() {
    setIsCompleteScheduleModalOpen(false)
  }

  const startDate = new Date()
  const [inputStartDate, setInputStartDate] = useState(
    formatYmdDate(startDate.toString())
  )

  const endDate = new Date()
  endDate.setDate(endDate.getDate() + 7)

  const [inputEndDate, setInputEndDate] = useState(
    formatYmdDate(endDate.toString())
  )

  const handleChangeStartDate = (date: string) => {
    setInputStartDate(date)
    setFilter({ ...filter, start_date: date })
  }

  const handleChangeEndDate = (date: string) => {
    setInputEndDate(date)
    setFilter({ ...filter, end_date: date })
  }

  const [filter, setFilter] = useState<SchedulesFilterData>(() => {
    const data: SchedulesFilterData = {
      company: workingCompany.company?.id,
      branch: workingBranch.branch?.id,
      start_date: formatYmdDate(startDate.toString()),
      end_date: formatYmdDate(endDate.toDateString()),
      group_by: 'hour'
    }

    return data
  })

  const handleChangeDay = (toSum: number) => {
    const newInputStartDate = new Date()
    const newInputEndDate = new Date()

    newInputStartDate.setDate(new Date(inputStartDate).getDate() + 1 + toSum)

    newInputEndDate.setMonth(new Date(inputEndDate).getMonth())
    newInputEndDate.setDate(new Date(inputEndDate).getDate() + 1 + toSum)

    const formattedNewInputStartDate = formatYmdDate(
      newInputStartDate.toString()
    )
    const formattedNewInputEndDate = formatYmdDate(newInputEndDate.toString())

    setInputStartDate(formattedNewInputStartDate)
    setInputEndDate(formattedNewInputEndDate)

    setFilter({
      ...filter,
      end_date: formattedNewInputEndDate,
      start_date: formattedNewInputStartDate
    })
  }

  const handleAddDay = () => {
    handleChangeDay(+1)
  }

  const handleRemoveDay = () => {
    handleChangeDay(-1)
  }

  const schedules = useSchedules(filter, 1)

  let d = 0
  const schedulesDays = [{ text: '', wrap: false }]
  const toRowDays: string[] = []

  // const inputStartDateDay = new Date(inputStartDate).getDate() + 1;
  // const inputEndDateDay = new Date(inputEndDate).getDate() + 1;

  const inputStartDateDay = new Date(inputStartDate)
  const inputEndDateDay = new Date(inputEndDate)

  const newDate = new Date(inputStartDate)

  while (inputStartDateDay <= inputEndDateDay) {
    newDate.setDate(newDate.getDate() + 1)

    schedulesDays.push({
      text: newDate.toLocaleDateString('pt-BR', {
        weekday: 'short',
        day: 'numeric',
        month: 'numeric'
      }),
      wrap: true
    })
    toRowDays.push(newDate.toLocaleDateString())

    inputStartDateDay.setDate(inputStartDateDay.getDate() + 1)
    d++
  }

  useEffect(() => {
    setFilter({
      ...filter,
      company: workingCompany.company?.id,
      branch: workingBranch.branch?.id
    })
  }, [workingCompany, workingBranch])

  return (
    <MainBoard sidebar="commercial" header={<CompanySelectMaster />}>
      <NewScheduleModal
        cities={cities}
        leads={leads}
        afterCreate={schedules.refetch}
        isOpen={isNewScheduleModalOpen}
        onRequestClose={CloseNewScheduleModal}
      />
      <EditScheduleModal
        leads={leads}
        afterEdit={schedules.refetch}
        isOpen={isEditScheduleModalOpen}
        onRequestClose={CloseEditScheduleModal}
        toEditScheduleData={toEditScheduleData}
      />
      <CompleteScheduleModal
        leads={leads}
        afterEdit={schedules.refetch}
        isOpen={isCompleteScheduleModalOpen}
        onRequestClose={CloseCompleteScheduleModal}
        toCompleteScheduleData={completeScheduleData}
      />
      <ConfirmScheduleRemoveModal
        afterRemove={schedules.refetch}
        isOpen={isRemoveScheduleModalOpen}
        onRequestClose={CloseRemoveScheduleModal}
        toRemoveScheduleData={removeScheduleData}
      />

      <Board marginTop="-40px">
        <Stack
          direction={['column', 'column', 'row']}
          spacing="7"
          justifyContent="space-between"
          mb="7"
        >
          <Stack direction={['column', 'column', 'row']} spacing="4">
            <HStack>
              <IconButton
                onClick={() => handleRemoveDay()}
                h="24px"
                w="20px"
                minW="25px"
                p="0"
                float="right"
                aria-label="Voltar um dia"
                border="none"
                icon={<BackIcon width="20px" stroke="#6e7191" fill="none" />}
                variant="outline"
              />
              <IconButton
                onClick={() => handleAddDay()}
                h="24px"
                w="20px"
                minW="25px"
                p="0"
                float="right"
                aria-label="Adiantar um dia"
                border="none"
                icon={<ForwardIcon width="20px" stroke="#6e7191" fill="none" />}
                variant="outline"
              />
            </HStack>

            <HStack>
              <Input
                value={inputStartDate}
                onChange={handleChangeStartDate}
                focusBorderColor="orange.400"
                name="start_date"
                type="date"
                placeholder="Data inicial"
                variant="filled"
                maxW="240px"
              />
              <Text>Até</Text>
            </HStack>

            <Input
              value={inputEndDate}
              onChange={handleChangeEndDate}
              focusBorderColor="orange.400"
              name="end_date"
              type="date"
              placeholder="Data final"
              variant="filled"
              maxW="240px"
            />
          </Stack>

          <SolidButton
            color="white"
            bg="orange.400"
            icon={PlusIcon}
            colorScheme="orange"
            mb="10"
            onClick={() => OpenNewScheduleModal()}
          >
            Agendar
          </SolidButton>
        </Stack>

        {schedules.isLoading ? (
          <Flex justify="center" mt="4">
            <Spinner />
          </Flex>
        ) : schedules.isError ? (
          <Text fontSize="11px">Erro listar os leads</Text>
        ) : (
          schedules.data?.data.length === 0 && (
            <Text fontSize="11px">Nenhuma agendamento encontrado.</Text>
          )
        )}

        <SchedulesTable header={schedulesDays}>
          {hours.map((hour: string, index: number) => {
            const splitedHour = hour.split(':')

            return schedules.data?.data[splitedHour[0]] ? (
              // <Tr borderBottom="1px solid" borderColor="gray.200">
              //     <Th p="1" textAlign="center" borderBottom="none" borderLeft="1px solid #e2e8f0" borderRight="1px solid #e2e8f0" fontSize="11px">
              //         {hour}
              //     </Th>

              // </Tr>
              <ScheduleRow
                handleRemoveSchedule={OpenRemoveScheduleModal}
                handleEditSchedule={OpenEditScheduleModal}
                handleCompleteSchedule={OpenCompleteScheduleModal}
                key={hour}
                hour={hour}
                days={toRowDays}
                hourSchedules={schedules.data?.data[splitedHour[0]]}
              />
            ) : (
              <Tr key={hour} borderBottom="1px solid" borderColor="gray.200">
                <Th
                  p="1"
                  textAlign="center"
                  borderBottom="none"
                  borderLeft="1px solid #e2e8f0"
                  borderRight="1px solid #e2e8f0"
                  fontSize="11px"
                >
                  {hour}
                </Th>
              </Tr>
            )
          })}
        </SchedulesTable>
      </Board>
    </MainBoard>
  )
}
