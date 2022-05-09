import { Flex, HStack, Stack, Text, Th, Tr } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { HasPermission, useProfile } from '../../hooks/useProfile'
import SimpleDonout from '../../components/SimpleDonout'
import { CommissionsSellerFilterData, useCommissionsSeller } from '../../hooks/useCommissionsSeller';
import { useWorkingCompany } from '../../hooks/useWorkingCompany';
import { useWorkingBranch } from '../../hooks/useWorkingBranch';

export default function CommissionsGrafic() {
  const { profile, permissions } = useProfile();

  const isManager = HasPermission(permissions, 'Comercial Completo');

  const workingCompany = useWorkingCompany();
  const workingBranch = useWorkingBranch();

  const [filter, setFilter] = useState<CommissionsSellerFilterData>(() => {
    const data: CommissionsSellerFilterData = {
        search: '',
        company: workingCompany.company?.id,
        branch: workingBranch.branch?.id,
        group_by: 'commission_date',
        seller_id: !HasPermission(permissions, 'Commissões completo') && !isManager ? (profile ? profile.id : 0) : undefined
    };
    
    return data;
})

  const commissions = useCommissionsSeller(filter, 1);

  return (
    <Flex align="center" justify="center" width="100%">
      <Stack width="100%" min-width="300px" spacing="6" justify="space-between" alignItems="left" bg="white" borderRadius="16px" shadow="xl" px="8" py="8" mt={8}>
        <Text color="#000" fontSize="xl" fontWeight="400">
          Comissões
        </Text>
        <HStack alignItems="center" justify="center" spacing="4">
          <SimpleDonout />
        </HStack>
      </Stack>
    </Flex>
  )
}
