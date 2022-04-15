import {
  Box,
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
  useToast,
  Input as ChakraInput,
  Divider,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel
} from '@chakra-ui/react'
import { SolidButton } from '../../../components/Buttons/SolidButton'

import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { api } from '../../../services/api'
import { useHistory } from 'react-router'
import { useErrors } from '../../../hooks/useErrors'

import { Input } from '../../../components/Forms/Inputs/Input'
import { LeadStatus } from '../../../types'
import { useWorkingCompany } from '../../../hooks/useWorkingCompany'
import { useProfile } from '../../../hooks/useProfile'
import { ControlledSelect } from '../../../components/Forms/Selects/ControlledSelect'
import { useEffect } from 'react'
import { isAuthenticated } from '../../../services/auth'
import { redirectMessages } from '../../../utils/redirectMessages'

interface NewLeadModalProps {
  isOpen: boolean
  toEditLeadStatusData: EditLeadStatusFormData
  onRequestClose: () => void
  afterEdit: () => void
  statuses: LeadStatus[]
}

export interface EditLeadStatusFormData {
  id: number
  name: string
  status?: number
  text?: string
}

export interface LeadStatusFormData {
  status?: number
  text?: string
}

const EditLeadFormSchema = yup.object().shape({
  status: yup.number(),
  text: yup.string().required('Por favor, dê detalhes sobre essa alteração')
})

export function ChangeLeadStatusModal({
  isOpen,
  onRequestClose,
  afterEdit,
  toEditLeadStatusData,
  statuses
}: NewLeadModalProps) {
  const workingCompany = useWorkingCompany()
  const { profile, permissions } = useProfile()

  const history = useHistory()
  const toast = useToast()
  const { showErrors } = useErrors()

  const { register, handleSubmit, control, reset, formState } =
    useForm<LeadStatusFormData>({
      resolver: yupResolver(EditLeadFormSchema),
      defaultValues: {
        status: toEditLeadStatusData.status,
        text: ''
      }
    })

  const handleCreateNewPayment = async (leadData: LeadStatusFormData) => {
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

      await api.post(`/leads/update/${toEditLeadStatusData.id}`, {
        status: leadData.status
      })

      const response = await api.post(`lead_notes/store`, {
        status: leadData.status,
        lead: toEditLeadStatusData.id,
        user: profile.id,
        text: leadData.text
      })

      toast({
        title: 'Sucesso',
        description: `O lead ${toEditLeadStatusData.name} foi atualizado.`,
        status: 'success',
        duration: 12000,
        isClosable: true
      })

      await api.post('/logs/store', {
        user: profile.id,
        company: workingCompany.company.id,
        action: `Alterou o status do lead ${toEditLeadStatusData.name} para ${leadData.status}`
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
          Alterar status do lead {toEditLeadStatusData.name}
        </ModalHeader>

        <ModalCloseButton top="10" right="5" />

        <ModalBody pl="10" pr="10">
          <Stack spacing="6">
            <HStack spacing="4" align="baseline">
              {!statuses ? (
                <Flex justify="center">
                  <Text>Nenhum status disponível</Text>
                </Flex>
              ) : (
                <ControlledSelect
                  control={control}
                  value={toEditLeadStatusData.status}
                  h="45px"
                  name="status"
                  w="100%"
                  fontSize="sm"
                  focusBorderColor="orange.400"
                  bg="gray.400"
                  variant="outline"
                  _hover={{ bgColor: 'gray.500' }}
                  size="lg"
                  borderRadius="full"
                  error={formState.errors.status}
                >
                  {statuses &&
                    statuses.map((status: LeadStatus) => {
                      return (
                        <option key={status.id} value={status.id}>
                          {status.name}
                        </option>
                      )
                    })}
                </ControlledSelect>
              )}
            </HStack>

            <Input
              as="textarea"
              value=""
              register={register}
              borderRadius="24px"
              h="100px"
              name="text"
              type="text"
              placeholder="Anotação"
              focusBorderColor="orange.400"
              variant="outline"
              error={formState.errors.text}
            />
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
