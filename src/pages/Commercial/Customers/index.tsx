import {
    Accordion,
    AccordionButton,
    AccordionItem,
    AccordionPanel,
    Badge as ChakraBadge,
    Checkbox,
    Divider,
    Flex,
    HStack,
    IconButton,
    Link,
    Spinner,
    Stack,
    Text,
    useBreakpointValue,
    useToast
  } from '@chakra-ui/react'
  import Badge from '../../../components/Badge'
  import { OutlineButton } from '../../../components/Buttons/OutlineButton'
  import { CompanySelectMaster } from '../../../components/CompanySelect/companySelectMaster'
  import { MainBoard } from '../../../components/MainBoard'
  
  import { ReactComponent as PlusIcon } from '../../../assets/icons/Plus.svg'
  import { ReactComponent as MinusIcon } from '../../../assets/icons/Minus.svg'
  import { ReactComponent as StrongPlusIcon } from '../../../assets/icons/StrongPlus.svg'
  import { ReactComponent as CloseIcon } from '../../../assets/icons/Close.svg'
  import { ReactComponent as EditIcon } from '../../../assets/icons/Edit.svg'
  
  import { HasPermission, useProfile } from '../../../hooks/useProfile'
  import { EditButton } from '../../../components/Buttons/EditButton'
  import { RemoveButton } from '../../../components/Buttons/RemoveButton'
  import { SolidButton } from '../../../components/Buttons/SolidButton'
  import { ChangeEvent, useState } from 'react'
  import { LeadsFilterData, useLeads } from '../../../hooks/useLeads'
  import { Customer, DataOrigin, Lead, LeadStatus } from '../../../types'
  import { api } from '../../../services/api'
  import { useEffect } from 'react'
  import { formatBRDate } from '../../../utils/Date/formatBRDate'
  import { getHour } from '../../../utils/Date/getHour'
  import { useUsers } from '../../../hooks/useUsers'
  import { NewSaleModal } from '../Sales/NewSaleModal'
  import { EditSaleFormData, EditSaleModal } from '../Sales/EditSaleModal'
  import {
    ConfirmSaleRemoveModal,
    RemoveSaleData
  } from '../Sales/ConfirmSaleRemoveModal'
  import { useWorkingCompany } from '../../../hooks/useWorkingCompany'
  import { useWorkingBranch } from '../../../hooks/useWorkingBranch'
import { useCustomers } from '../../../hooks/useCustomers'
import { SearchCustomers } from './SearchCustomers'
import { EditCustomerModal } from './EditCustomerModal'
  
  export default function Customers() {
    const workingCompany = useWorkingCompany()
    const workingBranch = useWorkingBranch()
  
    const toast = useToast()
    const { permissions, profile } = useProfile()
  
    const isManager = HasPermission(permissions, 'Comercial Completo');
  
    const checkPendingLeads = async () => {
      await api.post('/leads/check')
    }
  
    useEffect(() => {
      checkPendingLeads()
    }, [])
  
    const [origins, setOrigins] = useState<DataOrigin[]>([])
  
    const loadOrigins = async () => {
      const { data } = await api.get('/data_origins')
  
      setOrigins(data)
    }
  
    useEffect(() => {
      loadOrigins()
    }, [])
  
    const [filter, setFilter] = useState<LeadsFilterData>(() => {
      const data: LeadsFilterData = {
        search: '',
        //start_date: formatYmdDate(new Date().toString()),
        //end_date: formatYmdDate(new Date().toString()),
        company: workingCompany.company?.id,
        branch: workingBranch.branch?.id,
        status: 0,
        user: isManager ? undefined : profile?.id,
        group_by: ''
      }
  
      return data
    })
  
    function handleChangeFilter(newFilter: LeadsFilterData) {
      newFilter.user = isManager
        ? newFilter.user
          ? newFilter.user
          : undefined
        : profile?.id
      setFilter(newFilter)
    }

    const [isNewSaleModalOpen, setIsNewSaleModalOpen] = useState(false)
    const [addSaleToCustomerData, setAddSaleToCustomerData] = useState<Customer>()
  
    function OpenNewSaleModal(customer?: Customer) {
      setAddSaleToCustomerData(customer)
      setIsNewSaleModalOpen(true)
    }
    function CloseNewSaleModal() {
      setIsNewSaleModalOpen(false)
    }

    const customers = useCustomers(filter, 1);
  
    const [isEditCustomerModalOpen, setIsEditCustomerModalOpen] = useState(false)
    const [editCustomerFormData, setEditCustomerFormData] = useState<Customer>()
  
    function OpenEditCustomerModal(customerData: Customer) {
      setEditCustomerFormData(customerData)
      setIsEditCustomerModalOpen(true)
    }
    function CloseEditCustomerModal() {
      setIsEditCustomerModalOpen(false)
    }
  
    const pendingCustomersCount = 0;
  
    const isWideVersion = useBreakpointValue({
      base: false,
      lg: true
    })
  
    const [showingFilterMobile, setShowingFilterMobile] = useState(false)
  
    const handleOpenFilter = () => {
      setShowingFilterMobile(true)
    }
  
    const handleCloseFilter = () => {
      setShowingFilterMobile(false)
    }
  
    useEffect(() => {
      setFilter({
        ...filter,
        company: workingCompany.company?.id,
        branch: workingBranch.branch?.id
      })
    }, [workingCompany, workingBranch])

    console.log(customers.data?.data.data);
  
    return (
      <MainBoard sidebar="commercial" header={<CompanySelectMaster />}>
        <NewSaleModal
          isOpen={isNewSaleModalOpen}
          onRequestClose={CloseNewSaleModal}
          toAddCustomerData={addSaleToCustomerData}
        />

        <EditCustomerModal
          toEditCustomerData={editCustomerFormData}
          afterEdit={customers.refetch}
          isOpen={isEditCustomerModalOpen}
          onRequestClose={CloseEditCustomerModal}
        />
  
        <SolidButton
          color="white"
          bg="orange.400"
          icon={PlusIcon}
          colorScheme="orange"
          mb="10"
          onClick={() => OpenNewSaleModal()}
        >
          Cadastrar venda
        </SolidButton>
  
        {isWideVersion ? (
            <SearchCustomers
              filter={filter}
              handleSearchCustomers={handleChangeFilter}
            />
        ) : (
          <>
            <Link
              onClick={showingFilterMobile ? handleCloseFilter : handleOpenFilter}
              mb="12"
            >
              {showingFilterMobile ? 'Fechar Filtro' : 'Filtrar lista'}
            </Link>
  
            {showingFilterMobile && (
              <SearchCustomers
                filter={filter}
                handleSearchCustomers={handleChangeFilter}
              />
            )}
          </>
        )}
  
        {customers.isLoading ? (
          <Flex justify="center">
            <Spinner />
          </Flex>
        ) : customers.isError ? (
          <Flex justify="center" mt="4" mb="4">
            <Text>Erro listar os clientes</Text>
          </Flex>
        ) : (
            customers.data?.data.data.length === 0 && (
            <Flex justify="center">
              <Text>Nenhuma cliente encontrado.</Text>
            </Flex>
          )
        )}
  
        {!customers.isLoading && !customers.error && (
          <Accordion
            w="100%"
            border="2px"
            borderColor="gray.500"
            borderRadius="26"
            overflow="hidden"
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
                <Text>{customers.data?.data.data.length} clientes</Text>
              </HStack>
            </HStack>
  
            {customers.data?.data.data.map((customer: Customer) => {
                console.log(customer);
  
              return (
                <AccordionItem
                  key={customer.id}
                  display="flex"
                  flexDir="column"
                  paddingX={[4, 4, 8]}
                  paddingTop="3"
                  bg="white"
                  borderTop="2px"
                  borderTopColor="gray.500"
                  borderBottom="0"
                >
                  {({ isExpanded }) => (
                    <>
                      <HStack justify="space-between" mb="3" pos="relative">
                        <AccordionButton p="0" height="fit-content" w="auto">
                          <Flex
                            alignItems="center"
                            justifyContent="center"
                            h="24px"
                            w="30px"
                            p="0"
                            borderRadius="full"
                            border="2px"
                            borderColor="orange.400"
                          >
                            {!isExpanded ? (
                              <StrongPlusIcon
                                stroke="#f24e1e"
                                fill="none"
                                width="12px"
                              />
                            ) : (
                              <MinusIcon
                                stroke="#f24e1e"
                                fill="none"
                                width="12px"
                              />
                            )}
                          </Flex>
                        </AccordionButton>
  
                        {/* <ControlledCheckbox label="Pendência" control={control} defaultIsChecked={toEditPaymentData.pendency} name="pendency" error={formState.errors.pendency}/> */}
                        
                        {/* <Checkbox
                            label=""
                            name="delegate"
                            checked={delegateList.includes(customer.id)}
                            value={customer.id}
                            onChange={handleSelect}
                        /> */}
  
                        {/* {isWideVersion && (
                          <Stack spacing="0">
                            <Text fontSize="10px" color="gray.800">
                              {getHour(customer.created_at)}
                            </Text>
                            <Text
                              fontSize="sm"
                              fontWeight="normal"
                              color="gray.800"
                            >
                              {formatBRDate(customer.created_at)}
                            </Text>
                          </Stack>
                        )} */}
  
                        <Stack spacing="0">
                          <Text fontSize="sm" fontWeight="bold" color="gray.800">
                            {customer.name}
                          </Text>
                          <Text
                            fontSize="11px"
                            fontWeight="normal"
                            color="gray.800"
                          >
                            {customer.phone}
                          </Text>
                        </Stack>
  
                        <Stack spacing="0">
                          <Text
                            fontSize="sm"
                            fontWeight="normal"
                            color="gray.800"
                          >
                            {customer.city.name}
                          </Text>
                          <Text
                            fontSize="sm"
                            fontWeight="normal"
                            color="gray.800"
                          >
                            {customer.state.name}
                          </Text>
                        </Stack>
  
                        {/* <Text fontSize="sm" fontWeight="normal" color="gray.800">Veículo - R$50.000,00</Text> */}
  
                        <Text
                            fontSize="11px"
                            fontWeight="normal"
                            color="gray.800"
                          >
                            {customer.email}
                        </Text>

                        <Stack spacing="0">
                            <Text
                                fontSize="11px"
                                fontWeight="normal"
                                color="gray.800"
                            >
                                Cotas
                            </Text>
                                <Text
                                fontSize="sm"
                                fontWeight="normal"
                                color="gray.800"
                            >
                                {customer.quotas.length} cotas
                            </Text>
                        </Stack>

                        <EditButton onClick={() => OpenEditCustomerModal(customer)}/>
                      </HStack>
  
                      <AccordionPanel
                        flexDir="column"
                        borderTop="2px"
                        borderColor="gray.500"
                        px="1"
                        py="5"
                      >
                        <Stack
                          spacing="8"
                          direction={['column', 'column', 'column']}
                          justifyContent="space-between"
                          mb="4"
                        >
                            <Stack
                                spacing="8"
                                direction={['column', 'column', 'row']}
                                justifyContent="space-between"
                                mb="4"
                            >
                                <Stack spacing="0">
                                    <Text
                                        fontSize="11px"
                                        fontWeight="normal"
                                        color="gray.800"
                                    >
                                        Tipo de cliente
                                    </Text>
                                        <Text
                                        fontSize="sm"
                                        fontWeight="normal"
                                        color="gray.800"
                                    >
                                        {customer.type_customer === "PF" ? "Pessoa física" : "Pessoa jurídica" }
                                    </Text>
                                </Stack>

                                <Stack spacing="0">
                                    <Text
                                        fontSize="11px"
                                        fontWeight="normal"
                                        color="gray.800"
                                    >
                                        Rua
                                    </Text>
                                        <Text
                                        fontSize="sm"
                                        fontWeight="normal"
                                        color="gray.800"
                                    >
                                        {customer.address}
                                    </Text>
                                </Stack>

                                <Stack spacing="0">
                                    <Text
                                        fontSize="11px"
                                        fontWeight="normal"
                                        color="gray.800"
                                    >
                                        Bairro
                                    </Text>
                                        <Text
                                        fontSize="sm"
                                        fontWeight="normal"
                                        color="gray.800"
                                    >
                                        {customer.neighborhood}
                                    </Text>
                                </Stack>

                                <Stack spacing="0">
                                    <Text
                                        fontSize="11px"
                                        fontWeight="normal"
                                        color="gray.800"
                                    >
                                        Número
                                    </Text>
                                        <Text
                                        fontSize="sm"
                                        fontWeight="normal"
                                        color="gray.800"
                                    >
                                        {customer.number}
                                    </Text>
                                </Stack>

                                <Stack spacing="0">
                                    <Text
                                        fontSize="11px"
                                        fontWeight="normal"
                                        color="gray.800"
                                    >
                                        {customer.type_customer === "PF" ? "CPF" : "CNPJ" }
                                    </Text>
                                        <Text
                                        fontSize="sm"
                                        fontWeight="normal"
                                        color="gray.800"
                                    >
                                        {customer.cpf_cnpj}
                                    </Text>
                                </Stack>

                                <Stack spacing="0">
                                    <Text
                                        fontSize="11px"
                                        fontWeight="normal"
                                        color="gray.800"
                                    >
                                        Estado civil
                                    </Text>
                                        <Text
                                        fontSize="sm"
                                        fontWeight="normal"
                                        color="gray.800"
                                    >
                                        {customer.civil_status}
                                    </Text>
                                </Stack>

                            </Stack>

                          <Stack fontSize="sm" spacing="3">
                            <HStack justifyContent="space-between">
                              <Text fontWeight="bold">Cotas</Text>

                              <SolidButton
                                color="white"
                                bg="orange.400"
                                icon={PlusIcon}
                                pr="4"
                                pl="4"
                                fontSize="12px"
                                colorScheme="orange"
                                height="8"
                                size="sm"
                                onClick={() => OpenNewSaleModal(customer)}
                              >
                                Cadastrar venda
                              </SolidButton>
                            </HStack>
  
                            {customer.quotas.map(quota => {
                              return (
                                <HStack key={quota.id} justifyContent="space-between" borderTop="1px solid" borderColor="gray.200" pt="3">
                                    <Stack spacing="0">
                                        <Text
                                            fontSize="11px"
                                            fontWeight="normal"
                                            color="gray.800"
                                        >
                                            Contrato
                                        </Text>
                                            <Text
                                            fontSize="sm"
                                            fontWeight="normal"
                                            color="gray.800"
                                        >
                                            {quota.contract.number_contract}
                                        </Text>
                                    </Stack>

                                    <Stack spacing="0">
                                        <Text
                                            fontSize="11px"
                                            fontWeight="normal"
                                            color="gray.800"
                                        >
                                            Grupo e cota
                                        </Text>
                                            <Text
                                            fontSize="sm"
                                            fontWeight="normal"
                                            color="gray.800"
                                        >
                                            {quota.group} - {quota.quota}
                                        </Text>
                                    </Stack>

                                    <Stack spacing="0">
                                        <Text
                                            fontSize="11px"
                                            fontWeight="normal"
                                            color="gray.800"
                                        >
                                            Segmento
                                        </Text>
                                            <Text
                                            fontSize="sm"
                                            fontWeight="normal"
                                            color="gray.800"
                                        >
                                            {quota.consortium_type.description}
                                        </Text>
                                    </Stack>

                                    <Stack spacing="0">
                                        <Text
                                            fontSize="11px"
                                            fontWeight="normal"
                                            color="gray.800"
                                        >
                                            Parcelas pagas
                                        </Text>
                                            <Text
                                            fontSize="sm"
                                            fontWeight="normal"
                                            color="gray.800"
                                        >
                                            {quota.installments_paid} parcelas
                                        </Text>
                                    </Stack>

                                    <Stack spacing="0">
                                        <Text
                                            fontSize="11px"
                                            fontWeight="normal"
                                            color="gray.800"
                                        >
                                            Contemplação
                                        </Text>
                                            <Text
                                            fontSize="sm"
                                            fontWeight="normal"
                                            color="gray.800"
                                        >
                                            {quota.date_contemplation ? quota.date_contemplation : "Não contemplado"}
                                        </Text>
                                    </Stack>

                                    <Text color="gray.900" fontWeight="semibold">{Intl.NumberFormat('pt-BR', {style: 'currency',currency: 'BRL'}).format(quota.credit)}</Text>
                                </HStack>
                              )
                            })}
                          </Stack>
                        </Stack>
                      </AccordionPanel>
                    </>
                  )}
                </AccordionItem>
              )
            })}
          </Accordion>
        )}
      </MainBoard>
    )
  }
  