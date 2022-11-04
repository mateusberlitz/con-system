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
import { Company } from '../../../types'
import { ControlledSelect } from '../../../components/Forms/Selects/ControlledSelect'
import { useDesks } from '../../../hooks/useDesks'
import { useEffect } from 'react'
import { isAuthenticated } from '../../../services/auth'
import { redirectMessages } from '../../../utils/redirectMessages'

interface EditRoleModalProps {
  isOpen: boolean
  toEditRoleData: EditRoleData
  onRequestClose: () => void
  afterEdit: () => void
}

interface EditRoleFormData {
  name: string
  desk_id: number
}

interface EditRoleData {
  id: number
  name: string
  desk_id: number
}

const EditRoleFormSchema = yup.object().shape({
  name: yup.string().required('Nome do cargo é obrigatório'),
  desk_id: yup
    .number()
    .min(1, 'Selecione a área principal de trabalho')
    .required('Selecione a área principal de trabalho')
})

export function EditRoleModal({
  isOpen,
  toEditRoleData,
  afterEdit,
  onRequestClose
}: EditRoleModalProps) {
  const desks = useDesks()

  const history = useHistory()
  const toast = useToast()
  const { showErrors } = useErrors()

  const { handleSubmit, formState, control } = useForm<EditRoleFormData>({
    resolver: yupResolver(EditRoleFormSchema),
    defaultValues: {
      name: toEditRoleData.name,
      desk_id: toEditRoleData.desk_id
    }
  })

  const handleEditRole = async (roleData: EditRoleFormData) => {
    try {
      await api.put(`/roles/edit/${toEditRoleData.id}`, roleData)

      toast({
        title: 'Sucesso',
        description: `O cargo ${toEditRoleData.name} foi atualizado.`,
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
        onSubmit={handleSubmit(handleEditRole)}
      >
        <ModalHeader p="10" fontWeight="700" fontSize="2xl">
          Editar usuário {toEditRoleData.name}
        </ModalHeader>

        <ModalCloseButton top="10" right="5" />

        <ModalBody pl="10" pr="10">
          <Stack spacing="6">
            <HStack spacing="4" align="baseline">
              <ControlledInput
                control={control}
                value={toEditRoleData.name}
                name="name"
                type="text"
                placeholder="Nome do cargo"
                variant="outline"
                error={formState.errors.name}
                focusBorderColor="purple.600"
              />
            </HStack>

            <HStack spacing="4" align="baseline">
              {desks.isLoading ? (
                <Flex justify="center">
                  <Spinner />
                </Flex>
              ) : (
                <ControlledSelect
                  control={control}
                  name="desk_id"
                  value={toEditRoleData.desk_id.toString()}
                  variant="outline"
                  error={formState.errors.desk_id}
                  focusBorderColor="purple.600"
                >
                  <option key="0" value="0">
                    Empresa
                  </option>
                  {desks.data &&
                    desks.data.map((desk: Company) => {
                      return (
                        <option key={desk.id} value={desk.id}>
                          {desk.name}
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
