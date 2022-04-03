import {
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast
} from '@chakra-ui/react'
import { SolidButton } from '../../../components/Buttons/SolidButton'

import { ReactComponent as CloseIcon } from '../../../assets/icons/Close.svg'
import { showErrors } from '../../../hooks/useErrors'
import { api } from '../../../services/api'
import { isAuthenticated } from '../../../services/auth'
import { useEffect } from 'react'
import { redirectMessages } from '../../../utils/redirectMessages'
import { useHistory } from 'react-router-dom'
import { useWorkingCompany } from '../../../hooks/useWorkingCompany'
import { useProfile } from '../../../hooks/useProfile'

export interface RemoveSaleData {
  id: number
  group: string
  quota: string
}

interface ConfirmSaleRemoveModalProps {
  isOpen: boolean
  toRemoveSaleData: RemoveSaleData
  onRequestClose: () => void
  afterRemove: () => void
}

export function ConfirmSaleRemoveModal({
  isOpen,
  toRemoveSaleData,
  afterRemove,
  onRequestClose
}: ConfirmSaleRemoveModalProps) {
  const workingCompany = useWorkingCompany()
  const { profile, permissions } = useProfile()
  const toast = useToast()

  const history = useHistory()

  const handleRemoveLead = async () => {
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

      await api.delete(`/sales/destroy/${toRemoveSaleData.id}`)

      toast({
        title: 'Sucesso',
        description: `A venda ${toRemoveSaleData.group}-${toRemoveSaleData.quota}`,
        status: 'success',
        duration: 12000,
        isClosable: true
      })

      await api.post('/logs/store', {
        user: profile.id,
        company: workingCompany.company.id,
        action: `Removeu a venda ${toRemoveSaleData.group}-${toRemoveSaleData.quota}`
      })

      onRequestClose()
      afterRemove()
    } catch (error) {
      showErrors(error, toast)
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
      <ModalContent borderRadius="24px">
        <ModalHeader p="10" fontWeight="700" fontSize="2xl">
          Remover a venda {toRemoveSaleData.group}-{toRemoveSaleData.quota}?
        </ModalHeader>

        <ModalCloseButton top="10" right="5" />

        <ModalBody pl="10" pr="10">
          <SolidButton
            onClick={handleRemoveLead}
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
