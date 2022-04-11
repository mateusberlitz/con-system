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

interface EditCompanyRuleParcelModalProps{
    isOpen: boolean;
    toEditCompanyRuleParcelData: EditNewCompanyRuleParcelFormData;
    onRequestClose: () => void;
    afterEdit: () => void;
}

export interface EditNewCompanyRuleParcelFormData{
    id: number;
    company_commission_rule_id: number;
    parcel_number: number;
    percentage_to_pay: number;
    chargeback_percentage?: number;
}

const EditNewCompanyRuleFormSchema = yup.object().shape({
    parcel_number: yup.number().required('Tipo de estorno obrigatório'),
    percentage_to_pay: yup.number().required('Tipo de estorno obrigatório'),
    chargeback_percentage: yup.number().required('Tipo de estorno obrigatório'),
});

export function EditCompanyRuleParcelModal( { isOpen, toEditCompanyRuleParcelData, afterEdit, onRequestClose } : EditCompanyRuleParcelModalProps){
    const history = useHistory();
    const toast = useToast();
    const { showErrors } = useErrors();

    const { handleSubmit, formState, control} = useForm<EditNewCompanyRuleParcelFormData>({
        resolver: yupResolver(EditNewCompanyRuleFormSchema),
    });

    const handleEditCompanyRuleParcel = async (companyRuleParcelData : EditNewCompanyRuleParcelFormData) => {
        try{
            companyRuleParcelData.company_commission_rule_id = toEditCompanyRuleParcelData.company_commission_rule_id;

            await api.put(`/company-commission-rule-parcels/${toEditCompanyRuleParcelData.id}`, companyRuleParcelData);

            toast({
                title: "Sucesso",
                description: `Dados da parcela foram alterados.`,
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
            <ModalContent as="form" borderRadius="24px" onSubmit={handleSubmit(handleEditCompanyRuleParcel)}>
                <ModalHeader p="10" fontWeight="700" fontSize="2xl">Alterar parcela {toEditCompanyRuleParcelData.parcel_number}</ModalHeader>

                <ModalCloseButton top="10" right="5"/>
                
                <ModalBody pl="10" pr="10">
                    <Stack spacing="6">
                        
                        <ControlledInput control={control} name="parcel_number" type="number" max={180} placeholder="Número da parcela" variant="outline" value={toEditCompanyRuleParcelData.parcel_number.toLocaleString()} error={formState.errors.parcel_number} focusBorderColor="purple.600"/>
                        
                        <HStack>
                            <ControlledInput control={control} name="percentage_to_pay" type="number" max={100} placeholder="Percentual a receber" variant="outline" value={toEditCompanyRuleParcelData.percentage_to_pay.toLocaleString()} error={formState.errors.percentage_to_pay} focusBorderColor="purple.600"/>
                            <ControlledInput control={control} name="chargeback_percentage" type="number" max={100} placeholder="Percentual de estorno" variant="outline" value={toEditCompanyRuleParcelData.chargeback_percentage ? toEditCompanyRuleParcelData.chargeback_percentage.toLocaleString() : ""} error={formState.errors.chargeback_percentage} focusBorderColor="purple.600"/>
                        </HStack>
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