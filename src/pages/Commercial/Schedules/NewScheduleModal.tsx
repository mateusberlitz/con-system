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
import { ReactSelect, SelectOption } from "../../../components/Forms/ReactSelect";
import { formatInputHourDate } from "../../../utils/Date/formatInputHourDate";

interface NewLeadModalProps{
    isOpen: boolean;
    onRequestClose: () => void;
    afterCreate: () => void;
    cities: City[];
    leads: Lead[];
}

interface CreateNewScheduleFormData{
    city: string;
    company: number;
    user: number;
    lead?: number;
    datetime: string;
}

const CreateNewScheduleFormSchema = yup.object().shape({
    datetime: yup.date().required("Informe a data e horário do agendamento"),
    city: yup.string().required("Para qual cidade você vai?"),
    lead: yup.lazy((value) => (value === '' ? yup.string() : yup.number())),
});

export function NewScheduleModal( { isOpen, onRequestClose, afterCreate, cities, leads} : NewLeadModalProps){
    const workingCompany = useWorkingCompany();
    const {profile, permissions} = useProfile();

    const history = useHistory();
    const toast = useToast();
    const { showErrors } = useErrors();

    const { register, handleSubmit, control, reset, formState} = useForm<CreateNewScheduleFormData>({
        resolver: yupResolver(CreateNewScheduleFormSchema),
    });

    const handleCreateNewSchedule = async (scheduleData : CreateNewScheduleFormData) => {
        //return;
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

            scheduleData.company = workingCompany.company.id;
            scheduleData.user = profile.id;

            scheduleData.datetime = formatInputHourDate(scheduleData.datetime);
            //console.log(formatInputHourDate(scheduleData.datetime));

            const response = await api.post('/schedules/store', scheduleData);

            toast({
                title: "Sucesso",
                description: `O agendamento criado para ${scheduleData.city}.`,
                status: "success",
                duration: 12000,
                isClosable: true,
            });

            await api.post('/logs/store', {
                user: profile.id,
                company: workingCompany.company.id,
                action: `Criou um novo agendamento.`
            });

            onRequestClose();
            afterCreate();
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
    }, [isOpen])

    // const cityOptions:Array<SelectOption> = [];

    // cities.map((city: City) => {
    //     cityOptions.push({value: city.name, label: city.name});
    // })

    const leadOptions:Array<SelectOption> = [
        {
            value: "",
            label: "Selecionar Lead"
        }
    ];

    leads.map((lead: Lead) => {
        leadOptions.push({value: lead.id.toString(), label: lead.name});
    })

    //console.log(cityOptions);

    return(
        <Modal isOpen={isOpen} onClose={onRequestClose} size="xl">
            <ModalOverlay />
            <ModalContent as="form" borderRadius="24px" onSubmit={handleSubmit(handleCreateNewSchedule)}>
                <ModalHeader p="10" fontWeight="700" fontSize="2xl">Agendar visita</ModalHeader>

                <ModalCloseButton top="10" right="5"/>
                
                <ModalBody pl="10" pr="10">
                    <Stack spacing="6">
                        
                        <Input register={register} name="datetime" type="datetime-local" placeholder="Data da visita" focusBorderColor="orange.400" variant="outline" error={formState.errors.datetime}/>
                        
                        <Input register={register} name="city" type="text" placeholder="Cidade" focusBorderColor="orange.400" variant="outline" error={formState.errors.city}/>

                        <HStack spacing="4" align="baseline">
                            {
                                ( !leads ? (
                                    <Flex justify="center">
                                        <Text>Nenhum lead disponível</Text>
                                    </Flex>
                                ) : (
                                    <ReactSelect options={leadOptions} control={control} label="Contato" name="lead" bg="gray.400" variant="outline" _hover={ {bgColor: 'gray.500'} } borderRadius="full" error={formState.errors.lead} />
                                ))
                            }
                        </HStack>
                        

                    </Stack>
                </ModalBody>

                <ModalFooter p="10">
                    <SolidButton mr="6" color="white" bg="orange.400" colorScheme="orange" type="submit" isLoading={formState.isSubmitting}>
                        Agendar
                    </SolidButton>

                    <Link onClick={onRequestClose} color="gray.700" fontSize="14px">Cancelar</Link>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}