import { Text, Stack, Flex, Tag, IconButton, Spinner, HStack, useToast } from "@chakra-ui/react";

import { ReactComponent as CloseIcon } from '../../assets/icons/Close.svg';
import { ReactComponent as CheckIcon } from '../../assets/icons/Check.svg';
import { ReactComponent as PlusIcon } from '../../assets/icons/Plus.svg';

import { SolidButton } from "../../components/Buttons/SolidButton";
import { useState } from "react";
import { formatYmdDate } from "../../utils/Date/formatYmdDate";
import { NewTaskModal } from "../Tasks/NewTaskModal";
import { Task } from "../../types";
import { formatDate } from "../../utils/Date/formatDate";
import { getDay } from "../../utils/Date/getDay";
import { formatBRDate } from "../../utils/Date/formatBRDate";
import { getHour } from "../../utils/Date/getHour";
import { dateObject } from "../../utils/Date/dateObject";
import { ConfirmTaskRemoveModal } from "../Tasks/ConfirmTaskRemoveModal";
import { api } from "../../services/api";
import { showErrors } from "../../hooks/useErrors";
import { Pagination } from "../../components/Pagination";
import { UseQueryResult } from "react-query";
import { CheckSquare } from "react-feather";

interface RemoveTaskData{
    id: number;
}

interface TasksSummaryProps{
    tasks: UseQueryResult<{
        data: any;
        total: number;
    }, unknown>;
    page: number;
    setPage: (page:number) => void;
}

export function TasksSummary({tasks, page, setPage}: TasksSummaryProps){

    const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);

    function OpenNewTaskModal(){
        setIsNewTaskModalOpen(true);
    }
    function CloseNewTaskModal(){
        setIsNewTaskModalOpen(false);
    }

    const [isConfirmRemoveTaskModalOpen, setIsConfirmRemoveTaskModalOpen] = useState(false);
    const [removeTaskData, setRemoveTaskData] = useState<RemoveTaskData>(() => {

        const data: RemoveTaskData = {
            id: 0,
        };
        
        return data;
    });


    function OpenConfirmRemoveTaskModal(taskRemoveData: RemoveTaskData){
        setRemoveTaskData(taskRemoveData);
        setIsConfirmRemoveTaskModalOpen(true);
    }
    function CloseConfirmRemoveTaskModal(){
        setIsConfirmRemoveTaskModalOpen(false);
    }

    const toast = useToast();

    const handleCheckTask = async (taskId: number) => {
        try{
            await api.post(`/tasks/check/${taskId}`);

            toast({
                title: "Sucesso",
                description: `A tarefa foi concluída`,
                status: "success",
                duration: 12000,
                isClosable: true,
            });

            tasks.refetch();
        }catch(error){
            showErrors(error, toast);
        }
    }

    // useEffect(() => {
    //     console.log(company?.id);
    //     const updatedFilter = filter;
    //     updatedFilter.company = company?.id;

    //     setFilter(updatedFilter);
    // }, [company, setFilter])

    return(
        <>
        <NewTaskModal afterCreate={tasks.refetch} isOpen={isNewTaskModalOpen} onRequestClose={CloseNewTaskModal}/>
        <ConfirmTaskRemoveModal toRemoveTaskData={removeTaskData} afterRemove={tasks.refetch} isOpen={isConfirmRemoveTaskModalOpen} onRequestClose={CloseConfirmRemoveTaskModal}/>

        <Stack spacing="5" w="100%" minWidth="300px" justify="space-between" alignItems="left" bg="white" borderRadius="16px" shadow="xl" px={[5,5,8]} py={[5,5,8]}>
            <Stack direction={["column", "column", "row"]} justifyContent="space-between" mb="4">
                <HStack spacing="2">
                    <CheckSquare/>
                    <Text fontSize="xl" mb="5" w="100%">Tarefas</Text>
                </HStack>

                <SolidButton onClick={OpenNewTaskModal} color="white" bg="blue.400" height="32px" icon={PlusIcon} colorScheme="blue" fontSize="12px">
                    Adicionar
                </SolidButton>
            </Stack>

            {   tasks.isLoading ? (
                    <Flex justify="center">
                        <Spinner/>
                    </Flex>
                ) : ( tasks.isError ? (
                    <Flex justify="center" mt="4" mb="4">
                        <Text>Erro listar as tarefas</Text>
                    </Flex>
                ) : (tasks.data?.data.length === 0) && (
                    <Flex justify="center">
                        <Text>Nenhuma tarefa encontrada.</Text>
                    </Flex>
                ) ) 
            }


            {
                (!tasks.isLoading && !tasks.error) && Object.keys(tasks.data?.data).map((day:string) => {
                    const totalDayPayments = tasks.data?.data[day].length;

                    const todayFormatedDate = formatDate(formatYmdDate(new Date().toDateString()));
                    const dayPaymentsFormated = formatDate(day);
                    const tomorrow = getDay(formatYmdDate(new Date().toDateString())) + 1;
                    const paymentDay = getDay(day);

                    //const hasPaymentsYoPay = tasks.data?.data[day].filter((task:Task) => Number(task.status) === 0).length;

                    const taskDate = dateObject(day);

                    return (
                        <Stack key={day}>
                            <Flex>
                                <Text fontSize="sm" fontWeight="semibold" color="gray.800" mr="4">{(todayFormatedDate === dayPaymentsFormated) ? '' : (tomorrow === paymentDay) ? "" : ""} {formatBRDate(day)}</Text>
                                <hr style={{marginTop:"10px", width: "100%", borderTopWidth: "2px"}}/>
                            </Flex>

                            <Stack spacing="4">
                            {
                                tasks.data?.data[day].map((task:Task) => {
                                    const statusColor = (task.status ? 'green.400' : (todayFormatedDate === dayPaymentsFormated ? 'orange.300' : (new Date() > taskDate ? 'red.500' : 'blue.400')))

                                    return (
                                        <HStack justifyContent="space-between" key={task.id}>
                                            <Flex>
                                                <Tag mr="3" colorScheme="green" bg={statusColor} minW="50px" variant="solid" height="28px" alignItems="center" justify="center" justifyContent="center" padding="2" width="50px" textAlign="center" fontSize="12px" borderRadius="full" display="inline-block">
                                                    {getHour(task.time)}
                                                </Tag>

                                                <IconButton onClick={() => handleCheckTask(task.id)} isDisabled={task.status} mr="3" h="24px" w="20px" minW="25px" p="0" float="right" aria-label="Excluir categoria" border="none" icon={ <CheckIcon width="20px" stroke="#48bb78" fill="none"/>} variant="outline"/>

                                                <Text justifyContent="center" textDecoration={task.status ? "line-through" : ""}>{task.description}</Text>
                                            </Flex>

                                            <IconButton onClick={() => OpenConfirmRemoveTaskModal({id: task.id})} h="24px" w="20px" minW="25px" p="0" float="right" aria-label="Excluir categoria" border="none" icon={ <CloseIcon width="20px" stroke="#C30052" fill="none"/>} variant="outline"/>
                                        </HStack>
                                    )
                                })
                            }
                            </Stack>
                        </Stack>
                    )
                })
            }

            <Pagination totalCountOfRegister={tasks.data ? tasks.data.total : 0} registerPerPage={6} currentPage={page} onPageChange={setPage}/>
                        
        </Stack>
        </>
    )
}