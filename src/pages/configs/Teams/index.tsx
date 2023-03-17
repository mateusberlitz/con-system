import { Avatar, Flex, HStack, IconButton, Spinner, Td, Text, Tr } from "@chakra-ui/react"
import { useState } from "react"
import { Board } from "../../../components/Board"
import { EditButton } from "../../../components/Buttons/EditButton"
import { RemoveButton } from "../../../components/Buttons/RemoveButton"
import { SolidButton } from "../../../components/Buttons/SolidButton"
import { Table } from "../../../components/Table"
import { useTeams } from "../../../hooks/useTeams"
import { UserFilterData, useUsers } from "../../../hooks/useUsers"
import { Team, User } from "../../../types"
import { TeamUsersListModal } from "../Branch/TeamUsersListModal"
import { ConfirmTeamRemoveModal, RemoveTeamData } from "./ConfirmTeamRemoveModal"
import { EditTeamFormData, EditTeamModal } from "./EditTeamModal"
import { NewTeamModal } from "./NewTeamModal"

import { ReactComponent as BackArrow } from '../../../assets/icons/Back Arrow.svg'
import { ReactComponent as ProfileIcon } from '../../../assets/icons/Profile.svg'
import { ReactComponent as PlusIcon } from '../../../assets/icons/Plus.svg'
import { ReactComponent as PasteIcon } from '../../../assets/icons/Paste.svg'
import { ReactComponent as EditIcon } from '../../../assets/icons/Edit.svg';
import { ReactComponent as CloseIcon } from '../../../assets/icons/Close.svg';
import IncludeUserModal, { IncludeUserData } from "../Users/IncludeUserModal"

interface TeamsProps{
    branchId?: number;
    companyId?: number;
}

export default function Teams({branchId, companyId}: TeamsProps){
    const [filter, setFilter] = useState<UserFilterData>(() => {
        const data: UserFilterData = {
          search: '',
          branch: branchId,
          company: companyId
        }
    
        return data
    })

    const { data, isLoading, refetch, error } = useUsers(filter);
    const teams = useTeams({ branch: branchId, company: companyId }, 1);

    const [isNewTeamModalOpen, setIsNewTeamModalOpen] = useState(false)

    function OpenNewTeamModal() {
        setIsNewTeamModalOpen(true)
    }
    
    function CloseNewTeamModal() {
        setIsNewTeamModalOpen(false)
    }

    const [editTeamData, setEditTeamData] = useState<EditTeamFormData>(() => {
        const data: EditTeamFormData = {
        id: 0,
        name: '',
        manager: 0,
        branch: 0,
        company: 0,
        desk: 0
        }

        return data
    })

    const [removeTeamData, setRemoveTeamData] = useState<RemoveTeamData>(() => {
        const data: RemoveTeamData = {
        name: '',
        id: 0
        }

        return data
    })

    const [isEditTeamModalOpen, setIsEditTeamModalOpen] = useState(false)
    const [isConfirmTeamRemoveModalOpen, setIsConfirmTeamRemoveModalOpen] =
        useState(false)

    function OpenEditTeamModal(team: EditTeamFormData) {
        setEditTeamData(team)
        setIsEditTeamModalOpen(true)
    }
    function CloseEditTeamModal() {
        setIsEditTeamModalOpen(false)
    }

    function OpenConfirmTeamRemoveModal(teamIdAndName: RemoveTeamData) {
        setRemoveTeamData(teamIdAndName)
        setIsConfirmTeamRemoveModalOpen(true)
    }
    function CloseConfirmTeamRemoveModal() {
        setIsConfirmTeamRemoveModalOpen(false)
    }

    const [isTeamUsersListModalOpen, setIsTeamUsersListModalOpen] = useState(false)
    const [team, setTeam] = useState<Team>();

    function OpenTeamUsersListModal(team: Team) {
        setTeam(team);
        setIsTeamUsersListModalOpen(true)
    }
    function CloseTeamUsersListModal() {
        teams.refetch();
        setIsTeamUsersListModalOpen(false)
    }

    const [isIncludeUserModalOpen, setIsIncludeUserModalOpen] = useState(false)
    const [includeUserData, setIncludeUserData] = useState<IncludeUserData>({
        company: 0,
        companyName: '',
        branch: 0,
        branchName: '',
        team: 0,
        teamName: ''
    })
    const [afterIncludeUser, setAfterIncludeUser] = useState<() => void>(() => refetch);

    function OpenIncludeUserModal() {
        setIncludeUserData({
            branch: branchId && branchId,
            company: companyId && companyId,
        })
        setIsIncludeUserModalOpen(true)
    }
    function CloseIncludeUserModal() {
        setIsIncludeUserModalOpen(false)
    }

    function OpenTeamIncludeUserModal(teamId: number, afterIncludeUser?:() => void) {
        setIncludeUserData({
            branch: branchId && branchId,
            company: companyId && companyId,
            team: teamId
        });

        setIsIncludeUserModalOpen(true);

        if(afterIncludeUser){
        const afterIncludeActions = () => {
            afterIncludeUser();
            refetch();
        }

        setAfterIncludeUser(() => afterIncludeActions);
        }
    }

    const [isUnicludeUserModalOpen, setIsUnicludeUserModalOpen] = useState(false)
    const [unicludeUserData, setUnicludeUserData] = useState<IncludeUserData>({
        company: 0,
        companyName: '',
        branch: 0,
        branchName: '',
        team: 0,
        teamName: ''
    })

    function OpenUnicludeUserModal(teamId?:number) {
        setIncludeUserData({
            branch: branchId && branchId,
            company: companyId && companyId,
            team: teamId && teamId
        })
        setIsUnicludeUserModalOpen(true)
    }
    function CloseUnicludeUserModal() {
        setIsUnicludeUserModalOpen(false)
    }

    const [user, setUser] = useState<User>();
    const [isConfirmUnicludeUserModalOpen, setIsConfirmUnicludeUserModalOpen] = useState(false)

    function OpenConfirmUnicludeUserModal(user: User) {
        setUser(user);
        setIsConfirmUnicludeUserModalOpen(true)
    }
    function CloseConfirmUnicludeUserModal() {
        setIsConfirmUnicludeUserModalOpen(false)
    }

    const refetchBoard = () => {
        refetch(); 
        teams.refetch();
    }

    return(
        <>
            <NewTeamModal
                afterCreate={teams.refetch}
                isOpen={isNewTeamModalOpen}
                onRequestClose={CloseNewTeamModal}
            />
            <EditTeamModal
                afterEdit={teams.refetch}
                toEditTeamData={editTeamData}
                isOpen={isEditTeamModalOpen}
                onRequestClose={CloseEditTeamModal}
            />
            <ConfirmTeamRemoveModal
                afterRemove={teams.refetch}
                toRemoveTeamData={removeTeamData}
                isOpen={isConfirmTeamRemoveModalOpen}
                onRequestClose={CloseConfirmTeamRemoveModal}
            />

            <TeamUsersListModal afterEdit={refetchBoard} handleUnicludeUser={OpenUnicludeUserModal} handleOpenIncludeUserModal={OpenTeamIncludeUserModal} isOpen={isTeamUsersListModalOpen} team={team} onRequestClose={CloseTeamUsersListModal}/>
        
            <IncludeUserModal
                afterEdit={afterIncludeUser}
                toIncludeUserProps={includeUserData}
                isOpen={isIncludeUserModalOpen}
                onRequestClose={CloseIncludeUserModal}
            />
        
            <Board>
            <HStack mb="4" justifyContent="space-between">
                <Text fontSize="xl">Equipes</Text>

                <SolidButton
                onClick={() => OpenNewTeamModal()}
                mb="12"
                color="white"
                bg="purple.300"
                icon={PlusIcon}
                colorScheme="purple"
                >
                Adicionar equipe
                </SolidButton>
            </HStack>

            {teams.isLoading ? (
                <Flex justify="left">
                <Spinner />
                </Flex>
            ) : teams.error ? (
                <Flex justify="left" mt="4" mb="4">
                <Text>Erro listar as equipes</Text>
                </Flex>
            ) : (
                teams.data?.data.length === 0 && (
                <Flex justify="left">
                    <Text>Nenhuma equipe encontrada.</Text>
                </Flex>
                )
            )}

            {!teams.isLoading && !teams.error && teams.data?.data.length !== 0 && (
                <Table
                header={[
                    {
                    text: 'Equipe'
                    },
                    {
                    text: 'Setor'
                    },
                    {
                    text: 'Participantes'
                    },
                    // {
                    //     text: 'E-mail',
                    // },
                    // {
                    //     text: 'Telefone',
                    // },
                    {
                    text: 'Gerente',
                    icon: ProfileIcon
                    },
                    {
                    text: ''
                    }
                ]}
                >
                {/* ITEMS */}
                {!teams.isLoading &&
                    !teams.error &&
                    teams.data?.data.map((team: Team) => {
                    return (
                        <Tr key={team.id}>
                        <Td alignItems="center" display="flex">
                            <Text
                            display="flex"
                            fontSize="sm"
                            color="gray.700"
                            fontWeight="600"
                            whiteSpace="nowrap"
                            >
                            {team.name}
                            </Text>
                        </Td>

                        <Td fontSize="sm" color="gray.800" whiteSpace="nowrap">
                            {team.desk.name}
                        </Td>
                        {/* <Td fontSize="sm" color="gray.800">{branch.email}</Td>
                                            <Td fontSize="sm" color="gray.800">{branch.phone}</Td> */}

                        <Td fontSize="sm" color="gray.800" whiteSpace="nowrap" cursor="pointer" onClick={() => OpenTeamUsersListModal(team)}>
                            <HStack>
                            <Text>{team.users.length > 0 ? team.users.length : 'Nenhum'}</Text>
                            <IconButton h="24px" w="20px !important" p="0" float="right" aria-label="Incluir participantes" border="none" icon={ <EditIcon width="20px" stroke="#d69e2e" fill="none"/>} variant="outline"/>
                            </HStack>
                        </Td>

                        <Td alignItems="center" display="flex">
                            <Flex
                            mr="4"
                            borderRadius="full"
                            h="fit-content"
                            w="fit-content"
                            bgGradient="linear(to-r, purple.600, blue.300)"
                            p="2px"
                            whiteSpace="nowrap"
                            >
                            <Avatar
                                whiteSpace="nowrap"
                                borderColor="gray.600"
                                border="2px"
                                size="sm"
                                name={`${team.manager.name} ${team.manager.last_name}`}
                                src={
                                team.manager.image
                                    ? `${
                                        process.env.NODE_ENV === 'production'
                                        ? process.env.REACT_APP_API_STORAGE
                                        : process.env.REACT_APP_API_LOCAL_STORAGE
                                    }${team.manager.image}`
                                    : ''
                                }
                            />
                            </Flex>
                            <Text
                            display="flex"
                            fontSize="sm"
                            color="gray.700"
                            fontWeight="600"
                            whiteSpace="nowrap"
                            >
                            {team.manager.name}{' '}
                            {team.manager.last_name && team.manager.last_name}
                            </Text>
                        </Td>

                        <Td>
                            <HStack spacing="4">
                            {/* <OutlineButton size="sm" colorScheme="purple" h="28px" px="5" onClick={() => history.push(`/filiais/${team.id}`)}>Gerenciar</OutlineButton> */}
                            <EditButton
                                onClick={() =>
                                OpenEditTeamModal({
                                    id: team.id,
                                    name: team.name,
                                    company: team.company.id,
                                    branch: team.branch.id,
                                    manager: team.manager.id,
                                    desk: team.desk.id
                                })
                                }
                            />
                            <RemoveButton
                                onClick={() =>
                                OpenConfirmTeamRemoveModal({
                                    id: team.id,
                                    name: team.name
                                })
                                }
                            />
                            </HStack>
                        </Td>
                        </Tr>
                    )
                    })}
                </Table>
            )}
            </Board>
        </>
    )
}