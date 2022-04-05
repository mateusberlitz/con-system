import {
  Checkbox,
  Flex,
  FormControl,
  Text,
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
  useToast
} from '@chakra-ui/react'
import { SolidButton } from '../../../components/Buttons/SolidButton'

import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { api } from '../../../services/api'
import { useHistory } from 'react-router'
import { useErrors } from '../../../hooks/useErrors'
import { Branch, Company } from '../../../types'
import { useEffect } from 'react'
import { isAuthenticated } from '../../../services/auth'
import { redirectMessages } from '../../../utils/redirectMessages'
import { useBranches } from '../../../hooks/useBranches'

interface SyncBranchesModalProps {
  isOpen: boolean
  toEditUserData: SyncBranchesUserData
  onRequestClose: () => void
  afterEdit: () => void
}

interface SyncBranch {
  [key: number]: string
}

export interface SyncBranchesUserData {
  id: number
  name: string
  branches: Branch[]
}

const EditUserFormSchema = yup.object().shape({
  phone: yup.string().min(9, 'Existe Telefone com menos de 9 dígitos?'), //51991090700
  email: yup
    .string()
    .required('Informe um E-mail')
    .email('Informe um e-mail válido'),
  role: yup.number().required('Selecione um Cargo')
})

export function SyncBranchesModal({
  isOpen,
  toEditUserData,
  afterEdit,
  onRequestClose
}: SyncBranchesModalProps) {
  const branches = useBranches({})

  const history = useHistory()
  const toast = useToast()
  const { showErrors } = useErrors()

  const { register, handleSubmit, formState, reset } = useForm()

  const handleSaveBranches = async (data: any) => {
    //Retorna um array com a ID das permissões ativas
    const filteredBranches = Object.values(data).filter(
      (companyKey, companyIndex, companyArray) => {
        return (
          parseInt(Object.keys(data)[companyIndex].split('-')[0]) ===
            toEditUserData.id && companyKey !== false
        )
      }
    )

    //transforma o Array de permissões em um objeto do tipo SyncBranchs
    const syncedBranches = filteredBranches.reduce(
      (syncCompanies: SyncBranch, companyField: any, permissionIndex) => {
        syncCompanies[parseInt(companyField)] = 'on'
        return syncCompanies
      },
      {} as SyncBranch
    )

    console.log(filteredBranches)

    try {
      await api.post(
        `/users/${toEditUserData.id}/sync_branches`,
        syncedBranches
      )

      toast({
        title: 'Sucesso',
        description: 'Permissões sincronizadas.',
        status: 'success',
        duration: 12000,
        isClosable: true
      })

      afterEdit()
      onRequestClose()
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

  return (
    <Modal isOpen={isOpen} onClose={onRequestClose} size="xl">
      <ModalOverlay />
      <ModalContent
        as="form"
        borderRadius="24px"
        onSubmit={handleSubmit(handleSaveBranches)}
      >
        <ModalHeader p="10" fontWeight="700" fontSize="2xl">
          Filiais do usuário {toEditUserData.name}
        </ModalHeader>

        <ModalCloseButton top="10" right="5" />

        <ModalBody pl="10" pr="10">
          <Stack spacing="6">
            <Flex>
              {!branches.isLoading && !branches.error && (
                <Stack spacing="10" direction="column">
                  {!branches.isLoading &&
                    !branches.isError &&
                    branches.data?.data.map((branch: Branch) => {
                      let checkOption = false
                      if (toEditUserData.branches) {
                        if (
                          toEditUserData.branches.find(
                            (userCompany: Company) =>
                              userCompany.id === branch.id
                          )
                        ) {
                          checkOption = true
                        }
                      }

                      console.log(branch)

                      return (
                        <FormControl
                          key={`${toEditUserData.id}-${branch.id}`}
                          pos="relative"
                        >
                          <Checkbox
                            {...register(`${toEditUserData.id}-${branch.id}`)}
                            defaultChecked={checkOption}
                            value={branch.id}
                            colorScheme="purple"
                            size="md"
                            mr="15"
                            borderRadius="full"
                            fontSize="sm"
                            color="gray.800"
                          >
                            <HStack>
                              <Text color="gray.700">
                                {branch.company.name} -{' '}
                              </Text>
                              <Text fontWeight="semibold">{branch.name}</Text>
                            </HStack>
                          </Checkbox>
                        </FormControl>
                      )
                    })}

                  {/* <FormControl pos="relative">
                                        <Text mb="4" fontWeight="600">Configurações</Text>

                                        <RadioGroup name="cobranca">
                                            <HStack spacing="6">
                                                <ChakraRadio value="2" colorScheme="purple" color="purple.300" variant="check" defaultIsChecked>Acesso Completo</ChakraRadio>
                                                <ChakraRadio value="3" colorScheme="purple">Acesso Limitado</ChakraRadio>
                                            </HStack>
                                        </RadioGroup>
                                    </FormControl> */}
                </Stack>
              )}

              {branches.isLoading ? (
                <Flex justify="center">
                  <Spinner />
                </Flex>
              ) : (
                branches.error && (
                  <Flex justify="center" mt="4" mb="4">
                    <Text>Erro ao obter as filiais</Text>
                  </Flex>
                )
              )}
            </Flex>
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
            Atualizar
          </SolidButton>

          <Link onClick={onRequestClose} color="gray.700" fontSize="14px">
            Cancelar
          </Link>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
