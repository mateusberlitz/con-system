import {
  Checkbox,
  Flex,
  FormControl,
  Text,
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
import { Company } from '../../../types'
import { useCompanies } from '../../../hooks/useCompanies'
import { useRoles } from '../../../hooks/useRoles'
import { useEffect } from 'react'
import { isAuthenticated } from '../../../services/auth'
import { redirectMessages } from '../../../utils/redirectMessages'

interface SyncCompaniesModalProps {
  isOpen: boolean
  toEditUserData: SyncUserData
  onRequestClose: () => void
  afterEdit: () => void
}

interface SyncCompany {
  [key: number]: string
}

export interface SyncUserData {
  id: number
  name: string
  companies: Company[]
}

const EditUserFormSchema = yup.object().shape({
  phone: yup.string().min(9, 'Existe Telefone com menos de 9 dígitos?'), //51991090700
  email: yup
    .string()
    .required('Informe um E-mail')
    .email('Informe um e-mail válido'),
  role: yup.number().required('Selecione um Cargo')
})

export function SyncCompaniesModal({
  isOpen,
  toEditUserData,
  afterEdit,
  onRequestClose
}: SyncCompaniesModalProps) {
  const companies = useCompanies()
  const roles = useRoles()

  const history = useHistory()
  const toast = useToast()
  const { showErrors } = useErrors()

  const { register, handleSubmit, formState, reset } = useForm()

  // const handleEditUser = async (userData : EditUserFormData) => {
  //     try{
  //         await api.post(`/users/edit/${toEditUserData.id}`, userData);

  //         toast({
  //             title: "Sucesso",
  //             description: "Dados do usuário atualizados.",
  //             status: "success",
  //             duration: 12000,
  //             isClosable: true,
  //         });

  //         afterEdit();
  //         onRequestClose();
  //     }catch(error) {
  //         showErrors(error, toast);

  //         if(error.response.data.access){
  //             history.push('/');
  //         }
  //     }
  //}

  // useEffect(() => {
  //     if(toEditUserData.id){
  //         const selectedRoleData = roles.data.filter((user:User) => user.id === toEditUserData.id)[0];

  //         if(selectedRoleData){
  //             setEditRoleData(roles.data.filter((user:User) => user.id === toEditUserData.id)[0]);
  //         }
  //     }
  // }, [toEditUserData])

  const handleSaveCompanies = async (data: any) => {
    //Retorna um array com a ID das permissões ativas
    const filteredCompanies = Object.values(data).filter(
      (companyKey, companyIndex, companyArray) => {
        return (
          parseInt(Object.keys(data)[companyIndex].split('-')[0]) ===
            toEditUserData.id && companyKey !== false
        )
      }
    )

    //transforma o Array de permissões em um objeto do tipo Synccompanys
    const syncedCompanies = filteredCompanies.reduce(
      (syncCompanies: SyncCompany, companyField: any, permissionIndex) => {
        syncCompanies[parseInt(companyField)] = 'on'
        return syncCompanies
      },
      {} as SyncCompany
    )

    console.log(filteredCompanies)

    try {
      await api.post(`/users/${toEditUserData.id}/sync`, syncedCompanies)

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
        onSubmit={handleSubmit(handleSaveCompanies)}
      >
        <ModalHeader p="10" fontWeight="700" fontSize="2xl">
          Empresas do usuário {toEditUserData.name}
        </ModalHeader>

        <ModalCloseButton top="10" right="5" />

        <ModalBody pl="10" pr="10">
          <Stack spacing="6">
            <Flex>
              {!companies.isLoading && !companies.error && (
                <Stack spacing="10" direction="column">
                  {!companies.isLoading &&
                    !companies.isError &&
                    companies.data.map((company: Company) => {
                      let checkOption = false
                      if (toEditUserData.companies) {
                        if (
                          toEditUserData.companies.find(
                            (userCompany: Company) =>
                              userCompany.id === company.id
                          )
                        ) {
                          checkOption = true
                        }
                      }
                      return (
                        <FormControl
                          key={`${toEditUserData.id}-${company.id}`}
                          pos="relative"
                        >
                          <Checkbox
                            {...register(`${toEditUserData.id}-${company.id}`)}
                            defaultChecked={checkOption}
                            value={company.id}
                            colorScheme="purple"
                            size="md"
                            mr="15"
                            borderRadius="full"
                            fontSize="sm"
                            color="gray.800"
                          >
                            {company.name}
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

              {companies.isLoading ? (
                <Flex justify="center">
                  <Spinner />
                </Flex>
              ) : (
                companies.error && (
                  <Flex justify="center" mt="4" mb="4">
                    <Text>Erro ao obter as empresas</Text>
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
