import { SolidButton } from '../../../components/Buttons/SolidButton'
import { CompanySelectMaster } from '../../../components/CompanySelect/companySelectMaster'
import { MainBoard } from '../../../components/MainBoard'

import { ReactComponent as PlusIcon } from '../../../assets/icons/Plus.svg'
import { ReactComponent as SearchIcon } from '../../../assets/icons/Search.svg'
import { ReactComponent as HomeIcon } from '../../../assets/icons/Home.svg'
import { ReactComponent as PasteIcon } from '../../../assets/icons/Paste.svg'
import { ReactComponent as StarIcon } from '../../../assets/icons/Star.svg'
import { ReactComponent as ProfileIcon } from '../../../assets/icons/Profile.svg'

import { UserFilterData, useUsers } from '../../../hooks/useUsers'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Avatar, Flex, HStack, Spinner, Td, Text, Tr } from '@chakra-ui/react'
import { Input } from '../../../components/Forms/Inputs/Input'
import { Select } from '../../../components/Forms/Selects/Select'
import { OutlineButton } from '../../../components/Buttons/OutlineButton'
import { Board } from '../../../components/Board'

import { Table as ProTable } from '../../../components/Table'
import { User } from '../../../types'
import { Users } from 'react-feather'



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
  seller_commission_rule_id?: number;
}

interface RemoveUserData {
  id: number
  name: string
}

export default function Teams() {
  const [filter, setFilter] = useState<UserFilterData>(() => {
    const data: UserFilterData = {
      search: '',
      quotas: true
    }

    return data
  })


  const { data, isLoading, refetch, error } = useUsers(filter);

  const { register, handleSubmit, formState } = useForm<UserFilterData>({
    resolver: yupResolver(SearchUserFormSchema)
  })

  const handleSearchUser = async (search: UserFilterData) => {
    console.log(search)
    setFilter(search)
  }


  return (
    <MainBoard sidebar="commercial" header={<CompanySelectMaster />} >
      <SolidButton
        onClick={() => {}}
        mb="12"
        color="white"
        bg="orange.400"
        icon={PlusIcon}
        colorScheme="orange"
      >
        Adicionar Integrante
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

        <OutlineButton
          type="submit"
          colorScheme="orange"
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
              text: 'Contratos',
              icon: PasteIcon
            },
            // {
            //   text: 'Clientes',
            //   icon: Users
            // },
            {
              text: 'Metas',
              icon: StarIcon
            },
            {
              text: 'Vendidos',
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
              console.log(user);
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
                  <Td fontSize="sm" color="gray.800">
                    {user.quotas ? user.quotas.length : 0}
                  </Td>
                  <Td fontSize="sm" color="gray.800">
                    {user.quotas ? user.quotas.length : 0}
                  </Td>
                  <Td>
                    <HStack spacing="4">
                      {/* <RemoveButton
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
                            seller_commission_rule_id: user.seller_commission_rule_id,
                          })
                        }
                      /> */}
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
