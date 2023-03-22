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

import { Input } from '../../../components/Forms/Inputs/Input'
import { Select } from '../../../components/Forms/Selects/Select'
import { useWorkingCompany } from '../../../hooks/useWorkingCompany'
import { useProfile } from '../../../hooks/useProfile'
import { useEffect } from 'react'
import { isAuthenticated } from '../../../services/auth'
import { redirectMessages } from '../../../utils/redirectMessages'
import moneyToBackend from '../../../utils/moneyToBackend'

interface NewGoalModalProps {
  isOpen: boolean
  onRequestClose: () => void
  toAddUserData: toAddGoalData
  afterCreate: () => void
}

export interface toAddGoalData {
  id: number
  name: string
}

interface CreateNewGoalFormData {
  value: string
  user: number
  company: number
  month: number
}

const CreateNewGoalFormSchema = yup.object().shape({
  value: yup.string().required('Qual o valor da meta?'),
  month: yup.number().required('Selecione o mês e ano?')
})

export function NewGoalModal({
  isOpen,
  onRequestClose,
  afterCreate,
  toAddUserData
}: NewGoalModalProps) {
  const workingCompany = useWorkingCompany()
  const { profile, permissions } = useProfile()

  const history = useHistory()
  const toast = useToast()
  const { showErrors } = useErrors()

  const { register, handleSubmit, control, reset, formState } =
    useForm<CreateNewGoalFormData>({
      resolver: yupResolver(CreateNewGoalFormSchema)
    })

  const handleCreateNewPayment = async (saleData: CreateNewGoalFormData) => {
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

      saleData.company = workingCompany.company.id
      saleData.user = toAddUserData.id

      const valueNotFormatted = saleData.value;
      saleData.value = moneyToBackend(saleData.value)

      const response = await api.post('/goals/store', saleData)

      toast({
        title: 'Sucesso',
        description: `Meta de ${valueNotFormatted} adicionada ao vendedor ${
          toAddUserData.name
        }`,
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

  const month = new Date().getMonth() + 1
  const year = new Date().getFullYear()

  return (
    <Modal isOpen={isOpen} onClose={onRequestClose} size="xl">
      <ModalOverlay />
      <ModalContent
        as="form"
        borderRadius="24px"
        onSubmit={handleSubmit(handleCreateNewPayment)}
      >
        <ModalHeader p="10" fontWeight="700" fontSize="2xl">
          Cadastrar uma nova meta para {toAddUserData.name}
        </ModalHeader>

        <ModalCloseButton top="10" right="5" />

        <ModalBody pl="10" pr="10">
          <Stack spacing="6">
            <Input
              register={register}
              name="value"
              type="text"
              placeholder="Valor da meta"
              focusBorderColor="orange.400"
              variant="outline"
              mask="money"
              error={formState.errors.value}
            />

            <HStack spacing="4" align="baseline">
              <Select
                register={register}
                h="45px"
                name="month"
                w="100%"
                fontSize="sm"
                focusBorderColor="orange.400"
                bg="gray.400"
                variant="outline"
                _hover={{ bgColor: 'gray.500' }}
                size="lg"
                borderRadius="full"
                error={formState.errors.month}
              >
                <option value={1} selected={month === 1 ? true : false}>
                  Janeiro/{month <= 1 ? year : year + 1}
                </option>
                <option value={2} selected={month === 2 ? true : false}>
                  Fevereiro/{month <= 2 ? year : year + 1}
                </option>
                <option value={3} selected={month === 3 ? true : false}>
                  Março/{month <= 3 ? year : year + 1}
                </option>
                <option value={4} selected={month === 4 ? true : false}>
                  Abril/{month <= 4 ? year : year + 1}
                </option>
                <option value={5} selected={month === 5 ? true : false}>
                  Maio/{month <= 5 ? year : year + 1}
                </option>
                <option value={6} selected={month === 6 ? true : false}>
                  Junho/{month <= 6 ? year : year + 1}
                </option>
                <option value={7} selected={month === 7 ? true : false}>
                  Julho/{month <= 7 ? year : year + 1}
                </option>
                <option value={8} selected={month === 8 ? true : false}>
                  Agosto/{month <= 8 ? year : year + 1}
                </option>
                <option value={9} selected={month === 9 ? true : false}>
                  Setembro/{month <= 9 ? year : year + 1}
                </option>
                <option value={10} selected={month === 10 ? true : false}>
                  Outubro/{month <= 10 ? year : year + 1}
                </option>
                <option value={11} selected={month === 11 ? true : false}>
                  Novembro/{month <= 11 ? year : year + 1}
                </option>
                <option value={12} selected={month === 12 ? true : false}>
                  Dezembro/{month <= 12 ? year : year + 1}
                </option>
              </Select>
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
