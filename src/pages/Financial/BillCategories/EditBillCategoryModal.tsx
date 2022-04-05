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
import { ColorPicker } from '../../../components/Forms/ColorPicker'
import { useEffect } from 'react'
import { isAuthenticated } from '../../../services/auth'
import { redirectMessages } from '../../../utils/redirectMessages'
import { ControlledCheckbox } from '../../../components/Forms/CheckBox/ControlledCheckbox'

interface EditBillCategoryModalProps {
  isOpen: boolean
  toEditBillCategoryData: EditBillCategoryData
  onRequestClose: () => void
  afterEdit: () => void
  changeColor: (color: string) => void
  color: string
}

interface EditBillCategoryFormData {
  name: string
  color: string
  individual: boolean
}

interface EditBillCategoryData {
  id: number
  name: string
  color: string
  individual: boolean
}

const EditBillCategoryFormSchema = yup.object().shape({
  name: yup.string().required('Nome da categoria é obrigatório'),
  color: yup.string(),
  individual: yup.boolean()
})

export function EditBillCategoryModal({
  isOpen,
  toEditBillCategoryData,
  color,
  changeColor,
  afterEdit,
  onRequestClose
}: EditBillCategoryModalProps) {
  const history = useHistory()
  const toast = useToast()
  const { showErrors } = useErrors()

  const { handleSubmit, formState, control } =
    useForm<EditBillCategoryFormData>({
      resolver: yupResolver(EditBillCategoryFormSchema),
      defaultValues: {
        name: toEditBillCategoryData.name,
        color: toEditBillCategoryData.color
      }
    })

  const handleEditPaymentCategory = async (
    paymentCategoryData: EditBillCategoryFormData
  ) => {
    paymentCategoryData.color = color

    if (paymentCategoryData.color === '#ffffff') {
      toast({
        title: 'Ops',
        description: `Selecione uma cor diferente`,
        status: 'warning',
        duration: 12000,
        isClosable: true
      })

      return
    }

    try {
      await api.put(
        `/bill_categories/update/${toEditBillCategoryData.id}`,
        paymentCategoryData
      )

      toast({
        title: 'Sucesso',
        description: `A categoria ${toEditBillCategoryData.name} foi atualizado.`,
        status: 'success',
        duration: 12000,
        isClosable: true
      })

      afterEdit()
      onRequestClose()
    } catch (error: any) {
      console.log(error)
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
        onSubmit={handleSubmit(handleEditPaymentCategory)}
      >
        <ModalHeader p="10" fontWeight="700" fontSize="2xl">
          Editar a categoria {toEditBillCategoryData.name}
        </ModalHeader>

        <ModalCloseButton top="10" right="5" />

        <ModalBody pl="10" pr="10">
          <Stack spacing="6">
            <HStack spacing="4" align="baseline">
              <ColorPicker color={color} setNewColor={changeColor} />
              <ControlledInput
                control={control}
                value={toEditBillCategoryData.name}
                name="name"
                type="text"
                placeholder="Nome da categoria"
                variant="outline"
                error={formState.errors.name}
              />
            </HStack>

            <Flex as="div">
              <ControlledCheckbox
                label="Desabilitar no resultado"
                control={control}
                defaultIsChecked={toEditBillCategoryData.individual}
                name="individual"
                error={formState.errors.individual}
              />
            </Flex>
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
