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
import { PaymentCategory, User, Source, Company } from '../../../types'
import { useWorkingCompany } from '../../../hooks/useWorkingCompany'
import { formatInputDate } from '../../../utils/Date/formatInputDate'
import moneyToBackend from '../../../utils/moneyToBackend'
import { ControlledSelect } from '../../../components/Forms/Selects/ControlledSelect'
import { useProfile } from '../../../hooks/useProfile'
import { isAuthenticated } from '../../../services/auth'
import { useEffect } from 'react'
import { redirectMessages } from '../../../utils/redirectMessages'

interface NewBillModalProps {
  isOpen: boolean
  onRequestClose: () => void
  afterCreate: () => void
  categories: PaymentCategory[]
  sources: Source[]
  users: User[]
}

interface CreateNewBillFormData {
  title: string
  observation?: string
  company: number
  category: number
  status?: boolean
  source?: number
  value: string
  expire: string
}

const CreateNewBillFormSchema = yup.object().shape({
  title: yup.string().required('Título do pagamento obrigatório'),
  observation: yup.string(),
  company: yup.number(),
  category: yup.number(),
  status: yup.boolean(),
  source: yup
    .number()
    .transform((v, o) => (o === '' ? null : v))
    .nullable(),
  value: yup.string().required('Informe o valor a receber'),
  expire: yup.date().required('Selecione a data de vencimento')
})

export function NewBillModal({
  isOpen,
  onRequestClose,
  afterCreate,
  categories,
  sources
}: NewBillModalProps) {
  const workingCompany = useWorkingCompany()
  const history = useHistory()
  const toast = useToast()
  const { showErrors } = useErrors()

  const { profile } = useProfile()

  const { register, handleSubmit, reset, control, formState } =
    useForm<CreateNewBillFormData>({
      resolver: yupResolver(CreateNewBillFormSchema)
    })

  function includeAndFormatData(billData: CreateNewBillFormData) {
    billData.value = moneyToBackend(billData.value)

    billData.expire = formatInputDate(billData.expire)

    if (billData.source === null || billData.source === 0) {
      delete billData.source
    }

    if (!workingCompany.company) {
      return billData
    } else if (billData.company === 0) {
      billData.company = workingCompany.company?.id
    }

    return billData
  }

  const handleCreateNewBill = async (billData: CreateNewBillFormData) => {
    try {
      if (!workingCompany.company && billData.company === 0) {
        toast({
          title: 'Ué',
          description: `Seleciona uma empresa para trabalhar`,
          status: 'warning',
          duration: 12000,
          isClosable: true
        })

        return
      }

      billData = includeAndFormatData(billData)

      console.log(billData)

      await api.post('/bills/store', billData)

      toast({
        title: 'Sucesso',
        description: `A conta a receber ${billData.title} foi cadastrada.`,
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
        onSubmit={handleSubmit(handleCreateNewBill)}
      >
        <ModalHeader p="10" fontWeight="700" fontSize="2xl">
          Cadastrar Conta a Receber
        </ModalHeader>

        <ModalCloseButton top="10" right="5" />

        <ModalBody pl="10" pr="10">
          <Stack spacing="6">
            <Input
              register={register}
              name="title"
              type="text"
              placeholder="Título"
              variant="outline"
              error={formState.errors.title}
            />

            {!profile || !profile.companies ? (
              <Flex justify="center">
                <Text>Nenhuma empresa disponível</Text>
              </Flex>
            ) : (
              <ControlledSelect
                control={control}
                value={
                  workingCompany.company && workingCompany.company.id
                    ? workingCompany.company.id.toString()
                    : ''
                }
                h="45px"
                name="company"
                placeholder="Empresa"
                w="100%"
                fontSize="sm"
                focusBorderColor="blue.400"
                bg="gray.400"
                variant="outline"
                _hover={{ bgColor: 'gray.500' }}
                size="lg"
                borderRadius="full"
                error={formState.errors.company}
              >
                {profile.companies &&
                  profile.companies.map((company: Company) => {
                    return (
                      <option key={company.id} value={company.id}>
                        {company.name}
                      </option>
                    )
                  })}
              </ControlledSelect>
            )}

            <HStack spacing="4" align="baseline">
              <Input
                register={register}
                name="expire"
                type="date"
                placeholder="Data de Vencimento"
                variant="outline"
                error={formState.errors.expire}
              />

              <Input
                register={register}
                name="value"
                type="text"
                placeholder="Valor"
                variant="outline"
                mask="money"
                error={formState.errors.value}
              />
            </HStack>

            <HStack spacing="4" align="baseline">
              <Select
                register={register}
                h="45px"
                value="0"
                name="category"
                w="100%"
                fontSize="sm"
                focusBorderColor="blue.400"
                bg="gray.400"
                variant="outline"
                _hover={{ bgColor: 'gray.500' }}
                size="lg"
                borderRadius="full"
                placeholder="Categoria"
                error={formState.errors.category}
              >
                {categories &&
                  categories.map((category: PaymentCategory) => {
                    return (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    )
                  })}
              </Select>

              <Select
                register={register}
                h="45px"
                name="source"
                value="0"
                w="100%"
                fontSize="sm"
                focusBorderColor="blue.400"
                bg="gray.400"
                variant="outline"
                _hover={{ bgColor: 'gray.500' }}
                size="lg"
                borderRadius="full"
                placeholder="Fonte"
                error={formState.errors.source}
              >
                {sources &&
                  sources.map((source: Source) => {
                    return (
                      <option key={source.id} value={source.id}>
                        {source.name}
                      </option>
                    )
                  })}
              </Select>
            </HStack>

            <Input
              register={register}
              name="observation"
              type="text"
              placeholder="Observação"
              variant="outline"
              error={formState.errors.observation}
            />
          </Stack>
        </ModalBody>

        <ModalFooter p="10">
          <SolidButton
            mr="6"
            color="white"
            bg="blue.400"
            colorScheme="blue"
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
