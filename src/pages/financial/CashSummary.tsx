import { Text, Stack,Link, useToast } from "@chakra-ui/react";


import { useWorkingCompany } from "../../hooks/useWorkingCompany";
import { useState } from "react";
import { TaskFilterData, useTasks } from "../../hooks/useTasks";
import { api } from "../../services/api";
import { showErrors } from "../../hooks/useErrors";

import { ReactComponent as CheckIcon } from '../../assets/icons/Check.svg';

interface RemoveTaskData{
    id: number;
}

export function CashSummary(){
    const workingCompany = useWorkingCompany();
    const [page, setPage] = useState(1);

    const [filter, setFilter] = useState<TaskFilterData>(() => {
        const data: TaskFilterData = {
            search: '',
            company: workingCompany.company?.id,
        };
        
        return data;
    })

    const tasks = useTasks(filter, page);

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

    return(
        <Stack spacing="8">
            <Stack spacing="5" w="35%" minWidth="300px" justify="space-between" alignItems="left" bg="white" borderRadius="16px" shadow="xl" px="8" py="8">
                <Text fontSize="xl" w="100%">Saldo do Caixa</Text>

                <Text fontSize="2xl" w="100%" fontWeight="bold" color="green.400">R$ 120.000,00</Text>

                <Link href="/caixa" display="flex" alignItems="center" fontSize="md" color="gray.700"><CheckIcon width="20px" stroke="#6e7191" fill="none"/> <Text ml="2">Ver fluxo de caixa</Text></Link>  
            </Stack>

            <Stack spacing="5" w="35%" minWidth="300px" justify="space-between" alignItems="left" bg="white" borderRadius="16px" shadow="xl" px="8" py="8">
                <Text fontSize="xl" w="100%">Saldo do Mês</Text>

                <Text fontSize="2xl" w="100%" fontWeight="bold" color="red.400">- R$ 20.000,00</Text>

                <Link href="/caixa" display="flex" alignItems="center" fontSize="md" color="gray.700"><CheckIcon width="20px" stroke="#6e7191" fill="none"/> <Text ml="2">Ver fluxo de caixa</Text></Link>  
            </Stack>
        </Stack>
    )
}