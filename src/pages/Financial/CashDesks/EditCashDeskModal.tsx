import { HStack, Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, useToast } from "@chakra-ui/react";
import { SolidButton } from "../../../components/Buttons/SolidButton";

import {  useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { CashDeskCategory, } from "../../../types";
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

interface EditCashDeskModalProps{
    isOpen: boolean;
    onRequestClose: () => void;
    afterEdit: () => void;
    categories: CashDeskCategory[];
    toEditCashDeskData: EditCashDeskFormData;
}

export interface EditCashDeskFormData{
    id: number;
    title: string;
    company: number;
    category: number;
    type?: number;
    value: string;
    date: string;
}

const EditCashDeskFormSchema = yup.object().shape({
    title: yup.string().required('Título da movimentação obrigatório'),
    company: yup.number(),
    category: yup.number(),
    type: yup.number(),
    value: yup.string().required("Informe o valor da movimentação"),
    date: yup.date().required("Selecione a data"),
});

export function EditCashDeskModal( { isOpen, onRequestClose, afterEdit, toEditCashDeskData, categories } : EditCashDeskModalProps){
    const workingCompany = useWorkingCompany();
    const history = useHistory();
    const toast = useToast();
    const { showErrors } = useErrors();

    const { handleSubmit, formState, control} = useForm<EditCashDeskFormData>({
        resolver: yupResolver(EditCashDeskFormSchema),
        defaultValues: {
            title: toEditCashDeskData.title,
            value: toEditCashDeskData.value,
            company: toEditCashDeskData.company,
            category: toEditCashDeskData.category,
            type: toEditCashDeskData.type,
            date: toEditCashDeskData.date
        }
    });

    function includeAndFormatData(cashDeskData: EditCashDeskFormData){
        cashDeskData.value = moneyToBackend(cashDeskData.value);

        if(!workingCompany.company){
            return cashDeskData;
        }

        cashDeskData.company = workingCompany.company?.id;

        return cashDeskData;
    }

    const handleEditCashDesk = async (cashDeskData : EditCashDeskFormData) => {
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

            cashDeskData = includeAndFormatData(cashDeskData);

            await api.post(`/cashdesks/update/${toEditCashDeskData.id}`, cashDeskData);

            toast({
                title: "Sucesso",
                description: `Dados da movimentação ${toEditCashDeskData.title} foram atualizados.`,
                status: "success",
                duration: 12000,
                isClosable: true,
            });

            afterEdit();
            onRequestClose();
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

    console.log(toEditCashDeskData);

    return (
        <Modal isOpen={isOpen} onClose={onRequestClose} size="xl">
            <ModalOverlay />
            <ModalContent as="form" borderRadius="24px" onSubmit={handleSubmit(handleEditCashDesk)}>
                <ModalHeader p="10" fontWeight="700" fontSize="2xl">Alterar {toEditCashDeskData.title}</ModalHeader>

                <ModalCloseButton top="10" right="5"/>
                
                <ModalBody pl="10" pr="10">
                    <Stack spacing="6">
                        <HStack spacing="4" align="baseline">
                            <ControlledSelect control={control} name="type" value={toEditCashDeskData.type} error={formState.errors.type} variant="outline" w="100%" maxW="200px" focusBorderColor="blue.400"> 
                                <option value={1}>Dinheiro</option>
                                <option value={2}>Cartão</option>
                                <option value={3}>Pix</option>
                            </ControlledSelect>

                            <ControlledSelect control={control} name="category" value={toEditCashDeskData.category.toString()} error={formState.errors.category} variant="outline" w="100%" maxW="200px" focusBorderColor="blue.400"> 
                                    <option key="0" value="0">Categoria</option>
                                    {categories && categories.map((category:CashDeskCategory) => {
                                        return (
                                            <option key={category.id} value={category.id}>{category.name}</option>
                                        )
                                    })}
                            </ControlledSelect>
                        </HStack>

                        <ControlledInput control={control} value={toEditCashDeskData.title} name="title" type="text" placeholder="Título" variant="outline" error={formState.errors.title} focusBorderColor="blue.400"/>

                        <HStack spacing="4" align="baseline">
                            <ControlledInput control={control} value={toEditCashDeskData.value} name="value" type="text" placeholder="Telefone" variant="outline" mask="money" error={formState.errors.value} focusBorderColor="blue.400"/>
                        
                            <ControlledInput control={control} value={toEditCashDeskData.date} name="date" type="date" placeholder="Data da Movimentação" variant="outline" error={formState.errors.date} focusBorderColor="blue.400"/>
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