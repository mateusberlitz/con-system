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
  useToast,
  Text,
  IconButton,
  Flex,
  Spinner
} from '@chakra-ui/react'

import { useHistory } from 'react-router'
import { useErrors } from '../../hooks/useErrors'

import { useWorkingCompany } from '../../hooks/useWorkingCompany'
import { useProfile } from '../../hooks/useProfile'
import { QuotaFilterData } from '../../hooks/useQuotas'
import { useEffect, useState } from 'react'
import { isAuthenticated } from '../../services/auth'
import { redirectMessages } from '../../utils/redirectMessages'

import { formatBRDate } from '../../utils/Date/formatBRDate'
import { useQuotas } from '../../hooks/useQuotas'
import { Quota } from '../../types'

interface ListUserSalesModalProps {
  isOpen: boolean
  onRequestClose: () => void
}

export interface toAddGoalUserData {
  id: number
  name: string
}

export function ListUserSalesModal({
  isOpen,
  onRequestClose
}: ListUserSalesModalProps) {
  const workingCompany = useWorkingCompany()
  const { profile, permissions } = useProfile()

  const history = useHistory()
  const toast = useToast()
  const { showErrors } = useErrors()

  const [page, setPage] = useState(1)

  const handleChangePage = (page: number) => {
    setPage(page)
  }

  const [filter, setFilter] = useState<QuotaFilterData>(() => {
    const data: QuotaFilterData = {
      company: workingCompany.company?.id,
      seller_id: profile ? profile.id : 0
    }

    return data
  })

  const quotas = useQuotas(filter, page)

  useEffect(() => {
    if (!isAuthenticated()) {
      history.push({
        pathname: '/',
        state: redirectMessages.auth
      })
    }
  }, [isOpen])

  useEffect(() => {
    setFilter({ ...filter, company: workingCompany.company?.id })
  }, [workingCompany])

  return (
    <Modal isOpen={isOpen} onClose={onRequestClose} size="xl">
      <ModalOverlay />
      <ModalContent as="form" borderRadius="24px">
        <ModalHeader p="10" fontWeight="700" fontSize="2xl">
          Histórico de vendas
        </ModalHeader>

        <ModalCloseButton top="10" right="5" />

        <ModalBody pl="10" pr="10">
          <Stack spacing="6">
            {   quotas.isLoading ? (
                    <Flex justify="left">
                        <Spinner/>
                    </Flex>
                ) : ( quotas.isError ? (
                    <Flex justify="left" mt="4" mb="4">
                        <Text>Erro listar as cotas vendidas</Text>
                    </Flex>
                ) : (quotas.data?.data.data.length === 0) && (
                    <Flex justify="left">
                        <Text>Nenhuma cota vendida encontrada.</Text>
                    </Flex>
                ) ) 
            }
            {quotas.data &&
              quotas.data.data?.data.map((quota: Quota) => {
                return (
                  <HStack>
                    <Text>{formatBRDate(quota.date_sale)}: </Text>
                    <Text
                      cursor="pointer"
                      fontWeight="bold"
                      _hover={{ textDecoration: 'underline' }}
                    >
                      {Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(quota.credit)}
                    </Text>
                  </HStack>
                )
              })}
          </Stack>
        </ModalBody>

        <ModalFooter p="10">
          <Link onClick={onRequestClose} color="gray.700" fontSize="14px">
            Fechar
          </Link>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
