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
import { SolidButton } from '../../components/Buttons/SolidButton'

import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { api } from '../../services/api'
import { useHistory } from 'react-router'
import { useErrors } from '../../hooks/useErrors'

import { Input } from '../../components/Forms/Inputs/Input'
import { useWorkingCompany } from '../../hooks/useWorkingCompany'
import { formatInputHourDate } from '../../utils/Date/formatInputHourDate'

interface NewTaskModalProps {
  isOpen: boolean
  onRequestClose: () => void
  afterCreate: () => void
}

interface CreateNewTaskFormData {
  description: string
  company: number
  time: string
}

const CreateNewTaskFormSchema = yup.object().shape({
  description: yup.string().required('A descrição da tarefa é obrigatória.'),
  company: yup.number(),
  time: yup.date().required('Selecione a data e horário de execução')
})

export function NewTaskModal({
  isOpen,
  onRequestClose,
  afterCreate
}: NewTaskModalProps) {
  const workingCompany = useWorkingCompany()
  const history = useHistory()
  const toast = useToast()
  const { showErrors } = useErrors()

  const { register, handleSubmit, reset, formState } =
    useForm<CreateNewTaskFormData>({
      resolver: yupResolver(CreateNewTaskFormSchema)
    })

  function includeAndFormatData(taskData: CreateNewTaskFormData) {
    taskData.time = formatInputHourDate(taskData.time)

    console.log(taskData.time)

    if (!workingCompany.company) {
      return taskData
    }

    taskData.company = workingCompany.company?.id

    return taskData
  }

  const handleCreateNewPayment = async (taskData: CreateNewTaskFormData) => {
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

      taskData = includeAndFormatData(taskData)

      await api.post('/tasks/store', taskData)

      toast({
        title: 'Sucesso',
        description: `A tarefa foi cadastrada.`,
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

  return (
    <Modal isOpen={isOpen} onClose={onRequestClose} size="xl">
      <ModalOverlay />
      <ModalContent
        as="form"
        borderRadius="24px"
        onSubmit={handleSubmit(handleCreateNewPayment)}
      >
        <ModalHeader p="10" fontWeight="700" fontSize="2xl">
          Cadastrar Tarefa
        </ModalHeader>

        <ModalCloseButton top="10" right="5" />

        <ModalBody pl="10" pr="10">
          <Stack spacing="6">
            <Input
              register={register}
              name="description"
              type="text"
              placeholder="Descrição"
              variant="outline"
              error={formState.errors.description}
            />

            <Input
              register={register}
              name="time"
              type="datetime-local"
              placeholder="Data de Execução"
              variant="outline"
              error={formState.errors.time}
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
