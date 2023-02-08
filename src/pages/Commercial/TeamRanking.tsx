import { Divider, Flex, FormControl, HStack, Select as ChakraSelect, Spinner, Text, Th, Tr } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Board } from "../../components/Board";
import { Table } from "../../components/Table";
import { useProfile } from "../../hooks/useProfile";
import { TeamsFilterData, useTeams } from "../../hooks/useTeams";
import { useWorkingBranch } from "../../hooks/useWorkingBranch";
import { useWorkingCompany } from "../../hooks/useWorkingCompany";
import { api } from "../../services/api";
import { Team, User } from "../../types";

interface TeamRankingTableProps{
    startDate?: string;
    endDate?: string;
    isManager?: boolean
}

export default function TeamRankingTable({startDate, endDate, isManager}: TeamRankingTableProps) {
    const { permissions, profile } = useProfile();
    const workingCompany = useWorkingCompany();
    const workingBranch = useWorkingBranch();

    const [filter, setFilter] = useState<TeamsFilterData>(() => {
        const data: TeamsFilterData = {
            company: workingCompany.company?.id,
            start_date: startDate,
            end_date: endDate,
        };
    
        return data;
    })

    const history = useHistory();

    const teamsQuery = useTeams(filter);

    const teams:Team[] = profile?.role.id === 1 ? teamsQuery.data?.data : profile?.teams;

    const [selectedTeamId, setSelectedTeamId] = useState<number>();

    function handleChangeTeam(event:any){
        const newTeam = event?.target.value ? event?.target.value : selectedTeamId;

        setSelectedTeamId(newTeam);
    }

    const [team, setTeam] = useState<Team>();

    const loadTeam = async () => {
        await api.get(`/teams/${selectedTeamId}`).then(response => setTeam(response.data));
    }

    useEffect(() => {
        loadTeam();
    }, [selectedTeamId])

    useEffect(() => {
        if(!team && !selectedTeamId && teamsQuery.data?.data.length > 0){
            setSelectedTeamId(teams[0].id);
        }
    }, [teams]);

    //console.log(teams);

    return (
            <Board mb="12" h={450}>
                {   teamsQuery.isLoading ? (
                        <Flex justify="left">
                            <Spinner/>
                        </Flex>
                    ) : ( teamsQuery.isError ? (
                        <Flex justify="left" mt="4" mb="4">
                            <Text>Erro listar os times</Text>
                        </Flex>
                    ) : (teamsQuery.data?.data.length === 0) && (
                        <Flex justify="left">
                            <Text>Nenhum time encontrado</Text>
                        </Flex>
                    ) ) 
                }

                {
                    (!teamsQuery.isLoading && !teamsQuery.error) && (

                        <>
                            <HStack as="form" spacing="12" w="100%" mb="6" justifyContent="left">
                                <Text fontWeight="500" w="100%" fontSize="xl">Ranking da equipe</Text>

                                <FormControl display="flex" justifyContent="flex-end" minW="150px">
                                    <ChakraSelect onChange={handleChangeTeam} defaultValue={selectedTeamId} h="45px" name="selected_company" maxW="200px" fontSize="sm" focusBorderColor="purple.600" bg="gray.400" variant="filled" _hover={{ bgColor: 'gray.500' }} size="lg" borderRadius="full">
                                        {/* <option value={''}>Selecionar time</option> */}
                                        {
                                            teams.map((team: Team) => {
                                                return (
                                                    <option key={team.id.toString()} value={team.id.toString()}>{team.name}</option>
                                                )
                                            })
                                        }
                                    </ChakraSelect>
                                </FormControl>

                            </HStack>

                            <Divider mb="4" />

                            <Table header={[
                                { text: 'Vendedor' },
                                { text: 'Contratos' },
                                { text: 'Vendas' },
                                { text: 'Estornos' },
                                { text: 'total' }
                            ]}>
                                <Tr>
                                    <Th></Th>
                                </Tr>
                                {
                                    team ? team.users.map((user, position) => {
                                        const quotasCreditAmount = user.quotas ? user.quotas.reduce((amount, quota) => {return amount + quota.credit}, 0) : 0;

                                        const reversalQuotasCreditAmount = user.quotas ? user.quotas.reduce((amount, quota) => {return quota.is_chargeback ? amount + quota.credit : 0}, 0) : 0;

                                        return(
                                            <Tr key={user.id}>
                                                <Th color="black" fontSize="12px" position="sticky" left="0">{position + 1}. {user.name} {user.last_name}</Th>
                                                <Th color="gray.600">{user.quotas ? user.quotas.length : 0}</Th>
                                                <Th color="gray.600">{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(quotasCreditAmount)}</Th>
                                                <Th color="gray.600">{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(reversalQuotasCreditAmount)}</Th>
                                                <Th>{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(quotasCreditAmount - reversalQuotasCreditAmount)}</Th>
                                            </Tr>
                                        )
                                    })
                                    :(
                                        <Flex justify="center">
                                            <Text>Selecione um time</Text>
                                        </Flex>
                                    )
                                }
                            </Table>
                        </>
                    )
                }
            </Board>
    );
}