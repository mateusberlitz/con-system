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
import { useEffect } from 'react'
import { redirectMessages } from '../../../utils/redirectMessages'
import { isAuthenticated } from '../../../services/auth'
import { useHistory } from 'react-router-dom'

interface ConfirmRoleRemoveModalProps {
  isOpen: boolean
  toRemoveRoleId: number
  onRequestClose: () => void
  afterRemove: () => void
}

export function ConfirmRoleRemoveModal({
  isOpen,
  toRemoveRoleId,
  afterRemove,
  onRequestClose
}: ConfirmRoleRemoveModalProps) {
  const toast = useToast()
  const history = useHistory()

  const handleRemoveRole = async () => {
    console.log(toRemoveRoleId)
    try {
      await api.delete(`/roles/destroy/${toRemoveRoleId}`)

      toast({
        title: 'Sucesso',
        description: `O cargo foi removido`,
        status: 'success',
        duration: 12000,
        isClosable: true
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
          Remover o cargo selecionado?
        </ModalHeader>

        <ModalCloseButton top="10" right="5" />

        <ModalBody pl="10" pr="10">
          <SolidButton
            onClick={handleRemoveRole}
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
