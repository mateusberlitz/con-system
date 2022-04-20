import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Flex, Stack } from '@chakra-ui/react'
import { Input } from '../../../components/Forms/Inputs/Input'
import { Select } from '../../../components/Forms/Selects/Select'
import { OutlineButton } from '../../../components/Buttons/OutlineButton'
import { LeadsFilterData } from '../../../hooks/useLeads'
import { DataOrigin, LeadStatus, State, User } from '../../../types'
import { useState, useEffect } from 'react'
import { api } from '../../../services/api'
import { CustomersFilterData } from '../../../hooks/useCustomers'
import { useCities } from '../../../hooks/useCities'
import { useStates } from '../../../hooks/useStates'

interface SearchCustomersProps {
  filter: CustomersFilterData
  handleSearchCustomers: (filter: CustomersFilterData) => void;
}

const FilterCustomersFormSchema = yup.object().shape({
  search: yup.string().nullable(),
  type_customer: yup.string().nullable(),
  state_id: yup.number().nullable(),
  city: yup.string().nullable(),
  contract: yup.string().nullable(),
  cpf_cnpj: yup.string().nullable(),
  civil_status: yup.string().nullable(),
})

export function SearchCustomers({
  filter,
  handleSearchCustomers,
}: SearchCustomersProps) {
  const { register, handleSubmit, control, reset, formState } =
    useForm<CustomersFilterData>({
      resolver: yupResolver(FilterCustomersFormSchema)
    })

  const cities = useCities();
  const states = useStates();

  return (
    <Flex as="form" mb="20" onSubmit={handleSubmit(handleSearchCustomers)}>
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
            name="type_customer"
            error={formState.errors.type_customer}
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
            <option value="">Tipo de pessoa</option>
            <option value="PF">Pessoa física</option>
            <option value="PJ">Pessoa Jurídica</option>
          </Select>

          <Select
            register={register}
            h="45px"
            name="state_id"
            value="0"
            w="100%"
            fontSize="sm"
            focusBorderColor="purple.300"
            bg="gray.400"
            variant="outline"
            _hover={{ bgColor: 'gray.500' }}
            size="lg"
            borderRadius="full"
            placeholder="Estado"
            error={formState.errors.state_id}
          >
            {!states.isLoading &&
              !states.error &&
              states.data.map((state: State) => {
                return (
                  <option key={state.id} value={state.id}>
                    {state.name}
                  </option>
                )
              })}
          </Select>

          <Input
            register={register}
            name="end_date"
            type="date"
            placeholder="Cidade"
            variant="filled"
            error={formState.errors.end_date}
            focusBorderColor="orange.400"
          />

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
