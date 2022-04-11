import { HStack, Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, useToast } from "@chakra-ui/react";

import {  useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from "react";
import { ChargeBackType, Company, CompanyCommissionRule } from "../../../types";
import { ControlledInput } from "../../../components/Forms/Inputs/ControlledInput";
import { SolidButton } from "../../../components/Buttons/SolidButton";
import { isAuthenticated } from "../../../services/auth";
import { redirectMessages } from "../../../utils/redirectMessages";
import { useHistory } from "react-router-dom";
import { useErrors } from "../../../hooks/useErrors";
import { api } from "../../../services/api";
import { ControlledSelect } from "../../../components/Forms/Selects/ControlledSelect";
import { useChargeBackTypes } from "../../../hooks/useChargeBackTypes";

interface EditCompanyRuleModalProps{
    isOpen: boolean;
    toEditCompanyRuleData: EditNewCompanyRuleFormData;
    onRequestClose: () => void;
    afterEdit: () => void;
}

export interface EditNewCompanyRuleFormData{
    id: number;
    name: string;
    company_id: number;
    chargeback_type_id: number;
    percentage_paid_in_contemplation: number;
    initial_value?: number;
    final_value?: number;
    half_installment?: boolean;
    pay_in_contemplation?: boolean;
}

const EditNewCompanyRuleFormSchema = yup.object().shape({
    name: yup.string().required('Nome da regra é obrigatório'),
    chargeback_type_id: yup.number().required('Tipo de estorno obrigatório'),
    half_installment: yup.boolean().nullable(),
    pay_in_contemplation: yup.boolean().nullable(),
    percentage_paid_in_contemplation: yup.number().required('Quanto será recebido na contemplação?'),
    initial_value: yup.number().nullable(),
    final_value: yup.number().nullable(),
});

export function EditCompanyRuleModal( { isOpen, toEditCompanyRuleData, afterEdit, onRequestClose } : EditCompanyRuleModalProps){
    const history = useHistory();
    const toast = useToast();
    const { showErrors } = useErrors();

    const { handleSubmit, formState, control} = useForm<EditNewCompanyRuleFormData>({
        resolver: yupResolver(EditNewCompanyRuleFormSchema),
    });

    const handleEditCompanyRule = async (companyData : EditNewCompanyRuleFormData) => {
        try{
            companyData.company_id = toEditCompanyRuleData.company_id;

            await api.put(`/company-commission-rules/${toEditCompanyRuleData.id}`, companyData);

            toast({
                title: "Sucesso",
                description: `Dados da regra ${toEditCompanyRuleData.name} foram alterados.`,
                status: "success",
                duration: 12000,
                isClosable: true,
            });

            onRequestClose();
            afterEdit();
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

  const chargeBackTypes = useChargeBackTypes();

    return(
        <Modal isOpen={isOpen} onClose={onRequestClose} size="xl">
            <ModalOverlay />
            <ModalContent as="form" borderRadius="24px" onSubmit={handleSubmit(handleEditCompanyRule)}>
                <ModalHeader p="10" fontWeight="700" fontSize="2xl">Alterar regra {toEditCompanyRuleData.name}</ModalHeader>

                <ModalCloseButton top="10" right="5"/>
                
                <ModalBody pl="10" pr="10">
                    <Stack spacing="6">
                        
                        <ControlledInput control={control} name="name" type="text" placeholder="Nome da Regra" variant="outline" value={toEditCompanyRuleData.name} error={formState.errors.name} focusBorderColor="purple.600"/>
                        
                        <ControlledSelect
                            control={control}
                            h="45px"
                            name="chargeback_type_id"
                            value={toEditCompanyRuleData.chargeback_type_id}
                            w="100%"
                            fontSize="sm"
                            focusBorderColor="purple.300"
                            bg="gray.400"
                            variant="outline"
                            _hover={{ bgColor: 'gray.500' }}
                            size="lg"
                            borderRadius="full"
                            placeholder="Tipo de estorno"
                            error={formState.errors.chargeback_type_id}
                            >
                            {!chargeBackTypes.isLoading &&
                                !chargeBackTypes.error &&
                                chargeBackTypes.data.map((chargeBackType: ChargeBackType) => {
                                return (
                                    <option key={chargeBackType.id} value={chargeBackType.id}>
                                    {chargeBackType.description}
                                    </option>
                                )
                                })}
                        </ControlledSelect>
                        
                        <ControlledSelect
                            control={control}
                            h="45px"
                            name="half_installment"
                            value={toEditCompanyRuleData.half_installment ? (toEditCompanyRuleData.half_installment === true ? 1 : 0) : undefined}
                            w="100%"
                            fontSize="sm"
                            focusBorderColor="purple.300"
                            bg="gray.400"
                            variant="outline"
                            _hover={{ bgColor: 'gray.500' }}
                            size="lg"
                            borderRadius="full"
                            placeholder="Tipo de estorno"
                            error={formState.errors.half_installment}
                            >
                            <option value={1}>Sim</option>
                            <option value={0}>Não</option>
                        </ControlledSelect>

                        <ControlledSelect
                            control={control}
                            h="45px"
                            name="pay_in_contemplation"
                            value={toEditCompanyRuleData.pay_in_contemplation ? (toEditCompanyRuleData.pay_in_contemplation === true ? 1 : 0) : undefined}
                            w="100%"
                            fontSize="sm"
                            focusBorderColor="purple.300"
                            bg="gray.400"
                            variant="outline"
                            _hover={{ bgColor: 'gray.500' }}
                            size="lg"
                            borderRadius="full"
                            placeholder="Recebe na contemplação"
                            error={formState.errors.pay_in_contemplation}
                            >
                            <option value={1}>Sim</option>
                            <option value={0}>Não</option>
                        </ControlledSelect>

                        <ControlledInput control={control} name="percentage_paid_in_contemplation" type="text" placeholder="Percentual na contemplação" variant="outline" value={toEditCompanyRuleData.percentage_paid_in_contemplation.toLocaleString()} error={formState.errors.percentage_paid_in_contemplation} focusBorderColor="purple.600"/>
                        
                    </Stack>
                </ModalBody>

                <ModalFooter p="10">
                    <SolidButton mr="6" color="white" bg="purple.300" colorScheme="purple" type="submit" isLoading={formState.isSubmitting}>
                        Atualizar
                    </SolidButton>

                    <Link onClick={onRequestClose} color="gray.700" fontSize="14px">Cancelar</Link>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}