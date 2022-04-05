import {
  Flex,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Stack,
  Text,
  toast,
  useToast
} from '@chakra-ui/react'
import { useUsers } from '../../../hooks/useUsers'
import {
  ReactSelect,
  SelectOption
} from '../../../components/Forms/ReactSelect'
import { SolidButton } from '../../../components/Buttons/SolidButton'

import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { api } from '../../../services/api'
import { showErrors } from '../../../hooks/useErrors'
import { useHistory } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Branch, Company, Team, User } from '../../../types'

interface IncludeUserModalProps {
  isOpen: boolean
  toIncludeUserProps: IncludeUserData
  onRequestClose: () => void
  afterEdit: () => void
}

export interface IncludeUserData {
  company?: number
  companyName?: string
  branch?: number
  branchName?: string
  team?: number
  teamName?: string
}

interface IncludeUserFormData {
  user: number
  name: string
}

interface Sync {
  [key: number]: string
}

const IncludeUserFormSchema = yup.object().shape({
  user: yup.number().required('Selecione um usuário para incluir')
})

export default function IncludeUserModal({
  isOpen,
  toIncludeUserProps,
  onRequestClose,
  afterEdit
}: IncludeUserModalProps) {
  const toast = useToast()
  const history = useHistory()

  const { register, handleSubmit, control, reset, formState } =
    useForm<IncludeUserFormData>({
      resolver: yupResolver(IncludeUserFormSchema)
    })

  const { isLoading, data, error } = useUsers({})

  const handleSyncNewUser = async (userData: IncludeUserFormData) => {
    try {
      const user: User = await api
        .get(`users/${userData.user}`)
        .then(response => response.data)

      //console.log(user, toIncludeUserProps.branch);

      if (toIncludeUserProps.company) {
        const companyData: Sync = user.companies.reduce(
          (syncCompanies: Sync, company: Company) => {
            syncCompanies[company.id] = 'on'
            return syncCompanies
          },
          {} as Sync
        )

        console.log(companyData)
        companyData[toIncludeUserProps.company] = 'on'

        await api.post(`/users/${userData.user}/sync`, companyData)
      }

      //console.log(toIncludeUserProps.branch);

      if (toIncludeUserProps.branch) {
        const branchData: Sync = user.branches.reduce(
          (syncBranches: Sync, branch: Branch) => {
            syncBranches[branch.id] = 'on'
            return syncBranches
          },
          {} as Sync
        )

        branchData[toIncludeUserProps.branch] = 'on'

        console.log(branchData)

        await api.post(`/users/${userData.user}/sync_branches`, branchData)
      }

      if (toIncludeUserProps.team) {
        const teamData: Sync = user.teams.reduce(
          (syncTeams: Sync, team: Team) => {
            syncTeams[team.id] = 'on'
            return syncTeams
          },
          {} as Sync
        )

        teamData[toIncludeUserProps.team] = 'on'

        await api.post(`/users/${userData.user}/sync_teams`, teamData)
      }

      toast({
        title: 'Sucesso',
        description: `O usuário ${userData.name} foi cadastrado.`,
        status: 'success',
        duration: 12000,
        isClosable: true
      })

      onRequestClose()
      afterEdit()
      reset()
    } catch (error: any) {
      showErrors(error, toast)

      if (error.response.data.access) {
        history.push('/')
      }
    }
  }

  const [userOptions, setUsersOptions] = useState<SelectOption[]>([
    {
      value: '',
      label: 'Selecionar Lead'
    }
  ])

  useEffect(() => {
    if (data) {
      const newLeadOptions: Array<SelectOption> = [
        {
          value: '',
          label: 'Selecionar usuário'
        }
      ]

      data.map((user: User) => {
        newLeadOptions.push({
          value: user.id.toString(),
          label: `${user.name} ${user.last_name && user.last_name}`
        })
      })

      console.log(newLeadOptions)
      setUsersOptions(newLeadOptions)
    }
  }, [data])

  return (
    <Modal isOpen={isOpen} onClose={onRequestClose} size="xl">
      <ModalOverlay />
      <ModalContent
        as="form"
        borderRadius="24px"
        onSubmit={handleSubmit(handleSyncNewUser)}
      >
        <ModalHeader p="10" fontWeight="700" fontSize="2xl">
          Incluir Usuário{' '}
        </ModalHeader>

        <ModalCloseButton top="10" right="5" />

        <ModalBody pl="10" pr="10">
          <Stack spacing="6">
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
                  <Text>Nenhum usuários.</Text>
                </Flex>
              )
            )}

            {!isLoading && !error && (
              <ReactSelect
                control={control}
                color="#5f2eea"
                options={userOptions}
                label="Contato"
                name="user"
                bg="gray.400"
                variant="outline"
                _hover={{ bgColor: 'gray.500' }}
                borderRadius="full"
                error={formState.errors.user}
              />
            )}
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
