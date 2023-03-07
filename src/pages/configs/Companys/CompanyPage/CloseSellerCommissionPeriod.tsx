import { HStack, Stack, Text, useToast } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { Board } from "../../../../components/Board";
import { ControlledInput } from "../../../../components/Forms/Inputs/ControlledInput";
import { formatYmdDate } from "../../../../utils/Date/formatYmdDate";


import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from "react";
import { api } from "../../../../services/api";
import { Select } from "../../../../components/Forms/Selects/Select";
import { SolidButton } from "../../../../components/Buttons/SolidButton";
import { showErrors, useErrors } from "../../../../hooks/useErrors";
import { useHistory } from "react-router-dom";
import { useWorkingCompany } from "../../../../hooks/useWorkingCompany";
import { Configuration } from "../../../../types";
import { ControlledSelect } from "../../../../components/Forms/Selects/ControlledSelect";

interface CloseSellerCommissionPeriodProps{
    companyId: number;
}

interface UpdateClosePeriodFormData{
    close_seller_commissions_start_day: string;
    close_seller_commissions_end_day: string;
}

const UpdateClosePeriodForm = yup.object().shape({
    close_seller_commissions_start_day: yup.string(),
    close_seller_commissions_end_day: yup.string(),
});

export function CloseSellerCommissionPeriod({companyId}: CloseSellerCommissionPeriodProps){
    const history = useHistory();
    const toast = useToast();
    const { showErrors } = useErrors();

    const { register, handleSubmit, formState, control} = useForm<UpdateClosePeriodFormData>({
        resolver: yupResolver(UpdateClosePeriodForm),
        defaultValues:{
            close_seller_commissions_start_day: "26",
            close_seller_commissions_end_day: "27",
        }
    });

    const [startDate, setStartDate] = useState("27");
    const [startDateConfiguration, setStartDateConfiguration] = useState<Configuration>();
    const [hasStartDate, setHasStartDate] = useState(false);

    const [endDate, setEndDate] = useState("26");
    const [endDateConfiguration, setEndDateConfiguration] = useState<Configuration>();
    const [hasEndDate, setHasEndDate] = useState(false);

    const loadStartDate = () => {
        api.get('configuration_by_name', {params: {
            name: "close_seller_commissions_start_day",
            company_id: companyId,
        }}).then(response => {
            if(response.data.data.id){
                console.log(response.data.data);
                setStartDateConfiguration(response.data.data);
                setStartDate(response.data.data.value);
                setHasStartDate(true);
            }
        });
    }

    const loadEndDate = () => {
        api.get('configuration_by_name', {params: {
            name: "close_seller_commissions_end_day",
            company_id: companyId,
        }}).then(response => {
            if(response.data.data.id){
                setEndDateConfiguration(response.data.data);
                setEndDate(response.data.data.value);
                setHasEndDate(true);
            }
        });
    }

    const handleUploadPeriod = async (period: UpdateClosePeriodFormData) => {
        try {
            if(hasStartDate && startDateConfiguration){
                await api.put(`/configuration/${startDateConfiguration.id}`, {
                    name: "close_seller_commissions_start_day",
                    value: period.close_seller_commissions_start_day,
                    company_id: companyId
                });
            }else{
                await api.post('/configuration', {
                    name: "close_seller_commissions_start_day",
                    value: period.close_seller_commissions_start_day,
                    company_id: companyId
                });
            }

            if(hasEndDate && endDateConfiguration){
                await api.put(`/configuration/${endDateConfiguration.id}`, {
                    name: "close_seller_commissions_end_day",
                    value: period.close_seller_commissions_end_day,
                    company_id: companyId
                });
            }else{
                await api.post('/configuration', {
                    name: "close_seller_commissions_end_day",
                    value: period.close_seller_commissions_end_day,
                    company_id: companyId
                });
            }
    
            toast({
                title: 'Sucesso',
                description: `Período de fechamento atualizado`,
                status: 'success',
                duration: 12000,
                isClosable: true
            });
        } catch (error:any) {
            showErrors(error, toast)
    
            if (error.response.data.access) {
                history.push('/')
            }
        }
    }

    useEffect(() => {
        loadStartDate();
        loadEndDate();
    }, []);

    const days = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31'];

    return(
        <Board>
            <HStack mb="4" justifyContent="space-between">
                <Text fontSize="xl">Período de fechamento</Text>
            </HStack>

            <HStack as="form" mb="4" justifyContent="space-between" onSubmit={handleSubmit(handleUploadPeriod)}>
                <HStack spacing="8">
                    <HStack>
                        <Text whiteSpace="nowrap">Dia inicial</Text>
                        <ControlledSelect control={control} value={startDate} name="close_seller_commissions_start_day" error={formState.errors.close_seller_commissions_start_day} variant="outline" focusBorderColor="purple.600">
                            {
                                days.map(function(day){
                                    return(
                                        <option value={day}>{day}</option>
                                    )
                                })
                            }
                        </ControlledSelect>
                    </HStack>

                    <HStack>
                        <Text whiteSpace="nowrap">Dia final</Text>
                        <ControlledSelect control={control} value={endDate} name="close_seller_commissions_end_day" error={formState.errors.close_seller_commissions_end_day} variant="outline" focusBorderColor="purple.600">
                            {
                                days.map(function(day){
                                    return(
                                        <option value={day}>{day}</option>
                                    )
                                })
                            }
                        </ControlledSelect>
                    </HStack>

                    {/* <ControlledInput control={control} name="close_seller_commissions_start_day" value={startDate} type="date" error={formState.errors.close_seller_commissions_start_day} placeholder="Data Inicial" variant="filled" focusBorderColor="red.400"/>
                    <ControlledInput control={control} name="close_seller_commissions_end_day" value={endDate} type="date" error={formState.errors.close_seller_commissions_end_day} placeholder="Data Final" variant="filled" focusBorderColor="red.400"/> */}

                </HStack>

                <SolidButton mr="6" color="white" bg="purple.300" colorScheme="purple" type="submit" isLoading={formState.isSubmitting}>
                    Salvar
                </SolidButton>
            </HStack>
        </Board>
    )
}