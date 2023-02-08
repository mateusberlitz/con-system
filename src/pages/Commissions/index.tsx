import { Divider, HStack, Stack } from '@chakra-ui/react'
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
import { useEffect, useState } from 'react'

import { useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { CommissionsSellerFilterData } from '../../hooks/useCommissionsSeller'
import { Input } from '../../components/Forms/Inputs/Input'
import { formatYmdDate } from '../../utils/Date/formatYmdDate'
import { ControlledInput } from '../../components/Forms/Inputs/ControlledInput'
import AffiliateCommissions from '../Financial/AffiliateCommissions'
import CommissionsReceivedGrafic from '../Financial/CommissionsReceivedGrafic'
import CommissionsPaidGrafic from '../Financial/CommissionsPaidGrafic'

interface FilterDashboardDateFormData{
    start_date: string;
    end_date: string;
}

const FilterDashboardDate = yup.object().shape({
    start_date: yup.string(),
    end_date: yup.string(),
});

export default function Commissions() {
    const { profile, permissions } = useProfile();

    const isManager = HasPermission(permissions, 'Comercial Completo');

    const { register, handleSubmit, formState, control, watch, getValues} = useForm<FilterDashboardDateFormData>({
        resolver: yupResolver(FilterDashboardDate),
    });

    const today = new Date();
    const monthBegin = new Date(today.getFullYear(), today.getMonth(), 1);

    const [startDate, setStartDate] = useState<string>(formatYmdDate(monthBegin.toString()));
    const [endDate, setEndDate] = useState<string>(formatYmdDate(today.toString()));

    //console.log(startDate, endDate);

    useEffect(() => {
        setStartDate(getValues('start_date'));
        //console.log(startDate, endDate);
    }, [watch('start_date')]);

    useEffect(() => {
        setEndDate(getValues('end_date'));
    }, [watch('end_date')]);

  return (
    <MainBoard sidebar="commissions" header={<CompanySelectMaster />}>
      <Stack fontSize="13px" alignItems="left" flexDirection={["column"]} spacing="10" justify="space-between" mb="10">
        <HStack maxW="500px" spacing="6" position={"sticky"}>
            <ControlledInput control={control} name="start_date" value={formatYmdDate(monthBegin.toString())} type="date" error={formState.errors.start_date} placeholder="Data Inicial" variant="filled" focusBorderColor="red.400"/>
            <ControlledInput control={control} name="end_date" value={formatYmdDate(today.toString())} type="date" error={formState.errors.end_date} placeholder="Data Final" variant="filled" focusBorderColor="red.400"/>
        </HStack>

        <Stack
         direction={['column', 'row']}
         spacing="8"
         alignItems="flex-start"
        >
          {/* Tables */}
          <Stack spacing="8" w={['100%', '55%']}>
            <CommissionsGrafic startDate={startDate} endDate={endDate}/>

            <LastComissionsTable startDate={startDate} endDate={endDate}/>
             
            {/* <ChargeBacks /> */}
          </Stack>

          {/* Comissões */}

          <Stack spacing="8" w={['100%', '45%']}>
        
          {
            HasPermission(permissions, 'Comissões Completo') && (
              <CommissionsReceived startDate={startDate} endDate={endDate}/>
            )
          }
            
            <CommissionsPaid startDate={startDate} endDate={endDate}/>
            <ReversedCommissions startDate={startDate} endDate={endDate}/>

            {/* {
              HasPermission(permissions, 'Comissões Completo') && (
                <RulesRanking startDate={startDate} endDate={endDate}/>
              )
            } */}
          </Stack>
        </Stack>

        <Stack spacing="4" mt={10}>
            {
                (profile && profile.role.id === 1) && (
                    <AffiliateCommissions />
                )
            }
        </Stack>

        <Divider />

        <HStack spacing="8" w={['100%', '100%']}>
            <CommissionsReceivedGrafic />

            <HStack  spacing="8" w={['100%', '100%']}>
                <CommissionsPaidGrafic />
            </HStack>
        </HStack>
      </Stack>
    </MainBoard>
  )
}
