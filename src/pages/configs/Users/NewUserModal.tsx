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

import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { api } from '../../../services/api'
import { useHistory } from 'react-router'
import { useErrors } from '../../../hooks/useErrors'

import { Input } from '../../../components/Forms/Inputs/Input'
import { Select } from '../../../components/Forms/Selects/Select'
import { useCompanies } from '../../../hooks/useCompanies'
import { useRoles } from '../../../hooks/useRoles'
import { Company, Role, SellerCommissionRule } from '../../../types'
import { redirectMessages } from '../../../utils/redirectMessages'
import { useEffect } from 'react'
import { isAuthenticated } from '../../../services/auth'
import { useSellerCommissionRules } from '../../../hooks/useSellerCommissionRules'
import { useSellerCommissionsRules } from '../../../hooks/useSellerCommissionsRules'

interface NewUserModalProps {
  isOpen: boolean
  onRequestClose: () => void
  afterCreate: () => void
}

interface CreateNewUserFormData {
  name: string
  last_name?: string
  phone: string
  cpf: string
  email: string
  company: number
  role: number
  password: string
  seller_commission_rule_id?: number
}

const CreateNewUserFormSchema = yup.object().shape({
  name: yup.string().required('Nome do Usuário Obrigatório'),
  last_name: yup.string(),
  phone: yup.string().min(9, 'Existe Telefone com menos de 9 dígitos?'), //51991090700
  cpf: yup.string().min(10, 'Não parece ser um CPF correto'), //02.999.999/0001-00
  email: yup
    .string()
    .required('Informe um E-mail')
    .email('Informe um e-mail válido'),
  company: yup.number().required('Selecione uma Empresa'),
  role: yup.number().required('Selecione um Cargo'),
  seller_commission_rule_id: yup.number().transform((v, o) => o === '' ? null : v).nullable(true),
  password: yup
    .string()
    .min(6, 'A senha precisa de no mínimo 6 dígitos.')
    .required('Informe uma senha forte.')
})

export function NewUserModal({
  isOpen,
  onRequestClose,
  afterCreate
}: NewUserModalProps) {
  const history = useHistory()
  const toast = useToast()
  const { showErrors } = useErrors()

  const companies = useCompanies()
  const roles = useRoles()
  const sellerCommissionRules = useSellerCommissionsRules();

  const { register, handleSubmit, reset, formState } =
    useForm<CreateNewUserFormData>({
      resolver: yupResolver(CreateNewUserFormSchema)
  });

  const handleCreateNewUser = async (userData: CreateNewUserFormData) => {
    try {
      console.log(userData)
      await api.post('/users/store', userData)

      toast({
        title: 'Sucesso',
        description: `O usuário ${userData.name} foi cadastrado.`,
        status: 'success',
        duration: 12000,
        isClosable: true
      })

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

  return (
    <Modal isOpen={isOpen} onClose={onRequestClose} size="xl">
      <ModalOverlay />
      <ModalContent
        as="form"
        borderRadius="24px"
        onSubmit={handleSubmit(handleCreateNewUser)}
      >
        <ModalHeader p="10" fontWeight="700" fontSize="2xl">
          Cadastrar Usuário
        </ModalHeader>

        <ModalCloseButton top="10" right="5" />

        <ModalBody pl="10" pr="10">
          <Stack spacing="6">
            <HStack spacing="4" align="baseline">
              <Input
                register={register}
                name="name"
                type="text"
                placeholder="Nome"
                variant="outline"
                error={formState.errors.name}
                focusBorderColor="purple.600"
              />
              <Input
                register={register}
                name="last_name"
                type="text"
                placeholder="Sobrenome"
                variant="outline"
                error={formState.errors.last_name}
                focusBorderColor="purple.600"
              />
            </HStack>

            <HStack spacing="4" align="baseline">
              <Input
                register={register}
                name="cpf"
                type="text"
                placeholder="CPF"
                variant="outline"
                mask="cpf"
                error={formState.errors.cpf}
                focusBorderColor="purple.600"
              />
              <Input
                register={register}
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
              <Input
                register={register}
                name="email"
                type="text"
                placeholder="E-mail"
                variant="outline"
                error={formState.errors.email}
                focusBorderColor="purple.600"
              />
              <Input
                register={register}
                name="password"
                type="password"
                placeholder="Senha"
                variant="outline"
                error={formState.errors.password}
                focusBorderColor="purple.600"
              />
            </HStack>

            <HStack spacing="4" align="baseline">
              {companies.isLoading ? (
                <Flex justify="center">
                  <Spinner />
                </Flex>
              ) : (
                <Select
                  register={register}
                  name="company"
                  variant="outline"
                  error={formState.errors.company}
                  focusBorderColor="purple.600"
                >
                  <option key="0" value="0">
                    Empresa
                  </option>
                  {companies.data &&
                    companies.data.map((company: Company) => {
                      return (
                        <option key={company.id} value={company.id}>
                          {company.name}
                        </option>
                      )
                    })}
                </Select>
              )}

              {roles.isLoading ? (
                <Flex justify="center">
                  <Spinner />
                </Flex>
              ) : (
                <Select
                  register={register}
                  name="role"
                  variant="outline"
                  error={formState.errors.email}
                  focusBorderColor="purple.600"
                >
                  <option key="0" value="0">
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
                </Select>
              )}
            </HStack>

            <HStack spacing="4" align="baseline">
              {sellerCommissionRules.isLoading ? (
                <Flex justify="center">
                  <Spinner />
                </Flex>
              ) : (
                <Select
                  register={register}
                  name="seller_commission_rule_id"
                  variant="outline"
                  error={formState.errors.seller_commission_rule_id}
                  focusBorderColor="purple.600"
                >
                  <option value="">
                    Regra de comissão
                  </option>
                  {sellerCommissionRules.data &&
                    sellerCommissionRules.data.data.map((sellerCommissionRule: SellerCommissionRule) => {
                      return (
                        <option key={sellerCommissionRule.id} value={sellerCommissionRule.id}>
                          {sellerCommissionRule.name}
                        </option>
                      )
                  })}
                </Select>
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
