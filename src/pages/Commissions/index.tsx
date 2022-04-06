import { Flex, HStack, Text, Stack } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { MainBoard } from '../../components/MainBoard'
import { useProfile } from '../../hooks/useProfile'
import { CompanySelectMaster } from '../../components/CompanySelect/companySelectMaster'
import LastComissionsTable from './LastCommissionsTable'
import CommissionsGrafic from './CommissionsGrafic'
import ChargeBacks from './ChargeBacks'
import CommissionsReceived from './CommissionsReceived'
import ReversedCommissions from './ReversedCommissions'
import CommissionsPaid from './CommissionsPaid'

export default function Commissions() {
  const { profile, permissions } = useProfile()

  return (
    <MainBoard sidebar="commissions" header={<CompanySelectMaster />}>
      <Flex align="center" justify="center">
        <Stack
          direction={['column', 'row']}
          spacing="16"
          alignItems="flex-start"
        >
          <CommissionsGrafic />

          <HStack>
            <Stack spacing="4" w={['100%', '100%']}>
              <CommissionsReceived />

              <ReversedCommissions />

              <CommissionsPaid />
            </Stack>
          </HStack>
        </Stack>
      </Flex>
      <Flex>
        <LastComissionsTable />
      </Flex>
      <Flex>
        <ChargeBacks />
      </Flex>
    </MainBoard>
  )
}
