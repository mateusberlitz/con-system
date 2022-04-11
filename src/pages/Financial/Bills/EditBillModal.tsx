import { Flex, HStack, Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, Text, useToast } from "@chakra-ui/react";
import { SolidButton } from "../../../components/Buttons/SolidButton";

import {  useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Company, PaymentCategory, Source, User } from "../../../types";
import { api } from "../../../services/api";
import { useHistory } from "react-router";
import { useErrors } from "../../../hooks/useErrors";
import { useWorkingCompany } from "../../../hooks/useWorkingCompany";
import { ControlledInput } from "../../../components/Forms/Inputs/ControlledInput";
import { ControlledSelect } from "../../../components/Forms/Selects/ControlledSelect";
import { formatInputDate } from "../../../utils/Date/formatInputDate";
import moneyToBackend from "../../../utils/moneyToBackend";
import { useProfile } from "../../../hooks/useProfile";
import { useEffect } from "react";
import { redirectMessages } from "../../../utils/redirectMessages";
import { isAuthenticated } from "../../../services/auth";

interface EditBillModalProps{
    isOpen: boolean;
    onRequestClose: () => void;
    afterEdit: () => void;
    categories: PaymentCategory[];
    sources: Source[];
    users: User[];
    toEditBillData: EditBillFormData;
}

export interface EditBillFormData{
    id: number;
    title: string;
    observation?: string;
    company: number;
    category: number;
    status?: boolean;
    source?: number;
    paid?: string;
    value: string;
    expire: string;
}

const EditBillFormSchema = yup.object().shape({
    title: yup.string().required('Título do pagamento obrigatório'),
    observation: yup.string().nullable(),
    company: yup.number(),
    category: yup.number(),
    //status: yup.boolean(),
    source: yup.number().transform((v, o) => o === '' ? null : v).nullable(),
    value: yup.string().required("Informe o valor do pagamento"),
    paid: yup.string(),
    expire: yup.date().required("Selecione a data de vencimento")
});

export function EditBillModal( { isOpen, onRequestClose, afterEdit, toEditBillData, categories, sources } : EditBillModalProps){
    const workingCompany = useWorkingCompany();
    const history = useHistory();
    const toast = useToast();
    const {profile} = useProfile();

    const { showErrors } = useErrors();

    const { handleSubmit, formState, control} = useForm<EditBillFormData>({
        resolver: yupResolver(EditBillFormSchema),
        defaultValues: {
            title: toEditBillData.title,
            value: toEditBillData.value,
            paid: toEditBillData.paid,
            company: toEditBillData.company,
            category: toEditBillData.category,
            source: toEditBillData.source,
            //status: toEditBillData.status,
            expire: toEditBillData.expire,
            observation: toEditBillData.observation,
        }
    });

    function includeAndFormatData(billData: EditBillFormData){
        billData.value = moneyToBackend(billData.value);

        billData.expire = formatInputDate(billData.expire);

        if(billData.paid === null || billData.paid === undefined){
            delete billData.paid;
        }else{
            billData.paid = moneyToBackend(billData.paid);
        }

        if(billData.source === null || billData.source === 0){
            delete billData.source;
        }

        if(!workingCompany.company){
            return billData;
        }else if(billData.company === 0){
            billData.company = workingCompany.company?.id;
        }

        return billData;
    }

    const handleEditBill = async (billData : EditBillFormData) => {
        try{
            console.log(billData.company);

            if(workingCompany.company){
                if(Object.keys(workingCompany.company).length === 0){
                    toast({
                        title: "Ué",
                        description: `Seleciona uma empresa para trabalhar`,
                        status: "warning",
                        duration: 12000,
                        isClosable: true,
                    });
    
                    return;
                }
            }
            if(!workingCompany.company && billData.company === 0){
                toast({
                    title: "Ué",
                    description: `Seleciona uma empresa para trabalhar`,
                    status: "warning",
                    duration: 12000,
                    isClosable: true,
                });

                return;
            }

            billData = includeAndFormatData(billData);

            await api.post(`/bills/update/${toEditBillData.id}`, billData);

            toast({
                title: "Sucesso",
                description: `Dados do pagamento ${toEditBillData.title} atualizados.`,
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

    return (
        <Modal isOpen={isOpen} onClose={onRequestClose} size="xl">
            <ModalOverlay />
            <ModalContent as="form" borderRadius="24px" onSubmit={handleSubmit(handleEditBill)}>
                <ModalHeader p="10" fontWeight="700" fontSize="2xl">Alterar {toEditBillData.title}</ModalHeader>

                <ModalCloseButton top="10" right="5"/>
                
                <ModalBody pl="10" pr="10">
                    <Stack spacing="6">
                        <ControlledInput control={control} value={toEditBillData.title} name="title" type="text" placeholder="Título" variant="outline" error={formState.errors.title} focusBorderColor="blue.400"/>

                        {
                            ( !profile || !profile.companies ? (
                                <Flex justify="center">
                                    <Text>Nenhuma empresa disponível</Text>
                                </Flex>
                            ) : (
                                <ControlledSelect control={control} value={toEditBillData.company.toString()}  h="45px" name="company" w="100%" fontSize="sm" focusBorderColor="blue.400" bg="gray.400" variant="outline" _hover={ {bgColor: 'gray.500'} } size="lg" borderRadius="full" error={formState.errors.company}>
                                    {profile.companies && profile.companies.map((company:Company) => {
                                        return (
                                            <option key={company.id} value={company.id}>{company.name}</option>
                                        )
                                    })}
                                </ControlledSelect>
                            ))
                        }

                        {
                            toEditBillData.category && (
                                <ControlledSelect control={control} name="category" value={toEditBillData.category.toString()} error={formState.errors.category} variant="outline" w="100%" maxW="100%" focusBorderColor="blue.400"> 
                                    <option key="0" value="0">Categoria</option>
                                    {categories && categories.map((category:PaymentCategory) => {
                                        return (
                                            <option key={category.id} value={category.id}>{category.name}</option>
                                        )
                                    })}
                                </ControlledSelect>
                            )
                        }
                        
                        <HStack spacing="4" align="baseline">
                            <ControlledInput control={control} value={toEditBillData.expire} name="expire" type="date" placeholder="Data de Vencimento" variant="outline" error={formState.errors.expire} focusBorderColor="blue.400"/>
                            <ControlledInput control={control} value={toEditBillData.value} name="value" type="text" placeholder="Valor a receber" variant="outline" mask="money" error={formState.errors.value} focusBorderColor="blue.400"/>
                        </HStack>


                        <HStack spacing="4" align="baseline">
                            <ControlledSelect control={control} name="source" value={toEditBillData.source?.toString()} error={formState.errors.source} variant="outline" w="100%" maxW="100%" focusBorderColor="blue.400"> 
                                    <option key="0" value="0">Fonte</option>
                                    {sources && sources.map((source:Source) => {
                                        return (
                                            <option key={source.id} value={source.id}>{source.name}</option>
                                        )
                                    })}
                            </ControlledSelect>

                            <ControlledInput control={control} value={toEditBillData.paid} name="paid" type="text" placeholder="Valor recebido" variant="outline" mask="money" error={formState.errors.paid} focusBorderColor="blue.400"/>
                        </HStack>

                        <ControlledInput control={control} value={toEditBillData.observation} name="observation" type="text" placeholder="Observação" variant="outline" error={formState.errors.observation} focusBorderColor="blue.400"/>

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