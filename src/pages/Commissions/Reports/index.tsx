import { Stack } from '@chakra-ui/react'
import { MainBoard } from '../../../components/MainBoard'
import { useProfile } from '../../../hooks/useProfile'
import { CompanySelectMaster } from '../../../components/CompanySelect/companySelectMaster'
import CommissionsReceivedReport from './CommissionsReceivedReport'
import CommissionsPaidReport from './CommissionsPaidReport'
import ContractReport from './ContractReport'
import RulesReport from './RulesReport'


export default function ReportsCommissions() {
  const { profile, permissions } = useProfile()

  return (
    <MainBoard sidebar="commissions" header={<CompanySelectMaster />}>
      <Stack fontSize="13px" spacing="12" alignItems="center" justify="center">

          <Stack spacing="9" w={['100%', '100%']}>
            <CommissionsReceivedReport />

            <CommissionsPaidReport />

            {/* <ContractReport /> */}

            <RulesReport />
          </Stack>
        </Stack>
    </MainBoard>
  )
}
