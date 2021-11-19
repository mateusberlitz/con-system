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
import { PaymentCategory, User, Provider, Company, LeadStatus, DataOrigin } from "../../../types";
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

interface NewLeadModalProps{
    isOpen: boolean;
    toEditSaleData: EditSaleFormData;
    onRequestClose: () => void;
    afterEdit: () => void;
}

export interface EditSaleFormData{
    id: number;
    value: string;
    segment: string;
    contract: string;
    group: string;
    quota: string;
    date: string;
}

const EditSaleFormSchema = yup.object().shape({
    value: yup.string().required('Qual o valor da venda?'),
    segment: yup.string().required('Qual o segmento da carta vendida?'),
    contract: yup.string().required("Informe o contrato da cota"),
    group: yup.string().required("Qual o grupo?"),
    quota: yup.string().required("Informe o número da cota"),
    date: yup.string().required("Quando foi feita a venda?"),
});

export function EditSaleModal( { isOpen, onRequestClose, afterEdit, toEditSaleData } : NewLeadModalProps){
    const workingCompany = useWorkingCompany();
    const {profile, permissions} = useProfile();

    const history = useHistory();
    const toast = useToast();
    const { showErrors } = useErrors();

    const { register, handleSubmit, control, reset, formState} = useForm<EditSaleFormData>({
        resolver: yupResolver(EditSaleFormSchema),
        defaultValues: {
            id: toEditSaleData.id,
            value: toEditSaleData.value,
            contract: toEditSaleData.contract,
            group: toEditSaleData.group,
            quota: toEditSaleData.quota,
            segment: toEditSaleData.segment,
            date: toEditSaleData.date,
        }
    });

    const handleCreateNewPayment = async (saleData : EditSaleFormData) => {
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

            saleData.date = formatInputDate(saleData.date);

            const response = await api.post(`/sales/update/${toEditSaleData.id}`, saleData);

            toast({
                title: "Sucesso",
                description: `Venda atualizada`,
                status: "success",
                duration: 12000,
                isClosable: true,
            });

            await api.post('/logs/store', {
                user: profile.id,
                company: workingCompany.company.id,
                action: `Alterou as informações de uma venda`
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

    return(
        <Modal isOpen={isOpen} onClose={onRequestClose} size="xl">
            <ModalOverlay />
            <ModalContent as="form" borderRadius="24px" onSubmit={handleSubmit(handleCreateNewPayment)}>
                <ModalHeader p="10" fontWeight="700" fontSize="2xl">Cadastrar Lead</ModalHeader>

                <ModalCloseButton top="10" right="5"/>
                
                <ModalBody pl="10" pr="10">
                    <Stack spacing="6">
                        
                        <ControlledInput control={control} value={toEditSaleData.value} name="value" type="text" placeholder="Nome" focusBorderColor="orange.400" variant="outline" error={formState.errors.value}/>


                        <HStack spacing="4" align="baseline">
                            <ControlledInput control={control} value={toEditSaleData.contract} name="contract" type="text" placeholder="Contrato" focusBorderColor="orange.400" variant="outline" error={formState.errors.contract}/>

                            <ControlledInput control={control} value={toEditSaleData.group} name="group" type="text" placeholder="Grupo" focusBorderColor="orange.400" variant="outline" error={formState.errors.group}/>

                            <ControlledInput control={control} value={toEditSaleData.quota} name="quota" type="text" placeholder="Cota" focusBorderColor="orange.400" variant="outline" error={formState.errors.quota}/>
                        </HStack>

                        <ControlledInput control={control} value={toEditSaleData.date} name="date" type="date" placeholder="Data da venda" focusBorderColor="orange.400" variant="outline" error={formState.errors.date}/>

                        <HStack spacing="4" align="baseline">
                            <ControlledSelect control={control} value={toEditSaleData.segment.toString()}  h="45px" name="segment" w="100%" fontSize="sm" focusBorderColor="orange.400" bg="gray.400" variant="outline" _hover={ {bgColor: 'gray.500'} } size="lg" borderRadius="full" error={formState.errors.segment}>
                                <option value="Imóvel">Imóvel</option>
                                <option value="Veículo">Veículo</option>
                            </ControlledSelect>
                        </HStack>

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