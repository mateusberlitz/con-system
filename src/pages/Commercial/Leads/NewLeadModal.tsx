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

interface NewLeadModalProps{
    isOpen: boolean;
    onRequestClose: () => void;
    afterCreate: () => void;
    statuses: LeadStatus[];
    origins: DataOrigin[];
}

interface CreateNewLeadFormData{
    name: string;
    email: string;
    phone: string;
    accept_newsletter: number;
    company: number;
    user: number;
    birthday?: string;
    status?: number;
    cpf?: string;
    cnpj?: string;
    origin?: string;

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
    value?: number;
}

const CreateNewLeadFormSchema = yup.object().shape({
    name: yup.string().required('Nome do lead é obrigatório'),
    email: yup.string().required('E-mail obrigatório').email("Informe um e-mail válido"),
    phone: yup.string().min(9, "Existe Telefone com menos de 9 dígitos?"),//51991090700

    accept_newsletter: yup.number(),
    status: yup.number(),

    birthday: yup.string(),

    cpf: yup.string(),
    cnpj: yup.string(),

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

export function NewLeadModal( { isOpen, onRequestClose, afterCreate, statuses, origins } : NewLeadModalProps){
    const workingCompany = useWorkingCompany();
    const {profile, permissions} = useProfile();

    const history = useHistory();
    const toast = useToast();
    const { showErrors } = useErrors();

    const { register, handleSubmit, control, reset, formState} = useForm<CreateNewLeadFormData>({
        resolver: yupResolver(CreateNewLeadFormSchema),
    });

    const handleCreateNewPayment = async (leadData : CreateNewLeadFormData) => {
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

            const isManager = HasPermission(permissions, 'Vendas Completo');

            if(!isManager){
                leadData.own = true;
            }

            if(leadData.cpf === ''){
                delete leadData.cpf;
            }

            if(leadData.cnpj === ''){
                delete leadData.cnpj;
            }

            leadData.company = workingCompany.company.id;
            leadData.user = profile.id;

            const response = await api.post('/leads/store', leadData);

            toast({
                title: "Sucesso",
                description: `O lead ${leadData.name} foi cadastrado.`,
                status: "success",
                duration: 12000,
                isClosable: true,
            });


            await api.post('/logs/store', {
                user: profile.id,
                company: workingCompany.company.id,
                action: `Adicionou o lead ${leadData.name}`
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
                <ModalHeader p="10" fontWeight="700" fontSize="2xl">Cadastrar Lead</ModalHeader>

                <ModalCloseButton top="10" right="5"/>
                
                <ModalBody pl="10" pr="10">
                    <Stack spacing="6">
                        
                        <Input register={register} name="name" type="text" placeholder="Nome" focusBorderColor="orange.400" variant="outline" error={formState.errors.name}/>


                        <HStack spacing="4" align="baseline">
                            <Input register={register} name="email" type="email" placeholder="E-mail" focusBorderColor="orange.400" variant="outline" error={formState.errors.email}/>

                            <Input register={register} name="phone" type="text" placeholder="Número de telefone" focusBorderColor="orange.400" variant="outline" mask="phone" error={formState.errors.phone}/>
                        </HStack>

                        <HStack spacing="4" align="baseline">
                            {
                                ( !statuses ? (
                                    <Flex justify="center">
                                        <Text>Nenhuma empresa disponível</Text>
                                    </Flex>
                                ) : (
                                    <ControlledSelect control={control} value={1} isDisabled={true} h="45px" name="status" w="100%" fontSize="sm" focusBorderColor="orange.400" bg="gray.400" variant="outline" _hover={ {bgColor: 'gray.500'} } size="lg" borderRadius="full" error={formState.errors.status}>
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
                                        <Text>Nenhuma empresa disponível</Text>
                                    </Flex>
                                ) : (
                                    <ControlledSelect control={control} value={1} h="45px" name="origin" w="100%" fontSize="sm" focusBorderColor="orange.400" bg="gray.400" variant="outline" _hover={ {bgColor: 'gray.500'} } size="lg" borderRadius="full" error={formState.errors.origin}>
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
                            <Select register={register}  h="45px" name="segment" w="100%" fontSize="sm" focusBorderColor="blue.800" bg="gray.400" variant="outline" _hover={ {bgColor: 'gray.500'} } size="lg" borderRadius="full" error={formState.errors.segment}>
                                <option value="Imóvel" selected>Imóvel</option>
                                <option value="Veículo">Veículo</option>
                            </Select>

                            <Input register={register} name="value" type="text" placeholder="Valor pretendido" focusBorderColor="orange.400" variant="outline" mask="money" error={formState.errors.value}/>
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
                                                    <Input register={register} name="recommender" type="text" placeholder="Quem indicou?" focusBorderColor="orange.400" variant="outline" mask="" error={formState.errors.recommender}/>
                                                    <Input register={register} name="commission" type="text" placeholder="Comissão da indicação" focusBorderColor="orange.400" variant="outline" mask="" error={formState.errors.commission}/>
                                                </HStack>

                                                <Divider/>

                                                <HStack spacing="4" align="baseline">
                                                    <Input register={register} name="cpf" type="text" placeholder="CPF" focusBorderColor="orange.400" variant="outline" mask="cpf" error={formState.errors.cpf}/>
                                                    <Input register={register} name="cnpj" type="text" placeholder="CNPJ" focusBorderColor="orange.400" variant="outline" mask="cnpj" error={formState.errors.cnpj}/>
                                                </HStack>

                                                <HStack spacing="4" align="baseline">
                                                    <Input register={register} name="address_country" type="text" placeholder="País" focusBorderColor="orange.400" variant="outline" mask="" error={formState.errors.address_country}/>
                                                    <Input register={register} name="address_uf" type="text" placeholder="Estado" focusBorderColor="orange.400" variant="outline" mask="" error={formState.errors.address_uf}/>
                                                </HStack>

                                                <HStack spacing="4" align="baseline">
                                                    <Input register={register} name="address_city" type="text" placeholder="Cidade" focusBorderColor="orange.400" variant="outline" mask="" error={formState.errors.address_city}/>
                                                    <Input register={register} name="address" type="text" placeholder="Logradouro" focusBorderColor="orange.400" variant="outline" mask="" error={formState.errors.address}/>
                                                </HStack>

                                                <HStack spacing="4" align="baseline">
                                                    <Input register={register} name="address_code" type="text" placeholder="CEP" focusBorderColor="orange.400" variant="outline" mask="" error={formState.errors.address_code}/>
                                                    <Input register={register} name="address_number" type="text" placeholder="Estado" focusBorderColor="orange.400" variant="outline" mask="" error={formState.errors.address_number}/>
                                                </HStack>
                                            </Stack>
                                        </AccordionPanel>
                                    </>
                                )}
                                

                            </AccordionItem>
                        </Accordion>

                        
{/* 
                        {
                            ( !profile || !profile.companies ? (
                                <Flex justify="center">
                                    <Text>Nenhuma empresa disponível</Text>
                                </Flex>
                            ) : (
                                <ControlledSelect control={control} value={(workingCompany.company && workingCompany.company.id) ? workingCompany.company.id : ""}  h="45px" name="company" placeholder="Empresa" w="100%" fontSize="sm" focusBorderColor="blue.400" bg="gray.400" variant="outline" _hover={ {bgColor: 'gray.500'} } size="lg" borderRadius="full" error={formState.errors.company}>
                                    {profile.companies && profile.companies.map((company:Company) => {
                                        return (
                                            <option key={company.id} value={company.id}>{company.name}</option>
                                        )
                                    })}
                                </ControlledSelect>
                            ))
                        }

                        <HStack spacing="4" align="baseline">
                            <Input register={register} name="expire" type="date" placeholder="Data de Vencimento" variant="outline" error={formState.errors.expire}/>

                            <Input register={register} name="value" type="text" placeholder="Valor" variant="outline" mask="money" error={formState.errors.value}/>
                        </HStack>

                        <HStack spacing="4" align="baseline">
                            <Select register={register} h="45px" value="0" name="category" w="100%" fontSize="sm" focusBorderColor="blue.400" bg="gray.400" variant="outline" _hover={ {bgColor: 'gray.500'} } size="lg" borderRadius="full" placeholder="Categoria" error={formState.errors.category}>
                                {categories && categories.map((category:PaymentCategory) => {
                                    return (
                                        <option key={category.id} value={category.id}>{category.name}</option>
                                    )
                                })}
                            </Select>

                            <Select register={register} h="45px" value="0" name="provider" w="100%" fontSize="sm" focusBorderColor="blue.400" bg="gray.400" variant="outline" _hover={ {bgColor: 'gray.500'} } size="lg" borderRadius="full" placeholder="Fornecedor" error={formState.errors.pay_to_user}>
                                {providers && providers.map((provider:Provider) => {
                                    return (
                                        <option key={provider.id} value={provider.id}>{provider.name}</option>
                                    )
                                })}
                            </Select>
                        </HStack>

                        <HStack spacing="4" align="baseline">
                            <Input register={register} name="contract" type="text" placeholder="Contrato" variant="outline" error={formState.errors.contract}/>

                            <Select register={register} h="45px" name="pay_to_user" value="0" w="100%" fontSize="sm" focusBorderColor="blue.400" bg="gray.400" variant="outline" _hover={ {bgColor: 'gray.500'} } size="lg" borderRadius="full" placeholder="Pagar para" error={formState.errors.pay_to_user}>
                                {users && users.map((user:User) => {
                                    return (
                                        <option key={user.id} value={user.id}>{user.name}</option>
                                    )
                                })}
                            </Select>
                        </HStack>

                        <HStack spacing="4" align="baseline">
                            <Input register={register} name="recurrence" type="number" placeholder="Repetir Mensalmente" variant="outline" error={formState.errors.recurrence}/>
                        </HStack>

                        <HStack spacing="4" align="baseline">

                            <Flex alignSelf="center">
                                <Box as="label" mr="10px" display="flex" borderRadius="full" alignItems="center" h="29px" fontWeight="600" fontSize="10px" pl="6" pr="6" cursor="pointer" border="2px" borderColor="purple.300" color="purple.300">
                                    <ChakraInput name="file" type="file" accept="image/png, image/jpeg, application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint,text/plain, application/pdf" display="none" onChange={handleChangeFile}/> 
                                    Selecionar Boleto
                                </Box>

                                <Text>{fileName}</Text>
                            </Flex>
                        </HStack>

                        <Input register={register} name="observation" type="text" placeholder="Observação" variant="outline" error={formState.errors.observation}/>

                        <HStack spacing="4" align="baseline">

                            <Flex alignSelf="center">
                                <Box as="label" mr="10px" display="flex" borderRadius="full" alignItems="center" h="29px" fontWeight="600" fontSize="10px" pl="6" pr="6" cursor="pointer" border="2px" borderColor="purple.300" color="purple.300">
                                    <ChakraInput name="invoice" type="file" accept="image/png, image/jpeg, application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint,text/plain, application/pdf" display="none" onChange={handleChangeInvoice}/> 
                                    Selecionar Nota
                                </Box>

                                <Text>{invoiceName}</Text>
                            </Flex>

                            <Input register={register} name="invoice_date" type="date" placeholder="Data da nota" variant="outline" error={formState.errors.invoice_date}/>
                        </HStack> */}

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