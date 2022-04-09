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
  Text,
  useToast
} from '@chakra-ui/react'
import { SolidButton } from '../../../components/Buttons/SolidButton'

import { ReactComponent as CloseIcon } from '../../../assets/icons/Close.svg'
import { showErrors } from '../../../hooks/useErrors'
import { api } from '../../../services/api'
import { isAuthenticated } from '../../../services/auth'
import { useEffect, useState } from 'react'
import { redirectMessages } from '../../../utils/redirectMessages'
import { useHistory } from 'react-router-dom'
import { useWorkingCompany } from '../../../hooks/useWorkingCompany'
import { useProfile } from '../../../hooks/useProfile'
import { Input } from '../../../components/Forms/Inputs/Input'

export interface RemoveCompanyRuleParcelData {
  id: number;
  company_commission_rule_id: number;
  parcel_number: number;
  percentage_to_pay: number;
  chargeback_percentage?: number;
}

interface ConfirmBranchRemoveModalProps {
  isOpen: boolean
  toRemoveCompanyRuleParcelData: RemoveCompanyRuleParcelData
  onRequestClose: () => void
  afterRemove: () => void
}

export function ConfirmCompanyRuleParcelRemoveModal({
  isOpen,
  toRemoveCompanyRuleParcelData,
  afterRemove,
  onRequestClose
}: ConfirmBranchRemoveModalProps) {
  const workingCompany = useWorkingCompany()
  const { profile, permissions } = useProfile()
  const toast = useToast()

  const history = useHistory()

  const [name, setName] = useState('')

  const handleRemoveCompanyRuleParcel = async () => {
    try {
      if (!profile) {
        return
      }

      await api.delete(`/company-commission-rule-parcels/${toRemoveCompanyRuleParcelData.id}`)

      toast({
        title: 'Sucesso',
        description: `A parcela ${toRemoveCompanyRuleParcelData.parcel_number} foi removida`,
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
          Remover a parcela {toRemoveCompanyRuleParcelData.parcel_number}?
        </ModalHeader>

        <ModalCloseButton top="10" right="5" />

        <ModalBody pl="10" pr="10">
            <SolidButton onClick={handleRemoveCompanyRuleParcel} mr="6" color="white" bg="red.400" _hover={{filter: "brightness(90%)"}} rightIcon={<CloseIcon stroke="#ffffff" fill="none" width="18px" strokeWidth="3px"/>}>
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
