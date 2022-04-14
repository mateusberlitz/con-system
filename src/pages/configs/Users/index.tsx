import { Avatar, Flex, HStack, Spinner, Td, Text, Tr } from '@chakra-ui/react'
import { OutlineButton } from '../../../components/Buttons/OutlineButton'
import { Board } from '../../../components/Board'
import { RemoveButton } from '../../../components/Buttons/RemoveButton'
import { EditButton } from '../../../components/Buttons/EditButton'
import { SolidButton } from '../../../components/Buttons/SolidButton'
import { MainBoard } from '../../../components/MainBoard'
import { Table as ProTable } from '../../../components/Table'
import { Input } from '../../../components/Forms/Inputs/Input'
import { Select } from '../../../components/Forms/Selects/Select'

import { ReactComponent as PlusIcon } from '../../../assets/icons/Plus.svg'
import { ReactComponent as SearchIcon } from '../../../assets/icons/Search.svg'
import { ReactComponent as HomeIcon } from '../../../assets/icons/Home.svg'
import { ReactComponent as PasteIcon } from '../../../assets/icons/Paste.svg'
import { ReactComponent as ProfileIcon } from '../../../assets/icons/Profile.svg'

import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { UserFilterData, useUsers } from '../../../hooks/useUsers'

import { Company, Role, User } from '../../../types'
import { useState } from 'react'
import { NewUserModal } from './NewUserModal'
import { EditUserModal } from './EditUserModal'
import { ConfirmUserRemoveModal } from './ConfirmUserRemoveModal'
import { useCompanies } from '../../../hooks/useCompanies'
import { useRoles } from '../../../hooks/useRoles'
import { SyncCompaniesModal, SyncUserData } from './SyncCompaniesModal'
import { SyncBranchesModal, SyncBranchesUserData } from './SyncBranchesModal'

const SearchUserFormSchema = yup.object().shape({
  search: yup.string(),
  company: yup.string(),
  role: yup.string()
})

interface EditUserFormData {
  name: string
  id: number
  phone: string
  email: string
  role: number
  rule_id: number;
}

interface RemoveUserData {
  id: number
  name: string
}

export default function Users() {
  const companies = useCompanies()
  const roles = useRoles()

  const [filter, setFilter] = useState<UserFilterData>(() => {
    const data: UserFilterData = {
      search: ''
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
      role: 0,
      rule_id: 0,
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

  const { register, handleSubmit, formState } = useForm<UserFilterData>({
    resolver: yupResolver(SearchUserFormSchema)
  })

  const handleSearchUser = async (search: UserFilterData) => {
    console.log(search)
    setFilter(search)
  }

  const [editSyncUserData, setEditSyncUserData] = useState<SyncUserData>(() => {
    const data: SyncUserData = {
      name: '',
      id: 0,
      companies: []
    }

    return data
  })

  const [isSyncCompaniesModalOpen, setIsSyncCompaniesModalOpen] =
    useState(false)
  function OpenSyncCompaniesModal(user: SyncUserData) {
    setEditSyncUserData(user)
    setIsSyncCompaniesModalOpen(true)
  }
  function CloseSyncCompaniesModal() {
    setIsSyncCompaniesModalOpen(false)
  }

  const [editBranchesSyncUserData, setEditBranchesSyncUserData] =
    useState<SyncBranchesUserData>(() => {
      const data: SyncBranchesUserData = {
        name: '',
        id: 0,
        branches: []
      }

      return data
    })

  const [isSyncBranchesModalOpen, setIsSyncBranchesModalOpen] = useState(false)
  function OpenSyncBranchesModal(user: SyncBranchesUserData) {
    setEditBranchesSyncUserData(user)
    setIsSyncBranchesModalOpen(true)
  }
  function CloseSyncBranchesModal() {
    setIsSyncBranchesModalOpen(false)
  }

  return (
    <MainBoard sidebar="configs">
      <NewUserModal
        afterCreate={refetch}
        isOpen={isNewUserModalOpen}
        onRequestClose={CloseNewUserModal}
      />
      <EditUserModal
        afterEdit={refetch}
        toEditUserData={editUserData}
        isOpen={isEditModalOpen}
        onRequestClose={CloseEditModal}
      />
      <SyncCompaniesModal
        afterEdit={refetch}
        toEditUserData={editSyncUserData}
        isOpen={isSyncCompaniesModalOpen}
        onRequestClose={CloseSyncCompaniesModal}
      />
      <SyncBranchesModal
        afterEdit={refetch}
        toEditUserData={editBranchesSyncUserData}
        isOpen={isSyncBranchesModalOpen}
        onRequestClose={CloseSyncBranchesModal}
      />
      <ConfirmUserRemoveModal
        afterRemove={refetch}
        toRemoveUserData={removeUserData}
        isOpen={isConfirmUserRemoveModalOpen}
        onRequestClose={CloseConfirmUserRemoveModal}
      />

      <SolidButton
        onClick={OpenNewUserModal}
        mb="12"
        color="white"
        bg="purple.300"
        icon={PlusIcon}
        colorScheme="purple"
      >
        Adicionar Usuário
      </SolidButton>

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
          focusBorderColor="purple.600"
          placeholder="Procurar"
        />

        <Select
          register={register}
          name="role"
          error={formState.errors.role}
          focusBorderColor="purple.600"
        >
          <option value="0">Cargo</option>
          {roles.data &&
            roles.data.map((role: Role) => {
              return (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              )
            })}
        </Select>

        <Select
          register={register}
          name="company"
          error={formState.errors.company}
          focusBorderColor="purple.600"
        >
          <option value="0">Empresa</option>
          {companies.data &&
            companies.data.map((company: Company) => {
              return (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              )
            })}
        </Select>

        <OutlineButton
          type="submit"
          colorScheme="purple"
          h="45px"
          size="sm"
          borderRadius="full"
          variant="outline"
        >
          Filtrar
        </OutlineButton>
      </HStack>

      <Board mt="50px">
        <ProTable
          header={[
            {
              text: 'Usuários',
              icon: ProfileIcon
            },
            {
              text: 'Empresas',
              icon: HomeIcon
            },
            {
              text: 'Filiais',
              icon: HomeIcon
            },
            {
              text: 'Cargo',
              icon: PasteIcon
            },
            {
              text: 'Ações'
              //icon: ConfigureIcon
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
                  <Td
                    whiteSpace="nowrap"
                    fontSize="sm"
                    color="blue.800"
                    cursor="pointer"
                    onClick={() =>
                      OpenSyncCompaniesModal({
                        id: user.id,
                        name: user.name,
                        companies: user.companies
                      })
                    }
                  >
                    {user.companies.length > 0
                      ? user.companies[0].name
                      : 'Sem empresas'}{' '}
                    {user.companies.length > 1 &&
                      `+ ${user.companies.length - 1}`}
                  </Td>
                  <Td
                    whiteSpace="nowrap"
                    fontSize="sm"
                    color="blue.800"
                    cursor="pointer"
                    onClick={() =>
                      OpenSyncBranchesModal({
                        id: user.id,
                        name: user.name,
                        branches: user.branches
                      })
                    }
                  >
                    {user.branches.length > 0
                      ? user.branches[0].name
                      : 'Sem filiais'}{' '}
                    {user.branches.length > 1 &&
                      `+ ${user.branches.length - 1}`}
                  </Td>
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
                            role: user.role.id,
                            rule_id: user.rule.id,
                          })
                        }
                      />
                    </HStack>
                  </Td>
                </Tr>
              )
            })}
        </ProTable>

        {isLoading ? (
          <Flex justify="center">
            <Spinner />
          </Flex>
        ) : (
          error && (
            <Flex justify="center" mt="4" mb="4">
              <Text>Erro ao obter os dados dos usuários</Text>
            </Flex>
          )
        )}
      </Board>
    </MainBoard>
  )
}
