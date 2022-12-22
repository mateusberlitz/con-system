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
  useToast,
  Input as ChakraInput,
  Divider,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Flex,
  Text,
  Checkbox,
  Spinner
} from '@chakra-ui/react'
import { SolidButton } from '../../../components/Buttons/SolidButton'

import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { api } from '../../../services/api'
import { useHistory } from 'react-router'
import { useErrors } from '../../../hooks/useErrors'

import { Input } from '../../../components/Forms/Inputs/Input'
import { Select } from '../../../components/Forms/Selects/Select'
import { useWorkingCompany } from '../../../hooks/useWorkingCompany'
import { formatInputDate } from '../../../utils/Date/formatInputDate'
import moneyToBackend from '../../../utils/moneyToBackend'
import { HasPermission, useProfile } from '../../../hooks/useProfile'
import { useEffect, useState } from 'react'
import { isAuthenticated } from '../../../services/auth'
import { redirectMessages } from '../../../utils/redirectMessages'
import { ReactSelect, SelectOption } from '../../../components/Forms/ReactSelect'
import { LeadsFilterData, useLeads } from '../../../hooks/useLeads'
import { City, Customer, Lead, State, User } from '../../../types'
import { useStates } from '../../../hooks/useStates'
import { useCities } from '../../../hooks/useCities'
import { useWorkingBranch } from '../../../hooks/useWorkingBranch'
import { useUsers } from '../../../hooks/useUsers'

interface NewSaleModalProps {
  isOpen: boolean
  onRequestClose: () => void
  toAddLeadData?: toAddSaleLeadData;
  toAddCustomerData?: Customer;
  afterCreate?: () => void
}

export interface toAddSaleLeadData {
  id: number
  name: string
}

export interface CreateNewSaleFormData {
  company_id: number;
  branch_id?: number;
  seller_id: number;

  number_contract: string; //contract
  credit: string;
  group: string;
  quota: string;
  date_sale: string;
  consortium_type_id: number; //segment
  type_sale: string;

  lead?: number;
  name?: string;
  email?: string;
  phone?: string;
  cpf_cnpj?: string;
  type_customer?: "PF" | "PJ";
  birth_date?: string;
  civil_status: string;
  state_id: number;
  city_id: number;
  cep: string;
  address: string;
  neighborhood: string;
  number?: string;

  recommender_commission: number;
}

const CreateNewSaleFormSchema = yup.object().shape({
  credit: yup.string().required('Qual o valor da venda?'),
  name: yup.string().required('Nome do cliente obrigatório'),
  email: yup.string().required('E-mail do cliente obrigatório'),
  phone: yup.string().required('Telefone do cliente obrigatório'),
  cpf_cnpj: yup.string().required('Informe um CPF ou CNPJ'),
  consortium_type_id: yup.number().required('Qual o segmento da carta vendida?'),
  date_sale: yup.string().required('Quando foi feita a venda?'),
  birth_date: yup.string().nullable(),
  civil_status: yup.string().required('Informe o estado civil'),
  state_id: yup.number().required('Informe o estado'),
  city_id: yup.string().required('Informe a cidade'),
  cep: yup.string().required('Informe o CEP'),
  address: yup.string().required('Informe o endereço'),
  neighborhood: yup.string().required('Informe o bairro'),
  number: yup.string().required('Informe o número'),
  group: yup.string().required('Informe o grupo'),
  quota: yup.string().required('Informe a cota'),
  seller_id: yup.string().required('Informe o vendedor'),
  number_contract: yup.string().required('Informe o número do contrato'),
})

export function NewSaleModal({
  isOpen,
  onRequestClose,
  afterCreate,
  toAddLeadData,
  toAddCustomerData
}: NewSaleModalProps) {
  const workingCompany = useWorkingCompany();
  const workingBranch = useWorkingBranch();
  const { profile, permissions } = useProfile()

  const history = useHistory()
  const toast = useToast()
  const { showErrors } = useErrors()

  const { register, handleSubmit, control, reset, watch, formState } =
    useForm<CreateNewSaleFormData>({
      resolver: yupResolver(CreateNewSaleFormSchema)
    })

  const handleCreateNewPayment = async (saleData: CreateNewSaleFormData) => {
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

      //const isManager = HasPermission(permissions, 'Vendas Completo');
      
      if(toAddLeadData){
        saleData.lead = toAddLeadData.id
      }

      saleData.date_sale = saleData.date_sale;
      saleData.credit = moneyToBackend(saleData.credit)

      const newSaleData = {
        company_id: workingCompany.company.id,
        branch_id: workingBranch.branch && workingBranch.branch.id,
        seller_id: saleData.seller_id ? saleData.seller_id : profile.id,
        contract: {
          number_contract: saleData.number_contract
        },
        quota: {
          consortium_type_id: saleData.consortium_type_id,
          credit: saleData.credit,
          group: saleData.group,
          quota: saleData.quota,
          date_sale: saleData.date_sale,
        },
        customer: {
          cpf_cnpj: saleData.cpf_cnpj,
          type_customer: isPF ? 'PF' : 'PJ',
          name: saleData.name,
          email: saleData.email,
          phone: saleData.phone,
          birth_date: saleData.birth_date,
          civil_status: saleData.civil_status,
          city_id: saleData.city_id,
          state_id: saleData.state_id,
          cep: saleData.cep,
          address: saleData.address,
          neighborhood: saleData.neighborhood,
          number: saleData.number,
        }
      };

      const response = await api.post('/sales', newSaleData)

      toast({
        title: 'Sucesso',
        description: `Venda cadastrada`,
        status: 'success',
        duration: 12000,
        isClosable: true
      })

      await api.post('/logs/store', {
        user: profile.id,
        company: workingCompany.company.id,
        action: `Cadastrou uma nova venda`
      })

      onRequestClose()
      if(afterCreate){
        afterCreate();
      }
      reset()
    } catch (error: any) {
      showErrors(error, toast)

      if (error.response.data.access) {
        history.push('/')
      }
    }
  }

  const isManager = HasPermission(permissions, 'Comercial Completo');

  const [leadFilter, setLeadFilter] = useState<LeadsFilterData>(() => {
    const data: LeadsFilterData = {
      search: '',
      status: 0,
      user: isManager ? undefined : profile?.id,
    }

    return data
  })

  const leads = useLeads(leadFilter, 1);

  const [leadsOptions, setLeadsOptions] = useState<Array<SelectOption>>([
    {
      value: '',
      label: 'Selecionar Lead'
    }
  ]);

  const [usersOptions, setUsersOptions] = useState<Array<SelectOption>>([
    {
      value: '',
      label: 'Selecionar Vendedor'
    }
  ]);

  const states = useStates();
  const users = useUsers({});

  const selectedState = watch('state_id');
  const cities = useCities({state_id: selectedState ? selectedState : 1});

  useEffect(() => {
    if (!isAuthenticated()) {
      history.push({
        pathname: '/',
        state: redirectMessages.auth
      })
    }
  }, [isOpen]);

  useEffect(() => {
    const newLeadsOptions = leadsOptions;
    
    if(leads.data){
      leads.data?.data.map((lead: Lead) => {
        newLeadsOptions.push({ value: lead.id.toString(), label: lead.name });
      })
    }

    //
  }, [leads]);

  useEffect(() => {
    const newUsersOptions = usersOptions;
    
    if(users.data){
      users.data?.map((user: User) => {
        newUsersOptions.push({ value: user.id.toString(), label: `${user.name} ${user.last_name}` });
      })
    }

    setUsersOptions(newUsersOptions);
  }, [users]);

  const [otherValue, setOtherValue] = useState(false);
  const [isPF, setIsPF] = useState(true);

  console.log(users);

  return (
    <Modal isOpen={isOpen} onClose={onRequestClose} size="xl">
      <ModalOverlay />
      <ModalContent
        maxH="calc(100vh - 120px)"
        overflow="auto"
        as="form"
        borderRadius="24px"
        onSubmit={handleSubmit(handleCreateNewPayment)}
      >
        <ModalHeader p="10" fontWeight="700" fontSize="2xl">
          Cadastrar nova venda
          {
            toAddCustomerData && (
              <Text fontSize="md" fontWeight="normal" color="gray.700">Adicionar plano ao cliente <b>{toAddCustomerData.name}</b></Text>
            )
          }
        </ModalHeader>

        <ModalCloseButton top="10" right="5" />

        <ModalBody pl="10" pr="10">
          <Stack spacing="6">
            

            {/* <HStack spacing="4" align="baseline">
                            <Input register={register} name="contract" type="text" placeholder="Contrato" focusBorderColor="orange.400" variant="outline" error={formState.errors.contract}/>

                            <Input register={register} name="group" type="text" placeholder="Grupo" focusBorderColor="orange.400" variant="outline" error={formState.errors.group}/>

                            <Input register={register} name="quota" type="text" placeholder="Cota" focusBorderColor="orange.400" variant="outline" mask="" error={formState.errors.quota}/>
                        </HStack> */}

            {/* <HStack spacing="4" alignItems="flex-start">
                <Select
                    register={register}
                    h="45px"
                    name="seller_id"
                    value="0"
                    w="100%"
                    fontSize="sm"
                    focusBorderColor="purple.300"
                    bg="gray.400"
                    variant="outline"
                    _hover={{ bgColor: 'gray.500' }}
                    size="lg"
                    borderRadius="full"
                    placeholder="Vendedor"
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
            </HStack> */}

            <HStack spacing="4" alignItems="flex-start">
              {users && users.data?.length !== 0 && (
                  <ReactSelect
                    options={usersOptions}
                    control={control}
                    label="Vendedor"
                    name="seller_id"
                    bg="gray.400"
                    variant="outline"
                    _hover={{ bgColor: 'gray.500' }}
                    borderRadius="full"
                    isRequired={true}
                    error={formState.errors.seller_id}
                  />
                )}
            </HStack>

            <HStack spacing="4" alignItems="flex-start">
              <Input
                register={register}
                name="date_sale"
                type="date"
                placeholder="Data da venda"
                focusBorderColor="orange.400"
                variant="outline"
                mask=""
                isRequired={true}
                error={formState.errors.date_sale}
              />
              <Select
                register={register}
                h="45px"
                name="consortium_type_id"
                w="100%"
                fontSize="sm"
                focusBorderColor="orange.400"
                bg="gray.400"
                variant="outline"
                _hover={{ bgColor: 'gray.500' }}
                size="lg"
                borderRadius="full"
                isRequired={true}
                error={formState.errors.consortium_type_id}
              >
                <option value={1} selected>
                  Imóvel
                </option>
                <option value={2}>Veículo</option>
              </Select>
            </HStack>

            <HStack spacing="4" alignItems="flex-start">
              {leads && leads.data?.data.length !== 0 && (
                  <ReactSelect
                    options={leadsOptions}
                    control={control}
                    label="Contato"
                    name="lead"
                    bg="gray.400"
                    variant="outline"
                    _hover={{ bgColor: 'gray.500' }}
                    borderRadius="full"
                    error={formState.errors.lead}
                  />
                )}
            </HStack>

            <HStack spacing="4" alignItems="flex-start">
              <Stack width="100%">
                {!otherValue ? (
                  <Select
                    register={register}
                    h="45px"
                    name="credit"
                    w="100%"
                    fontSize="sm"
                    focusBorderColor="orange.400"
                    bg="gray.400"
                    variant="outline"
                    _hover={{ bgColor: 'gray.500' }}
                    size="lg"
                    borderRadius="full"
                    error={formState.errors.credit}
                  >
                    <option value="">Valor do plano</option>
                    <option value="25000">R$25.000,00</option>
                    <option value="35000">R$35.000,00</option>
                    <option value="40000">R$40.000,00</option>
                    <option value="50000">R$50.000,00</option>
                    <option value="60000">R$60.000,00</option>
                    <option value="70000">R$70.000,00</option>
                    <option value="80000">R$80.000,00</option>
                    <option value="90000">R$90.000,00</option>
                    <option value="100000">R$100.000,00</option>
                    <option value="120000">R$120.000,00</option>
                    <option value="150000">R$150.000,00</option>
                    <option value="180000">R$180.000,00</option>
                    <option value="200000">R$200.000,00</option>
                    <option value="220000">R$220.000,00</option>
                    <option value="230000">R$230.000,00</option>
                    <option value="250000">R$250.000,00</option>
                    <option value="275000">R$275.000,00</option>
                    <option value="300000">R$300.000,00</option>
                  </Select>
                ) : (
                  <Input
                    register={register}
                    name="credit"
                    type="text"
                    placeholder="Valor do crédito"
                    focusBorderColor="orange.400"
                    variant="outline"
                    error={formState.errors.credit}
                  />
                )}

                <Link
                  fontSize="sm"
                  ml="2"
                  onClick={() => {
                    setOtherValue(!otherValue)
                  }}
                  width="fit-content"
                >
                  {otherValue ? 'Valor predefinido' : 'Outro valor'}
                </Link>
              </Stack>

              <Input
                register={register}
                name="number_contract"
                type="text"
                placeholder="Número do contrato"
                focusBorderColor="orange.400"
                variant="outline"
                mask=""
                error={formState.errors.number_contract}
              />
            </HStack>

            <HStack spacing="4" alignItems="flex-start">
              <Input
                  register={register}
                  name="group"
                  type="text"
                  placeholder="Grupo"
                  focusBorderColor="orange.400"
                  variant="outline"
                  mask=""
                  error={formState.errors.group}
                />
              <Input
                register={register}
                name="quota"
                type="text"
                placeholder="Cota"
                focusBorderColor="orange.400"
                variant="outline"
                mask=""
                error={formState.errors.quota}
              />
            </HStack>

            {
              !toAddCustomerData && (
                <>
                  <HStack spacing="4" alignItems="flex-start">
                    <Checkbox isChecked={isPF} onChange={() => setIsPF(true)}>Pessoa física</Checkbox>
                    <Checkbox isChecked={!isPF} onChange={() => setIsPF(false)}>Pessoa jurídica</Checkbox>
                  </HStack>

                  <Input
                      register={register}
                      name="cpf_cnpj"
                      type="text"
                      placeholder={isPF ? "CPF" : "CNPJ"}
                      focusBorderColor="orange.400"
                      variant="outline"
                      mask={isPF ? "cpf" : "cnpj"}
                      error={formState.errors.cpf_cnpj}
                    />

                  <Input
                      register={register}
                      name="name"
                      type="text"
                      placeholder="Nome completo"
                      focusBorderColor="orange.400"
                      variant="outline"
                      mask=""
                      error={formState.errors.name}
                    />

                  <HStack spacing="4" alignItems="flex-start">
                    <Input
                      register={register}
                      name="email"
                      type="text"
                      placeholder="E-mail"
                      focusBorderColor="orange.400"
                      variant="outline"
                      mask=""
                      error={formState.errors.email}
                    />

                    <Input
                      register={register}
                      name="phone"
                      type="text"
                      placeholder="Telefone"
                      focusBorderColor="orange.400"
                      variant="outline"
                      mask="phone"
                      error={formState.errors.phone}
                    />
                  </HStack>

                  <HStack spacing="4" alignItems="flex-start">
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
                        <Select
                          register={register}
                          h="45px"
                          name="city_id"
                          value="0"
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
                        </Select>
                      )
                    }
                  </HStack>

                  <HStack spacing="4" alignItems="flex-start">
                    <Input
                      register={register}
                      name="birth_date"
                      type="date"
                      placeholder="Data de nascimento"
                      focusBorderColor="orange.400"
                      variant="outline"
                      mask=""
                      error={formState.errors.birth_date}
                    />
                    <Input
                      register={register}
                      name="civil_status"
                      type="text"
                      placeholder="Estado Civil"
                      focusBorderColor="orange.400"
                      variant="outline"
                      mask=""
                      error={formState.errors.civil_status}
                    />
                  </HStack>

                  <HStack spacing="4" alignItems="flex-start">
                    <Input
                      register={register}
                      name="cep"
                      type="text"
                      placeholder="CEP"
                      focusBorderColor="orange.400"
                      variant="outline"
                      mask="cep"
                      error={formState.errors.cep}
                    />
                    <Input
                      register={register}
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
                    <Input
                      register={register}
                      name="neighborhood"
                      type="text"
                      placeholder="Bairro"
                      focusBorderColor="orange.400"
                      variant="outline"
                      mask=""
                      error={formState.errors.neighborhood}
                    />
                    <Input
                      register={register}
                      name="number"
                      type="text"
                      placeholder="Número"
                      focusBorderColor="orange.400"
                      variant="outline"
                      mask=""
                      error={formState.errors.number}
                    />
                  </HStack>
                </>
              )
            }
            
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
