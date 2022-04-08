import {
  Flex,
  HStack,
  Stack,
  Spinner,
  Text,
  IconButton,
  Select as ChakraSelect,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  useToast,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Divider,
  Box,
  Icon,
  useBreakpointValue
} from '@chakra-ui/react'
import { SolidButton } from '../../../components/Buttons/SolidButton'
import { MainBoard } from '../../../components/MainBoard'
import { useCompanies } from '../../../hooks/useCompanies'
import { useProfile } from '../../../hooks/useProfile'
import { Company, Bill, BillCategory, PartialBill } from '../../../types'

import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import { ReactComponent as PlusIcon } from '../../../assets/icons/Plus.svg'
import { ReactComponent as MinusIcon } from '../../../assets/icons/Minus.svg'
import { ReactComponent as StrongPlusIcon } from '../../../assets/icons/StrongPlus.svg'
import { ReactComponent as EllipseIcon } from '../../../assets/icons/Ellipse.svg'
import { ReactComponent as TagIcon } from '../../../assets/icons/Tag.svg'
import { ReactComponent as CheckIcon } from '../../../assets/icons/Check.svg'
import { ReactComponent as CloseIcon } from '../../../assets/icons/Close.svg'
import { ReactComponent as RefreshIcon } from '../../../assets/icons/Refresh.svg'
import { ReactComponent as EditIcon } from '../../../assets/icons/Edit.svg'

import { Input } from '../../../components/Forms/Inputs/Input'
import { OutlineButton } from '../../../components/Buttons/OutlineButton'
import { EditButton } from '../../../components/Buttons/EditButton'
import { RemoveButton } from '../../../components/Buttons/RemoveButton'
import { useEffect, useState } from 'react'
import { NewBillModal } from './NewBillModal'
import { ConfirmBillRemoveModal } from './ConfirmBillRemoveModal'
import { useHistory } from 'react-router'
import { api } from '../../../services/api'
import { UserFilterData, useUsers } from '../../../hooks/useUsers'
import { useWorkingCompany } from '../../../hooks/useWorkingCompany'
import { BillFilterData, useBills } from '../../../hooks/useBills'
import { EditBillFormData, EditBillModal } from './EditBillModal'
import { formatDate } from '../../../utils/Date/formatDate'
import { formatYmdDate } from '../../../utils/Date/formatYmdDate'
import { formatBRDate } from '../../../utils/Date/formatBRDate'
import { getDay } from '../../../utils/Date/getDay'
import { useSources } from '../../../hooks/useSources'
import { Select } from '../../../components/Forms/Selects/Select'
import { Pagination } from '../../../components/Pagination'
import { ReceiveBillFormData, ReceiveBillModal } from './ReceiveBillModal'
import { ReceiveAllBillsModal } from './ReceiveAllBillsModal'
import { showErrors } from '../../../hooks/useErrors'
import { ConfirmPartialBillRemoveModal } from './ConfirmPartialBillRemoveModal'
import {
  EditPartialBillFormData,
  EditPartialBillModal
} from './EditPartialBillModal'
import { useWorkingBranch } from '../../../hooks/useWorkingBranch'
import { CompanySelectMaster } from '../../../components/CompanySelect/companySelectMaster'

interface RemoveBillData {
  id: number
  title: string
}

const FilterBillsFormSchema = yup.object().shape({
  search: yup.string(),
  start_date: yup.string(),
  end_date: yup.string(),
  category: yup.string(),
  company: yup.string(),
  source: yup.string(),
  status: yup.string()
})

export default function Bills() {
  const workingCompany = useWorkingCompany()
  const workingBranch = useWorkingBranch()
  const history = useHistory()
  const isWideVersion = useBreakpointValue({ base: false, lg: true })

  const [filter, setFilter] = useState<BillFilterData>(() => {
    const data: BillFilterData = {
      search: '',
      company: workingCompany.company?.id,
      branch: workingBranch.branch?.id,
      status: 0
    }

    return data
  })

  function handleChangeFilter(newFilter: BillFilterData) {
    setFilter(newFilter)
  }

  const [page, setPage] = useState(1)

  const bills = useBills(filter, page)

  const { profile, permissions } = useProfile()
  const companies = useCompanies()
  const sources = useSources()

  const { register, handleSubmit, formState } = useForm<BillFilterData>({
    resolver: yupResolver(FilterBillsFormSchema)
  })

  function handleChangeCompany(event: any) {
    const selectedCompanyId = event?.target.value ? event?.target.value : 1
    const selectedCompanyData = companies.data.filter(
      (company: Company) => company.id === selectedCompanyId
    )[0]
    workingCompany.changeCompany(selectedCompanyData)

    const updatedFilter = filter
    updatedFilter.company = selectedCompanyId

    setFilter(updatedFilter)
  }

  const [isNewBillModalOpen, setIsNewBillModalOpen] = useState(false)

  function OpenNewBillModal() {
    setIsNewBillModalOpen(true)
  }
  function CloseNewBillModal() {
    setIsNewBillModalOpen(false)
  }

  const [categories, setCategories] = useState<BillCategory[]>([])

  const loadCategories = async () => {
    const { data } = await api.get('/bill_categories')

    setCategories(data)
  }

  useEffect(() => {
    loadCategories()
  }, [])

  const usersFilter: UserFilterData = {
    search: ''
  }

  const users = useUsers(usersFilter)

  const [toEditBillData, setToEditBillData] = useState<EditBillFormData>(() => {
    const data: EditBillFormData = {
      id: 0,
      title: '',
      value: '',
      company: 0,
      category: 0,
      source: 0,
      expire: '',
      observation: ''
    }

    return data
  })

  const [isEditBillModalOpen, setIsEditBillModalOpen] = useState(false)

  function OpenEditBillModal(BillData: EditBillFormData) {
    setToEditBillData(BillData)
    setIsEditBillModalOpen(true)
  }
  function CloseEditBillModal() {
    setIsEditBillModalOpen(false)
  }

  const [isConfirmBillRemoveModalOpen, setisConfirmBillRemoveModalOpen] =
    useState(false)
  const [removeBillData, setRemoveBillData] = useState<RemoveBillData>(() => {
    const data: RemoveBillData = {
      title: '',
      id: 0
    }

    return data
  })

  function OpenConfirmBillRemoveModal(BillData: RemoveBillData) {
    setRemoveBillData(BillData)
    setisConfirmBillRemoveModalOpen(true)
  }
  function CloseConfirmBillRemoveModal() {
    setisConfirmBillRemoveModalOpen(false)
  }

  const [isConfirmPartialRemoveModalOpen, setisConfirmPartialRemoveModalOpen] =
    useState(false)
  const [removePartialData, setRemovePartialData] = useState<RemoveBillData>(
    () => {
      const data: RemoveBillData = {
        title: '',
        id: 0
      }

      return data
    }
  )

  function OpenConfirmPartialRemoveModal(partialData: RemoveBillData) {
    setRemovePartialData(partialData)
    setisConfirmPartialRemoveModalOpen(true)
  }
  function CloseConfirmPartialRemoveModal() {
    setisConfirmPartialRemoveModalOpen(false)
  }

  const [isReceiveBillModalOpen, setIsReceiveBillModalOpen] = useState(false)
  const [toReceiveBillData, setToReceiveBillData] =
    useState<ReceiveBillFormData>(() => {
      const data: ReceiveBillFormData = {
        id: 0,
        value: 0,
        paid: 0,
        new_value: '',
        title: '',
        company: workingCompany.company?.id
      }

      return data
    })

  function OpenReceiveBillModal(billIdAndName: ReceiveBillFormData) {
    setToReceiveBillData(billIdAndName)
    setIsReceiveBillModalOpen(true)
  }
  function CloseReceiveBillModal() {
    setIsReceiveBillModalOpen(false)
  }

  const [isPartialEditModalOpen, setIsPartialEditModalOpen] = useState(false)
  const [EditPartialData, setEditPartialData] =
    useState<EditPartialBillFormData>(() => {
      const data: EditPartialBillFormData = {
        id: 0,
        value: '',
        receive_date: ''
      }

      return data
    })

  function OpenPartialEditModal(partialData: EditPartialBillFormData) {
    setEditPartialData(partialData)
    setIsPartialEditModalOpen(true)
  }
  function ClosePartialEditModal() {
    setIsPartialEditModalOpen(false)
  }

  const [isReceiveAllBillsModalOpen, setIsReceiveAllBillsModalOpen] =
    useState(false)
  const [dayToReceiveBills, setDayToReceiveBills] = useState<string>(() => {
    const day: string = ''

    return day
  })

  function OpenReceiveAllBillsModal(day: string) {
    setDayToReceiveBills(day)
    setIsReceiveAllBillsModalOpen(true)
  }
  function CloseReceiveAllBillsModal() {
    setIsReceiveAllBillsModalOpen(false)
  }

  const toast = useToast()

  const handleReverseBill = async (billId: number) => {
    try {
      await api.post(`/bills/unreceive/${billId}`)

      toast({
        title: 'Sucesso',
        description: `Conta a receber redefinda como não recebida.`,
        status: 'success',
        duration: 12000,
        isClosable: true
      })

      bills.refetch()
    } catch (error: any) {
      showErrors(error, toast)

      if (error.response.data.access) {
        history.push('/')
      }
    }
  }

  const handleSearchBills = async (search: BillFilterData) => {
    search.company = workingCompany.company?.id

    setPage(1)
    setFilter(search)
  }

  let totalOfSelectedDays = 0

  if (
    filter.start_date !== undefined &&
    filter.start_date !== '' &&
    filter.end_date !== undefined &&
    filter.end_date !== ''
  ) {
    !bills.isLoading &&
      !bills.error &&
      Object.keys(bills.data?.data).map((day: string) => {
        totalOfSelectedDays =
          totalOfSelectedDays +
          bills.data?.data[day].reduce((sumAmount: number, bill: Bill) => {
            return (
              sumAmount +
              (bill.status
                ? bill.paid > 0
                  ? bill.paid
                  : bill.value
                : bill.value - bill.paid)
            )
          }, 0)
      })
  }

  const [toggleFilter, setToggleFilter] = useState(false)

  useEffect(() => {
    setFilter({
      ...filter,
      company: workingCompany.company?.id,
      branch: workingBranch.branch?.id
    })
  }, [workingCompany, workingBranch])

  return (
    <MainBoard sidebar="financial" header={<CompanySelectMaster />}>
      <NewBillModal
        categories={categories}
        users={users.data}
        sources={sources.data}
        afterCreate={bills.refetch}
        isOpen={isNewBillModalOpen}
        onRequestClose={CloseNewBillModal}
      />
      <ReceiveBillModal
        afterReceive={bills.refetch}
        toReceiveBillData={toReceiveBillData}
        isOpen={isReceiveBillModalOpen}
        onRequestClose={CloseReceiveBillModal}
      />
      <ReceiveAllBillsModal
        afterReceive={bills.refetch}
        dayToReceiveBills={dayToReceiveBills}
        isOpen={isReceiveAllBillsModalOpen}
        onRequestClose={CloseReceiveAllBillsModal}
      />
      <EditBillModal
        categories={categories}
        toEditBillData={toEditBillData}
        users={users.data}
        sources={sources.data}
        afterEdit={bills.refetch}
        isOpen={isEditBillModalOpen}
        onRequestClose={CloseEditBillModal}
      />

      <ConfirmPartialBillRemoveModal
        afterRemove={bills.refetch}
        toRemoveBillData={removePartialData}
        isOpen={isConfirmPartialRemoveModalOpen}
        onRequestClose={CloseConfirmPartialRemoveModal}
      />
      <EditPartialBillModal
        toEditPartialBillData={EditPartialData}
        afterEdit={bills.refetch}
        isOpen={isPartialEditModalOpen}
        onRequestClose={ClosePartialEditModal}
      />

      <ConfirmBillRemoveModal
        afterRemove={bills.refetch}
        toRemoveBillData={removeBillData}
        isOpen={isConfirmBillRemoveModalOpen}
        onRequestClose={CloseConfirmBillRemoveModal}
      />

      <Stack
        flexDirection={['column', 'row']}
        spacing={['4', '0']}
        justify="space-between"
        mb="10"
      >
        <SolidButton
          onClick={OpenNewBillModal}
          color="white"
          bg="blue.400"
          icon={PlusIcon}
          colorScheme="blue"
        >
          Adicionar Conta a Receber
        </SolidButton>

        {/* <Link href="/categorias" border="2px" borderRadius="full" borderColor="gray.500" px="6" h="8" alignItems="center">
                    <Text>Categorias</Text>
                </Link> */}

        <HStack spacing="4">
          <OutlineButton
            onClick={() => {
              history.push('/receber/categorias')
            }}
          >
            Categorias
          </OutlineButton>

          <OutlineButton
            onClick={() => {
              history.push('/receber/fontes')
            }}
          >
            Fontes
          </OutlineButton>
        </HStack>
      </Stack>

      <Stack
        flexDir={['column', 'row']}
        spacing="6"
        as="form"
        mb="20"
        onSubmit={handleSubmit(handleSearchBills)}
        borderRadius={!isWideVersion ? '24' : ''}
        p={!isWideVersion ? '5' : ''}
        bg={!isWideVersion ? 'white' : ''}
        boxShadow={!isWideVersion ? 'md' : ''}
      >
        {!isWideVersion && (
          <HStack onClick={() => setToggleFilter(!toggleFilter)}>
            <Icon as={PlusIcon} fontSize="20" stroke={'gray.800'} />
            <Text>Filtrar pagamentos</Text>
          </HStack>
        )}

        <Box w="100%"
          display={
            isWideVersion || (!isWideVersion && toggleFilter) ? 'flex' : 'none'
          }
        >
          <Stack spacing="6" w="100%">
            <Stack direction={['column', 'row']} spacing="6">
              <Input
                register={register}
                name="search"
                type="text"
                placeholder="Procurar"
                variant="filled"
                error={formState.errors.search}
              />

              <Select
                register={register}
                defaultValue={0}
                h="45px"
                name="status"
                error={formState.errors.status}
                w="100%"
                maxW="200px"
                fontSize="sm"
                focusBorderColor="blue.600"
                bg="gray.400"
                variant="filled"
                _hover={{ bgColor: 'gray.500' }}
                size="lg"
                borderRadius="full"
              >
                <option value="">Todos</option>
                <option value={1}>Recebidos</option>
                <option value={0}>Pendentes</option>
              </Select>
            </Stack>

            <Stack direction={['column', 'row']} spacing="6">
              <Input
                register={register}
                name="source"
                type="text"
                placeholder="Cliente"
                variant="filled"
                error={formState.errors.source}
              />

              <Input
                register={register}
                name="start_date"
                type="date"
                placeholder="Data Inicial"
                variant="filled"
                error={formState.errors.start_date}
              />
              <Input
                register={register}
                name="end_date"
                type="date"
                placeholder="Data Final"
                variant="filled"
                error={formState.errors.end_date}
              />

              <Select
                register={register}
                h="45px"
                name="category"
                w="100%"
                maxW="200px"
                fontSize="sm"
                focusBorderColor="blue.600"
                bg="gray.400"
                variant="filled"
                _hover={{ bgColor: 'gray.500' }}
                size="lg"
                borderRadius="full"
                placeholder="Categoria"
              >
                {categories &&
                  categories.map((category: BillCategory) => {
                    return (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    )
                  })}
              </Select>

              <OutlineButton
                type="submit"
                mb="10"
                color="blue.400"
                borderColor="blue.400"
                colorScheme="blue"
              >
                Filtrar
              </OutlineButton>
            </Stack>
          </Stack>
        </Box>
      </Stack>

      <Stack fontSize="13px" spacing="12">
        {totalOfSelectedDays > 0 && (
          <Flex>
            <Text fontSize="md" mr="2">{`Do dia ${formatBRDate(
              filter.start_date !== undefined ? filter.start_date : ''
            )} ao dia ${formatBRDate(
              filter.end_date !== undefined ? filter.end_date : ''
            )} soma:`}</Text>
            <Text fontSize="md" fontWeight="semibold">
              {Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(totalOfSelectedDays)}{' '}
              a receber
            </Text>
          </Flex>
        )}

        {bills.isLoading ? (
          <Flex justify="center">
            <Spinner />
          </Flex>
        ) : bills.isError ? (
          <Flex justify="center" mt="4" mb="4">
            <Text>Erro listar as contas a receber</Text>
          </Flex>
        ) : (
          bills.data?.data.length === 0 && (
            <Flex justify="center">
              <Text>Nenhuma conta a pagar encontrada.</Text>
            </Flex>
          )
        )}

        {!bills.isLoading &&
          !bills.error &&
          Object.keys(bills.data?.data).map((day: string) => {
            const totalDayBills = bills.data?.data[day].length
            const totalDayAmount = bills.data?.data[day].reduce(
              (sumAmount: number, bill: Bill) => {
                return (
                  sumAmount +
                  (bill.status
                    ? bill.paid > 0
                      ? bill.paid
                      : bill.value
                    : bill.value - bill.paid)
                )
              },
              0
            )

            const todayFormatedDate = formatDate(
              formatYmdDate(new Date().toDateString())
            )
            const dayBillsFormated = formatDate(day)
            const tomorrow =
              getDay(formatYmdDate(new Date().toDateString())) + 1
            const BillDay = getDay(day)

            const hasBillstoReceive = bills.data?.data[day].filter(
              (bill: Bill) => Number(bill.status) === 0
            ).length

            return (
              <Accordion
                key={day}
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
                  paddingX={['4', '8']}
                  paddingY="3"
                  bg="gray.200"
                >
                  <Stack
                    direction={['column', 'row']}
                    spacing={['4', '6']}
                    alignItems="baseline"
                    mt={['1', '0']}
                  >
                    <Text fontWeight="bold">
                      {todayFormatedDate === dayBillsFormated
                        ? 'Hoje'
                        : tomorrow === BillDay
                        ? 'Amanhã'
                        : ''}{' '}
                      {formatBRDate(day)}
                    </Text>
                    <Text fontWeight="bold">
                      {totalDayBills} Contas a Receber
                    </Text>
                  </Stack>

                  <Stack
                    direction={['column', 'row']}
                    spacing={['3', '6']}
                    alignItems={['flex-end', 'center']}
                  >
                    {!hasBillstoReceive ? (
                      <Flex
                        fontWeight="bold"
                        alignItems="center"
                        color="green.400"
                      >
                        <CheckIcon stroke="#48bb78" fill="none" width="16px" />
                        <Text ml="2">Tudo Recebido</Text>
                      </Flex>
                    ) : (
                      <SolidButton
                        onClick={() => OpenReceiveAllBillsModal(day)}
                        h="30px"
                        size="sm"
                        fontSize="11"
                        color="white"
                        bg="green.400"
                        colorScheme="green"
                      >
                        Receber Tudo
                      </SolidButton>
                    )}
                    <Text float="right">
                      <strong>
                        TOTAL:{' '}
                        {Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(totalDayAmount)}
                      </strong>
                    </Text>
                  </Stack>
                </HStack>

                {bills.data?.data[day].map((bill: Bill) => {
                  const billToEditData: EditBillFormData = {
                    id: bill.id,
                    title: bill.title,
                    value: bill.value.toString().replace('.', ','),
                    paid: bill.paid.toString().replace('.', ','),
                    company: bill.company?.id,
                    category: bill.category?.id,
                    source: bill.source?.id,
                    status: bill.status,
                    expire: bill.expire,
                    observation: bill.observation
                  }

                  return (
                    <AccordionItem
                      key={bill.id}
                      display="flex"
                      flexDir="column"
                      paddingX="8"
                      paddingTop="3"
                      bg="white"
                      borderTop="2px"
                      borderTopColor="gray.500"
                      borderBottom="0"
                    >
                      {({ isExpanded }) => (
                        <>
                          <Stack
                            spacing={['5', '']}
                            direction={['column', 'row']}
                            justify="space-between"
                            mb="3"
                            alignItems={['', 'center']}
                          >
                            <HStack
                              spacing={['5', '5']}
                              justifyContent="space-between"
                            >
                              <AccordionButton
                                p="0"
                                height="fit-content"
                                w="auto"
                              >
                                <Flex
                                  alignItems="center"
                                  justifyContent="center"
                                  h="24px"
                                  w="30px"
                                  p="0"
                                  borderRadius="full"
                                  border="2px"
                                  borderColor="blue.400"
                                  variant="outline"
                                >
                                  {!isExpanded ? (
                                    <StrongPlusIcon
                                      stroke="#2097ed"
                                      fill="none"
                                      width="12px"
                                    />
                                  ) : (
                                    <MinusIcon
                                      stroke="#2097ed"
                                      fill="none"
                                      width="12px"
                                    />
                                  )}
                                </Flex>
                              </AccordionButton>

                              <Stack
                                direction={['column', 'row']}
                                spacing={['1', '4']}
                              >
                                <Flex
                                  fontWeight="500"
                                  alignItems="center"
                                  opacity={bill.status ? 0.5 : 1}
                                >
                                  <EllipseIcon
                                    stroke="none"
                                    fill={
                                      bill.cash_desk_category !== null
                                        ? bill.cash_desk_category.color
                                        : bill.category?.color
                                    }
                                  />
                                  <Text
                                    ml="2"
                                    color={
                                      bill.cash_desk_category !== null
                                        ? bill.cash_desk_category.color
                                        : bill.category?.color
                                    }
                                  >
                                    {bill.title}
                                  </Text>
                                </Flex>

                                <Flex
                                  fontWeight="500"
                                  alignItems="center"
                                  color="gray.800"
                                  opacity={bill.status ? 0.5 : 1}
                                >
                                  {isWideVersion && (
                                    <TagIcon
                                      stroke="#4e4b66"
                                      fill="none"
                                      width="17px"
                                    />
                                  )}
                                  <Text ml="2">
                                    {bill.cash_desk_category !== null
                                      ? bill.cash_desk_category.name
                                      : bill.category.name}
                                  </Text>
                                </Flex>
                              </Stack>

                              {!isWideVersion && (
                                <Text float="right">
                                  {Intl.NumberFormat('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL'
                                  }).format(
                                    bill.status
                                      ? bill.paid > 0
                                        ? bill.paid
                                        : bill.value
                                      : bill.value - bill.paid
                                  )}
                                </Text>
                              )}
                            </HStack>

                            <HStack
                              spacing={['5', '5']}
                              justifyContent="space-between"
                              fontSize={['11px', '13px']}
                            >
                              {bill.status ? (
                                <HStack>
                                  <Flex
                                    fontWeight="bold"
                                    alignItems="center"
                                    color="green.400"
                                  >
                                    <CheckIcon
                                      stroke="#48bb78"
                                      fill="none"
                                      width="16px"
                                    />
                                    <Text ml="2">Recebido</Text>
                                  </Flex>

                                  <IconButton
                                    onClick={() => handleReverseBill(bill.id)}
                                    h="24px"
                                    w="20px"
                                    minW="25px"
                                    p="0"
                                    float="right"
                                    aria-label="Excluir categoria"
                                    border="none"
                                    icon={
                                      <RefreshIcon
                                        width="20px"
                                        stroke="#14142b"
                                        fill="none"
                                      />
                                    }
                                    variant="outline"
                                  />
                                </HStack>
                              ) : (
                                <OutlineButton
                                  onClick={() =>
                                    OpenReceiveBillModal({
                                      id: bill.id,
                                      title: bill.title,
                                      value: bill.value,
                                      paid: bill.paid,
                                      status: bill.status,
                                      new_value: ''
                                    })
                                  }
                                  h="30px"
                                  size="sm"
                                  color="green.400"
                                  borderColor="green.400"
                                  colorScheme="green"
                                  fontSize="11"
                                >
                                  Receber
                                </OutlineButton>
                              )}
                            </HStack>

                            {isWideVersion && (
                              <Text float="right">
                                {Intl.NumberFormat('pt-BR', {
                                  style: 'currency',
                                  currency: 'BRL'
                                }).format(
                                  bill.status
                                    ? bill.paid > 0
                                      ? bill.paid
                                      : bill.value
                                    : bill.value - bill.paid
                                )}
                              </Text>
                            )}
                          </Stack>

                          <AccordionPanel
                            flexDir="column"
                            borderTop="2px"
                            borderColor="gray.500"
                            px="0"
                            py="5"
                          >
                            <Stack
                              direction={['column', 'row']}
                              spacing={['5', '4']}
                              justifyContent="space-between"
                              mb="4"
                            >
                              <Flex alignItems="center">
                                <Text fontWeight="500" mr="2">
                                  Valor total:{' '}
                                </Text>
                                <Text fontWeight="700">
                                  {Intl.NumberFormat('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL'
                                  }).format(bill.value)}
                                </Text>
                              </Flex>

                              <HStack spacing="5">
                                <Flex alignItems="center">
                                  <Text fontWeight="500">Fonte: </Text>
                                  <Text>
                                    {' '}
                                    {bill.source?.name && bill.source?.name}
                                  </Text>
                                </Flex>

                                <Flex alignItems="center">
                                  <Text fontWeight="500">Observação: </Text>
                                  <Text>
                                    {' '}
                                    {bill.observation && bill.observation}
                                  </Text>
                                </Flex>
                              </HStack>
                            </Stack>

                            <Divider mb="3" />

                            <Stack
                              direction={['column', 'row']}
                              spacing="5"
                              alignItems="center"
                            >
                              <Table size="sm" variant="simple">
                                <Thead>
                                  <Tr>
                                    <Th color="gray.900">
                                      Valores recebidos:{' '}
                                    </Th>
                                    <Th color="gray.900">
                                      {Intl.NumberFormat('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL'
                                      }).format(bill.paid)}
                                    </Th>
                                    <Th></Th>
                                  </Tr>
                                </Thead>
                                <Tbody>
                                  {bill.partial_bills &&
                                    bill.partial_bills.map(
                                      (partial: PartialBill) => {
                                        return (
                                          <Tr
                                            key={`${partial.id}-${partial.value}`}
                                          >
                                            <Td fontSize="12px">
                                              {partial.receive_date &&
                                                formatBRDate(
                                                  partial.receive_date.toString()
                                                )}
                                            </Td>
                                            <Td
                                              color="gray.800"
                                              fontWeight="semibold"
                                              fontSize="12px"
                                            >
                                              {Intl.NumberFormat('pt-BR', {
                                                style: 'currency',
                                                currency: 'BRL'
                                              }).format(partial.value)}
                                            </Td>
                                            <Td>
                                              <IconButton
                                                onClick={() =>
                                                  OpenConfirmPartialRemoveModal(
                                                    {
                                                      id: partial.id,
                                                      title:
                                                        partial.value.toString()
                                                    }
                                                  )
                                                }
                                                h="24px"
                                                w="23px"
                                                p="0"
                                                float="right"
                                                aria-label="Excluir pagamento parcial"
                                                border="none"
                                                icon={
                                                  <CloseIcon
                                                    width="20px"
                                                    stroke="#C30052"
                                                    fill="none"
                                                  />
                                                }
                                                variant="outline"
                                              />
                                              <IconButton
                                                onClick={() =>
                                                  OpenPartialEditModal({
                                                    id: partial.id,
                                                    value:
                                                      partial.value.toString(),
                                                    receive_date:
                                                      partial.receive_date
                                                        ? formatYmdDate(
                                                            partial.receive_date.toString()
                                                          )
                                                        : ''
                                                  })
                                                }
                                                h="24px"
                                                w="23px"
                                                p="0"
                                                float="right"
                                                aria-label="Alterar parcial"
                                                border="none"
                                                icon={
                                                  <EditIcon
                                                    width="20px"
                                                    stroke="#d69e2e"
                                                    fill="none"
                                                  />
                                                }
                                                variant="outline"
                                              />
                                            </Td>
                                          </Tr>
                                        )
                                      }
                                    )}
                                </Tbody>

                                {/* <HStack>
                                                                        <Text>Valores pagos: </Text>
                                                                        <strong> {Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(payment.paid)}</strong>
                                                                    </HStack>

                                                                    {
                                                                        payment.partial_payments && payment.partial_payments.map((partial: PartialPayment) => {
                                                                            return (
                                                                                <HStack>
                                                                                    <Text>{partial.receive_date && formatBRDate(partial.receive_date.toString())}</Text>
                                                                                    <Text color="gray.800" fontWeight="semibold"> {Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(partial.value)}</Text>
                                                                                </HStack>
                                                                            )
                                                                        })
                                                                    } */}
                              </Table>

                              <HStack spacing="5" alignItems="center">
                                <EditButton
                                  onClick={() =>
                                    OpenEditBillModal(billToEditData)
                                  }
                                />
                                <RemoveButton
                                  onClick={() =>
                                    OpenConfirmBillRemoveModal({
                                      id: bill.id,
                                      title: bill.title
                                    })
                                  }
                                />
                              </HStack>
                            </Stack>
                          </AccordionPanel>
                        </>
                      )}
                    </AccordionItem>
                  )
                })}
              </Accordion>
            )
          })}

        <Pagination
          totalCountOfRegister={bills.data ? bills.data.total : 0}
          currentPage={page}
          onPageChange={setPage}
        />
      </Stack>
    </MainBoard>
  )
}
