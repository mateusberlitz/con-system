import { CompanySelectMaster } from '../../../components/CompanySelect/companySelectMaster'
import {
  Flex,
  FormControl,
  HStack,
  Icon,
  IconButton,
  Spinner,
  Stack,
  Td,
  Text,
  Tr,
  Select as ChakraSelect
} from '@chakra-ui/react'
import { OutlineButton } from '../../../components/Buttons/OutlineButton'
import { Board } from '../../../components/Board'
import { RemoveButton } from '../../../components/Buttons/RemoveButton'
import { MainBoard } from '../../../components/MainBoard'
import { Table } from '../../../components/Table'
import { Input } from '../../../components/Forms/Inputs/Input'

import { ReactComponent as PlusIcon } from '../../../assets/icons/Plus.svg'
import { ReactComponent as SearchIcon } from '../../../assets/icons/Search.svg'
import { ReactComponent as PasteIcon } from '../../../assets/icons/Paste.svg'
import { ReactComponent as ProfileIcon } from '../../../assets/icons/Profile.svg'
import { ReactComponent as CloseIcon } from '../../../assets/icons/Close.svg'

import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { UserFilterData, useUsers } from '../../../hooks/useUsers'

import { Goal, Quota, Team, User } from '../../../types'
import { useEffect, useState } from 'react'
import { useCompanies } from '../../../hooks/useCompanies'
import { useRoles } from '../../../hooks/useRoles'
import { EditUserModal } from '../../configs/Users/EditUserModal'
import { ConfirmUserRemoveModal } from '../../configs/Users/ConfirmUserRemoveModal'
import { NewGoalModal, toAddGoalData } from './NewGoalModal'
import { EditGoalFormData, EditGoalModal } from './EditGoalModal'
import {
  ConfirmGoalRemoveModal,
  RemoveGoalData
} from './ConfirmGoalRemoveModal'
import { ListGoalsModal } from './ListGoalsModal'
import { useWorkingCompany } from '../../../hooks/useWorkingCompany'
import { useWorkingBranch } from '../../../hooks/useWorkingBranch'
import { SolidButton } from '../../../components/Buttons/SolidButton'
import { Link } from 'react-router-dom'
import { useProfile } from '../../../hooks/useProfile'
import { ConfirmUnicludeUserModal } from '../../configs/Branch/ConfirmUnicludeUserModal'
import { ConfirmTeamUnicludeUserModal } from '../../configs/Teams/ConfirmTeamUnicludeUserModal'
import IncludeUserModal, { IncludeUserData } from '../../configs/Users/IncludeUserModal'
import Users from '../../configs/Users'
import { GoalsBoard } from './GoalsBoard'
import { useTeams } from '../../../hooks/useTeams'
import { api } from '../../../services/api'

const SearchUserFormSchema = yup.object().shape({
  search: yup.string().nullable(),
  company: yup.string().nullable(),
  role: yup.string().nullable()
})

interface EditUserFormData {
  name: string
  last_name: string
  id: number
  phone: string
  email: string
  role: number
}

interface RemoveUserData {
  id: number
  name: string
}

export default function Sellers() {
  const workingCompany = useWorkingCompany()
  const workingBranch = useWorkingBranch()
  const companies = useCompanies()
  const roles = useRoles()
  const { profile } = useProfile();

  const teamsQuery = useTeams({company: workingCompany.company?.id});
    const teams:Team[] = profile?.role.id === 1 ? teamsQuery.data?.data : profile?.teams;

    const [selectedTeamId, setSelectedTeamId] = useState<number>();
    const [team, setTeam] = useState<Team>();

  const hasTeam = (profile && profile.teams.length > 0) ? true : false;

  const [filter, setFilter] = useState<UserFilterData>(() => {
    const data: UserFilterData = {
      search: '',
      branch: workingBranch.branch?.id,
      company: workingCompany.company?.id,
      //team: (profile && profile.teams.length > 0) ? profile.teams[0].id : undefined,
      team: team ? team.id : undefined,
      //role: 5,
      goals: true,
      quotas: true,
    }

    return data
  })

    const { data, isLoading, refetch, error } = useUsers(filter)

    const loadTeam = async () => {
        //await api.get(`/teams/${selectedTeamId}`).then(response => setTeam(response.data));
        //console.log(teams.filter((team) => team.id === selectedTeamId)[0]);
        const newTeam = teams.filter((team) => team.id === selectedTeamId)[0];

        setTeam(newTeam);
        setFilter({
            ...filter,
            team: newTeam.id
        })
    }

    useEffect(() => {
        loadTeam();
    }, [selectedTeamId])

    useEffect(() => {
        if(!team && !selectedTeamId && teamsQuery.data?.data.length > 0){
            setSelectedTeamId(teams[0].id);
        }else{
            if(profile && hasTeam){
                setSelectedTeamId(profile.teams[0].id);
            }
        }
    }, [teams]);

    function handleChangeTeam(event:any){
        const newTeam = event?.target.value ? parseInt(event?.target.value) : selectedTeamId;

        setSelectedTeamId(newTeam);
    }

  const [editUserData, setEditUserData] = useState<EditUserFormData>(() => {
    const data: EditUserFormData = {
      name: '',
      last_name: '',
      id: 0,
      email: '',
      phone: '',
      role: 5
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

  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isConfirmUserRemoveModalOpen, setisConfirmUserRemoveModalOpen] =
    useState(false)

  function OpenNewUserModal() {
    setIsNewUserModalOpen(true)
  }

  function CloseNewUserModal() {
    setIsNewUserModalOpen(false)
  }

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

  const [isNewGoalModalOpen, setIsNewGoalModalOpen] = useState(false)
  const [toAddGoalUserData, setToAddGoalUserData] = useState<toAddGoalData>(
    () => {
      const data: toAddGoalData = {
        name: '',
        id: 0
      }

      return data
    }
  )

  function OpenNewGoalModal(userData: toAddGoalData) {
    setIsNewGoalModalOpen(true)
    setToAddGoalUserData(userData)
  }
  function CloseNewGoalModal() {
    setIsNewGoalModalOpen(false)
  }

  const [isEditGoalModalOpen, setIsEditGoalModalOpen] = useState(false)
  const [toEditGoalUserData, setToEditGoalUserData] =
    useState<EditGoalFormData>(() => {
      const data: EditGoalFormData = {
        name: '',
        id: 0,
        value: '',
        month: 0
      }

      return data
    })

  function OpenEditGoalModal(userData: EditGoalFormData) {
    setIsEditGoalModalOpen(true)
    setToEditGoalUserData(userData)
  }
  function CloseEditGoalModal() {
    setIsEditGoalModalOpen(false)
  }

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

  const [isListGoalsModalOpen, setIsListGoalsModalOpen] = useState(false)
  const [listGoals, setListGoals] = useState<Goal[]>([])

  function OpenListGoalsModal(listGoals: Goal[], userData: toAddGoalData) {
    setListGoals(listGoals)
    setToAddGoalUserData(userData)

    setIsListGoalsModalOpen(true)
  }
  function CloseListGoalsModal() {
    setIsListGoalsModalOpen(false)
  }

  function refetchGoals() {
    refetch().then(response => {
      const userGoals = response.data.filter((user: User) => {
        return user.id === toAddGoalUserData.id
      })

      console.log(userGoals[0])

      setListGoals(userGoals[0].goals)
    })
  }

  const { register, handleSubmit, formState } = useForm<UserFilterData>({
    resolver: yupResolver(SearchUserFormSchema)
  });

  const handleSearchUser = async (search: UserFilterData) => {
    setFilter({ ...filter, ...search })
  }

  const month = new Date().getMonth() + 1

  useEffect(() => {
    setFilter({
      ...filter,
      company: workingCompany.company?.id,
      branch: workingBranch.branch?.id
    })
  }, [workingCompany, workingBranch])

  const [user, setUser] = useState<User>();
  const [isConfirmUnicludeUserModalOpen, setIsConfirmUnicludeUserModalOpen] = useState(false)

  function OpenConfirmUnicludeUserModal(user: User) {
    setUser(user);
    setIsConfirmUnicludeUserModalOpen(true)
  }
  function CloseConfirmUnicludeUserModal() {
    setIsConfirmUnicludeUserModalOpen(false)
  }


  const [isIncludeUserModalOpen, setIsIncludeUserModalOpen] = useState(false)
  const [includeUserData, setIncludeUserData] = useState<IncludeUserData>({
    company: 0,
    companyName: '',
    branch: 0,
    branchName: '',
    team: 0,
    teamName: ''
  });

  function OpenTeamIncludeUserModal(teamId: number, afterIncludeUser?:() => void) {
    setIncludeUserData({
      branch: workingBranch.branch ? workingBranch.branch.id : undefined,
      company: workingBranch.branch ? workingBranch.branch.company.id : undefined,
      team: teamId
    });

    setIsIncludeUserModalOpen(true);
  }

  function CloseIncludeUserModal() {
    setIsIncludeUserModalOpen(false)
  }

  console.log(selectedTeamId);

  return (
    <MainBoard sidebar="commercial" header={<CompanySelectMaster />}>
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

      <NewGoalModal
        toAddUserData={toAddGoalUserData}
        afterCreate={refetchGoals}
        isOpen={isNewGoalModalOpen}
        onRequestClose={CloseNewGoalModal}
      />
      <EditGoalModal
        toEditGoalData={toEditGoalUserData}
        afterEdit={refetch}
        isOpen={isEditGoalModalOpen}
        onRequestClose={CloseEditGoalModal}
      />
      <ConfirmGoalRemoveModal
        toRemoveGoalData={toRemoveGoalData}
        afterRemove={refetchGoals}
        isOpen={isConfirmGoalRemoveModalOpen}
        onRequestClose={CloseConfirmRemoveGoalModal}
      />

      <ListGoalsModal
        toAddUserData={toAddGoalUserData}
        goals={listGoals}
        afterEdit={refetch}
        isOpen={isListGoalsModalOpen}
        onRequestClose={CloseListGoalsModal}
        openNewGoalModal={OpenNewGoalModal}
        openConfirmRemoveGoalModal={OpenConfirmRemoveGoalModal}
      />

      <IncludeUserModal
        afterEdit={refetch}
        toIncludeUserProps={includeUserData}
        isOpen={isIncludeUserModalOpen}
        onRequestClose={CloseIncludeUserModal}
      />

      {
        user && (
          <ConfirmTeamUnicludeUserModal
            afterRemove={refetch}
            toRemoveUser={user}
            toRemoveTeamId={(profile && profile.teams.length > 0) ? profile.teams[0].id : 0}
            isOpen={isConfirmUnicludeUserModalOpen}
            onRequestClose={CloseConfirmUnicludeUserModal}
          />
        )
      }

        <HStack as="form" spacing="12" w="100%" mb="6">
            <Text fontWeight="500" w="100%" fontSize="xl">Equipe:</Text>

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
                    )
            }

        </HStack>

      <GoalsBoard teamId={team?.id}/>

      {
        (team) && (
          <SolidButton
            onClick={() => OpenTeamIncludeUserModal(team.id)}
            mb="12"
            color="white"
            bg="orange.400"
            icon={PlusIcon}
            colorScheme="orange"
          >
            Adicionar Integrante
          </SolidButton>
        )
      }

      <HStack
        as="form"
        spacing="24px"
        w="100%"
        onSubmit={handleSubmit(handleSearchUser)}
      >
        <Input
          register={register}
          name="search"
          variant="filled"
          type="text"
          icon={SearchIcon}
          error={formState.errors.search}
          focusBorderColor="orange.400"
          placeholder="Procurar"
        />

        {/* <Select register={register} name="company" error={formState.errors.company} focusBorderColor="orange.400">
                        <option value="0">Empresa</option>
                        {companies.data && companies.data.map((company:Company) => {
                            return (
                                <option key={company.id} value={company.id}>{company.name}</option>
                            )
                        })}
                </Select> */}

        <OutlineButton
          type="submit"
          colorScheme="orange"
          color="orange.400"
          borderColor="orange.400"
          h="45px"
          size="sm"
          borderRadius="full"
          variant="outline"
        >
          Filtrar
        </OutlineButton>
      </HStack>

      <Board mt="50px">
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
            <Text>Erro listar os vendedores</Text>
          </Flex>
        ) : (
          data.length === 0 && (
            <Flex justify="center">
              <Text>Nenhum vendedor(a) encontrado.</Text>
            </Flex>
          )
        )}

        {(!isLoading && !error && data.length !== 0 && team) && (
          <Table
            header={[
              {
                text: '',
                icon: ProfileIcon
              },
              {
                text: 'Conversão'
              },
              {
                text: 'Metas'
              },
              {
                text: 'Meta atual'
              },
              {
                text: 'Vendido'
              },
              {
                text: 'Último acesso'
              },
              {
                text: ''
              }
            ]}
          >
            {/* ITEMS */}
            {!isLoading &&
              !error &&
              data.map((user: User) => {
                const goal = user.goals.find(goal => {
                  return goal.month == month
                })

                const salesAmount = user.quotas ?  user.quotas.reduce((sumAmount:number, quota:Quota) => {
                    return sumAmount + quota.credit;
                }, 0) : 0;

                return (
                  <Tr key={user.id}>
                    <Td alignItems="center" display="flex">
                      <Text
                        display="flex"
                        fontSize="sm"
                        color="gray.700"
                        fontWeight="600"
                      >
                        {user.name} {user.last_name && user.last_name}
                      </Text>
                    </Td>
                    <Td fontSize="sm" color="gray.800">
                      {user.conversion_percent}%
                    </Td>
                    <Td fontSize="sm" color="gray.800">
                      <Text fontSize="">
                        {user.goal_amount ? user.goal_amount : 0}-
                        {user.goals.length}
                      </Text>
                    </Td>
                    <Td fontSize="sm" color="gray.800">
                      {goal ? (
                        <Stack>
                          <HStack>
                            <Text
                              onClick={() =>
                                OpenEditGoalModal({
                                  id: goal.id,
                                  month: goal.month,
                                  name: user.name,
                                  value: goal.value.toString().replace('.', ',')
                                })
                              }
                              cursor="pointer"
                              fontWeight="bold"
                              _hover={{ textDecoration: 'underline' }}
                            >
                              {Intl.NumberFormat('pt-BR', {
                                style: 'currency',
                                currency: 'BRL'
                              }).format(goal.value)}
                            </Text>
                            <IconButton
                              onClick={() =>
                                OpenConfirmRemoveGoalModal({
                                  id: goal.id,
                                  name: user.name,
                                  month: goal.month
                                })
                              }
                              h="24px"
                              w="23px"
                              p="0"
                              float="right"
                              aria-label="Excluir venda"
                              border="none"
                              icon={
                                <CloseIcon
                                  width="20px"
                                  stroke="#C30052"
                                  fill="none"
                                />
                              }
                              variant="outline"
                            />
                            <IconButton
                              onClick={() =>
                                OpenListGoalsModal(user.goals, {
                                  id: user.id,
                                  name: user.name
                                })
                              }
                              h="24px"
                              w="23px"
                              p="0"
                              float="right"
                              aria-label="Excluir venda"
                              border="none"
                              icon={
                                <PasteIcon
                                  width="17px"
                                  stroke="#4e4b66"
                                  fill="none"
                                />
                              }
                              variant="outline"
                            />
                          </HStack>
                        </Stack>
                      ) : (
                        <HStack>
                          <OutlineButton
                            onClick={() =>
                              OpenNewGoalModal({ id: user.id, name: user.name })
                            }
                            icon={PlusIcon}
                            h="30px"
                            px="3"
                            variant="outline"
                            size="sm"
                            fontSize="11"
                            color="green.400"
                            colorScheme="green"
                          >
                            Adicionar
                          </OutlineButton>

                          <IconButton
                            onClick={() =>
                              OpenListGoalsModal(user.goals, {
                                id: user.id,
                                name: user.name
                              })
                            }
                            h="24px"
                            w="23px"
                            p="0"
                            float="right"
                            aria-label="Excluir venda"
                            border="none"
                            icon={
                              <PasteIcon
                                width="17px"
                                stroke="#4e4b66"
                                fill="none"
                              />
                            }
                            variant="outline"
                          />
                        </HStack>
                      )}
                    </Td>
                    <Td fontSize="sm" color="gray.800">
                      {Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(salesAmount)}
                    </Td>
                    <Td fontSize="sm" color="gray.800">
                      12/07/2021
                    </Td>
                    <Td>
                      <HStack spacing="4">
                        <Link to={`/historico/${user.id}`}>
                          <HStack>
                            <Icon
                              as={PasteIcon}
                              stroke="#4e4b66"
                              fill="none"
                              width="11"
                              strokeWidth="3"
                            />
                            <Text fontSize="12px" color="gray.800">
                              Histórico
                            </Text>
                          </HStack>
                        </Link>
                        {/* <EditButton onClick={() => OpenEditModal({id: user.id, name: user.name, phone: user.phone, email: user.email, role: user.role.id }) }/> */}
                      </HStack>
                    </Td>
                    <Td>
                      <RemoveButton
                        onClick={() => OpenConfirmUnicludeUserModal(user)}
                      />
                    </Td>
                  </Tr>
                )
              })}
          </Table>
        )}
      </Board>
    </MainBoard>
  )
}
