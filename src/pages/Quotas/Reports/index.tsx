import {
  Divider,
  Flex,
  FormControl,
  HStack,
  Select as ChakraSelect,
  Spinner,
  Text,
  Th,
  Tr
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { Board } from '../../../components/Board'
import { CompanySelectMaster } from '../../../components/CompanySelect/companySelectMaster'
import { MainBoard } from '../../../components/MainBoard'
import { Table } from '../../../components/Table'
import {
  quotaReportFilterData,
  useQuotaReport
} from '../../../hooks/useQuotaReport'
import { useWorkingBranch } from '../../../hooks/useWorkingBranch'
import { useWorkingCompany } from '../../../hooks/useWorkingCompany'
import { api } from '../../../services/api'
import { newMonthsAmountArray } from '../../Financial/Reports/populateMonthAmountArray'
import SaleListReport from './SaleListReport'

interface purchaseReport {
  cost: number
  purchase_date: string
}

interface saleReport {
  value: number
  sale_date: string
}

interface cancelReport {
  quota_sale: {
    value: number
  }
  cancel_date: string
}

export default function QuotasReport() {
  //const {permissions, profile} = useProfile();
  const workingCompany = useWorkingCompany()
  const workingBranch = useWorkingBranch()

  //const history = useHistory();

  const [years, setYears] = useState<Number[]>([])
  const [selectedYear, setSelectedYear] = useState<string>('')

  const loadYears = async () => {
    const { data } = await api.get('/ready_quotas_years')

    setYears(data)
  }

  useEffect(() => {
    loadYears()
  }, [])

  const dateObject = new Date()

  const [filter, setFilter] = useState<quotaReportFilterData>(() => {
    const data: quotaReportFilterData = {
      company: workingCompany.company?.id,
      branch: workingBranch.branch?.id,
      year: dateObject.getFullYear().toString()
    }

    return data
  })

  function handleChangeYear(event: any) {
    const newYear = event?.target.value ? event?.target.value : selectedYear

    setSelectedYear(newYear)

    const newFilter = filter
    newFilter.year = newYear
    setFilter(newFilter)
  }

  const [page, setPage] = useState(1)

  const quotaReports = useQuotaReport(filter, page)

  let totalPurchases = 0
  let totalSales = 0
  let total = 0
  const totalByMonths = newMonthsAmountArray()

  useEffect(() => {
    setFilter({
      ...filter,
      company: workingCompany.company?.id,
      branch: workingBranch.branch?.id
    })
  }, [workingCompany, workingBranch])

  return (
    <MainBoard sidebar="quotas" header={<CompanySelectMaster />}>
      <Board mb="14">
        <HStack as="form" spacing="12" w="100%" mb="6" justifyContent="left">
          <FormControl display="flex" w="fit-content" minW="150px">
            <ChakraSelect
              onChange={handleChangeYear}
              defaultValue={workingCompany.company?.id}
              h="45px"
              name="selected_company"
              maxW="200px"
              fontSize="sm"
              focusBorderColor="purple.600"
              bg="gray.400"
              variant="filled"
              _hover={{ bgColor: 'gray.500' }}
              size="lg"
              borderRadius="full"
            >
              {years.map((year: Number) => {
                return (
                  <option key={year.toString()} value={year.toString()}>
                    {year}
                  </option>
                )
              })}
            </ChakraSelect>
          </FormControl>

          <Text fontWeight="bold">RELATÓRIO CONTEMPLADAS</Text>
        </HStack>

        <Divider mb="6" />

        {quotaReports.isLoading ? (
          <Flex justify="center">
            <Spinner />
          </Flex>
        ) : quotaReports.isError ? (
          <Flex justify="center" mt="4" mb="4">
            <Text>Erro listar as contas a pagar</Text>
          </Flex>
        ) : (
          quotaReports.data.length === 0 && (
            <Flex justify="center">
              <Text>Nenhuma pagamento encontrado.</Text>
            </Flex>
          )
        )}

        {!quotaReports.isLoading && !quotaReports.error && (
          <Table
            header={[
              { text: '' },
              { text: 'Janeiro' },
              { text: 'Fevereiro' },
              { text: 'Março' },
              { text: 'Abril' },
              { text: 'Maio' },
              { text: 'Junho' },
              { text: 'Julho' },
              { text: 'Agosto' },
              { text: 'Setembro' },
              { text: 'Outubro' },
              { text: 'Novembro' },
              { text: 'Dezembro' },
              { text: 'Soma', bold: true }
            ]}
          >
            <Tr>
              <Th></Th>
            </Tr>

            <Tr>
              <Th
                fontWeight="bold"
                color="gray.800"
                textTransform="capitalize"
                position="sticky"
                left="0"
                bg="white"
              >
                COMPRAS
              </Th>
              {Object.keys(quotaReports.data.purchases).map(
                (month: string, index: number) => {
                  let monthTotal = 0

                  if (quotaReports.data.purchases[month] !== 0) {
                    monthTotal = quotaReports.data.purchases[month].reduce(
                      (sumAmount: number, purchase: purchaseReport) => {
                        return sumAmount - purchase.cost
                      },
                      0
                    )
                  }

                  if (quotaReports.data.cancels[month] !== 0) {
                    monthTotal = quotaReports.data.cancels[month].reduce(
                      (sumAmount: number, cancel: cancelReport) => {
                        return (
                          sumAmount -
                          (cancel.quota_sale ? cancel.quota_sale.value : 0)
                        )
                      },
                      monthTotal
                    )
                  }

                  totalPurchases += monthTotal
                  totalByMonths[index + 1] += monthTotal
                  console.log(totalByMonths[index + 1])

                  return (
                    <Th
                      whiteSpace="nowrap"
                      fontWeight="500"
                      color={monthTotal === 0 ? 'gray.800' : 'red.400'}
                      key={`${month}-${monthTotal}`}
                    >
                      {Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(monthTotal)}
                    </Th>
                  )
                }
              )}
              <Th
                whiteSpace="nowrap"
                fontWeight="500"
                color={totalPurchases === 0 ? 'gray.800' : 'red.400'}
              >
                {Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(totalPurchases)}
              </Th>
            </Tr>

            <Tr>
              <Th></Th>
            </Tr>

            <Tr>
              <Th
                fontWeight="bold"
                color="gray.800"
                textTransform="capitalize"
                position="sticky"
                left="0"
                bg="white"
              >
                VENDAS
              </Th>
              {Object.keys(quotaReports.data.sales).map(
                (month: string, index: number) => {
                  let monthTotal = 0

                  if (quotaReports.data.sales[month] !== 0) {
                    monthTotal = quotaReports.data.sales[month].reduce(
                      (sumAmount: number, sale: saleReport) => {
                        return sumAmount + sale.value
                      },
                      0
                    )
                  }

                  totalByMonths[index + 1] += monthTotal
                  totalSales += monthTotal

                  return (
                    <Th
                      whiteSpace="nowrap"
                      fontWeight="500"
                      color={monthTotal === 0 ? 'gray.800' : 'green.400'}
                      key={`${month}-${monthTotal}`}
                    >
                      {Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(monthTotal)}
                    </Th>
                  )
                }
              )}
              <Th
                whiteSpace="nowrap"
                fontWeight="500"
                color={totalSales === 0 ? 'gray.800' : 'green.400'}
              >
                {Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(totalSales)}
              </Th>
            </Tr>

            <Tr>
              <Th
                position="sticky"
                fontSize="sm"
                left="0"
                bg="white"
                color="black"
              >
                RESULTADO
              </Th>
              {totalByMonths.map((value: number, index: number) => {
                if (index === 14) {
                  return
                }
                if (index === 13) {
                  value = totalSales + totalPurchases
                }
                return (
                  <Th
                    whiteSpace="nowrap"
                    color={
                      value > 0
                        ? 'green.400'
                        : value < 0
                        ? 'red.400'
                        : 'gray.800'
                    }
                    key={`exits-${index}-${value}}`}
                  >
                    {Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(value)}
                  </Th>
                )
              })}
            </Tr>
          </Table>
        )}
      </Board>

      {/* <Board>
                <HStack as="form" spacing="12" w="100%" mb="6" justifyContent="left">
                    <FormControl display="flex" w="fit-content" minW="150px">
                        <ChakraSelect onChange={handleChangeYear} defaultValue={workingCompany.company?.id} h="45px" name="selected_company" maxW="200px" fontSize="sm" focusBorderColor="purple.600" bg="gray.400" variant="filled" _hover={ {bgColor: 'gray.500'} } size="lg" borderRadius="full">
                            {
                                years.map((year:Number) => {
                                    return (
                                        <option key={year.toString()} value={year.toString()}>{year}</option>
                                    )
                                })
                            }
                        </ChakraSelect>
                    </FormControl>

                    <Text fontWeight="bold">RELATÓRIO DE VENDAS</Text>
                </HStack>

                <Accordion allowMultiple>
                    <Table header={[
                            {text: 'Data', bold: true},
                            {text: 'Cota'},
                            {text: 'Lucro'},
                            {text: 'Valor da venda'},
                            {text: 'Segmento'},
                            {text: 'Crédito'},
                            {text: 'Custo Total'},
                            {text: 'Custo do parceiro'},
                            {text: 'Ganho do parceiro'},
                            {text: 'Coordenador'},
                            {text: 'Vendedor'},
                            {text: 'Comprador'},
                        ]}>

                        <Tr>
                            <Th></Th>
                        </Tr>

                        <AccordionItem>
                            <AccordionButton p="0" height="fit-content" w="auto">
                                <Tr>
                                    <Th color="gray.900">Janeiro</Th>
                                </Tr>
                            </AccordionButton>

                            <AccordionPanel>
                                <Tr>
                                    <Th>Janeiro</Th>
                                </Tr><Tr>
                                    <Th>Janeiro</Th>
                                </Tr>
                            </AccordionPanel>
                        </AccordionItem>

                    </Table>
                </Accordion>

                <Divider mb="6"/>
            </Board> */}

      <SaleListReport />
    </MainBoard>
  )
}
