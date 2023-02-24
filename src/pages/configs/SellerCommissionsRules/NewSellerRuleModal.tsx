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
import { SolidButton } from '../../../components/Buttons/SolidButton'

import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { api } from '../../../services/api'
import { useHistory } from 'react-router'
import { useErrors } from '../../../hooks/useErrors'

import { useParams } from 'react-router-dom';

import { Input } from '../../../components/Forms/Inputs/Input'
import { isAuthenticated } from '../../../services/auth'
import { useEffect } from 'react'
import { redirectMessages } from '../../../utils/redirectMessages'
import { Select } from '../../../components/Forms/Selects/Select'
import { useUsers } from '../../../hooks/useUsers'
import { ChargeBackType, Company, State, User } from '../../../types'
import { useCompanies } from '../../../hooks/useCompanies'
import { useChargeBackTypes } from '../../../hooks/useChargeBackTypes'
import moneyToBackend from '../../../utils/moneyToBackend'

interface NewSellerRuleModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  afterCreate: () => void;
  companyId?: number;
  branchId?: number;
}

interface CreateNewSellerRuleFormData {
  name: string;
  company_id: number;
  branch_id?: number;
  chargeback_type_id: number;
  percentage_paid_in_contemplation: number;
  initial_value?: string;
  final_value?: string;
  half_installment?: boolean;
  pay_in_contemplation?: boolean;
}

const CreateNewSellerRuleFormSchema = yup.object().shape({
  name: yup.string().required('Nome da regra é obrigatório'),
  //company_id: yup.number().required('A qual empresa essa filial pertence?'),
  chargeback_type_id: yup.number().required('Tipo de estorno obrigatório'),
  half_installment: yup.boolean().nullable(),
  pay_in_contemplation: yup.boolean().nullable(),
  percentage_paid_in_contemplation: yup.number().required('Quanto será recebido na contemplação?'),
  initial_value: yup.string().nullable(),
  final_value: yup.string().nullable(),
})

export function NewSellerRuleModal({
  isOpen,
  companyId,
  branchId,
  onRequestClose,
  afterCreate
}: NewSellerRuleModalProps) {
  const history = useHistory()
  const toast = useToast()
  const { showErrors } = useErrors()

  const { register, handleSubmit, reset, formState } =
    useForm<CreateNewSellerRuleFormData>({
      resolver: yupResolver(CreateNewSellerRuleFormSchema)
    })

  const handleCreateNewSellerRule = async (sellerRuleData: CreateNewSellerRuleFormData) => {
    try {
      if(companyId){
        sellerRuleData.company_id = companyId;
      }

      if(branchId){
        sellerRuleData.branch_id = branchId;
      }

      sellerRuleData.initial_value = sellerRuleData.initial_value ? moneyToBackend(sellerRuleData.initial_value) : undefined;
      sellerRuleData.final_value = sellerRuleData.final_value ?  moneyToBackend(sellerRuleData.final_value) : undefined;

      await api.post('/seller-commission-rules', sellerRuleData)

      toast({
        title: 'Sucesso',
        description: `A regra ${sellerRuleData.name} foi cadastrada`,
        status: 'success',
        duration: 12000,
        isClosable: true
      });

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

  const chargeBackTypes = useChargeBackTypes();

  return (
    <Modal isOpen={isOpen} onClose={onRequestClose} size="xl">
      <ModalOverlay />
      <ModalContent
        as="form"
        borderRadius="24px"
        onSubmit={handleSubmit(handleCreateNewSellerRule)}
      >
        <ModalHeader p="10" fontWeight="700" fontSize="2xl">
          Cadastrar Regra de PAGAMENTO
        </ModalHeader>

        <ModalCloseButton top="10" right="5" />

        <ModalBody pl="10" pr="10">
          <Stack spacing="6">
            <Input
              register={register}
              name="name"
              type="text"
              placeholder="Nome da regra"
              variant="outline"
              error={formState.errors.name}
              focusBorderColor="purple.300"
            />

            <HStack spacing="4">
                <Input
                register={register}
                name="initial_value"
                type="text"
                placeholder="Valor inicial"
                variant="outline"
                mask="money"
                error={formState.errors.initial_value}
                focusBorderColor="purple.300"
                />

                <Input
                register={register}
                name="final_value"
                type="text"
                placeholder="Valor final"
                variant="outline"
                mask="money"
                error={formState.errors.final_value}
                focusBorderColor="purple.300"
                />
            </HStack>

            <Select
              register={register}
              h="45px"
              name="chargeback_type_id"
              value="0"
              w="100%"
              fontSize="sm"
              focusBorderColor="purple.300"
              bg="gray.400"
              variant="outline"
              _hover={{ bgColor: 'gray.500' }}
              size="lg"
              borderRadius="full"
              placeholder="Tipo de estorno"
              error={formState.errors.chargeback_type_id}
            >
              {!chargeBackTypes.isLoading &&
                !chargeBackTypes.error &&
                chargeBackTypes.data.map((chargeBackType: ChargeBackType) => {
                  return (
                    <option key={chargeBackType.id} value={chargeBackType.id}>
                      {chargeBackType.description}
                    </option>
                  )
                })}
            </Select>

            <Select
              register={register}
              h="45px"
              name="half_installment"
              value="0"
              w="100%"
              fontSize="sm"
              focusBorderColor="purple.300"
              bg="gray.400"
              variant="outline"
              _hover={{ bgColor: 'gray.500' }}
              size="lg"
              borderRadius="full"
              placeholder="Meia parcela"
              error={formState.errors.half_installment}
            >
              <option value={1}>Sim</option>
              <option value={0}>Não</option>
            </Select>

            <Select
              register={register}
              h="45px"
              name="pay_in_contemplation"
              value="0"
              w="100%"
              fontSize="sm"
              focusBorderColor="purple.300"
              bg="gray.400"
              variant="outline"
              _hover={{ bgColor: 'gray.500' }}
              size="lg"
              borderRadius="full"
              placeholder="Pagar na contemplação"
              error={formState.errors.pay_in_contemplation}
            >
              <option value={1}>Sim</option>
              <option value={0}>Não</option>
            </Select>

            <Input
              register={register}
              name="percentage_paid_in_contemplation"
              type="text"
              placeholder="Percentual na contemplação"
              variant="outline"
              error={formState.errors.percentage_paid_in_contemplation}
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
