import { Text, Stack, Flex, Spinner, HStack } from '@chakra-ui/react'
import { UseQueryResult } from 'react-query'
import { SolidButton } from '../../components/Buttons/SolidButton'
import { DataOrigin, Lead, LeadStatus } from '../../types'
import { formatYmdDate } from '../../utils/Date/formatYmdDate'

import { formatBRDate } from '../../utils/Date/formatBRDate'
import { useProfile } from '../../hooks/useProfile'
import { BillFilterData } from '../../hooks/useBills'
import { useEffect, useState } from 'react'
import {
  ConfirmLeadRemoveModal,
  RemoveLeadData
} from './Leads/ConfirmLeadRemoveModal'
import { EditLeadFormData, EditLeadModal } from './Leads/EditLeadModal'
import { LeadsFilterData, useLeads } from '../../hooks/useLeads'
import { AtSign } from 'react-feather'
import { api } from '../../services/api'

import { ReactComponent as PlusIcon } from '../../assets/icons/Plus.svg'
import { getHour } from '../../utils/Date/getHour'
import { NewLeadModal } from './Leads/NewLeadModal'
import { useWorkingCompany } from '../../hooks/useWorkingCompany'

interface BillsSummaryProps {
  bills?: UseQueryResult<
    {
      data: any
      total: number
    },
    unknown
  >
  filter?: BillFilterData
  handleChangeFilter?: (newFilterValue: BillFilterData) => void
}

export function LeadsSummary() {
  const { profile } = useProfile()
  const workingCompany = useWorkingCompany()

  const [origins, setOrigins] = useState<DataOrigin[]>([])

  const loadOrigins = async () => {
    const { data } = await api.get('/data_origins')

    setOrigins(data)
  }

  const [statuses, setStatuses] = useState<LeadStatus[]>([])

  const loadStatuses = async () => {
    const { data } = await api.get('/lead_statuses')

    setStatuses(data)
  }

  const checkPendingLeads = async () => {
    await api.post('/leads/check')
  }

  useEffect(() => {
    loadOrigins()
    loadStatuses()
    checkPendingLeads()
  }, [])

  const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState(false)

  function OpenNewLeadModal() {
    setIsNewLeadModalOpen(true)
  }
  function CloseNewLeadModal() {
    setIsNewLeadModalOpen(false)
  }

  const [filter, setFilter] = useState<LeadsFilterData>(() => {
    const data: LeadsFilterData = {
      search: '',
      start_date: formatYmdDate(new Date().toString()),
      end_date: formatYmdDate(new Date().toString()),
      status: 0,
      user: profile?.id,
      group_by: '',
      company: workingCompany.company?.id
    }

    return data
  })

  useEffect(() => {
    setFilter({ ...filter, company: workingCompany.company?.id })
  }, [workingCompany])

  function handleChangeFilter(newFilter: LeadsFilterData) {
    setFilter(newFilter)
  }

  const leads = useLeads(filter, 1)

  const [isEditLeadModalOpen, setIsEditLeadModalOpen] = useState(false)

  const [toEditLeadData, setToEditLeadData] = useState<EditLeadFormData>(() => {
    const data: EditLeadFormData = {
      id: 0,
      name: '',
      email: '',
      phone: '',
      company: 0,
      accept_newsletter: 0,
      user: 0,
      status: 0,
      birthday: '',
      cnpj: '',
      cpf: '',
      origin: 0,
      address: '',
      address_code: '',
      address_country: '',
      address_uf: '',
      address_city: '',
      address_number: ''
    }

    return data
  })

  function OpenEditLeadModal(leadData: EditLeadFormData) {
    setToEditLeadData(leadData)
    setIsEditLeadModalOpen(true)
  }
  function CloseEditLeadModal() {
    setIsEditLeadModalOpen(false)
  }

  const [isRemoveLeadModalOpen, setIsRemoveLeadModalOpen] = useState(false)
  const [removeLeadData, setRemoveLeadData] = useState<RemoveLeadData>(() => {
    const data: RemoveLeadData = {
      name: '',
      id: 0
    }

    return data
  })

  function OpenRemoveLeadModal(leadData: RemoveLeadData) {
    setRemoveLeadData(leadData)
    setIsRemoveLeadModalOpen(true)
  }
  function CloseRemoveLeadModal() {
    setIsRemoveLeadModalOpen(false)
  }

  const pendingLeadsCount = leads.data?.data.reduce(
    (sumAmount: number, lead: Lead) => {
      if (lead.status && lead.status.name === 'Pendente') {
        return sumAmount + 1
      }
    },
    0
  )

  return (
    <>
      <NewLeadModal
        statuses={statuses}
        origins={origins}
        afterCreate={leads.refetch}
        isOpen={isNewLeadModalOpen}
        onRequestClose={CloseNewLeadModal}
      />
      <EditLeadModal
        toEditLeadData={toEditLeadData}
        statuses={statuses}
        origins={origins}
        afterEdit={leads.refetch}
        isOpen={isEditLeadModalOpen}
        onRequestClose={CloseEditLeadModal}
      />
      <ConfirmLeadRemoveModal
        toRemoveLeadData={removeLeadData}
        afterRemove={leads.refetch}
        isOpen={isRemoveLeadModalOpen}
        onRequestClose={CloseRemoveLeadModal}
      />

      <Stack
        w="100%"
        min-width="300px"
        spacing="6"
        justify="space-between"
        alignItems="left"
        bg="white"
        borderRadius="16px"
        shadow="xl"
        px={[5, 5, 8]}
        py={[5, 5, 8]}
      >
        <Stack
          direction={['column', 'column', 'row']}
          justifyContent="space-between"
          mb="4"
        >
          <HStack spacing="2">
            <AtSign />
            <Text fontSize="xl" mb="5" w="100%">
              Meus leads
            </Text>
          </HStack>

          <SolidButton
            onClick={OpenNewLeadModal}
            color="white"
            bg="orange.400"
            height="32px"
            icon={PlusIcon}
            colorScheme="orange"
            fontSize="12px"
          >
            Adicionar
          </SolidButton>
        </Stack>

        {leads.isLoading ? (
          <Flex justify="left">
            <Spinner />
          </Flex>
        ) : leads.isError ? (
          <Flex justify="left" mt="4" mb="4">
            <Text>Erro listar os leads</Text>
          </Flex>
        ) : (
          leads.data?.data.length === 0 && (
            <Flex justify="left">
              <Text>Nenhum lead encontrado.</Text>
            </Flex>
          )
        )}

        {!leads.isLoading && !leads.error && (
          <Stack
            w="100%"
            border="2px"
            borderColor="gray.500"
            borderRadius="26"
            overflow="hidden"
            spacing="0"
            allowMultiple
          >
            <HStack
              spacing="8"
              justify="space-between"
              paddingX="8"
              paddingY="3"
              bg="gray.200"
            >
              <HStack fontSize="sm" spacing="4">
                <Text>{leads.data?.data.length} leads</Text>
                <Text fontWeight="bold">
                  {pendingLeadsCount ? pendingLeadsCount : 0} pendentes
                </Text>
              </HStack>
            </HStack>

            {leads.data?.data.map((lead: Lead) => {
              const leadToEditData: EditLeadFormData = {
                id: lead.id,
                name: lead.name,
                email: lead.email,
                phone: lead.phone,
                company: lead.company.id,
                accept_newsletter: lead.accept_newsletter,
                user: lead.user?.id,
                status: lead.status?.id,
                birthday: lead.birthday,
                cnpj: lead.cnpj,
                cpf: lead.cpf,
                origin: lead.origin?.id,

                address: lead.address,
                address_code: lead.address_code,
                address_country: lead.address_country,
                address_uf: lead.address_uf,
                address_city: lead.address_city,
                address_number: lead.address_number,

                recommender: lead.recommender,
                commission: lead.commission,

                value: lead.value
                  ? lead.value.toString().replace('.', ',')
                  : '',
                segment: lead.segment
              }

              return (
                <Flex
                  key={lead.id}
                  display="flex"
                  flexDir="column"
                  paddingX={[4, 4, 8]}
                  paddingTop="3"
                  bg="white"
                  borderTop="2px"
                  borderTopColor="gray.500"
                  borderBottom="0"
                >
                  <HStack justify="space-between" mb="3">
                    <Stack spacing="0">
                      <Text fontSize="10px" color="gray.800">
                        {getHour(lead.created_at)}
                      </Text>
                      <Text fontSize="sm" fontWeight="normal" color="gray.800">
                        {formatBRDate(lead.created_at)}
                      </Text>
                    </Stack>

                    <Stack spacing="0">
                      <Text fontSize="sm" fontWeight="bold" color="gray.800">
                        {lead.name}
                      </Text>
                      <Text
                        fontSize="11px"
                        fontWeight="normal"
                        color="gray.800"
                      >
                        {lead.phone}
                      </Text>
                    </Stack>

                    <Stack spacing="0">
                      <Text fontSize="sm" fontWeight="normal" color="gray.800">
                        {lead.address_city}
                      </Text>
                      <Text fontSize="sm" fontWeight="normal" color="gray.800">
                        {lead.address_uf}
                      </Text>
                    </Stack>

                    {/* <Text fontSize="sm" fontWeight="normal" color="gray.800">Veículo - R$50.000,00</Text> */}

                    <Stack spacing="0">
                      <Text fontSize="10px" color="gray.800">
                        Pretensão
                      </Text>
                      <Text fontSize="sm" fontWeight="normal" color="gray.800">
                        {lead?.segment} -{' '}
                        {lead.value
                          ? Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: 'BRL'
                            }).format(lead.value)
                          : ''}
                      </Text>
                    </Stack>
                  </HStack>
                </Flex>
              )
            })}
          </Stack>
        )}
      </Stack>
    </>
  )
}
