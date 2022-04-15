import { Stack } from '@chakra-ui/layout'
import { useEffect, useState } from 'react'
import { MainBoard } from '../../components/MainBoard'
import { PaymentFilterData, usePayments } from '../../hooks/usePayments'
import { useWorkingCompany } from '../../hooks/useWorkingCompany'
import { formatYmdDate } from '../../utils/Date/formatYmdDate'
import { PayPaymentFormData, PayPaymentModal } from './Payments/PayPaymentModal'
import { PaymentsSummary } from './PaymentsSummary'
import { TasksSummary } from './TasksSummary'
import { CashSummary } from './CashSummary'

import { HasPermission, useProfile } from '../../hooks/useProfile'
import { BillFilterData, useBills } from '../../hooks/useBills'
import { ReceiveBillFormData, ReceiveBillModal } from './Bills/ReceiveBillModal'
import { BillsSummary } from './BillsSummary'
import { PendenciesSummary } from './PendenciesSummary'
import { useCompanies } from '../../hooks/useCompanies'
import { CashFlowsFilterData, useCashFlows } from '../../hooks/useCashFlows'
import { TaskFilterData, useTasks } from '../../hooks/useTasks'
import { CompanySelectMaster } from '../../components/CompanySelect/companySelectMaster'
import { useWorkingBranch } from '../../hooks/useWorkingBranch'
import { CashFlowSummary } from './CashFlowSummary'

export default function Financial() {
  const { profile, permissions } = useProfile()
  const workingCompany = useWorkingCompany()
  const workingBranch = useWorkingBranch()

  const [filter, setFilter] = useState<PaymentFilterData>(() => {
    const data: PaymentFilterData = {
      search: '',
      start_date: formatYmdDate(new Date().toString()),
      end_date: formatYmdDate(new Date().toString()),
      status: 0,
      group_by: 'company'
    }

    return data
  })

  function handleChangeFilter(newFilter: PaymentFilterData) {
    setFilter(newFilter)
  }

  const payments = usePayments(filter, 1);
  const cashflow = useCashFlows({}, 50, 1);

  const [isPayPaymentModalOpen, setIsPayPaymentModalOpen] = useState(false)
  const [toPayPaymentData, setToPayPaymentData] = useState<PayPaymentFormData>(
    () => {
      const data: PayPaymentFormData = {
        id: 0,
        value: 0,
        paid: 0,
        new_value: '',
        title: '',
        company: workingCompany.company?.id
      }

      return data
    }
  )

  function OpenPayPaymentModal(paymentIdAndName: PayPaymentFormData) {
    setToPayPaymentData(paymentIdAndName)
    setIsPayPaymentModalOpen(true)
  }
  function ClosePayPaymentModal() {
    setIsPayPaymentModalOpen(false)
  }

  //BILLS

  const [filterBills, setFilterBills] = useState<BillFilterData>(() => {
    const data: BillFilterData = {
      search: '',
      start_date: formatYmdDate(new Date().toString()),
      end_date: formatYmdDate(new Date().toString()),
      status: 0,
      group_by: 'company'
    }

    return data
  })

  function handleChangeBillsFilter(newFilter: BillFilterData) {
    setFilterBills(newFilter)
  }

  const bills = useBills(filter, 1)

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

  function OpenReceiveBillModal(paymentIdAndName: ReceiveBillFormData) {
    setToReceiveBillData(paymentIdAndName)
    setIsReceiveBillModalOpen(true)
  }
  function CloseReceiveBillModal() {
    setIsReceiveBillModalOpen(false)
  }

  const [filterPendencies, setFilterPendencies] = useState<PaymentFilterData>(
    () => {
      const data: PaymentFilterData = {
        search: '',
        end_date: formatYmdDate(new Date().toString()),
        status: 0,
        group_by: 'company'
      }

      return data
    }
  )

  const pendencies = usePayments(filterPendencies, 1)

  const [filterCashFlow, setFilterCashFlow] = useState<CashFlowsFilterData>(
    () => {
      const data: CashFlowsFilterData = {
        search: '',
        company: workingCompany.company?.id,
        branch: workingBranch.branch?.id
      }

      return data
    }
  )

  //const cashFlows = useCashFlows(filterCashFlow, 5, 1);

  const [page, setPage] = useState(1)

  const handleChangePage = (page: number) => {
    setPage(page)
  }

  const [tasksFilter, setTasksFilter] = useState<TaskFilterData>(() => {
    const data: TaskFilterData = {
      search: '',
      company: workingCompany.company?.id,
      branch: workingBranch.branch?.id,
      author: profile ? profile.id : 0
    }

    return data
  })

  const tasks = useTasks(tasksFilter, page)

  const companies = useCompanies()

  useEffect(() => {
    setFilter({
      ...filter,
      company: workingCompany.company?.id,
      branch: workingBranch.branch?.id
    })
    setFilterBills({
      ...filterBills,
      company: workingCompany.company?.id,
      branch: workingBranch.branch?.id
    })
    setTasksFilter({
      ...tasksFilter,
      company: workingCompany.company?.id,
      branch: workingBranch.branch?.id
    })
    setFilterCashFlow({
      ...filterCashFlow,
      company: workingCompany.company?.id,
      branch: workingBranch.branch?.id
    })
    setFilterPendencies({
      ...filterPendencies,
      company: workingCompany.company?.id,
      branch: workingBranch.branch?.id
    })
  }, [workingCompany, workingBranch])

  return (
    <MainBoard sidebar="financial" header={<CompanySelectMaster />}>
      <Stack fontSize="13px" spacing="12">
        <PayPaymentModal
          afterPay={payments.refetch}
          toPayPaymentData={toPayPaymentData}
          isOpen={isPayPaymentModalOpen}
          onRequestClose={ClosePayPaymentModal}
        />
        <ReceiveBillModal
          afterReceive={bills.refetch}
          toReceiveBillData={toReceiveBillData}
          isOpen={isReceiveBillModalOpen}
          onRequestClose={CloseReceiveBillModal}
        />

        <Stack
          direction={['column', 'row']}
          spacing="8"
          alignItems="flex-start"
        >
          {/* PAGAMENTOS */}
          <Stack spacing="8" w={['100%', '55%']}>
            <PaymentsSummary
              payments={payments}
              openPayPayment={OpenPayPaymentModal}
              filter={filter}
              handleChangeFilter={handleChangeFilter}
            />

            <BillsSummary
              bills={bills}
              openReceiveBill={OpenReceiveBillModal}
              filter={filterBills}
              handleChangeFilter={handleChangeBillsFilter}
            />

            <PendenciesSummary
              payments={pendencies}
              openPayPayment={OpenPayPaymentModal}
              paymentFilter={filter}
              handleChangePaymentFilter={handleChangeFilter}
            />
          </Stack>

          {/* TAREFAS */}

          <Stack spacing="8" w={['100%', '45%']}>
            <TasksSummary
              tasks={tasks}
              page={page}
              setPage={handleChangePage}
            />

            {HasPermission(permissions, 'Financeiro Completo') && (
              <>
                <CashSummary
                  company={workingCompany.company}
                  branch={workingBranch.branch}
                />

                <CashFlowSummary
                  cashFlows={cashflow}
                />
              </>
            )}
          </Stack>
        </Stack>
      </Stack>
    </MainBoard>
  )
}
