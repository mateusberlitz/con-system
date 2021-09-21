import { Checkbox, Flex, HStack, Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, Text, useToast } from "@chakra-ui/react";
import { SolidButton } from "../../../components/Buttons/SolidButton";

import {  useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Company, PaymentCategory, Provider, User } from "../../../types";
import { api } from "../../../services/api";
import { useHistory } from "react-router";
import { useErrors } from "../../../hooks/useErrors";
import { useWorkingCompany } from "../../../hooks/useWorkingCompany";
import { ControlledInput } from "../../../components/Forms/Inputs/ControlledInput";
import { ControlledSelect } from "../../../components/Forms/Selects/ControlledSelect";
import { formatInputDate } from "../../../utils/Date/formatInputDate";
import moneyToBackend from "../../../utils/moneyToBackend";
import { useProfile } from "../../../hooks/useProfile";
import { redirectMessages } from "../../../utils/redirectMessages";
import { isAuthenticated } from "../../../services/auth";
import { useEffect, useState } from "react";

interface EditPaymentModalProps{
    isOpen: boolean;
    onRequestClose: () => void;
    afterEdit: () => void;
    toEditQuotaData: EditQuota;
}

export interface EditQuota{
    id: number;
    sold: boolean;
    company: number;
    segment: string;
    value: string;
    credit: string;
    group: string;
    quota: string;
    cost: string;
    partner?: string;
    partner_cost?: string;
    passed_cost?: string;
    total_cost?: string;
    seller?: string;
    cpf_cnpj: string;
    paid_percent: string;
    partner_commission?: string;
    tax?: string;
    contemplated_type: string;
    description?: string;
    purchase_date: string;
    created_at?: Date;
    updated_at?: Date;
}

const EditQuotaFormSchema = yup.object().shape({
    segment: yup.string().required('Selecione o tipo da carta de crédito'),
    description: yup.string().nullable(),
    seller: yup.string().nullable().required("De quem foi comprada a carta?"),
    contemplated_type: yup.string().required("Qual o tipo de contemplação?"),
    value: yup.string().required("Informe o valor do pagamento"),
    cost: yup.string().required("Informe o custo"),
    cpf_cnpj: yup.string().required("Qual o cpf ou cnpj proprietário?"),
    partner: yup.string().nullable(),
    partner_cost: yup.string().nullable(),
    passed_cost: yup.string().nullable(),
    paid_percent: yup.string().required("Diga qual o percentual pago"),
    partner_commission: yup.string(),
    purchase_date: yup.string().required("Selecione a data de compra"),
    group: yup.string().required("Informe o grupo"),
    quota: yup.string().required("Informe a cota"),
});


export function EditQuotaModal( { isOpen, onRequestClose, afterEdit, toEditQuotaData } : EditPaymentModalProps){
    const workingCompany = useWorkingCompany();
    const history = useHistory();
    const toast = useToast();
    const {profile} = useProfile();

    const { showErrors } = useErrors();

    const { handleSubmit, register, formState, control} = useForm<EditQuota>({
        resolver: yupResolver(EditQuotaFormSchema),
        defaultValues: {
            id: toEditQuotaData.id,
            sold: toEditQuotaData.sold,
            credit: toEditQuotaData.credit,
            value: toEditQuotaData.value,
            segment: toEditQuotaData.segment,
            company: toEditQuotaData.company,
            seller: toEditQuotaData.seller,
            contemplated_type: toEditQuotaData.contemplated_type,
            cost: toEditQuotaData.cost,
            total_cost: toEditQuotaData.total_cost,
            cpf_cnpj: toEditQuotaData.cpf_cnpj,
            partner: toEditQuotaData.partner,
            partner_commission: toEditQuotaData.partner_commission,
            partner_cost: toEditQuotaData.partner_cost,
            passed_cost: toEditQuotaData.passed_cost,
            purchase_date: toEditQuotaData.purchase_date,
            paid_percent: toEditQuotaData.paid_percent,
            description: toEditQuotaData.description,
            group: toEditQuotaData.group,
            quota: toEditQuotaData.quota,
        }
    });

    function includeAndFormatData(quotaData: EditQuota){
        quotaData.value = moneyToBackend(quotaData.value);
        quotaData.credit = moneyToBackend(quotaData.credit);
        quotaData.cost = moneyToBackend(quotaData.cost);

        quotaData.partner_cost = ((quotaData.partner_cost != null && quotaData.partner_cost != "") ? moneyToBackend(quotaData.partner_cost) : '');
        quotaData.passed_cost = ((quotaData.passed_cost != null && quotaData.passed_cost != "") ? moneyToBackend(quotaData.passed_cost) : '');

        quotaData.purchase_date = formatInputDate(quotaData.purchase_date);

        if(!workingCompany.company){
            return quotaData;
        }else if(quotaData.company === 0){
            quotaData.company = workingCompany.company?.id;
        }

        return quotaData;
    }

    const handleEditPayment = async (quotaData : EditQuota) => {
        try{
            if(!workingCompany.company && quotaData.company === 0){
                toast({
                    title: "Ué",
                    description: `Seleciona uma empresa para trabalhar`,
                    status: "warning",
                    duration: 12000,
                    isClosable: true,
                });

                return;
            }

            quotaData = includeAndFormatData(quotaData);
            console.log(quotaData);

            await api.post(`/quotas/update/${toEditQuotaData.id}`, quotaData);

            toast({
                title: "Sucesso",
                description: `Dados da cota ${toEditQuotaData.group}-${toEditQuotaData.quota} atualizados.`,
                status: "success",
                duration: 12000,
                isClosable: true,
            });

            setIsDisabledRecurrence(true);
            afterEdit();
            onRequestClose();
        }catch(error: any) {
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

    const [isDisabledRecurrence, setIsDisabledRecurrence] = useState(true);

    const changeIsDisabledRecurrence = () => {
        setIsDisabledRecurrence(!isDisabledRecurrence);
    }

    console.log(toEditQuotaData);

    return (
        <Modal isOpen={isOpen} onClose={onRequestClose} size="xl">
            <ModalOverlay />
            <ModalContent as="form" borderRadius="24px" onSubmit={handleSubmit(handleEditPayment)}>
                <ModalHeader p="10" fontWeight="700" fontSize="2xl">Alterar {toEditQuotaData.group}-{toEditQuotaData.quota}</ModalHeader>

                <ModalCloseButton top="10" right="5"/>
                
                <ModalBody pl="10" pr="10">
                    <Stack spacing="6">

                        <HStack spacing="4" align="baseline">
                            <ControlledSelect control={control} value={toEditQuotaData.segment.toString()}  h="45px" name="segment" w="100%" fontSize="sm" focusBorderColor="blue.800" bg="gray.400" variant="outline" _hover={ {bgColor: 'gray.500'} } size="lg" borderRadius="full" error={formState.errors.segment}>
                                <option value="Imóvel">Imóvel</option>
                                <option value="Veículo">Veículo</option>
                            </ControlledSelect>

                            <ControlledInput control={control} value={toEditQuotaData.credit} name="credit" type="text" placeholder="Crédito" variant="outline" error={formState.errors.credit} focusBorderColor="blue.800"/>
                        </HStack>

                        <HStack spacing="4" align="baseline">
                            <ControlledInput control={control} value={toEditQuotaData.value} name="value" type="text" placeholder="Entrada" variant="outline" error={formState.errors.value} focusBorderColor="blue.800"/>
                            <ControlledInput control={control} value={toEditQuotaData.cost} name="cost" type="text" placeholder="Custo da empresa" variant="outline" error={formState.errors.cost} focusBorderColor="blue.800"/>
                        </HStack>

                        <ControlledInput control={control} value={toEditQuotaData.total_cost} name="total_cost" type="text" placeholder="Custo total" variant="outline" error={formState.errors.total_cost} focusBorderColor="blue.800"/>

                        <HStack spacing="4" align="baseline">
                            <ControlledInput control={control} value={toEditQuotaData.group} name="group" type="text" placeholder="Grupo" variant="outline" error={formState.errors.group} focusBorderColor="blue.800"/>
                            <ControlledInput control={control} value={toEditQuotaData.quota} name="quota" type="text" placeholder="Cota" variant="outline" error={formState.errors.quota} focusBorderColor="blue.800"/>
                        </HStack>

                        <HStack spacing="4" align="baseline">
                            <ControlledInput control={control} value={toEditQuotaData.purchase_date} name="purchase_date" type="date" placeholder="Data da compra" variant="outline" error={formState.errors.purchase_date} focusBorderColor="blue.800"/>
                            <ControlledInput control={control} value={toEditQuotaData.paid_percent} name="paid_percent" type="text" placeholder="Percentual Pago" variant="outline" error={formState.errors.paid_percent} focusBorderColor="blue.800"/>
                        </HStack>

                        <ControlledInput control={control} value={toEditQuotaData.seller} name="seller" type="text" placeholder="Percentual Pago" variant="outline" error={formState.errors.seller} focusBorderColor="blue.800"/>

                        <HStack spacing="4" align="baseline">
                            <ControlledInput control={control} value={toEditQuotaData.contemplated_type} name="contemplated_type" type="text" placeholder="Data da compra" variant="outline" error={formState.errors.contemplated_type} focusBorderColor="blue.800"/>
                            <ControlledInput control={control} value={toEditQuotaData.cpf_cnpj} name="cpf_cnpj" type="text" placeholder="CPF/CNPJ" variant="outline" error={formState.errors.cpf_cnpj} focusBorderColor="blue.800"/>
                        </HStack>

                        <ControlledInput control={control} value={toEditQuotaData.partner} name="partner" type="text" placeholder="Parceiro" variant="outline" error={formState.errors.partner} focusBorderColor="blue.800"/>

                        <HStack spacing="4" align="baseline">
                            <ControlledInput control={control} value={toEditQuotaData.partner_cost} name="partner_cost" type="text" placeholder="Custo do parceiro" variant="outline" error={formState.errors.partner_cost} focusBorderColor="blue.800"/>
                            <ControlledInput control={control} value={toEditQuotaData.passed_cost} name="passed_cost" type="text" placeholder="Custo passado" variant="outline" error={formState.errors.passed_cost} focusBorderColor="blue.800"/>
                        </HStack>

                        <ControlledInput control={control} value={toEditQuotaData.description} name="description" type="text" placeholder="Descrição" variant="outline" error={formState.errors.description} focusBorderColor="blue.800"/>

                    </Stack>
                </ModalBody>

                <ModalFooter p="10">
                    <SolidButton mr="6" color="white" bg="blue.800" colorScheme="blue" type="submit" isLoading={formState.isSubmitting}>
                        Atualizar
                    </SolidButton>

                    <Link onClick={onRequestClose} color="gray.700" fontSize="14px">Cancelar</Link>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}