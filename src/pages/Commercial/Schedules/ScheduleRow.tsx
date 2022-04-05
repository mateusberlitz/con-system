import {
  Flex,
  Spinner,
  Th,
  Tr,
  Text,
  Stack,
  Tooltip,
  Popover,
  PopoverTrigger,
  Button,
  Portal,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverBody
} from '@chakra-ui/react'
import { EditButton } from '../../../components/Buttons/EditButton'
import { OutlineButton } from '../../../components/Buttons/OutlineButton'
import { RemoveButton } from '../../../components/Buttons/RemoveButton'
import { useProfile } from '../../../hooks/useProfile'
import { Schedule } from '../../../types'
import { formatYmdDate } from '../../../utils/Date/formatYmdDate'
import { CompleteScheduleFormData } from './CompleteScheduleModal'
import { RemoveScheduleData } from './ConfirmScheduleRemoveModal'
import { EditScheduleFormData } from './EditScheduleModal'

interface ScheduleRowProps {
  hourSchedules: DaySchedule
  hour: string
  days: string[]
  handleEditSchedule: (scheduleData: EditScheduleFormData) => void
  handleRemoveSchedule: (scheduleData: RemoveScheduleData) => void
  handleCompleteSchedule: (scheduleData: CompleteScheduleFormData) => void
}

interface DaySchedule {
  [day: string]: Schedule[]
}

export function ScheduleRow({
  hourSchedules,
  hour,
  days,
  handleEditSchedule,
  handleRemoveSchedule,
  handleCompleteSchedule
}: ScheduleRowProps) {
  const { profile } = useProfile()

  return (
    <Tr borderBottom="1px solid" borderColor="gray.200">
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

      {hourSchedules &&
        days.map(day => {
          const splittedDate = day.split('/')
          const date = new Date(
            parseInt(splittedDate[2]),
            parseInt(splittedDate[1]) - 1,
            parseInt(splittedDate[0])
          )

          const toGetSchedulesDate = formatYmdDate(date.toDateString())

          return (
            <Th
              key={Math.random().toString(36).substr(2)}
              minWidth="154px"
              p="1"
              borderBottom="none"
              borderLeft="1px solid #e2e8f0"
              borderRight="1px solid #e2e8f0"
            >
              {hourSchedules[toGetSchedulesDate] &&
                hourSchedules[toGetSchedulesDate].map(schedule => {
                  const scheduleColor = schedule.status
                    ? 'green'
                    : date.toDateString() == new Date().toDateString()
                    ? 'orange'
                    : date < new Date()
                    ? 'red'
                    : 'blue'

                  const bgIntensity =
                    profile && profile.id === schedule.user.id ? '400' : '100'
                  const textColor =
                    profile && profile.id === schedule.user.id
                      ? 'white'
                      : `${scheduleColor}.500`

                  return profile && profile.id === schedule.user.id ? (
                    <Popover>
                      <PopoverTrigger>
                        <Stack
                          border="1px solid"
                          cursor={
                            profile && profile.id === schedule.user.id
                              ? 'pointer'
                              : 'alias'
                          }
                          key={`${schedule.city}-${schedule.user.name}-${day}-${hour}`}
                          spacing="0"
                          bg={`${scheduleColor}.${bgIntensity}`}
                          color={textColor}
                          p="1"
                          textTransform="capitalize"
                          borderRadius="4px"
                          fontSize="11px"
                          mb="3px"
                        >
                          <Text fontWeight="normal">
                            {schedule.user.name}{' '}
                            {schedule.user.last_name
                              ? schedule.user.last_name.slice(0, 1)
                              : ''}
                          </Text>
                          <Text fontWeight="bold">{schedule.city}</Text>
                        </Stack>
                      </PopoverTrigger>
                      <Portal>
                        <PopoverContent>
                          <PopoverArrow />
                          <PopoverCloseButton />

                          <PopoverBody>
                            <Stack spacing="4">
                              {!schedule.status && (
                                <>
                                  <OutlineButton
                                    onClick={() =>
                                      handleCompleteSchedule({
                                        id: schedule.id,
                                        lead: schedule.lead && schedule.lead.id
                                      })
                                    }
                                    w="130px"
                                    h="28px"
                                    colorScheme="green"
                                    borderColor="green.400"
                                    color="green.400"
                                  >
                                    Concluir
                                  </OutlineButton>
                                  <EditButton
                                    onClick={() =>
                                      handleEditSchedule({
                                        id: schedule.id,
                                        city: schedule.city,
                                        datetime: schedule.datetime,
                                        lead: schedule.lead
                                          ? schedule.lead.id
                                          : 0
                                      })
                                    }
                                    w="130px"
                                  />
                                </>
                              )}

                              <RemoveButton
                                onClick={() =>
                                  handleRemoveSchedule({ id: schedule.id })
                                }
                                w="130px"
                              />
                            </Stack>
                          </PopoverBody>
                        </PopoverContent>
                      </Portal>
                    </Popover>
                  ) : (
                    <Stack
                      cursor={
                        profile && profile.id === schedule.user.id
                          ? 'pointer'
                          : 'default'
                      }
                      key={`${schedule.city}-${schedule.user.name}-${day}-${hour}`}
                      spacing="0"
                      bg={`${scheduleColor}.100`}
                      color={`${scheduleColor}.500`}
                      p="1"
                      textTransform="capitalize"
                      borderRadius="4px"
                      fontSize="11px"
                      mb="3px"
                    >
                      <Text fontWeight="normal">
                        {schedule.user.name}{' '}
                        {schedule.user.last_name
                          ? schedule.user.last_name.slice(0, 1)
                          : ''}
                      </Text>
                      <Text fontWeight="bold">{schedule.city}</Text>
                    </Stack>
                  )
                })}
            </Th>
          )
        })}
    </Tr>
  )
}
