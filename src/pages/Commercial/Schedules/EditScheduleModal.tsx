import { Box, Flex, HStack, Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, Text, useToast, Input as ChakraInput, Divider, Accordion, AccordionItem, AccordionButton, AccordionPanel } from "@chakra-ui/react";
import { SolidButton } from "../../../components/Buttons/SolidButton";


import { useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { api } from "../../../services/api";
import { useHistory } from "react-router";
import { useErrors } from "../../../hooks/useErrors";

import { Input } from "../../../components/Forms/Inputs/Input";
import { Select } from "../../../components/Forms/Selects/Select";
import { PaymentCategory, User, Provider, Company, LeadStatus, DataOrigin, City, Lead } from "../../../types";
import { useWorkingCompany } from "../../../hooks/useWorkingCompany";
import { formatInputDate } from "../../../utils/Date/formatInputDate";
import moneyToBackend from "../../../utils/moneyToBackend";
import { profile } from "console";
import { HasPermission, useProfile } from "../../../hooks/useProfile";
import { ControlledSelect } from "../../../components/Forms/Selects/ControlledSelect";
import { useEffect, useState } from "react";
import { isAuthenticated } from "../../../services/auth";
import { redirectMessages } from "../../../utils/redirectMessages";

import { ReactComponent as PlusIcon } from '../../../assets/icons/Plus.svg';
import { ReactComponent as MinusIcon } from '../../../assets/icons/Minus.svg';
import { ReactComponent as StrongPlusIcon } from '../../../assets/icons/StrongPlus.svg';
import { ControlledInput } from "../../../components/Forms/Inputs/ControlledInput";
import { ReactSelect, SelectOption } from "../../../components/Forms/ReactSelect";
import { formatInputHourDate } from "../../../utils/Date/formatInputHourDate";

interface NewLeadModalProps{
    isOpen: boolean;
    toEditScheduleData: EditScheduleFormData;
    onRequestClose: () => void;
    afterEdit: () => void;
    leads: Lead[];
}

export interface EditScheduleFormData{
    id: number;
    city: string;
    lead?: number;
    datetime: string;
}

const EditScheduleFormSchema = yup.object().shape({
    datetime: yup.date().required("Informe a data e horário do agendamento"),
    city: yup.string().required("Para qual cidade você vai?"),
    lead: yup.lazy((value) => (value === '' ? yup.string() : yup.number())),
});

export function EditScheduleModal( { isOpen, onRequestClose, afterEdit, toEditScheduleData, leads } : NewLeadModalProps){
    const workingCompany = useWorkingCompany();
    const {profile, permissions} = useProfile();

    const history = useHistory();
    const toast = useToast();
    const { showErrors } = useErrors();

    const datetimeObject = new Date(toEditScheduleData.datetime);
    const initialDatetime = ( toEditScheduleData.datetime ? datetimeObject.toISOString().split('T')[0] + 'T' + (datetimeObject.getHours() < 10 ? '0' + datetimeObject.getHours() : datetimeObject.getHours()) + ':' +  datetimeObject.getMinutes() : '')

    console.log(initialDatetime);

    const { register, handleSubmit, control, reset, formState} = useForm<EditScheduleFormData>({
        resolver: yupResolver(EditScheduleFormSchema),
        defaultValues: {
            datetime: initialDatetime,
            city: toEditScheduleData.city,
            lead: toEditScheduleData.lead,
        }
    });

    const handleCreateNewPayment = async (scheduleData : EditScheduleFormData) => {
        try{
            if(!workingCompany.company){
                toast({
                    title: "Ué",
                    description: `Seleciona uma empresa para trabalhar`,
                    status: "warning",
                    duration: 12000,
                    isClosable: true,
                });

                return;
            }

            if(!profile){
                return;
            }

            scheduleData.datetime = formatInputHourDate(scheduleData.datetime);

            if(scheduleData.lead === 0){
                delete scheduleData.lead
            }

            const response = await api.post(`/schedules/update/${toEditScheduleData.id}`, scheduleData);

            toast({
                title: "Sucesso",
                description: `O agendamento foi atualizado.`,
                status: "success",
                duration: 12000,
                isClosable: true,
            });
            
            await api.post('/logs/store', {
                user: profile.id,
                company: workingCompany.company.id,
                action: `Alterou as informações de um agendamento`
            });

            onRequestClose();
            afterEdit();
            reset();
        }catch(error:any) {
            showErrors(error, toast);

            if(error.response.data.access){
                history.push('/');
            }
        }
    }

    useEffect(() => {
        if(!isAuthenticated()){
            history.push({
                pathname: '/',
                state: redirectMessages.auth
            });
        }
    }, [isOpen]);

    const leadOptions:Array<SelectOption> = [
        {
            value: "",
            label: "Selecionar Lead"
        }
    ];

    leads.map((lead: Lead) => {
        leadOptions.push({value: lead.id.toString(), label: lead.name});
    })

    return(
        <Modal isOpen={isOpen} onClose={onRequestClose} size="xl">
            <ModalOverlay />
            <ModalContent as="form" borderRadius="24px" onSubmit={handleSubmit(handleCreateNewPayment)}>
                <ModalHeader p="10" fontWeight="700" fontSize="2xl">Editar agendamento</ModalHeader>

                <ModalCloseButton top="10" right="5"/>
                
                <ModalBody pl="10" pr="10">
                    <Stack spacing="6">
                        
                        <ControlledInput control={control} value={initialDatetime} name="datetime" type="datetime-local" placeholder="Data da visita" focusBorderColor="orange.400" variant="outline" error={formState.errors.datetime}/>
                        
                        <ControlledInput control={control} value={toEditScheduleData.city} name="city" type="text" placeholder="Cidade" focusBorderColor="orange.400" variant="outline" error={formState.errors.city}/>

                        {
                            ( !leads ? (
                                <Flex justify="center">
                                    <Text>Nenhum lead disponível</Text>
                                </Flex>
                            ) : (
                                <ReactSelect value={toEditScheduleData.lead?.toString()} options={leadOptions} control={control} label="Contato" name="lead" bg="gray.400" variant="outline" _hover={ {bgColor: 'gray.500'} } borderRadius="full" error={formState.errors.lead} />
                            ))
                        }

                    </Stack>
                </ModalBody>

                <ModalFooter p="10">
                    <SolidButton mr="6" color="white" bg="orange.400" colorScheme="orange" type="submit" isLoading={formState.isSubmitting}>
                        Atualizar
                    </SolidButton>

                    <Link onClick={onRequestClose} color="gray.700" fontSize="14px">Cancelar</Link>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}