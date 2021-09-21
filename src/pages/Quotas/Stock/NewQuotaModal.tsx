import { Box, Flex, HStack, useToast, Modal, ModalBody, Text, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Stack, Select as ChakraInput, ModalFooter, Link } from "@chakra-ui/react"
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router";
import * as yup from 'yup';
import { SolidButton } from "../../../components/Buttons/SolidButton";
import { Input } from "../../../components/Forms/Inputs/Input";
import { ControlledSelect } from "../../../components/Forms/Selects/ControlledSelect";
import { Select } from "../../../components/Forms/Selects/Select";
import { useErrors } from "../../../hooks/useErrors";
import { useProfile } from "../../../hooks/useProfile";
import { useWorkingCompany } from "../../../hooks/useWorkingCompany";
import { api } from "../../../services/api";
import { Company, Quota } from "../../../types";
import { formatInputDate } from "../../../utils/Date/formatInputDate";
import moneyToBackend from "../../../utils/moneyToBackend";

interface NewQuotaModalProps{
    isOpen: boolean;
    onRequestClose: () => void;
    afterCreate: () => void;
}

export interface CreateNewQuota{
    id: number;
    sold: boolean;
    company: number;
    segment: string;
    value: string;
    credit: string;
    group: string;
    quota: string;
    cost: string;
    partner_cost?: string;
    partner?: string;
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

const CreateNewQuotaFormSchema = yup.object().shape({
    segment: yup.string().required('Selecione o tipo da carta de crédito'),
    description: yup.string(),
    seller: yup.string().nullable().required("De quem foi comprada a carta?"),
    contemplated_type: yup.string().required("Qual o tipo de contemplação?"),
    value: yup.string().required("Informe o valor do pagamento"),
    cost: yup.string().required("Informe o custo"),
    cpf_cnpj: yup.string().required("Qual o cpf ou cnpj proprietário?"),
    partner: yup.string(),
    partner_cost: yup.string(),
    passed_cost: yup.string(),
    paid_percent: yup.string().required("Diga qual o percentual pago"),
    partner_commission: yup.string(),
    purchase_date: yup.string().required("Selecione a data de compra"),
    group: yup.string().required("Informe o grupo"),
    quota: yup.string().required("Informe a cota"),
});

export function NewQuotaModal({ isOpen, onRequestClose, afterCreate } : NewQuotaModalProps){
    const workingCompany = useWorkingCompany();
    const {profile} = useProfile();

    const history = useHistory();
    const toast = useToast();
    const { showErrors } = useErrors();

    const { register, handleSubmit, control, reset, formState} = useForm<CreateNewQuota>({
        resolver: yupResolver(CreateNewQuotaFormSchema),
    });

    function includeAndFormatData(quotaData: CreateNewQuota){
        quotaData.value = moneyToBackend(quotaData.value);
        quotaData.credit = moneyToBackend(quotaData.credit);
        quotaData.cost = moneyToBackend(quotaData.cost);

        quotaData.partner_cost = ((quotaData.partner_cost != null && quotaData.partner_cost != "") ? moneyToBackend(quotaData.partner_cost) : '');
        quotaData.passed_cost = ((quotaData.passed_cost != null && quotaData.passed_cost != "") ? moneyToBackend(quotaData.passed_cost) : '');

        quotaData.purchase_date = formatInputDate(quotaData.purchase_date);

        quotaData.total_cost = quotaData.cost + moneyToBackend(quotaData.partner_cost);

        if(!workingCompany.company){
            return quotaData;
        }
        
        quotaData.company = workingCompany.company?.id;

        return quotaData;
    }

    const handleCreateNewQuota = async (quotaData : CreateNewQuota) => {
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

            quotaData = includeAndFormatData(quotaData);

            const response = await api.post('/quotas/store', quotaData);

            toast({
                title: "Sucesso",
                description: `A Cota ${quotaData.group}-${quotaData.quota} foi cadastrada.`,
                status: "success",
                duration: 12000,
                isClosable: true,
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

    return(
        <Modal isOpen={isOpen} onClose={onRequestClose} size="xl">
            <ModalOverlay />
            <ModalContent as="form" borderRadius="24px" onSubmit={handleSubmit(handleCreateNewQuota)}>
                <ModalHeader p="10" fontWeight="700" fontSize="2xl">Cadastrar Nova Cota</ModalHeader>

                <ModalCloseButton top="10" right="5"/>
                
                <ModalBody pl="10" pr="10">
                    <Stack spacing="6">
                        <HStack spacing="4" align="baseline">

                            <Select register={register}  h="45px" name="segment" w="100%" fontSize="sm" focusBorderColor="blue.800" bg="gray.400" variant="outline" _hover={ {bgColor: 'gray.500'} } size="lg" borderRadius="full" error={formState.errors.segment}>
                                <option value="Imóvel" selected>Imóvel</option>
                                <option value="Veículo">Veículo</option>
                            </Select>

                            <Input register={register} name="credit" type="text" placeholder="Crédito" variant="outline" mask="money" error={formState.errors.credit} focusBorderColor="blue.800"/>
                        </HStack>

                        <HStack spacing="4" align="baseline">
                            <Input register={register} name="value" type="text" placeholder="Entrada" variant="outline" mask="money" error={formState.errors.value} focusBorderColor="blue.800"/>

                            <Input register={register} name="cost" type="text" placeholder="Custo da Empresa" variant="outline" mask="money" error={formState.errors.cost} focusBorderColor="blue.800"/>
                        </HStack>

                        <Input register={register} name="total_cost" type="text" placeholder="Custo Total" variant="outline" mask="money" error={formState.errors.total_cost} focusBorderColor="blue.800"/>

                        <HStack spacing="4" align="baseline">
                            <Input register={register} name="group" type="text" placeholder="Grupo" variant="outline" error={formState.errors.group} focusBorderColor="blue.800"/>

                            <Input register={register} name="quota" type="text" placeholder="Cota" variant="outline" error={formState.errors.quota} focusBorderColor="blue.800"/>
                        </HStack>

                        <HStack spacing="4" align="baseline">
                            <Input register={register} name="purchase_date" type="date" placeholder="Data de Compra" variant="outline" error={formState.errors.purchase_date} focusBorderColor="blue.800"/>

                            <Input register={register} name="paid_percent" type="number" placeholder="Percentual pago" variant="outline" error={formState.errors.paid_percent} focusBorderColor="blue.800"/>
                        </HStack>

                        <Input register={register} name="seller" type="text" placeholder="Comprado de" variant="outline" error={formState.errors.seller} focusBorderColor="blue.800"/>

                        <HStack spacing="4" align="baseline">
                            <Input register={register} name="contemplated_type" type="text" placeholder="Tipo de contemplação" variant="outline" error={formState.errors.contemplated_type} focusBorderColor="blue.800"/>

                            <Input register={register} name="cpf_cnpj" type="text" placeholder="CPF/CNPJ" variant="outline" error={formState.errors.cpf_cnpj} focusBorderColor="blue.800"/>
                        </HStack>

                        <Input register={register} name="partner" type="text" placeholder="Parceiro" variant="outline" error={formState.errors.partner} focusBorderColor="blue.800"/>

                        <HStack spacing="4" align="baseline">
                            <Input register={register} name="partner_cost" type="text" placeholder="Custo do parceiro" variant="outline" mask="money" error={formState.errors.partner_cost} focusBorderColor="blue.800"/>
                            
                            <Input register={register} name="passed_cost" type="text" placeholder="Custo passado" variant="outline" mask="money" error={formState.errors.passed_cost} focusBorderColor="blue.800"/>
                        </HStack>

                        <Input register={register} name="description" type="text" placeholder="Descrição" variant="outline" error={formState.errors.description} focusBorderColor="blue.800"/>

                    </Stack>
                </ModalBody>

                <ModalFooter p="10">
                    <SolidButton mr="6" color="white" bg="blue.800" colorScheme="blue" type="submit" isLoading={formState.isSubmitting}>
                        Cadastrar
                    </SolidButton>

                    <Link onClick={onRequestClose} color="gray.700" fontSize="14px">Cancelar</Link>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}