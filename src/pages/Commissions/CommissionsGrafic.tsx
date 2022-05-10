import { Flex, HStack, Spinner, Stack, Text, Th, Tr } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { HasPermission, useProfile } from '../../hooks/useProfile'
import SimpleDonout from '../../components/SimpleDonout'
import { CommissionsSellerFilterData, useCommissionsSeller } from '../../hooks/useCommissionsSeller';
import { useWorkingCompany } from '../../hooks/useWorkingCompany';
import { useWorkingBranch } from '../../hooks/useWorkingBranch';
import { SellerCommission } from '../../types';

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
          seller_id: !HasPermission(permissions, 'Commissões completo') && !isManager ? (profile ? profile.id : 0) : undefined
      };
      
      return data;
  })

  const commissions = useCommissionsSeller(filter, 1);

  const [chargeBackCommissionsAmount, setChargeBackCommissionsAmount] = useState(0);
  const [confirmedCommissionsAmount, setConfirmedCommissionsAmount] = useState(0);
  const [pendingCommissionsAmount, setPendingCommissionsAmount] = useState(0);

  useEffect(() => {
    if(!commissions.isLoading && !commissions.error){
      console.log(commissions.data?.data.data);
      setChargeBackCommissionsAmount(commissions.data?.data.data.filter((commission:SellerCommission) => {return commission.is_chargeback}).length);
      setConfirmedCommissionsAmount(commissions.data?.data.data.filter((commission:SellerCommission) => {return commission.confirmed}).length);
      setPendingCommissionsAmount(commissions.data?.data.data.filter((commission:SellerCommission) => {return !commission.confirmed}).length);
    }
  }, [commissions]);

  return (
    <Flex align="center" justify="center" width="100%">
      <Stack width="100%" min-width="300px" spacing="6" justify="space-between" alignItems="left" bg="white" borderRadius="16px" shadow="xl" px="8" py="8" mt={8}>
        <Text color="#000" fontSize="xl" fontWeight="400">
          Comissões
        </Text>
        <HStack alignItems="center" justify="center" spacing="4">
          {   commissions.isLoading ? (
                  <Flex justify="center">
                      <Spinner/>
                  </Flex>
              ) : ( commissions.isError && (
                  <Flex justify="center" mt="4" mb="4">
                      <Text>Erro listar as comissões</Text>
                  </Flex>
              ) ) 
          }

          {
            (!commissions.isLoading && !commissions.error) &&  (
              <SimpleDonout chargeBackCommissions={chargeBackCommissionsAmount} confirmedCommissions={confirmedCommissionsAmount} pendingCommissions={pendingCommissionsAmount}/>
            )
          }
        </HStack>
      </Stack>
    </Flex>
  )
}
