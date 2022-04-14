import {
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay
} from '@chakra-ui/react'
import { SolidButton } from '../Buttons/SolidButton'

import { logout } from '../../services/auth'
import { useState } from 'react'
import { useHistory } from 'react-router'
import { useTenant } from '../../hooks/useTenant'

interface LogoutModalProps {
  isOpen: boolean
  onRequestClose: () => void
}

export function LogoutModal({ isOpen, onRequestClose }: LogoutModalProps) {
  //const {isOpen, onClose} = useDisclosure();
  const { prefix } = useTenant()
  const [logoutState, setLogoutState] = useState('')
  const history = useHistory()

  function handleLogout() {
    setLogoutState('logging off')

    if (logout()) {
      setLogoutState('logged off')

      history.push(`/`)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onRequestClose} size="xl">
      <ModalOverlay />
      <ModalContent borderRadius="24px">
        <ModalHeader p="10" fontWeight="700" fontSize="2xl">
          Deseja se desconectar?
        </ModalHeader>

        <ModalCloseButton top="10" right="5" />

        <ModalBody pl="10" pr="10"></ModalBody>

        <ModalFooter p="10">
          <SolidButton
            onClick={handleLogout}
            mr="6"
            color="white"
            bg="blue.400"
            fontSize="sm"
            _hover={{ filter: 'brightness(90%)' }}
            isLoading={logoutState === 'logging off'}
          >
            Desconectar
          </SolidButton>
          <Link onClick={onRequestClose} color="gray.700" fontSize="14px">
            Cancelar
          </Link>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
