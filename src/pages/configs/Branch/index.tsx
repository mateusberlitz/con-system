import {
  Avatar,
  Divider,
  Flex,
  Heading,
  HStack,
  Link,
  Spinner,
  Stack,
  Td,
  Text,
  Tr,
  useBreakpointValue
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { MainBoard } from '../../../components/MainBoard'
import { api } from '../../../services/api'
import { Branch as BranchInterface, Team, User } from '../../../types'
import { Table as ProTable, Table } from '../../../components/Table'
import { Board } from '../../../components/Board'

import { ReactComponent as BackArrow } from '../../../assets/icons/Back Arrow.svg'
import { ReactComponent as ProfileIcon } from '../../../assets/icons/Profile.svg'
import { ReactComponent as LocationIcon } from '../../../assets/icons/Location.svg'
import { ReactComponent as PlusIcon } from '../../../assets/icons/Plus.svg'
import { ReactComponent as HomeIcon } from '../../../assets/icons/Home.svg'
import { ReactComponent as PasteIcon } from '../../../assets/icons/Paste.svg'
import { RemoveButton } from '../../../components/Buttons/RemoveButton'
import { EditButton } from '../../../components/Buttons/EditButton'
import { UserFilterData, useUsers } from '../../../hooks/useUsers'
import { EditUserModal } from '../Users/EditUserModal'
import { ConfirmUserRemoveModal } from '../Users/ConfirmUserRemoveModal'
import { SolidButton } from '../../../components/Buttons/SolidButton'
import { useTeams } from '../../../hooks/useTeams'
import { OutlineButton } from '../../../components/Buttons/OutlineButton'
import { NewTeamModal } from '../Teams/NewTeamModal'
import {
  ConfirmTeamRemoveModal,
  RemoveTeamData
} from '../Teams/ConfirmTeamRemoveModal'
import { EditTeamFormData, EditTeamModal } from '../Teams/EditTeamModal'
import IncludeUserModal, { IncludeUserData } from '../Users/IncludeUserModal'

interface BranchParams {
  id: string
}

interface EditUserFormData {
  name: string
  id: number
  phone: string
  email: string
  role: number
}

interface RemoveUserData {
  id: number
  name: string
}

export default function Branch() {
  const history = useHistory()
  const { id } = useParams<BranchParams>()
  const isWideVersion = useBreakpointValue({ base: false, lg: true })

  const [branch, setBranch] = useState<BranchInterface>()

  const loadBranchData = async () => {
    const { data } = await api.get(`/branches/${id}`)

    setBranch(data)
  }

  useEffect(() => {
    loadBranchData()
  }, [])

  const [filter, setFilter] = useState<UserFilterData>(() => {
    const data: UserFilterData = {
      search: '',
      branch: parseInt(id)
    }

    return data
  })

  const { data, isLoading, refetch, error } = useUsers(filter)

  const [editUserData, setEditUserData] = useState<EditUserFormData>(() => {
    const data: EditUserFormData = {
      name: '',
      id: 0,
      email: '',
      phone: '',
      role: 0
    }

    return data
  })

  const [removeUserData, setRemoveUserData] = useState<RemoveUserData>(() => {
    const data: RemoveUserData = {
      name: '',
      id: 0
    }

    return data
  })

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isConfirmUserRemoveModalOpen, setisConfirmUserRemoveModalOpen] =
    useState(false)

  function OpenEditModal(user: EditUserFormData) {
    setEditUserData(user)
    setIsEditModalOpen(true)
  }
  function CloseEditModal() {
    setIsEditModalOpen(false)
  }

  function OpenConfirmUserRemoveModal(userIdAndName: RemoveUserData) {
    setRemoveUserData(userIdAndName)
    setisConfirmUserRemoveModalOpen(true)
  }
  function CloseConfirmUserRemoveModal() {
    setisConfirmUserRemoveModalOpen(false)
  }

  const teams = useTeams({ branch: parseInt(id) }, 1)

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

  const [isIncludeUserModalOpen, setIsIncludeUserModalOpen] = useState(false)
  const [includeUserData, setIncludeUserData] = useState<IncludeUserData>({
    company: 0,
    companyName: '',
    branch: 0,
    branchName: '',
    team: 0,
    teamName: ''
  })

  function OpenIncludeUserModal() {
    setIncludeUserData({
      branch: branch && branch.id,
      company: branch && branch.company.id
    })
    setIsIncludeUserModalOpen(true)
  }
  function CloseIncludeUserModal() {
    setIsIncludeUserModalOpen(false)
  }

  return (
    <MainBoard
      sidebar="configs"
      header={
        branch && (
          <HStack>
            <Link href={`/empresas/${branch.company.id}`}>
              <BackArrow width="20px" stroke="#4e4b66" fill="none" />
            </Link>
            <Text color="gray.800" ml="4">
              /{' '}
              <Link href={`/empresas/${branch.company.id}`}>
                {branch.company.name}
              </Link>
              / <strong>{branch.name}</strong>
            </Text>
          </HStack>
        )
      }
    >
      <EditUserModal
        afterEdit={refetch}
        toEditUserData={editUserData}
        isOpen={isEditModalOpen}
        onRequestClose={CloseEditModal}
      />
      <ConfirmUserRemoveModal
        afterRemove={refetch}
        toRemoveUserData={removeUserData}
        isOpen={isConfirmUserRemoveModalOpen}
        onRequestClose={CloseConfirmUserRemoveModal}
      />

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

      <IncludeUserModal
        afterEdit={refetch}
        toIncludeUserProps={includeUserData}
        isOpen={isIncludeUserModalOpen}
        onRequestClose={CloseIncludeUserModal}
      />

      <Stack spacing="8">
        <HStack justifyContent="space-between">
          <HStack>
            <Text>{branch && branch.company.name} -</Text>{' '}
            <Heading fontSize="2xl">{branch && branch.name}</Heading>
          </HStack>
          <HStack>
            <ProfileIcon width="20px" stroke="#4e4b66" fill="none" />
            <Text>{branch && branch.users.length} Usuários</Text>
          </HStack>
        </HStack>

        <Divider />

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
                        >
                          {team.name}
                        </Text>
                      </Td>

                      <Td fontSize="sm" color="gray.800">
                        {team.desk.name}
                      </Td>
                      {/* <Td fontSize="sm" color="gray.800">{branch.email}</Td>
                                        <Td fontSize="sm" color="gray.800">{branch.phone}</Td> */}

                      <Td fontSize="sm" color="gray.800">
                        {team.users.length > 0 ? team.users.length : 'Nenhum'}
                      </Td>

                      <Td alignItems="center" display="flex">
                        <Flex
                          mr="4"
                          borderRadius="full"
                          h="fit-content"
                          w="fit-content"
                          bgGradient="linear(to-r, purple.600, blue.300)"
                          p="2px"
                        >
                          <Avatar
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

        <Board mt="50px">
          <HStack mb="4" justifyContent="space-between">
            <Text fontSize="xl">Usuários</Text>

            <HStack spacing="5">
              <OutlineButton
                h={!isWideVersion ? '36px' : '45px'}
                onClick={() => OpenIncludeUserModal()}
                colorScheme="purple"
              >
                Incluir integrante
              </OutlineButton>

              <SolidButton
                onClick={() => OpenNewTeamModal()}
                color="white"
                bg="purple.300"
                icon={PlusIcon}
                colorScheme="purple"
              >
                Adicionar integrante
              </SolidButton>
            </HStack>
          </HStack>

          {!isLoading && !error && data.length !== 0 && (
            <ProTable
              w="100%"
              header={[
                {
                  text: 'Usuários',
                  icon: ProfileIcon
                },
                // {
                //     text: 'Empresas',
                //     icon: HomeIcon
                // },
                // {
                //     text: 'Filiais',
                //     icon: HomeIcon
                // },
                {
                  text: 'Cargo',
                  icon: PasteIcon
                },
                {
                  text: 'Ações'
                }
              ]}
            >
              {/* ITEMS */}
              {!isLoading &&
                !error &&
                data.map((user: User) => {
                  return (
                    <Tr key={user.id}>
                      <Td alignItems="center" display="flex">
                        <Flex
                          mr="4"
                          borderRadius="full"
                          h="fit-content"
                          w="fit-content"
                          bgGradient="linear(to-r, purple.600, blue.300)"
                          p="2px"
                        >
                          <Avatar
                            borderColor="gray.600"
                            border="2px"
                            size="sm"
                            name={`${user.name} ${user.last_name}`}
                            src={
                              user.image
                                ? `${
                                    process.env.NODE_ENV === 'production'
                                      ? process.env.REACT_APP_API_STORAGE
                                      : process.env.REACT_APP_API_LOCAL_STORAGE
                                  }${user.image}`
                                : ''
                            }
                          />
                        </Flex>
                        <Text
                          display="flex"
                          fontSize="sm"
                          color="gray.700"
                          fontWeight="600"
                        >
                          {user.name} {user.last_name && user.last_name}
                        </Text>
                      </Td>
                      {/* <Td whiteSpace="nowrap" fontSize="sm" color="blue.800" cursor="pointer" onClick={() => OpenSyncCompaniesModal({id:user.id, name: user.name, companies:user.companies}) }>{user.companies.length > 0 ? user.companies[0].name : "Sem empresas"} {user.companies.length > 1 && `+ ${user.companies.length - 1}`}</Td>
                                            <Td whiteSpace="nowrap" fontSize="sm" color="blue.800" cursor="pointer" onClick={() => OpenSyncBranchesModal({id:user.id, name: user.name, branches:user.branches}) }>{user.branches.length > 0 ? user.branches[0].name : "Sem filiais"} {user.branches.length > 1 && `+ ${user.branches.length - 1}`}</Td> */}
                      <Td fontSize="sm" color="gray.800">
                        {user.role.name}
                      </Td>
                      <Td>
                        <HStack spacing="4">
                          <RemoveButton
                            onClick={() =>
                              OpenConfirmUserRemoveModal({
                                id: user.id,
                                name: user.name
                              })
                            }
                          />
                          <EditButton
                            onClick={() =>
                              OpenEditModal({
                                id: user.id,
                                name: user.name,
                                phone: user.phone,
                                email: user.email,
                                role: user.role.id
                              })
                            }
                          />
                        </HStack>
                      </Td>
                    </Tr>
                  )
                })}
            </ProTable>
          )}

          {isLoading ? (
            <Flex justify="left">
              <Spinner />
            </Flex>
          ) : error ? (
            <Flex justify="left" mt="4" mb="4">
              <Text>Erro listar os usuários</Text>
            </Flex>
          ) : (
            data.length === 0 && (
              <Flex justify="left">
                <Text>Nenhum usuários nessa filial.</Text>
              </Flex>
            )
          )}
        </Board>
      </Stack>
    </MainBoard>
  )
}
