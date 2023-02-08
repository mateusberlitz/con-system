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
import { Team } from "../../types";

interface TeamsRankingsTableProps{
    startDate?: string;
    endDate?: string;
}

export default function TeamsRankingsTable({startDate, endDate}: TeamsRankingsTableProps) {
    const { permissions, profile } = useProfile();
    const workingCompany = useWorkingCompany();
    const workingBranch = useWorkingBranch();

    const [filter, setFilter] = useState<TeamsFilterData>(() => {
        const data: TeamsFilterData = {
            company: workingCompany.company?.id,
            start_date: startDate,
            end_date: endDate,
            sales: 'true',
        };
    
        return data;
    })

    const history = useHistory();

    const teams = useTeams(filter);

    return (
            <Board mb="12" h={450}>
                {   teams.isLoading ? (
                        <Flex justify="left">
                            <Spinner/>
                        </Flex>
                    ) : ( teams.isError ? (
                        <Flex justify="left" mt="4" mb="4">
                            <Text>Erro listar os times</Text>
                        </Flex>
                    ) : (teams.data?.data.length === 0) && (
                        <Flex justify="left">
                            <Text>Nenhum time encontrado</Text>
                        </Flex>
                    ) ) 
                }

                {
                    (!teams.isLoading && !teams.error) && (
                        <>
                            <HStack as="form" spacing="12" w="100%" mb="6" justifyContent="left">
                                <Text fontWeight="500" w="100%" fontSize="xl">Ranking de equipes</Text>

                                <FormControl display="flex" justifyContent="flex-end" alignItems="flex-end" minW="150px">
                                    {/* <ChakraSelect defaultValue={workingCompany.company?.id} h="45px" name="selected_company" maxW="200px" fontSize="sm" focusBorderColor="purple.600" bg="gray.400" variant="filled" _hover={{ bgColor: 'gray.500' }} size="lg" borderRadius="full">
                                        {
                                            years.map((year: Number) => {
                                                return (
                                                    <option key={year.toString()} value={year.toString()}>{year}</option>
                                                )
                                            })
                                        }
                                    </ChakraSelect> */}
                                </FormControl>

                            </HStack>

                            <Divider mb="4" />

                            <Table header={[
                                { text: 'Equipe' },
                                { text: 'Contratos' },
                                { text: 'Vendas' },
                                { text: 'Estornos' },
                                { text: 'total' }
                            ]}>
                                {
                                    teams.data?.data.map((team: Team, position: number) => {
                                        const teamContractCount = team.users.reduce((countAmount, user) => {
                                            return countAmount + (user.quotas ? user.quotas.length : 0)
                                        }, 0)

                                        const teamQuotasCreditAmount = team.users.reduce((countAmount, user) => {
                                            return countAmount + (user.quotas ? user.quotas.reduce((amount, quota) => {return amount + quota.credit}, 0) : 0);
                                        }, 0)

                                        const teamReversalQuotasCreditAmount = team.users.reduce((countAmount, user) => {
                                            return countAmount + (user.quotas ? user.quotas.reduce((amount, quota) => {return quota.is_chargeback ? amount + quota.credit : 0}, 0) : 0);
                                        }, 0)

                                        return(
                                            <Tr>
                                                <Th color="black" fontSize="12px" position="sticky" left="0">{position + 1}. {team.name}</Th>
                                                <Th color="gray.600">{teamContractCount}</Th>
                                                <Th color="gray.600">{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(teamQuotasCreditAmount)}</Th>
                                                <Th color="gray.600">{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(teamReversalQuotasCreditAmount)}</Th>
                                                <Th>{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(teamQuotasCreditAmount + teamReversalQuotasCreditAmount)}</Th>
                                            </Tr>
                                        )
                                    })
                                }
                            </Table>
                        </>
                    )
                }
                
            </Board>
    );
}