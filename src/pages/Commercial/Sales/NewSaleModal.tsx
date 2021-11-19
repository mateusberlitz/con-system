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

interface NewSaleModalProps{
    isOpen: boolean;
    onRequestClose: () => void;
    toAddLeadData: toAddSaleLeadData;
    afterCreate: () => void;
}

export interface toAddSaleLeadData{
    id: number;
    name: string;
}

interface CreateNewSaleFormData{
    value: number;
    lead: number;
    company: number;
    user: number;
    segment: string;
    contract: string;
    group: string;
    quota: string;
    recommender_commission: number;
    commission: number;
    date: string;
}

const CreateNewSaleFormSchema = yup.object().shape({
    value: yup.string().required('Qual o valor da venda?'),
    segment: yup.string().required('Qual o segmento da carta vendida?'),
    contract: yup.string().required("Informe o contrato da cota"),
    group: yup.string().required("Qual o grupo?"),
    quota: yup.string().required("Informe o número da cota"),
    date: yup.date().required("Quando foi feita a venda?"),
});

export function NewSaleModal( { isOpen, onRequestClose, afterCreate, toAddLeadData } : NewSaleModalProps){
    const workingCompany = useWorkingCompany();
    const {profile, permissions} = useProfile();

    const history = useHistory();
    const toast = useToast();
    const { showErrors } = useErrors();

    const { register, handleSubmit, control, reset, formState} = useForm<CreateNewSaleFormData>({
        resolver: yupResolver(CreateNewSaleFormSchema),
    });

    const handleCreateNewPayment = async (saleData : CreateNewSaleFormData) => {
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

            //const isManager = HasPermission(permissions, 'Vendas Completo');


            saleData.company = workingCompany.company.id;
            saleData.user = profile.id;
            saleData.lead = toAddLeadData.id;

            saleData.date = formatInputDate(saleData.date);

            const response = await api.post('/sales/store', saleData);

            toast({
                title: "Sucesso",
                description: `Venda cadastrada para o lead/cliente ${toAddLeadData.name}`,
                status: "success",
                duration: 12000,
                isClosable: true,
            });


            await api.post('/logs/store', {
                user: profile.id,
                company: workingCompany.company.id,
                action: `Cadastrou uma nova venda`
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

    return(
        <Modal isOpen={isOpen} onClose={onRequestClose} size="xl">
            <ModalOverlay />
            <ModalContent as="form" borderRadius="24px" onSubmit={handleSubmit(handleCreateNewPayment)}>
                <ModalHeader p="10" fontWeight="700" fontSize="2xl">Cadastrar nova venda</ModalHeader>

                <ModalCloseButton top="10" right="5"/>
                
                <ModalBody pl="10" pr="10">
                    <Stack spacing="6">
                        
                        <Input register={register} name="value" type="text" placeholder="Valor do crédito" focusBorderColor="orange.400" variant="outline" error={formState.errors.value}/>


                        <HStack spacing="4" align="baseline">
                            <Input register={register} name="contract" type="text" placeholder="Contrato" focusBorderColor="orange.400" variant="outline" error={formState.errors.contract}/>

                            <Input register={register} name="group" type="text" placeholder="Grupo" focusBorderColor="orange.400" variant="outline" error={formState.errors.group}/>

                            <Input register={register} name="quota" type="text" placeholder="Cota" focusBorderColor="orange.400" variant="outline" mask="" error={formState.errors.quota}/>
                        </HStack>

                        <Input register={register} name="date" type="date" placeholder="Data da venda" focusBorderColor="orange.400" variant="outline" mask="" error={formState.errors.date}/>

                        <HStack spacing="4" align="baseline">
                            <Select register={register}  h="45px" name="segment" w="100%" fontSize="sm" focusBorderColor="orange.400" bg="gray.400" variant="outline" _hover={ {bgColor: 'gray.500'} } size="lg" borderRadius="full" error={formState.errors.segment}>
                                <option value="Imóvel" selected>Imóvel</option>
                                <option value="Veículo">Veículo</option>
                            </Select>
                        </HStack>

                    </Stack>
                </ModalBody>

                <ModalFooter p="10">
                    <SolidButton mr="6" color="white" bg="orange.400" colorScheme="orange" type="submit" isLoading={formState.isSubmitting}>
                        Cadastrar
                    </SolidButton>

                    <Link onClick={onRequestClose} color="gray.700" fontSize="14px">Cancelar</Link>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}