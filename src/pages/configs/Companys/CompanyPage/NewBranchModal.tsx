import {
  HStack,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  useToast
} from '@chakra-ui/react'
import { SolidButton } from '../../../../components/Buttons/SolidButton'

import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { api } from '../../../../services/api'
import { useHistory } from 'react-router'
import { useErrors } from '../../../../hooks/useErrors'

import { Input } from '../../../../components/Forms/Inputs/Input'
import { isAuthenticated } from '../../../../services/auth'
import { useEffect } from 'react'
import { redirectMessages } from '../../../../utils/redirectMessages'
import { Select } from '../../../../components/Forms/Selects/Select'
import { useUsers } from '../../../../hooks/useUsers'
import { Company, State, User } from '../../../../types'
import { useCompanies } from '../../../../hooks/useCompanies'
import { useStates } from '../../../../hooks/useStates'

interface NewCompanyModalProps {
  isOpen: boolean
  onRequestClose: () => void
  afterCreate: () => void
}

interface CreateNewBranchFormData {
  name: string
  address: string
  phone?: string
  email?: string
  cnpj?: string
  manager: number
  company: number
  state: number
  city: string
}

const CreateNewBranchFormSchema = yup.object().shape({
  name: yup.string().required('Nome da filial obrigatório'),
  company: yup.number().required('A qual essa filial pertence?'),
  manager: yup.number().required('Informe o gerente desta filial'),
  state: yup.number().required('Informe o estado'),
  city: yup.string().required('Informe o estado'),
  address: yup.string().required('Endereço Obrigatório'),
  phone: yup.string().min(9, 'Informe um telefone com 9 dígitos'), //51991090700
  email: yup.string().email('Informe um e-mail válido'),
  cnpj: yup.string().min(12, 'Não parece ser um CNPJ correto') //02.999.999/0001-00
})

export function NewBranchModal({
  isOpen,
  onRequestClose,
  afterCreate
}: NewCompanyModalProps) {
  const history = useHistory()
  const toast = useToast()
  const { showErrors } = useErrors()

  const { register, handleSubmit, reset, formState } =
    useForm<CreateNewBranchFormData>({
      resolver: yupResolver(CreateNewBranchFormSchema)
    })

  const handleCreateNewBranch = async (branchData: CreateNewBranchFormData) => {
    try {
      await api.post('/branches/store', branchData)

      toast({
        title: 'Sucesso',
        description: `A nova filial ${branchData.name} foi cadastrada`,
        status: 'success',
        duration: 12000,
        isClosable: true
      })

      onRequestClose()
      afterCreate()
      reset()
    } catch (error: any) {
      showErrors(error, toast)

      if (error.response.data.access) {
        history.push('/')
      }
    }
  }

  useEffect(() => {
    if (!isAuthenticated()) {
      history.push({
        pathname: '/',
        state: redirectMessages.auth
      })
    }
  }, [isOpen])

  const users = useUsers({})
  const companies = useCompanies()
  const states = useStates()

  return (
    <Modal isOpen={isOpen} onClose={onRequestClose} size="xl">
      <ModalOverlay />
      <ModalContent
        as="form"
        borderRadius="24px"
        onSubmit={handleSubmit(handleCreateNewBranch)}
      >
        <ModalHeader p="10" fontWeight="700" fontSize="2xl">
          Cadastrar Filial
        </ModalHeader>

        <ModalCloseButton top="10" right="5" />

        <ModalBody pl="10" pr="10">
          <Stack spacing="6">
            <Input
              register={register}
              name="name"
              type="text"
              placeholder="Nome da filial"
              variant="outline"
              error={formState.errors.name}
              focusBorderColor="purple.300"
            />

            <Select
              register={register}
              h="45px"
              name="company"
              value="0"
              w="100%"
              fontSize="sm"
              focusBorderColor="purple.300"
              bg="gray.400"
              variant="outline"
              _hover={{ bgColor: 'gray.500' }}
              size="lg"
              borderRadius="full"
              placeholder="Empresa"
              error={formState.errors.company}
            >
              {!companies.isLoading &&
                !companies.error &&
                companies.data.map((company: Company) => {
                  return (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  )
                })}
            </Select>

            <Input
              register={register}
              name="phone"
              type="text"
              placeholder="Telefone"
              variant="outline"
              mask="phone"
              error={formState.errors.phone}
              focusBorderColor="purple.600"
            />
            <Input
              register={register}
              name="email"
              type="email"
              placeholder="E-mail"
              variant="outline"
              error={formState.errors.email}
              focusBorderColor="purple.600"
            />

            <Select
              register={register}
              h="45px"
              name="manager"
              value="0"
              w="100%"
              fontSize="sm"
              focusBorderColor="purple.300"
              bg="gray.400"
              variant="outline"
              _hover={{ bgColor: 'gray.500' }}
              size="lg"
              borderRadius="full"
              placeholder="Gerente"
              error={formState.errors.manager}
            >
              {!users.isLoading &&
                !users.error &&
                users.data.map((user: User) => {
                  return (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  )
                })}
            </Select>

            <HStack spacing="4" align="baseline" justifyContent="flex-end">
              <Select
                register={register}
                h="45px"
                name="state"
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
                error={formState.errors.state}
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
                name="city"
                type="text"
                placeholder="Cidade"
                variant="outline"
                mask=""
                error={formState.errors.city}
                focusBorderColor="purple.600"
              />
            </HStack>

            <Input
              register={register}
              name="address"
              type="text"
              placeholder="Endereço"
              variant="outline"
              error={formState.errors.address}
              focusBorderColor="purple.600"
            />
          </Stack>
        </ModalBody>

        <ModalFooter p="10">
          <SolidButton
            mr="6"
            color="white"
            bg="purple.300"
            colorScheme="purple"
            type="submit"
            isLoading={formState.isSubmitting}
          >
            Cadastrar
          </SolidButton>

          <Link onClick={onRequestClose} color="gray.700" fontSize="14px">
            Cancelar
          </Link>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
