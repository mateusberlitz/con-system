import { Stack } from '@chakra-ui/react'
import { MainBoard } from '../../components/MainBoard'
import { HasPermission, useProfile } from '../../hooks/useProfile'
import { CompanySelectMaster } from '../../components/CompanySelect/companySelectMaster'
import LastComissionsTable from './LastCommissionsTable'
import CommissionsGrafic from './CommissionsGrafic'
import ChargeBacks from './ChargeBacks'
import CommissionsReceived from './CommissionsReceived'
import ReversedCommissions from './ReversedCommissions'
import CommissionsPaid from './CommissionsPaid'
import RulesRanking from './RulesRanking'
import getMonthName from '../../utils/Date/getMonthName'



export default function Commissions() {
  const { profile, permissions } = useProfile();

  const isManager = HasPermission(permissions, 'Comercial Completo');

  return (
    <MainBoard sidebar="commissions" header={<CompanySelectMaster />}>
      <Stack fontSize="13px" alignItems="center" flexDirection={["column", "row"]} spacing="12" justify="space-between" mb="10">
        <Stack
         direction={['column', 'row']}
         spacing="8"
         alignItems="flex-start"
        >
          {/* Tables */}
          <Stack spacing="8" w={['100%', '55%']}>
            <CommissionsGrafic />

            <LastComissionsTable />
             
            {/* <ChargeBacks /> */}
          </Stack>

          {/* Comissões */}

          <Stack spacing="8" w={['100%', '45%']}>
        
          {
            HasPermission(permissions, 'Comissões Completo') && (
              <CommissionsReceived/>
            )
          }
    
            
            <CommissionsPaid />
            <ReversedCommissions />

            {
              HasPermission(permissions, 'Comissões Completo') && (
                <RulesRanking />
              )
            }
          </Stack>
        </Stack>
      </Stack>
    </MainBoard>
  )
}
