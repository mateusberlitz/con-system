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
    toEditLeadData: EditLeadFormData;
    onRequestClose: () => void;
    afterEdit: () => void;
    statuses: LeadStatus[];
    origins: DataOrigin[];
}

export interface EditLeadFormData{
    id: number;
    name: string;
    email: string;
    phone: string;
    accept_newsletter: number;
    company: number;
    user?: number;
    birthday?: string;
    status?: number;
    cpf?: string;
    cnpj?: string;
    origin?: number;

    address?: string;
    address_code?: string;
    address_country?: string;
    address_uf?: string;
    address_city?: string;
    address_number?: string;

    own?: boolean;

    recommender?: string;
    commission?: number;

    segment?: string;
    value?: string;
}

const EditLeadFormSchema = yup.object().shape({
    name: yup.string().required('Nome do lead é obrigatório'),
    email: yup.string().required('E-mail obrigatório').email("Informe um e-mail válido"),
    phone: yup.string().min(9, "Existe Telefone com menos de 9 dígitos?"),//51991090700

    accept_newsletter: yup.number(),
    status: yup.number(),

    birthday: yup.string(),

    cpf: yup.string().nullable(),
    cnpj: yup.string().nullable(),

    address: yup.string().nullable(),
    address_code: yup.string().nullable(),
    address_country: yup.string().nullable(),
    address_uf: yup.string().nullable(),
    address_city: yup.string().nullable(),
    address_number: yup.string().nullable(),

    recommender: yup.string().nullable(),
    commission: yup.string().nullable(),

    segment: yup.string().nullable(),
    value: yup.string().nullable(),
});

export function EditLeadModal( { isOpen, onRequestClose, afterEdit, toEditLeadData, statuses, origins } : NewLeadModalProps){
    const workingCompany = useWorkingCompany();
    const {profile, permissions} = useProfile();

    const history = useHistory();
    const toast = useToast();
    const { showErrors } = useErrors();

    const { register, handleSubmit, control, reset, formState} = useForm<EditLeadFormData>({
        resolver: yupResolver(EditLeadFormSchema),
        defaultValues: {
            id: toEditLeadData.id,
            name: toEditLeadData.name,
            email: toEditLeadData.email,
            phone: toEditLeadData.phone,
            company: toEditLeadData.company,
            accept_newsletter: toEditLeadData.accept_newsletter,
            user: toEditLeadData.user,
            status: toEditLeadData.status,
            birthday: toEditLeadData.birthday,
            cnpj: toEditLeadData.cnpj,
            cpf: toEditLeadData.cpf,
            origin: toEditLeadData.origin,
            address: toEditLeadData.address,
            address_code: toEditLeadData.address_code,
            address_country: toEditLeadData.address_country,
            address_uf: toEditLeadData.address_uf,
            address_city: toEditLeadData.address_city,
            address_number: toEditLeadData.address_number,
        }
    });

    const handleCreateNewPayment = async (leadData : EditLeadFormData) => {
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
            
            if(leadData.cpf === ''){
                delete leadData.cpf;
            }

            if(leadData.cnpj === ''){
                delete leadData.cnpj;
            }

            leadData.company = workingCompany.company.id;
            leadData.user = profile.id;

            if(leadData.value){
                leadData.value = moneyToBackend(leadData.value);
            }
            //leadData.origin = parseInt(leadData.origin);

            const response = await api.post(`/leads/update/${toEditLeadData.id}`, leadData);

            toast({
                title: "Sucesso",
                description: `O lead ${leadData.name} foi atualizado.`,
                status: "success",
                duration: 12000,
                isClosable: true,
            });

            await api.post('/logs/store', {
                user: profile.id,
                company: workingCompany.company.id,
                action: `Alterou as informações do lead ${toEditLeadData.name}`
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
                <ModalHeader p="10" fontWeight="700" fontSize="2xl">Alterar lead {toEditLeadData.name}</ModalHeader>

                <ModalCloseButton top="10" right="5"/>
                
                <ModalBody pl="10" pr="10">
                    <Stack spacing="6">
                        
                        <ControlledInput control={control} value={toEditLeadData.name} name="name" type="text" placeholder="Nome" focusBorderColor="orange.400" variant="outline" error={formState.errors.name}/>


                        <HStack spacing="4" align="baseline">
                            <ControlledInput control={control} value={toEditLeadData.email} name="email" type="email" placeholder="E-mail" focusBorderColor="orange.400" variant="outline" error={formState.errors.email}/>

                            <ControlledInput control={control} value={toEditLeadData.phone} name="phone" type="text" placeholder="Número de telefone" focusBorderColor="orange.400" variant="outline" mask="phone" error={formState.errors.phone}/>
                        </HStack>

                        <HStack spacing="4" align="baseline">
                            {
                                ( !statuses ? (
                                    <Flex justify="center">
                                        <Text>Nenhum status disponível</Text>
                                    </Flex>
                                ) : (
                                    <ControlledSelect control={control} value={toEditLeadData.status} isDisabled={true} h="45px" name="status" w="100%" fontSize="sm" focusBorderColor="orange.400" bg="gray.400" variant="outline" _hover={ {bgColor: 'gray.500'} } size="lg" borderRadius="full" error={formState.errors.status}>
                                        {statuses && statuses.map((status:LeadStatus) => {
                                            return (
                                                <option key={status.id} value={status.id}>{status.name}</option>
                                            )
                                        })}
                                    </ControlledSelect>
                                ))
                            }

                            {
                                ( !origins ? (
                                    <Flex justify="center">
                                        <Text>Nenhuma origem disponível</Text>
                                    </Flex>
                                ) : (
                                    <ControlledSelect control={control} value={toEditLeadData.origin} h="45px" name="origin" w="100%" fontSize="sm" focusBorderColor="orange.400" bg="gray.400" variant="outline" _hover={ {bgColor: 'gray.500'} } size="lg" borderRadius="full" error={formState.errors.origin}>
                                        {origins && origins.map((origin:DataOrigin) => {
                                            return (
                                                <option key={origin.id} value={origin.id}>{origin.name}</option>
                                            )
                                        })}
                                    </ControlledSelect>
                                ))
                            }
                        </HStack>

                        <HStack spacing="4" align="baseline">
                            <ControlledSelect control={control} value={toEditLeadData.segment ? toEditLeadData.segment.toString() : ""} placeholder="Segmento pretendido"  h="45px" name="segment" w="100%" fontSize="sm" focusBorderColor="orange.400" bg="gray.400" variant="outline" _hover={ {bgColor: 'gray.500'} } size="lg" borderRadius="full" error={formState.errors.segment}>
                                <option value="Imóvel">Imóvel</option>
                                <option value="Veículo">Veículo</option>
                                <option value="Investimento">Investimento</option>
                            </ControlledSelect>

                            <ControlledInput control={control} value={toEditLeadData.value} name="value" type="text" placeholder="Valor" focusBorderColor="orange.400" variant="outline" error={formState.errors.value}/>
                        </HStack>

                        <Divider/>

                        <HStack spacing="4" align="baseline">
                            <ControlledInput control={control} value={toEditLeadData.recommender} name="recommender" type="text" placeholder="Quem indicou?" focusBorderColor="orange.400" variant="outline" error={formState.errors.recommender}/>
                            <ControlledInput control={control} value={toEditLeadData.commission?.toString()} name="commission" type="text" placeholder="Comissão da indicação" focusBorderColor="orange.400" variant="outline" error={formState.errors.commission}/>
                        </HStack>

                        {/* <Divider/> */}

                        <Accordion mt="6" allowMultiple>
                            <AccordionItem borderTop="0">
                                {({ isExpanded }) => (
                                    <>
                                        <HStack mb="6">
                                            <Text>Dados adicionais</Text>

                                            <AccordionButton p="0" height="fit-content" w="auto">
                                                <Flex alignItems="center" justifyContent="center" h="24px" w="30px" p="0" borderRadius="full" border="2px" borderColor="orange.400" variant="outline">
                                                { 
                                                        !isExpanded ? <StrongPlusIcon stroke="#f24e1e" fill="none" width="12px"/> :
                                                        <MinusIcon stroke="#f24e1e" fill="none" width="12px"/>
                                                } 
                                                </Flex>
                                            </AccordionButton>
                                        </HStack>

                                        <AccordionPanel p="1px" mb="6">
                                            <Stack fontSize="sm" spacing="6">

                                                <HStack spacing="4" align="baseline">
                                                    <ControlledInput control={control} value={toEditLeadData.cpf} name="cpf" type="text" placeholder="CPF" focusBorderColor="orange.400" variant="outline" mask="cpf" error={formState.errors.cpf}/>
                                                    <ControlledInput control={control} value={toEditLeadData.cnpj} name="cnpj" type="text" placeholder="CNPJ" focusBorderColor="orange.400" variant="outline" mask="cnpj" error={formState.errors.cnpj}/>
                                                </HStack>

                                                <HStack spacing="4" align="baseline">
                                                    <ControlledInput control={control} value={toEditLeadData.address_country} name="address_country" type="text" placeholder="País" focusBorderColor="orange.400" variant="outline" mask="" error={formState.errors.address_country}/>
                                                    <ControlledInput control={control} value={toEditLeadData.address_uf} name="address_uf" type="text" placeholder="Estado" focusBorderColor="orange.400" variant="outline" mask="" error={formState.errors.address_uf}/>
                                                </HStack>

                                                <HStack spacing="4" align="baseline">
                                                    <ControlledInput control={control} value={toEditLeadData.address_city} name="address_city" type="text" placeholder="Cidade" focusBorderColor="orange.400" variant="outline" mask="" error={formState.errors.address_city}/>
                                                    <ControlledInput control={control} value={toEditLeadData.address} name="address" type="text" placeholder="Logradouro" focusBorderColor="orange.400" variant="outline" mask="" error={formState.errors.address}/>
                                                </HStack>

                                                <HStack spacing="4" align="baseline">
                                                    <ControlledInput control={control} value={toEditLeadData.address_code} name="address_code" type="text" placeholder="CEP" focusBorderColor="orange.400" variant="outline" mask="" error={formState.errors.address_code}/>
                                                    <ControlledInput control={control} value={toEditLeadData.address_number} name="address_number" type="text" placeholder="Estado" focusBorderColor="orange.400" variant="outline" mask="" error={formState.errors.address_number}/>
                                                </HStack>
                                            </Stack>
                                        </AccordionPanel>
                                    </>
                                )}
                                

                            </AccordionItem>
                        </Accordion>

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