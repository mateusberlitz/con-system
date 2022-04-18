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

interface NewSellerRuleParcelModalProps {
  sellerCommissionRuleId: number;
  isOpen: boolean
  onRequestClose: () => void
  afterCreate: () => void
}

interface CreateNewSellerRuleParcelFormData {
  seller_commission_rule_id: number;
  parcel_number: number;
  percentage_to_pay: number;
  chargeback_percentage?: number;
}

const CreateNewSellerRuleFormSchema = yup.object().shape({
  //seller_commission_rule_id: yup.number().required('Tipo de estorno obrigatório'),
  parcel_number: yup.number().required('Tipo de estorno obrigatório'),
  percentage_to_pay: yup.number().required('Tipo de estorno obrigatório'),
  chargeback_percentage: yup.number().required('Tipo de estorno obrigatório'),
})

export function NewSellerRuleParcelModal({
  isOpen,
  sellerCommissionRuleId,
  onRequestClose,
  afterCreate
}: NewSellerRuleParcelModalProps) {
  const history = useHistory()
  const toast = useToast()
  const { showErrors } = useErrors()

  const { register, handleSubmit, reset, formState } =
    useForm<CreateNewSellerRuleParcelFormData>({
      resolver: yupResolver(CreateNewSellerRuleFormSchema)
    })

  const handleCreateNewSellerRuleParcel = async (sellerRuleParcelData: CreateNewSellerRuleParcelFormData) => {
    try {
      sellerRuleParcelData.seller_commission_rule_id = sellerCommissionRuleId;

      await api.post('/seller-commission-rule-parcels', sellerRuleParcelData)

      toast({
        title: 'Sucesso',
        description: `A parcela ${sellerRuleParcelData.parcel_number} foi cadastrada`,
        status: 'success',
        duration: 12000,
        isClosable: true
      });

      onRequestClose();
      afterCreate();
      reset();
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
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onRequestClose} size="xl">
      <ModalOverlay />
      <ModalContent
        as="form"
        borderRadius="24px"
        onSubmit={handleSubmit(handleCreateNewSellerRuleParcel)}
      >
        <ModalHeader p="10" fontWeight="700" fontSize="2xl">
          Cadastrar parcela
        </ModalHeader>

        <ModalCloseButton top="10" right="5" />

        <ModalBody pl="10" pr="10">
          <Stack spacing="6">
            <Input
              register={register}
              name="parcel_number"
              type="text"
              placeholder="Número da parcela"
              variant="outline"
              error={formState.errors.parcel_number}
              focusBorderColor="purple.300"
            />

            <HStack>
              <Input
                register={register}
                name="percentage_to_pay"
                type="number"
                max={100}
                placeholder="Percentual a receber"
                variant="outline"
                error={formState.errors.percentage_to_pay}
                focusBorderColor="purple.300"
              />

              <Input
                register={register}
                name="chargeback_percentage"
                type="number"
                max={100}
                placeholder="Percentual de estorno"
                variant="outline"
                error={formState.errors.chargeback_percentage}
                focusBorderColor="purple.300"
              />
            </HStack>
            
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
