import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Flex, Stack } from '@chakra-ui/react'
import { Input } from '../../../components/Forms/Inputs/Input'
import { Select } from '../../../components/Forms/Selects/Select'
import { OutlineButton } from '../../../components/Buttons/OutlineButton'
import { LeadsFilterData } from '../../../hooks/useLeads'
import { DataOrigin, LeadStatus, User } from '../../../types'
import { useState, useEffect } from 'react'
import { api } from '../../../services/api'

interface SearchLeadsProps {
  filter: LeadsFilterData
  handleSearchLeads: (filter: LeadsFilterData) => void
  origins: DataOrigin[]
  statuses: LeadStatus[]
}

const FilterLeadsFormSchema = yup.object().shape({
  search: yup.string(),
  start_date: yup.string(),
  end_date: yup.string(),
  category: yup.string(),
  company: yup.string(),
  contract: yup.string(),
  group: yup.string(),
  quote: yup.string(),
  status: yup.string(),
  pay_to_user: yup.string(),
  cancelled: yup.string()
})

export function SearchLeads({
  filter,
  handleSearchLeads,
  statuses,
  origins
}: SearchLeadsProps) {
  const { register, handleSubmit, control, reset, formState } =
    useForm<LeadsFilterData>({
      resolver: yupResolver(FilterLeadsFormSchema)
    })

  const [users, setUsers] = useState<User[]>([])

  const loadUsers = async () => {
    const { data } = await api.get('/users', {
      params: {
        role: 5
      }
    })

    setUsers(data)
  }

  useEffect(() => {
    loadUsers()
  }, [])

  return (
    <Flex as="form" mb="20" onSubmit={handleSubmit(handleSearchLeads)}>
      <Stack spacing="6" w="100%">
        <Stack
          direction={['column', 'column', 'row']}
          spacing="6"
          flexWrap={['wrap', 'wrap', 'nowrap']}
        >
          <Input
            register={register}
            name="search"
            type="text"
            placeholder="Procurar"
            variant="filled"
            error={formState.errors.search}
            focusBorderColor="orange.400"
          />

          <Input
            register={register}
            name="start_date"
            type="date"
            placeholder="Data Inicial"
            variant="filled"
            error={formState.errors.start_date}
            focusBorderColor="orange.400"
          />
          <Input
            register={register}
            name="end_date"
            type="date"
            placeholder="Data Final"
            variant="filled"
            error={formState.errors.end_date}
            focusBorderColor="orange.400"
          />
        </Stack>

        <Stack direction={['column', 'column', 'row']} spacing="6">
          <Select
            register={register}
            defaultValue="true"
            h="45px"
            name="status"
            error={formState.errors.status}
            w="100%"
            maxW="200px"
            fontSize="sm"
            placeholder="Status"
            focusBorderColor="orange.400"
            bg="gray.400"
            variant="filled"
            _hover={{ bgColor: 'gray.500' }}
            size="lg"
            borderRadius="full"
          >
            {statuses.map((status: LeadStatus) => {
              return <option value={status.id}>{status.name}</option>
            })}
          </Select>

          <Select
            register={register}
            defaultValue="true"
            h="45px"
            name="origin"
            error={formState.errors.origin}
            w="100%"
            placeholder="Origem do lead"
            maxW="200px"
            fontSize="sm"
            focusBorderColor="orange.400"
            bg="gray.400"
            variant="filled"
            _hover={{ bgColor: 'gray.500' }}
            size="lg"
            borderRadius="full"
          >
            {origins.map((origin: DataOrigin) => {
              return <option value={origin.id}>{origin.name}</option>
            })}
          </Select>

          <Select
            register={register}
            defaultValue="true"
            h="45px"
            name="user"
            error={formState.errors.user}
            w="100%"
            placeholder="Vendedor(a)"
            maxW="200px"
            fontSize="sm"
            focusBorderColor="orange.400"
            bg="gray.400"
            variant="filled"
            _hover={{ bgColor: 'gray.500' }}
            size="lg"
            borderRadius="full"
          >
            {users.map((user: User) => {
              return <option value={user.id}>{user.name}</option>
            })}
          </Select>

          <OutlineButton
            type="submit"
            mb="10"
            color="orange.400"
            borderColor="orange.400"
            colorScheme="orange"
          >
            Filtrar
          </OutlineButton>
        </Stack>
      </Stack>
    </Flex>
  )
}
