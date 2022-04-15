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
import { User } from '../../../types'
import { useWorkingCompany } from '../../../hooks/useWorkingCompany'

import { HasPermission, useProfile } from '../../../hooks/useProfile'
import { ControlledSelect } from '../../../components/Forms/Selects/ControlledSelect'
import { useEffect } from 'react'
import { isAuthenticated } from '../../../services/auth'
import { redirectMessages } from '../../../utils/redirectMessages'

interface DelegateLeadModalProps {
  isOpen: boolean
  toDelegateLeadList: number[]
  toDelegate: number
  onRequestClose: () => void
  afterDelegate: () => void
  users: User[]
}

export interface DelegateLeadFormData {
  user: number
  status: number
}

const DelegateLeadFormSchema = yup.object().shape({
  user: yup.number()
})

export function DelegateLeadModal({
  isOpen,
  onRequestClose,
  toDelegateLeadList,
  toDelegate,
  afterDelegate,
  users
}: DelegateLeadModalProps) {
  const workingCompany = useWorkingCompany()
  const { profile, permissions } = useProfile()

  const history = useHistory()
  const toast = useToast()
  const { showErrors } = useErrors()

  const { register, handleSubmit, control, reset, formState } =
    useForm<DelegateLeadFormData>({
      resolver: yupResolver(DelegateLeadFormSchema),
      defaultValues: {}
    })

  const handleCreateNewPayment = async (leadData: DelegateLeadFormData) => {
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

      const isManager = HasPermission(permissions, 'Vendas Completo')

      if (!isManager) {
        return
      }

      let response

      console.log(leadData)

      leadData.status = 3

      if (toDelegate) {
        response = api
          .post(`/leads/update/${toDelegate}`, leadData)
          .then(afterDelegate)
      } else {
        response = toDelegateLeadList.map((leadId: number) => {
          return api
            .post(`/leads/update/${leadId}`, leadData)
            .then(afterDelegate)
        })
      }

      toast({
        title: 'Sucesso',
        description: `O leads foram delegados.`,
        status: 'success',
        duration: 12000,
        isClosable: true
      })

      const countOfLeads = toDelegate ? 1 : toDelegateLeadList.length

      await api.post('/logs/store', {
        user: profile.id,
        company: workingCompany.company.id,
        action: `Delegou ${countOfLeads} leads`
      })

      onRequestClose()
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
          Delegar leads
        </ModalHeader>

        <ModalCloseButton top="10" right="5" />

        <ModalBody pl="10" pr="10">
          <Stack spacing="6">
            <HStack spacing="4" align="baseline">
              {!users ? (
                <Flex justify="center">
                  <Text>Nenhum vendedor disponível</Text>
                </Flex>
              ) : (
                <ControlledSelect
                  control={control}
                  value={0}
                  placeholder="Selecionar Vendedor(a)"
                  h="45px"
                  name="user"
                  w="100%"
                  fontSize="sm"
                  focusBorderColor="orange.400"
                  bg="gray.400"
                  variant="outline"
                  _hover={{ bgColor: 'gray.500' }}
                  size="lg"
                  borderRadius="full"
                  error={formState.errors.user}
                >
                  {users &&
                    users.map((user: User) => {
                      return (
                        <option key={user.id} value={user.id}>
                          {user.name}
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
            bg="orange.400"
            colorScheme="orange"
            type="submit"
            isLoading={formState.isSubmitting}
          >
            Delegar
          </SolidButton>

          <Link onClick={onRequestClose} color="gray.700" fontSize="14px">
            Cancelar
          </Link>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
