import {
  Avatar,
  Divider,
  Flex,
  HStack,
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
  useToast
} from '@chakra-ui/react'
import { SolidButton } from '../../../components/Buttons/SolidButton'

import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { api } from '../../../services/api'
import { useHistory } from 'react-router'
import { useErrors } from '../../../hooks/useErrors'

import { isAuthenticated } from '../../../services/auth'
import { useEffect, useState } from 'react'
import { redirectMessages } from '../../../utils/redirectMessages'

import { useUsers } from '../../../hooks/useUsers'
import { User, Team } from '../../../types'

import {
  ReactSelect,
  SelectOption
} from '../../../components/Forms/ReactSelect'

interface NewTeamModalProps {
  isOpen: boolean
  onRequestClose: () => void
  afterEdit: () => void
  team: number
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

export function TeamUsersModal({
  team,
  isOpen,
  onRequestClose,
  afterEdit
}: NewTeamModalProps) {
  const history = useHistory()
  const toast = useToast()
  const { showErrors } = useErrors()

  const { register, handleSubmit, reset, formState, control } =
    useForm<IncludeUserFormData>({
      resolver: yupResolver(IncludeUserFormSchema)
    })

  const handleSyncNewUser = async (userData: IncludeUserFormData) => {
    try {
      const { data } = await api.get(`/users/${userData.user}/`)

      ////////////
      const teamData: Sync = []
      teamData[team] = 'on'

      data.teams &&
        data.teams.map((team: Team) => {
          teamData[team.id] = 'on'
        })

      await api.post(`/users/${userData.user}/sync_teams`, teamData)

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

  const unincludeUser = async (userData: IncludeUserFormData) => {}

  useEffect(() => {
    if (!isAuthenticated()) {
      history.push({
        pathname: '/',
        state: redirectMessages.auth
      })
    }
  }, [isOpen])

  const users = useUsers({})

  const [userOptions, setUsersOptions] = useState<SelectOption[]>([
    {
      value: '',
      label: 'Selecionar Lead'
    }
  ])

  useEffect(() => {
    if (users.data) {
      const newLeadOptions: Array<SelectOption> = [
        {
          value: '',
          label: 'Selecionar usuário'
        }
      ]

      users.data.map((user: User) => {
        newLeadOptions.push({
          value: user.id.toString(),
          label: `${user.name} ${user.last_name && user.last_name}`
        })
      })

      console.log(newLeadOptions)
      setUsersOptions(newLeadOptions)
    }
  }, [users.data])

  return (
    <Modal isOpen={isOpen} onClose={onRequestClose} size="xl">
      <ModalOverlay />
      <ModalContent borderRadius="24px">
        <ModalHeader p="10" fontWeight="700" fontSize="2xl">
          Integrantes da equipe
        </ModalHeader>

        <ModalCloseButton top="10" right="5" />

        <ModalBody pl="10" pr="10">
          <Stack spacing="8">
            {users.isLoading ? (
              <Flex justify="center">
                <Spinner />
              </Flex>
            ) : users.isError ? (
              <Flex justify="left" mt="4" mb="4">
                <Text>Erro listar as contas a pagar</Text>
              </Flex>
            ) : (
              users.data?.data.length === 0 && (
                <Flex justify="left">
                  <Text>Nenhuma nota encontrada.</Text>
                </Flex>
              )
            )}

            {!users.isLoading &&
              !users.error &&
              Object.keys(users.data?.data).map((day: string) => {
                return users.data?.data[day].map((user: User) => {
                  return (
                    <Stack
                      key={user.id}
                      p="6"
                      border="1px solid"
                      borderColor="gray.400"
                      borderRadius="26px"
                    >
                      <HStack>
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

                        {/* <RemoveButton onClick={() => unincludeUser({ id: user.id}) }/> */}
                      </HStack>
                    </Stack>
                  )
                })
              })}

            <Stack>
              <Text fontWeight="bold">Adicionar Integrante</Text>

              <Divider />
            </Stack>

            <Stack
              as="form"
              spacing="4"
              onSubmit={handleSubmit(handleSyncNewUser)}
            >
              <HStack spacing="6">
                <ReactSelect
                  control={control}
                  color="#5f2eea"
                  options={userOptions}
                  label="Usuário"
                  name="user"
                  bg="gray.400"
                  variant="outline"
                  _hover={{ bgColor: 'gray.500' }}
                  borderRadius="full"
                  error={formState.errors.user}
                />

                <SolidButton
                  mr="6"
                  color="white"
                  bg="purple.400"
                  colorScheme="purple"
                  type="submit"
                  isLoading={formState.isSubmitting}
                >
                  Adicionar
                </SolidButton>
              </HStack>
            </Stack>
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
