import { HStack, Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, useToast } from "@chakra-ui/react";
import { SolidButton } from "../../../components/Buttons/SolidButton";

import {  useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { CashFlowCategory, } from "../../../types";
import { api } from "../../../services/api";
import { useHistory } from "react-router";
import { useErrors } from "../../../hooks/useErrors";
import { useWorkingCompany } from "../../../hooks/useWorkingCompany";
import { ControlledInput } from "../../../components/Forms/Inputs/ControlledInput";
import { ControlledSelect } from "../../../components/Forms/Selects/ControlledSelect";
import moneyToBackend from "../../../utils/moneyToBackend";
import { useEffect } from "react";
import { isAuthenticated } from "../../../services/auth";
import { redirectMessages } from "../../../utils/redirectMessages";

interface EditCashFlowModalProps{
    isOpen: boolean;
    onRequestClose: () => void;
    afterEdit: () => void;
    categories: CashFlowCategory[];
    toEditCashFlowData: EditCashFlowFormData;
}

export interface EditCashFlowFormData{
    id: number;
    title: string;
    company: number;
    category: number;
    value: string;
}

const EditCashFlowFormSchema = yup.object().shape({
    title: yup.string().required('Título da movimentação obrigatório'),
    company: yup.number(),
    category: yup.number(),
    value: yup.string().required("Informe o valor da movimentação"),
});

export function EditCashFlowModal( { isOpen, onRequestClose, afterEdit, toEditCashFlowData, categories } : EditCashFlowModalProps){
    const workingCompany = useWorkingCompany();
    const history = useHistory();
    const toast = useToast();
    const { showErrors } = useErrors();

    const { handleSubmit, formState, control} = useForm<EditCashFlowFormData>({
        resolver: yupResolver(EditCashFlowFormSchema),
        defaultValues: {
            title: toEditCashFlowData.title,
            value: toEditCashFlowData.value,
            company: toEditCashFlowData.company,
            category: toEditCashFlowData.category,
        }
    });

    function includeAndFormatData(cashFlowData: EditCashFlowFormData){
        cashFlowData.value = moneyToBackend(cashFlowData.value);

        if(!workingCompany.company){
            return cashFlowData;
        }

        cashFlowData.company = workingCompany.company?.id;

        return cashFlowData;
    }

    const handleEditCashFlow = async (cashFlowData : EditCashFlowFormData) => {
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

            cashFlowData = includeAndFormatData(cashFlowData);

            await api.post(`/cashflows/update/${toEditCashFlowData.id}`, cashFlowData);

            toast({
                title: "Sucesso",
                description: `Dados da movimentação ${toEditCashFlowData.title} foram atualizados.`,
                status: "success",
                duration: 12000,
                isClosable: true,
            });

            afterEdit();
            onRequestClose();
        }catch(error) {
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

    return (
        <Modal isOpen={isOpen} onClose={onRequestClose} size="xl">
            <ModalOverlay />
            <ModalContent as="form" borderRadius="24px" onSubmit={handleSubmit(handleEditCashFlow)}>
                <ModalHeader p="10" fontWeight="700" fontSize="2xl">Alterar {toEditCashFlowData.title}</ModalHeader>

                <ModalCloseButton top="10" right="5"/>
                
                <ModalBody pl="10" pr="10">
                    <Stack spacing="6">
                        <ControlledInput control={control} value={toEditCashFlowData.title} name="title" type="text" placeholder="Título" variant="outline" error={formState.errors.title} focusBorderColor="blue.400"/>

                        <HStack spacing="4" align="baseline">
                            <ControlledSelect control={control} name="category" value={toEditCashFlowData.category.toString()} error={formState.errors.category} variant="outline" w="100%" maxW="200px" focusBorderColor="blue.400"> 
                                    <option key="0" value="0">Categoria</option>
                                    {categories && categories.map((category:CashFlowCategory) => {
                                        return (
                                            <option key={category.id} value={category.id}>{category.name}</option>
                                        )
                                    })}
                            </ControlledSelect>

                            <ControlledInput control={control} value={toEditCashFlowData.value} name="value" type="text" placeholder="Telefone" variant="outline" mask="money" error={formState.errors.value} focusBorderColor="blue.400"/>
                        </HStack>
                    </Stack>
                </ModalBody>

                <ModalFooter p="10">
                    <SolidButton mr="6" color="white" bg="blue.400" colorScheme="blue" type="submit" isLoading={formState.isSubmitting}>
                        Atualizar
                    </SolidButton>

                    <Link onClick={onRequestClose} color="gray.700" fontSize="14px">Cancelar</Link>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}