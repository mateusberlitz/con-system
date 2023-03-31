import { Flex, HStack, IconButton, Spinner, Stack, Td, Text, Tr } from "@chakra-ui/react";
import { Board } from "../../../components/Board";
import { SolidButton } from "../../../components/Buttons/SolidButton";
import { Table } from "../../../components/Table";

import { ReactComponent as PlusIcon } from '../../../assets/icons/Plus.svg'
import { ReactComponent as CloseIcon } from '../../../assets/icons/Close.svg'

import { useWorkingCompany } from "../../../hooks/useWorkingCompany";
import { useWorkingBranch } from "../../../hooks/useWorkingBranch";
import { UserFilterData } from "../../../hooks/useUsers";
import { useProfile } from "../../../hooks/useProfile";
import { useEffect, useState } from "react";
import { GoalsFilterData, useGoals } from "../../../hooks/useGoals";
import { Goal, Team, User } from "../../../types";
import { NewTeamGoalModal, toAddTeamGoalData } from "./NewTeamGoalModal";
import { ConfirmGoalRemoveModal, RemoveGoalData } from "./ConfirmGoalRemoveModal";

interface GoalsBoardInterface{
    teamId?: number;
}

export function GoalsBoard({teamId}: GoalsBoardInterface){
    const workingCompany = useWorkingCompany()
    const workingBranch = useWorkingBranch()
    const { profile } = useProfile();

    const [filter, setFilter] = useState<GoalsFilterData>(() => {
        const data: GoalsFilterData = {
            search: '',
            //branch_id: workingBranch.branch?.id,
            //company_id: workingCompany.company?.id,
            //team_id: (profile && profile.teams.length > 0) ? profile.teams[0].id : undefined,
            team_id: teamId,
        }
    
        return data
    })

    const [team, setTeam] = useState<Team>();

    const { data, isLoading, refetch, error } = useGoals(filter);

    //const hasTeam = (profile && profile.teams.length > 0) ? true : false;
    const hasTeam = teamId !== undefined;

    const [isNewGoalModalOpen, setIsNewGoalModalOpen] = useState(false)
    const [toAddGoalUserData, setToAddGoalUserData] = useState<toAddTeamGoalData>(
        () => {
        const data: toAddTeamGoalData = {
            name: '',
            id: 0,
            company_id: 0
        }

        return data
        }
    )

    function OpenNewGoalModal(userData: toAddTeamGoalData) {
        setIsNewGoalModalOpen(true)
        setToAddGoalUserData(userData)
    }
    function CloseNewGoalModal() {
        setIsNewGoalModalOpen(false)
    }

    useEffect(() => {
        if(profile && profile.teams.length > 0){
            setTeam(profile.teams[0]);
        }
    }, [profile])

    const monthNames = [
        '',
        'Junho',
        'Fevereiro',
        'Março',
        'Abril',
        'Maio',
        'Junho',
        'Julho',
        'Agosto',
        'Setembro',
        'Outubro',
        'Novembro',
        'Dezembro'
    ]

    const today = new Date();

    const year = today.getFullYear();
    const month = today.getMonth() + 1;

    const [isConfirmGoalRemoveModalOpen, setIsConfirmGoalRemoveModalOpen] = useState(false)
    const [toRemoveGoalData, setToRemoveGoalData] = useState<RemoveGoalData>(
        () => {
        const data: RemoveGoalData = {
            name: '',
            id: 0,
            month: 1
        }

        return data
        }
    )

    function OpenConfirmRemoveGoalModal(userData: RemoveGoalData) {
        setIsConfirmGoalRemoveModalOpen(true)
        setToRemoveGoalData(userData)
    }
    
    function CloseConfirmRemoveGoalModal() {
        setIsConfirmGoalRemoveModalOpen(false)
    }

    useEffect(() => {
        setFilter({...filter, team_id: teamId});
    }, [teamId])

    console.log(teamId, filter);

    return(
        <Board mb="50px">
            <NewTeamGoalModal toAddTeamData={toAddGoalUserData} afterCreate={refetch} isOpen={isNewGoalModalOpen} onRequestClose={CloseNewGoalModal}/>
            <ConfirmGoalRemoveModal toRemoveGoalData={toRemoveGoalData} afterRemove={refetch} isOpen={isConfirmGoalRemoveModalOpen} onRequestClose={CloseConfirmRemoveGoalModal}/>

            <Stack spacing="8">
                <HStack spacing="2" justifyContent={"space-between"}>
                    <Text fontSize="xl" mb="5" w="100%">
                        Metas da equipe
                    </Text>

                    {
                        team && (
                            <SolidButton
                                onClick={() => OpenNewGoalModal({id: team.id, name: team.name, company_id: team.company})}
                                mb="12"
                                color="white"
                                bg="orange.400"
                                icon={PlusIcon}
                                colorScheme="orange"
                            >
                                Adicionar Meta
                            </SolidButton>
                        )
                    }
                </HStack>

                {isLoading ? (
                    <Flex justify="center">
                        <Spinner />
                    </Flex>
                ) : !hasTeam ? (
                    <Flex justify="center" mt="4" mb="4">
                        <Text>Você não está enquadrado em uma equipe</Text>
                    </Flex>
                ) : error ? (
                <Flex justify="center" mt="4" mb="4">
                    <Text>Erro listar as metas</Text>
                </Flex>
                ) : (
                    data?.data.length === 0 && (
                        <Flex justify="center">
                            <Text>Nenhuma meta encontrada.</Text>
                        </Flex>
                    )
                )}
                
                {(!isLoading && !error && data?.data.length !== 0 && hasTeam) && (
                    <Table
                        header={[
                            {
                            text: 'Mês/Ano'
                        },
                        {
                            text: 'Valor'
                        },
                        {
                            text: 'Visitas'
                        },
                        {
                            text: 'Fechamentos'
                        },
                        ]}
                    >
                        {!isLoading && !error && data?.data.map((goal: Goal) => {
                            const isCurrentGoal = goal.year == year && goal.month == month ? true : false;

                            return(
                                <Tr fontWeight={isCurrentGoal ? "bold" : "normal"}>
                                    <Td fontSize="sm" color="gray.800">
                                        {monthNames[goal.month]}/{goal.year}{isCurrentGoal && "(atual)"}
                                    </Td>
                                    <Td fontSize="sm" color="gray.800">
                                        {Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(goal.value)}
                                    </Td>
                                    <Td fontSize="sm" color="gray.800">
                                        {goal.visits ? goal.sales : '--'}
                                    </Td>
                                    <Td fontSize="sm" color="gray.800">
                                        {goal.sales ? goal.sales : '--'}
                                    </Td>
                                    <Td>
                                        <IconButton
                                            onClick={() =>
                                                OpenConfirmRemoveGoalModal({
                                                    id: goal.id,
                                                    month: goal.month,
                                                    company_id: team?.company
                                                })
                                            }
                                            h="24px" w="23px" p="0" float="right" aria-label="Excluir venda" border="none" icon={
                                                <CloseIcon
                                                width="20px"
                                                stroke="#C30052"
                                                fill="none"
                                                />
                                            }
                                            variant="outline"
                                            />
                                    </Td>
                                </Tr>
                            )
                        })}
                    </Table>
                )}
            </Stack>
        </Board>
    )
}