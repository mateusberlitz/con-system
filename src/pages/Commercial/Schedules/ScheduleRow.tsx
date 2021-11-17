import { Flex, Spinner, Th, Tr, Text, Stack, Tooltip, Popover, PopoverTrigger, Button, Portal, PopoverContent, PopoverArrow, PopoverHeader, PopoverCloseButton, PopoverBody } from "@chakra-ui/react";
import { EditButton } from "../../../components/Buttons/EditButton";
import { RemoveButton } from "../../../components/Buttons/RemoveButton";
import { useProfile } from "../../../hooks/useProfile";
import { SchedulesFilterData, useSchedules } from "../../../hooks/useSchedules";
import { Schedule } from "../../../types";
import { formatYmdDate } from "../../../utils/Date/formatYmdDate";
import { RemoveScheduleData } from "./ConfirmScheduleRemoveModal";
import { EditScheduleFormData } from "./EditScheduleModal";

interface ScheduleRowProps{
    hourSchedules: DaySchedule;
    hour: string;
    days: string[];
    handleEditSchedule: (scheduleData : EditScheduleFormData) => void;
    handleRemoveSchedule: (scheduleData : RemoveScheduleData) => void;
}

interface DaySchedule{
    [day: string] : Schedule[];
}

export function ScheduleRow({hourSchedules, hour, days, handleEditSchedule, handleRemoveSchedule}: ScheduleRowProps){
    const {profile} = useProfile();

    return (
        <Tr borderBottom="1px solid" borderColor="gray.200">
            <Th p="1" textAlign="center" borderBottom="none" borderLeft="1px solid #e2e8f0" borderRight="1px solid #e2e8f0" fontSize="11px">
                {hour}
            </Th>

            {
                hourSchedules && (
                    days.map((day) => {
                        const splittedDate = day.split('/');
                        const date = new Date(parseInt(splittedDate[2]), parseInt(splittedDate[1]) - 1, parseInt(splittedDate[0]));

                        const toGetSchedulesDate = formatYmdDate(date.toDateString());

                        return (
                            <Th key={Math.random().toString(36).substr(2)} minWidth="154px" p="1" borderBottom="none" borderLeft="1px solid #e2e8f0" borderRight="1px solid #e2e8f0">
                                {
                                    hourSchedules[toGetSchedulesDate] && hourSchedules[toGetSchedulesDate].map((schedule) => {
                                        const scheduleColor = (date.toDateString() == new Date().toDateString() ? 'orange' : date < new Date() ? 'red' : 'green');

                                        return profile && profile.id === schedule.user.id ? (
                                            <Popover>
                                                <PopoverTrigger>
                                                    <Stack cursor={profile && profile.id === schedule.user.id ? 'pointer' : 'alias'} key={`${schedule.city}-${schedule.user.name}-${day}-${hour}`} spacing="0" bg={`${scheduleColor}.100`} color={`${scheduleColor}.500`} p="1" textTransform="capitalize" borderRadius="4px" fontSize="11px" mb="3px">
                                                        <Text fontWeight="normal">{schedule.user.name} {schedule.user.last_name ? schedule.user.last_name.slice(0, 1) : ''}</Text>
                                                        <Text fontWeight="bold">{schedule.city}</Text>
                                                    </Stack>
                                                </PopoverTrigger>
                                                <Portal>
                                                    <PopoverContent>

                                                        <PopoverArrow />
                                                        <PopoverCloseButton />

                                                        <PopoverBody>
                                                            <EditButton onClick={() => handleEditSchedule({id: schedule.id, city: schedule.city, datetime: schedule.datetime, lead: schedule.lead ? schedule.lead.id : 0})}/>
                                                            <RemoveButton onClick={() => handleRemoveSchedule({id: schedule.id})}/>
                                                        </PopoverBody>
                                                    </PopoverContent>
                                                </Portal>
                                            </Popover>
                                        ):(
                                            <Stack onClick={() => handleEditSchedule({id: schedule.id, city: schedule.city, datetime: schedule.datetime, lead: schedule.lead ? schedule.lead.id : 0})} cursor={profile && profile.id === schedule.user.id ? 'pointer' : 'default'} key={`${schedule.city}-${schedule.user.name}-${day}-${hour}`} spacing="0" bg={`${scheduleColor}.100`} color={`${scheduleColor}.500`} p="1" textTransform="capitalize" borderRadius="4px" fontSize="11px" mb="3px">
                                                <Text fontWeight="normal">{schedule.user.name} {schedule.user.last_name ? schedule.user.last_name.slice(0, 1) : ''}</Text>
                                                <Text fontWeight="bold">{schedule.city}</Text>
                                            </Stack>
                                        )
                                    })
                                }
                                
                            </Th>
                        )
                    })
                )
            }
        </Tr>
    )
}