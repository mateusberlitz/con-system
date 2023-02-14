import {
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
import { SolidButton } from '../../../components/Buttons/SolidButton'

import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { api } from '../../../services/api'
import { useHistory } from 'react-router'
import { useErrors } from '../../../hooks/useErrors'

import { Input } from '../../../components/Forms/Inputs/Input'
import { isAuthenticated } from '../../../services/auth'
import { useEffect } from 'react'
import { redirectMessages } from '../../../utils/redirectMessages'
import { Select } from '../../../components/Forms/Selects/Select'
import { useUsers } from '../../../hooks/useUsers'
import { Branch, Company, Desk, State, User } from '../../../types'
import { useCompanies } from '../../../hooks/useCompanies'
import { useDesks } from '../../../hooks/useDesks'
import { useBranches } from '../../../hooks/useBranches'

interface NewTeamModalProps {
  isOpen: boolean
  onRequestClose: () => void
  afterCreate: () => void
}

interface CreateNewTeamFormData {
  name: string
  manager: number
  company: number
  branch?: number
  desk: number
}

const CreateNewTeamFormSchema = yup.object().shape({
  name: yup.string().required('Nome da filial obrigatório'),
  company: yup.number().required('A qual essa filial pertence?'),
  branch: yup.number().transform((v, o) => (o === '' ? null : v)).nullable(),
  manager: yup.number().nullable(),
  desk: yup.number().required('Informe o setor desta equipe')
})

export function NewTeamModal({
  isOpen,
  onRequestClose,
  afterCreate
}: NewTeamModalProps) {
  const history = useHistory()
  const toast = useToast()
  const { showErrors } = useErrors()

  const { register, handleSubmit, reset, formState, watch } =
    useForm<CreateNewTeamFormData>({
      resolver: yupResolver(CreateNewTeamFormSchema)
    })

  const handleCreateNewBranch = async (teamData: CreateNewTeamFormData) => {
    try {
      await api.post('/teams/store', teamData)

      toast({
        title: 'Sucesso',
        description: `A nova equipe ${teamData.name} foi cadastrada`,
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
  const desks = useDesks()
  const companies = useCompanies()
  const branches = useBranches({ company: watch('company') })

  console.log(watch())

  return (
    <Modal isOpen={isOpen} onClose={onRequestClose} size="xl">
      <ModalOverlay />
      <ModalContent
        as="form"
        borderRadius="24px"
        onSubmit={handleSubmit(handleCreateNewBranch)}
      >
        <ModalHeader p="10" fontWeight="700" fontSize="2xl">
          Cadastrar Equipe
        </ModalHeader>

        <ModalCloseButton top="10" right="5" />

        <ModalBody pl="10" pr="10">
          <Stack spacing="6">
            <Input
              register={register}
              name="name"
              type="text"
              placeholder="Nome da equipe"
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

            <Select
              register={register}
              h="45px"
              name="branch"
              value="0"
              w="100%"
              fontSize="sm"
              focusBorderColor="purple.300"
              bg="gray.400"
              variant="outline"
              _hover={{ bgColor: 'gray.500' }}
              size="lg"
              borderRadius="full"
              placeholder="Filial"
              error={formState.errors.branch}
            >
              {!branches.isLoading &&
                !branches.error &&
                branches.data?.data.map((branch: Branch) => {
                  return (
                    <option key={branch.id} value={branch.id}>
                      {branch.name}
                    </option>
                  )
                })}
            </Select>

            <Select
              register={register}
              h="45px"
              name="desk"
              value="0"
              w="100%"
              fontSize="sm"
              focusBorderColor="purple.300"
              bg="gray.400"
              variant="outline"
              _hover={{ bgColor: 'gray.500' }}
              size="lg"
              borderRadius="full"
              placeholder="Setor"
              error={formState.errors.desk}
            >
              {!desks.isLoading &&
                !desks.error &&
                desks.data.map((desk: Desk) => {
                  return (
                    <option key={desk.id} value={desk.id}>
                      {desk.name}
                    </option>
                  )
                })}
            </Select>

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
