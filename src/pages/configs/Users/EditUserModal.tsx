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
  Spinner,
  Stack,
  useToast
} from '@chakra-ui/react'
import { SolidButton } from '../../../components/Buttons/SolidButton'
import { ControlledInput } from '../../../components/Forms/Inputs/ControlledInput'

import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { api } from '../../../services/api'
import { useHistory } from 'react-router'
import { useErrors } from '../../../hooks/useErrors'
import { Role, SellerCommissionRule } from '../../../types'
import { ControlledSelect } from '../../../components/Forms/Selects/ControlledSelect'
import { useCompanies } from '../../../hooks/useCompanies'
import { useRoles } from '../../../hooks/useRoles'
import { useEffect } from 'react'
import { isAuthenticated } from '../../../services/auth'
import { redirectMessages } from '../../../utils/redirectMessages'
import { useSellerCommissionsRules } from '../../../hooks/useSellerCommissionsRules'

interface EditUserModalProps {
  isOpen: boolean
  toEditUserData: EditUserData
  onRequestClose: () => void
  afterEdit: () => void
}

interface EditUserFormData {
  phone: string
  email: string
  company: number
  role: number
  seller_commission_rule_id?: number
}

interface EditUserData {
  id: number
  name: string
  last_name: string
  phone: string
  email: string
  seller_commission_rule_id?: number
  role: number
}

const EditUserFormSchema = yup.object().shape({
  phone: yup.string().min(9, 'Existe Telefone com menos de 9 dígitos?'), //51991090700
  email: yup
    .string()
    .required('Informe um E-mail')
    .email('Informe um e-mail válido'),
  role: yup.number().required('Selecione um Cargo'),
  seller_commission_rule_id: yup.number().transform((v, o) => o === '' ? null : v).nullable(true),
})

export function EditUserModal({
  isOpen,
  toEditUserData,
  afterEdit,
  onRequestClose
}: EditUserModalProps) {
  const companies = useCompanies()
  const roles = useRoles()
  const sellerCommissionsRules = useSellerCommissionsRules()

  const history = useHistory()
  const toast = useToast()
  const { showErrors } = useErrors()

  const { handleSubmit, formState, control } = useForm<EditUserFormData>({
    resolver: yupResolver(EditUserFormSchema),
    defaultValues: {
      phone: toEditUserData.phone,
      email: toEditUserData.name,
      role: toEditUserData.role
    }
  })

  const handleEditUser = async (userData: EditUserFormData) => {
    try {
      await api.post(`/users/edit/${toEditUserData.id}`, userData)

      toast({
        title: 'Sucesso',
        description: 'Dados do usuário atualizados.',
        status: 'success',
        duration: 12000,
        isClosable: true
      })

      afterEdit()
      onRequestClose()
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
        onSubmit={handleSubmit(handleEditUser)}
      >
        <ModalHeader p="10" fontWeight="700" fontSize="2xl">
          Editar usuário - {toEditUserData.name} {toEditUserData.last_name}
        </ModalHeader>

        <ModalCloseButton top="10" right="5" />

        <ModalBody pl="10" pr="10">
          <Stack spacing="6">
            <HStack spacing="4" align="baseline">
              <ControlledInput
                control={control}
                value={toEditUserData.email}
                name="email"
                type="text"
                placeholder="E-mail"
                variant="outline"
                error={formState.errors.email}
                focusBorderColor="purple.600"
              />
              <ControlledInput
                control={control}
                value={toEditUserData.phone}
                name="phone"
                type="text"
                placeholder="Telefone"
                variant="outline"
                mask="phone"
                error={formState.errors.phone}
                focusBorderColor="purple.600"
              />
            </HStack>

            <HStack spacing="4" align="baseline">
              {roles.isLoading ? (
                <Flex justify="center">
                  <Spinner />
                </Flex>
              ) : (
                <ControlledSelect
                  control={control}
                  name="role"
                  value={toEditUserData.role}
                  variant="outline"
                  error={formState.errors.role}
                  focusBorderColor="purple.600"
                >
                  <option value="">
                    Cargo
                  </option>
                  {roles.data &&
                    roles.data.map((role: Role) => {
                      return (
                        <option key={role.id} value={role.id}>
                          {role.name}
                        </option>
                      )
                  })}
                </ControlledSelect>
              )}
            </HStack>

            <HStack spacing="4" align="baseline">
              {sellerCommissionsRules.isLoading ? (
                <Flex justify="center">
                  <Spinner />
                </Flex>
              ) : (
                <ControlledSelect
                  control={control}
                  name="seller_commission_rule_id"
                  value={toEditUserData.seller_commission_rule_id}
                  variant="outline"
                  error={formState.errors.seller_commission_rule_id}
                  focusBorderColor="purple.600"
                >
                  <option value="">
                    Regra de comissão
                  </option>
                  {sellerCommissionsRules.data &&
                    sellerCommissionsRules.data.data.map((sellerCommissionsRule: SellerCommissionRule) => {
                      return (
                        <option key={sellerCommissionsRule.id} value={sellerCommissionsRule.id}>
                          {sellerCommissionsRule.name}
                        </option>
                      )
                  })}
                </ControlledSelect>
              )}
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
