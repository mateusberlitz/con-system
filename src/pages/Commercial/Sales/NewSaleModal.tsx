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
  Text
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
import { Lead } from '../../../types'

interface NewSaleModalProps {
  isOpen: boolean
  onRequestClose: () => void
  toAddLeadData?: toAddSaleLeadData
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
  type_sale: string; //segment

  lead?: number;
  name?: string;
  email?: string;
  phone?: string;
  cpf_cnpj?: string;
  type_customer?: "PF" | "PJ";
  birth_date?: string;
  civil_status: string;
  city_id: number;
  cep: string;
  address: string;
  neighborhood: string;
  number?: string;

  recommender_commission: number;
}

const CreateNewSaleFormSchema = yup.object().shape({
  value: yup.string().required('Qual o valor da venda?'),
  segment: yup.string().required('Qual o segmento da carta vendida?'),
  date: yup.string().required('Quando foi feita a venda?')
})

export function NewSaleModal({
  isOpen,
  onRequestClose,
  afterCreate,
  toAddLeadData
}: NewSaleModalProps) {
  const workingCompany = useWorkingCompany()
  const { profile, permissions } = useProfile()

  const history = useHistory()
  const toast = useToast()
  const { showErrors } = useErrors()

  const { register, handleSubmit, control, reset, formState } =
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

      saleData.company_id = workingCompany.company.id;
      saleData.seller_id = profile.id
      
      if(toAddLeadData){
        saleData.lead = toAddLeadData.id
      }

      saleData.date_sale = formatInputDate(saleData.date_sale)
      saleData.credit = moneyToBackend(saleData.credit)

      const response = await api.post('/sales/store', saleData)

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
      leads.data?.data.data.map((lead: Lead) => {
        newLeadsOptions.push({ value: lead.id.toString(), label: lead.name })
      })
    }
  }, [leads]);

  const [otherValue, setOtherValue] = useState(false)

  return (
    <Modal isOpen={isOpen} onClose={onRequestClose} size="xl">
      <ModalOverlay />
      <ModalContent
        as="form"
        borderRadius="24px"
        onSubmit={handleSubmit(handleCreateNewPayment)}
      >
        <ModalHeader p="10" fontWeight="700" fontSize="2xl">
          Cadastrar nova venda
        </ModalHeader>

        <ModalCloseButton top="10" right="5" />

        <ModalBody pl="10" pr="10">
          <Stack spacing="6">
            <Stack>
              {!otherValue ? (
                <Select
                  register={register}
                  h="45px"
                  name="value"
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
                  name="value"
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

            {/* <HStack spacing="4" align="baseline">
                            <Input register={register} name="contract" type="text" placeholder="Contrato" focusBorderColor="orange.400" variant="outline" error={formState.errors.contract}/>

                            <Input register={register} name="group" type="text" placeholder="Grupo" focusBorderColor="orange.400" variant="outline" error={formState.errors.group}/>

                            <Input register={register} name="quota" type="text" placeholder="Cota" focusBorderColor="orange.400" variant="outline" mask="" error={formState.errors.quota}/>
                        </HStack> */}

            <HStack spacing="4" alignItems="flex-start">
              <Input
                register={register}
                name="date_sale"
                type="date"
                placeholder="Data da venda"
                focusBorderColor="orange.400"
                variant="outline"
                mask=""
                error={formState.errors.date_sale}
              />
              <Select
                register={register}
                h="45px"
                name="type_sale"
                w="100%"
                fontSize="sm"
                focusBorderColor="orange.400"
                bg="gray.400"
                variant="outline"
                _hover={{ bgColor: 'gray.500' }}
                size="lg"
                borderRadius="full"
                error={formState.errors.type_sale}
              >
                <option value="Imóvel" selected>
                  Imóvel
                </option>
                <option value="Veículo">Veículo</option>
              </Select>
            </HStack>

            <HStack spacing="4" alignItems="flex-start">
              {!leads ? (
                  <Flex justify="center">
                    <Text>Nenhum lead disponível</Text>
                  </Flex>
                ) : (
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
