import { Stack } from '@chakra-ui/react'
import { MainBoard } from '../../components/MainBoard'
import { useProfile } from '../../hooks/useProfile'
import { CompanySelectMaster } from '../../components/CompanySelect/companySelectMaster'
import LastComissionsTable from './LastCommissionsTable'
import CommissionsGrafic from './CommissionsGrafic'
import ChargeBacks from './ChargeBacks'
import CommissionsReceived from './CommissionsReceived'
import ReversedCommissions from './ReversedCommissions'
import CommissionsPaid from './CommissionsPaid'
import RulesRanking from './RulesRanking'

export default function Commissions() {
  const { profile, permissions } = useProfile()

  return (
    <MainBoard sidebar="commissions" header={<CompanySelectMaster />}>
      <Stack fontSize="13px" spacing="12" alignItems="center" justify="center">
        <Stack
          direction={['column', 'row']}
          spacing="6"
          alignItems="flex-start"
        >
          {/* Tables */}
          <Stack spacing="6" w={['100%', '55%']}>
            <CommissionsGrafic />
            <LastComissionsTable />
            <ChargeBacks />
          </Stack>

          {/* Comissões */}

          <Stack spacing="9" w={['100%', '45%']}>
            <CommissionsReceived />

            <CommissionsPaid />
            <ReversedCommissions />
            <RulesRanking />
          </Stack>
        </Stack>
      </Stack>
    </MainBoard>
  )
}
