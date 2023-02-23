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
  Text
} from '@chakra-ui/react'
import { SolidButton } from '../../../components/Buttons/SolidButton'

import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { api } from '../../../services/api'
import { useHistory } from 'react-router'
import { useErrors } from '../../../hooks/useErrors'

import { useWorkingCompany } from '../../../hooks/useWorkingCompany'
import { formatInputDate } from '../../../utils/Date/formatInputDate'
import moneyToBackend from '../../../utils/moneyToBackend'
import { useProfile } from '../../../hooks/useProfile'
import { ControlledSelect } from '../../../components/Forms/Selects/ControlledSelect'
import { useEffect, useState } from 'react'
import { isAuthenticated } from '../../../services/auth'
import { redirectMessages } from '../../../utils/redirectMessages'

import { ControlledInput } from '../../../components/Forms/Inputs/ControlledInput'
import { Input } from '../../../components/Forms/Inputs/Input'
import { Select } from '../../../components/Forms/Selects/Select'
import { formatYmdDate } from '../../../utils/Date/formatYmdDate'

interface EditQuotaModalProps {
  isOpen: boolean
  toEditQuotaData: EditQuotaFormData
  onRequestClose: () => void
  afterEdit: () => void
}

export interface EditQuotaFormData {
  id: number;
  credit: string;
  consortium_type_id: string;
  date_sale: string;
  group: string;
  quota: string;
}

const EditQuotaFormSchema = yup.object().shape({
  credit: yup.string().required('Qual o valor da cota?'),
  consortium_type_id: yup.string().required('Qual o segmento da carta vendida?'),
  //contract: yup.string().required('Informe o contrato da cota'),
  group: yup.string().required('Qual o grupo?'),
  quota: yup.string().required('Informe o número da cota'),
  //date: yup.string().required('Quando foi feita a venda?')
})

export function EditQuotaModal({
  isOpen,
  onRequestClose,
  afterEdit,
  toEditQuotaData
}: EditQuotaModalProps) {
  const workingCompany = useWorkingCompany()
  const { profile, permissions } = useProfile()

  const history = useHistory()
  const toast = useToast()
  const { showErrors } = useErrors()

  const { register, handleSubmit, control, reset, formState } =
    useForm<EditQuotaFormData>({
      resolver: yupResolver(EditQuotaFormSchema),
      defaultValues: {
        id: toEditQuotaData.id,
        credit: toEditQuotaData.credit,
        date_sale: toEditQuotaData.date_sale,
        group: toEditQuotaData.group,
        quota: toEditQuotaData.quota,
        consortium_type_id: toEditQuotaData.consortium_type_id,
      }
    })

  const handleCreateNewPayment = async (saleData: EditQuotaFormData) => {
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

      //saleData.date = formatInputDate(saleData.date)
      saleData.credit = moneyToBackend(saleData.credit)

      const response = await api.put(`/quotas/${toEditQuotaData.id}`,saleData)

      toast({
        title: 'Sucesso',
        description: `Contrato atualizado`,
        status: 'success',
        duration: 12000,
        isClosable: true
      })

      await api.post('/logs/store', {
        user: profile.id,
        company: workingCompany.company.id,
        action: `Alterou as informações de uma cota`
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

  useEffect(() => {
    if (!isAuthenticated()) {
      history.push({
        pathname: '/',
        state: redirectMessages.auth
      })
    }
  }, [isOpen])

  const [otherValue, setOtherValue] = useState(true);

  //console.log(new Date(toEditQuotaData.date_sale).toISOString().split('T')[0]);

  return (
    <Modal isOpen={isOpen} onClose={onRequestClose} size="xl">
      <ModalOverlay />
      <ModalContent
        as="form"
        borderRadius="24px"
        onSubmit={handleSubmit(handleCreateNewPayment)}
      >
        <ModalHeader p="10" fontWeight="700" fontSize="2xl">
          Alterar Cota {toEditQuotaData.group} - {toEditQuotaData.quota}
        </ModalHeader>

        <ModalCloseButton top="10" right="5" />

        <ModalBody pl="10" pr="10">
          <Stack spacing="6">
            <ControlledInput
                control={control}
                value={toEditQuotaData.date_sale ? new Date(toEditQuotaData.date_sale).toISOString().split('T')[0] : ""}
                name="date_sale"
                type="date"
                placeholder="Data da venda"
                focusBorderColor="orange.400"
                variant="outline"
                mask=""
                isRequired={true}
                error={formState.errors.date_sale}
            />

            <Stack>
                <Text color="gray.700">Dados do plano</Text>
                <Divider></Divider>
            </Stack>

            <HStack spacing="4" alignItems="flex-start">
              <ControlledSelect
                control={control}
                value={toEditQuotaData.consortium_type_id}
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
              </ControlledSelect>
            </HStack>

            {/* <HStack spacing="4" alignItems="flex-start">
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
            </HStack> */}

            <HStack spacing="4" alignItems="flex-start">
              <Stack width="100%">
                {!otherValue ? (
                  <ControlledSelect
                    control={control}
                    value={formatYmdDate(toEditQuotaData.credit)}
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
                  </ControlledSelect>
                ) : (
                  <ControlledInput
                    control={control}
                    value={toEditQuotaData.credit}
                    name="credit"
                    type="text"
                    mask="money"
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
            </HStack>

            <HStack spacing="4" alignItems="flex-start">
              <ControlledInput
                  control={control}
                  value={toEditQuotaData.group}
                  name="group"
                  type="text"
                  placeholder="Grupo"
                  focusBorderColor="orange.400"
                  variant="outline"
                  mask=""
                  error={formState.errors.group}
                />
              <ControlledInput
                control={control}
                value={toEditQuotaData.quota}
                name="quota"
                type="text"
                placeholder="Cota"
                focusBorderColor="orange.400"
                variant="outline"
                mask=""
                error={formState.errors.quota}
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
            Alterar
          </SolidButton>

          <Link onClick={onRequestClose} color="gray.700" fontSize="14px">
            Cancelar
          </Link>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
