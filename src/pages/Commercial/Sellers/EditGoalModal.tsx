import {
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

import { useWorkingCompany } from '../../../hooks/useWorkingCompany'
import { useProfile } from '../../../hooks/useProfile'
import { useEffect } from 'react'
import { isAuthenticated } from '../../../services/auth'
import { redirectMessages } from '../../../utils/redirectMessages'

import { ControlledInput } from '../../../components/Forms/Inputs/ControlledInput'

interface NewLeadModalProps {
  isOpen: boolean
  toEditGoalData: EditGoalFormData
  onRequestClose: () => void
  afterEdit: () => void
}

export interface EditGoalFormData {
  id: number
  name: string
  value: string
  month?: number
}

const EditGoalFormSchema = yup.object().shape({
  value: yup.string().required('Qual o valor da venda?')
})

export function EditGoalModal({
  isOpen,
  onRequestClose,
  afterEdit,
  toEditGoalData
}: NewLeadModalProps) {
  const workingCompany = useWorkingCompany()
  const { profile, permissions } = useProfile()

  const history = useHistory()
  const toast = useToast()
  const { showErrors } = useErrors()

  const { register, handleSubmit, control, reset, formState } =
    useForm<EditGoalFormData>({
      resolver: yupResolver(EditGoalFormSchema),
      defaultValues: {
        id: toEditGoalData.id,
        value: toEditGoalData.value
      }
    })

  const handleCreateNewPayment = async (saleData: EditGoalFormData) => {
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

      const response = await api.post(
        `/goals/update/${toEditGoalData.id}`,
        saleData
      )

      toast({
        title: 'Sucesso',
        description: `Venda atualizada`,
        status: 'success',
        duration: 12000,
        isClosable: true
      })

      await api.post('/logs/store', {
        user: profile.id,
        company: workingCompany.company.id,
        action: `Alterou a meta do vendedor(a) ${toEditGoalData.name}`
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

  return (
    <Modal isOpen={isOpen} onClose={onRequestClose} size="xl">
      <ModalOverlay />
      <ModalContent
        as="form"
        borderRadius="24px"
        onSubmit={handleSubmit(handleCreateNewPayment)}
      >
        <ModalHeader p="10" fontWeight="700" fontSize="2xl">
          Alterar meta do vendedor(a) {toEditGoalData.name}
        </ModalHeader>

        <ModalCloseButton top="10" right="5" />

        <ModalBody pl="10" pr="10">
          <Stack spacing="6">
            <ControlledInput
              control={control}
              value={toEditGoalData.value}
              name="value"
              type="text"
              placeholder="Nome"
              focusBorderColor="orange.400"
              variant="outline"
              error={formState.errors.value}
            />

            {/* <HStack spacing="4" align="baseline">
                            <ControlledSelect control={control} value={toEditGoalData.segment.toString()}  h="45px" name="segment" w="100%" fontSize="sm" focusBorderColor="orange.400" bg="gray.400" variant="outline" _hover={ {bgColor: 'gray.500'} } size="lg" borderRadius="full" error={formState.errors.segment}>
                                <option value="Imóvel">Imóvel</option>
                                <option value="Veículo">Veículo</option>
                            </ControlledSelect>
                        </HStack> */}
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
      </ModalContent>
    </Modal>
  )
}
