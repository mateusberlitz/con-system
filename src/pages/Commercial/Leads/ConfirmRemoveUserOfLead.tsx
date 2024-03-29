import {
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
  Input as ChakraInput,
  Divider,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel
} from '@chakra-ui/react'
import { SolidButton } from '../../../components/Buttons/SolidButton'

import { api } from '../../../services/api'
import { useHistory } from 'react-router'
import { useErrors } from '../../../hooks/useErrors'
import { ReactComponent as CloseIcon } from '../../../assets/icons/Close.svg'

import { useWorkingCompany } from '../../../hooks/useWorkingCompany'
import { HasPermission, useProfile } from '../../../hooks/useProfile'
import { useEffect } from 'react'
import { isAuthenticated } from '../../../services/auth'
import { redirectMessages } from '../../../utils/redirectMessages'

export interface RemoveLeadData {
  id: number
  name: string
}

interface DelegateLeadModalProps {
  isOpen: boolean
  toRemoveLeadData: RemoveLeadData
  onRequestClose: () => void
  afterRemove: () => void
}

export function ConfirmRemoveUserOfLead({
  isOpen,
  onRequestClose,
  toRemoveLeadData,
  afterRemove
}: DelegateLeadModalProps) {
  const workingCompany = useWorkingCompany()
  const { profile, permissions } = useProfile()

  const history = useHistory()
  const toast = useToast()
  const { showErrors } = useErrors()

  const handleRemoveUserOfLead = async () => {
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

      const isManager = HasPermission(permissions, 'Vendas Completo')

      if (!isManager) {
        return
      }

      if (!profile) {
        return
      }

      const response = await api.post(`/leads/update/${toRemoveLeadData.id}`, {
        user: null,
        status: 7
      })

      toast({
        title: 'Sucesso',
        description: `O lead foi removido do usuário.`,
        status: 'success',
        duration: 12000,
        isClosable: true
      })

      await api.post('/logs/store', {
        user: profile.id,
        company: workingCompany.company.id,
        action: `Removeu o ${toRemoveLeadData.name} de um vendedor`
      })

      onRequestClose()
      afterRemove()
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
      <ModalContent as="form" borderRadius="24px">
        <ModalHeader p="10" fontWeight="700" fontSize="2xl">
          Remover o vendedor do lead {toRemoveLeadData.name}
        </ModalHeader>

        <ModalCloseButton top="10" right="5" />

        <ModalBody pl="10" pr="10">
          <SolidButton
            onClick={handleRemoveUserOfLead}
            mr="6"
            color="white"
            bg="red.400"
            _hover={{ filter: 'brightness(90%)' }}
            rightIcon={
              <CloseIcon
                stroke="#ffffff"
                fill="none"
                width="18px"
                strokeWidth="3px"
              />
            }
          >
            Confirmar e Remover
          </SolidButton>
        </ModalBody>

        <ModalFooter p="10">
          <Link onClick={onRequestClose} color="gray.700" fontSize="14px">
            Cancelar
          </Link>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
