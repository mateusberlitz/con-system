import {
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
  Stack,
  Text,
  useToast,
  Input as ChakraInput,
  Divider,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Spinner
} from '@chakra-ui/react'
import { SolidButton } from '../../../components/Buttons/SolidButton'

import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { api } from '../../../services/api'
import { useHistory } from 'react-router'
import { useErrors } from '../../../hooks/useErrors'

import { LeadStatus, DataOrigin, Customer, State, City } from '../../../types'
import { useWorkingCompany } from '../../../hooks/useWorkingCompany'
import moneyToBackend from '../../../utils/moneyToBackend'
import { ControlledSelect } from '../../../components/Forms/Selects/ControlledSelect'
import { useEffect } from 'react'
import { isAuthenticated } from '../../../services/auth'
import { redirectMessages } from '../../../utils/redirectMessages'

import { ReactComponent as MinusIcon } from '../../../assets/icons/Minus.svg'
import { ReactComponent as StrongPlusIcon } from '../../../assets/icons/StrongPlus.svg'
import { ControlledInput } from '../../../components/Forms/Inputs/ControlledInput'
import { useProfile } from '../../../hooks/useProfile'
import { useStates } from '../../../hooks/useStates'
import { useCities } from '../../../hooks/useCities'
import { Select } from '../../../components/Forms/Selects/Select'

interface NewLeadModalProps {
  isOpen: boolean
  toEditCustomerData?: EditCustomerFormData;
  onRequestClose: () => void;
  afterEdit: () => void;
}

// export interface EditCustomerFormData {
//   id:number;
//   name:string;
//   email:string;
//   phone: string;
//   type_customer: string;
//   birth_date: string;
//   civil_status: string;
//   city_id: number;
//   state_id: number;
//   cep: string;
//   address: string;
//   neighborhood: string;
//   number: string;
// }

type EditCustomerFormData = Omit<Customer, "quotas" | "city"  | "state">;

const EditCustomerFormSchema = yup.object().shape({
  name: yup.string().required('Nome do cliente obrigatório'),
  email: yup.string().required('E-mail do cliente obrigatório'),
  phone: yup.string().required('Telefone do cliente obrigatório'),
  birth_date: yup.string().nullable(),
  civil_status: yup.string().required('Informe o estado civil'),
  state_id: yup.number().required('Informe o estado'),
  city_id: yup.number().required('Informe a cidade'),
  cep: yup.string().required('Informe o CEP'),
  address: yup.string().required('Informe o endereço'),
  neighborhood: yup.string().required('Informe o bairro'),
  number: yup.string().required('Informe o número'),
})

export function EditCustomerModal({
  isOpen,
  onRequestClose,
  afterEdit,
  toEditCustomerData,
}: NewLeadModalProps) {
  const workingCompany = useWorkingCompany()
  const { profile, permissions } = useProfile()

  const history = useHistory()
  const toast = useToast()
  const { showErrors } = useErrors()

  const { register, handleSubmit, control, reset, watch, formState } =
    useForm<EditCustomerFormData>({
      resolver: yupResolver(EditCustomerFormSchema),
      defaultValues: toEditCustomerData
  });

  const handleEditCustomer = async (customer: EditCustomerFormData) => {
    if(toEditCustomerData){
      try {
        if (!workingCompany.company) {
          toast({
            title: 'Ué',
            description: `Seleciona uma empresa para trabalhar`,
            status: 'warning',
            duration: 12000,
            isClosable: true
          })
  
          return
        }
  
        if (!profile) {
          return
        }

        //console.log({...toEditCustomerData, ...customer});
  
        const response = await api.put(
          `/customers/${toEditCustomerData.id}`,
          {...toEditCustomerData, ...customer}
        )
  
        toast({
          title: 'Sucesso',
          description: `O cliente ${customer.name} foi atualizado.`,
          status: 'success',
          duration: 12000,
          isClosable: true
        })
  
        await api.post('/logs/store', {
          user: profile.id,
          company: workingCompany.company.id,
          action: `Alterou as informações do cliente ${toEditCustomerData.name}`
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
  }

  useEffect(() => {
    if (!isAuthenticated()) {
      history.push({
        pathname: '/',
        state: redirectMessages.auth
      })
    }
  }, [isOpen])

  const states = useStates();

  const selectedState = watch('state_id');
  console.log(selectedState);
  const cities = useCities({state_id: selectedState ? selectedState : 1});

  return (
    <Modal isOpen={isOpen} onClose={onRequestClose} size="xl">
      <ModalOverlay />
      <ModalContent
        as="form"
        borderRadius="24px"
        onSubmit={handleSubmit(handleEditCustomer)}
      >
        {
          toEditCustomerData && (
            <>
              <ModalHeader p="10" fontWeight="700" fontSize="2xl">
                Alterar cliente {toEditCustomerData.name}
              </ModalHeader>

              <ModalCloseButton top="10" right="5" />

              <ModalBody pl="10" pr="10">
                <Stack spacing="6">
                  <ControlledInput
                    control={control}
                    value={toEditCustomerData.name}
                    name="name"
                    type="text"
                    placeholder="Nome"
                    focusBorderColor="orange.400"
                    variant="outline"
                    error={formState.errors.name}
                  />

                  <HStack spacing="4" align="baseline">
                    <ControlledInput
                      control={control}
                      value={toEditCustomerData.email}
                      name="email"
                      type="email"
                      placeholder="E-mail"
                      focusBorderColor="orange.400"
                      variant="outline"
                      error={formState.errors.email}
                    />

                    <ControlledInput
                      control={control}
                      value={toEditCustomerData.phone}
                      name="phone"
                      type="text"
                      placeholder="Número de telefone"
                      focusBorderColor="orange.400"
                      variant="outline"
                      mask="phone"
                      error={formState.errors.phone}
                    />
                  </HStack>

                  <Divider />

                  <HStack spacing="4" alignItems="flex-start">
                    <ControlledSelect
                      control={control}
                      value={toEditCustomerData.state_id}
                      h="45px"
                      name="state_id"
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
                    </ControlledSelect>

                    {cities.isLoading ? (
                      <Flex justify="center" mt="4">
                        <Spinner />
                      </Flex>
                    ) : cities.isError ? (
                      <Text fontSize="11px">Erro listar as cidades</Text>
                    ) : (
                      cities.data?.length === 0 && (
                        <Text fontSize="11px">Selecione um estado.</Text>
                      )
                    )}
                    {
                      (!cities.isLoading && !cities.isError && cities.data?.length !== 0) && (
                        <ControlledSelect
                          control={control}
                          value={toEditCustomerData.city_id}
                          h="45px"
                          name="city_id"
                          w="100%"
                          fontSize="sm"
                          focusBorderColor="purple.300"
                          bg="gray.400"
                          variant="outline"
                          _hover={{ bgColor: 'gray.500' }}
                          size="lg"
                          borderRadius="full"
                          placeholder="Cidade"
                          error={formState.errors.city_id}
                        >
                          {!cities.isLoading &&
                            !cities.error &&
                            cities.data.map((city: City) => {
                              return (
                                <option key={city.id} value={city.id}>
                                  {city.name}
                                </option>
                              )
                            })}
                        </ControlledSelect>
                      )
                    }
                  </HStack>

                  <HStack spacing="4" alignItems="flex-start">
                    <ControlledInput
                      control={control}
                      value={toEditCustomerData.birth_date}
                      name="birth_date"
                      type="date"
                      placeholder="Data de nascimento"
                      focusBorderColor="orange.400"
                      variant="outline"
                      mask=""
                      error={formState.errors.birth_date}
                    />
                    <ControlledInput
                      control={control}
                      value={toEditCustomerData.civil_status}
                      name="civil_status"
                      type="text"
                      placeholder="Estado Civil"
                      focusBorderColor="orange.400"
                      variant="outline"
                      error={formState.errors.civil_status}
                    />
                  </HStack>

                  <HStack spacing="4" alignItems="flex-start">
                    <ControlledInput
                      control={control}
                      value={toEditCustomerData.cep}
                      name="cep"
                      type="text"
                      placeholder="CEP"
                      focusBorderColor="orange.400"
                      variant="outline"
                      mask="cep"
                      error={formState.errors.cep}
                    />
                    <ControlledInput
                      control={control}
                      value={toEditCustomerData.address}
                      name="address"
                      type="text"
                      placeholder="Rua"
                      focusBorderColor="orange.400"
                      variant="outline"
                      mask=""
                      error={formState.errors.address}
                    />
                  </HStack>

                  <HStack spacing="4" alignItems="flex-start">
                    <ControlledInput
                      control={control}
                      value={toEditCustomerData.neighborhood}
                      name="neighborhood"
                      type="text"
                      placeholder="Bairro"
                      focusBorderColor="orange.400"
                      variant="outline"
                      mask=""
                      error={formState.errors.neighborhood}
                    />
                    <ControlledInput
                      control={control}
                      value={toEditCustomerData.number}
                      name="number"
                      type="text"
                      placeholder="Número"
                      focusBorderColor="orange.400"
                      variant="outline"
                      mask=""
                      error={formState.errors.number}
                    />
                  </HStack>
                </Stack>
              </ModalBody>

              <ModalFooter p="10">
                <SolidButton
                  mr="6"
                  color="white"
                  bg="orange.400"
                  colorScheme="orange"
                  type="submit"
                  isLoading={formState.isSubmitting}
                >
                  Atualizar
                </SolidButton>

                <Link onClick={onRequestClose} color="gray.700" fontSize="14px">
                  Cancelar
                </Link>
              </ModalFooter>
            </>
          )
        }
        
      </ModalContent>
    </Modal>
  )
}
