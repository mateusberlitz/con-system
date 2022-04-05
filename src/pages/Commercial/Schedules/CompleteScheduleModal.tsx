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
import { Select } from '../../../components/Forms/Selects/Select'
import { Lead } from '../../../types'
import { useWorkingCompany } from '../../../hooks/useWorkingCompany'
import { formatInputDate } from '../../../utils/Date/formatInputDate'
import moneyToBackend from '../../../utils/moneyToBackend'
import { useProfile } from '../../../hooks/useProfile'
import { useEffect } from 'react'
import { isAuthenticated } from '../../../services/auth'
import { redirectMessages } from '../../../utils/redirectMessages'

import { SelectOption } from '../../../components/Forms/ReactSelect'
import { CreateNewSaleFormData } from '../Sales/NewSaleModal'

interface NewLeadModalProps {
  isOpen: boolean
  toCompleteScheduleData: CompleteScheduleFormData
  onRequestClose: () => void
  afterEdit: () => void
  leads: Lead[]
}

export interface CompleteScheduleFormData {
  id: number
  lead?: number
}

const CompleteScheduleFormSchema = yup.object().shape({
  value: yup.string().nullable(),
  segment: yup.string().nullable(),
  date: yup.string().nullable()
})

export function CompleteScheduleModal({
  isOpen,
  onRequestClose,
  afterEdit,
  toCompleteScheduleData,
  leads
}: NewLeadModalProps) {
  const workingCompany = useWorkingCompany()
  const { profile, permissions } = useProfile()

  const history = useHistory()
  const toast = useToast()
  const { showErrors } = useErrors()

  const { register, handleSubmit, control, reset, formState } =
    useForm<CreateNewSaleFormData>({
      resolver: yupResolver(CompleteScheduleFormSchema)
    })

  const handleCreateNewPayment = async (saleData: CreateNewSaleFormData) => {
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

      saleData.company = workingCompany.company.id
      saleData.user = profile.id

      saleData.date = formatInputDate(saleData.date)
      saleData.value = moneyToBackend(saleData.value)

      if (
        toCompleteScheduleData.lead &&
        saleData.value &&
        saleData.date &&
        saleData.segment
      ) {
        saleData.lead = toCompleteScheduleData.lead

        const response = await api.post(`/sales/store`, saleData)

        await api.post(`/leads/update/${toCompleteScheduleData.lead}`, {
          status: 4
        })
      } else {
        await api.post(`/leads/update/${toCompleteScheduleData.lead}`, {
          status: 6
        })
      }

      await api.post(`/schedules/update/${toCompleteScheduleData.id}`, {
        status: true
      })

      toast({
        title: 'Sucesso',
        description: `O agendamento foi concluído.`,
        status: 'success',
        duration: 12000,
        isClosable: true
      })

      await api.post('/logs/store', {
        user: profile.id,
        company: workingCompany.company.id,
        action: `Alterou as informações de um agendamento`
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

  const leadOptions: Array<SelectOption> = [
    {
      value: '',
      label: 'Selecionar Lead'
    }
  ]

  leads.map((lead: Lead) => {
    leadOptions.push({ value: lead.id.toString(), label: lead.name })
  })

  return (
    <Modal isOpen={isOpen} onClose={onRequestClose} size="xl">
      <ModalOverlay />
      <ModalContent
        as="form"
        borderRadius="24px"
        onSubmit={handleSubmit(handleCreateNewPayment)}
      >
        <ModalHeader p="10" fontWeight="700" fontSize="2xl">
          <Text>Concluir agendamento</Text>
          <Text fontSize="sm" color="gray.700" fontWeight="normal">
            Caso tenha efetuado a venda, preencha abaixo.
          </Text>
        </ModalHeader>

        <ModalCloseButton top="10" right="5" />

        <ModalBody pl="10" pr="10">
          <Stack spacing="6">
            <Input
              register={register}
              name="value"
              type="text"
              placeholder="Valor do crédito"
              focusBorderColor="orange.400"
              variant="outline"
              error={formState.errors.value}
            />

            <Input
              register={register}
              name="date"
              type="date"
              placeholder="Data da venda"
              focusBorderColor="orange.400"
              variant="outline"
              mask=""
              error={formState.errors.date}
            />

            <HStack spacing="4" align="baseline">
              <Select
                register={register}
                h="45px"
                placeholder="Selecionar Bem"
                name="segment"
                w="100%"
                fontSize="sm"
                focusBorderColor="orange.400"
                bg="gray.400"
                variant="outline"
                _hover={{ bgColor: 'gray.500' }}
                size="lg"
                borderRadius="full"
                error={formState.errors.segment}
              >
                <option value="Imóvel">Imóvel</option>
                <option value="Veículo">Veículo</option>
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
            Concluir
          </SolidButton>

          <Link onClick={onRequestClose} color="gray.700" fontSize="14px">
            Cancelar
          </Link>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
