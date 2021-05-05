import { Flex, HStack, Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, Stack, useToast } from "@chakra-ui/react";
import { SolidButton } from "../../../components/Buttons/SolidButton";
import { ControlledInput } from "../../../components/Forms/Inputs/ControlledInput";

import {  useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { api } from "../../../services/api";
import { useHistory } from "react-router";
import { useErrors } from "../../../hooks/useErrors";
import { Company, Role } from "../../../types";
import { ControlledSelect } from "../../../components/Forms/Selects/ControlledSelect";
import { useCompanies } from "../../../hooks/useCompanies";
import { useRoles } from "../../../hooks/useRoles";

interface EditUserModalProps{
    isOpen: boolean;
    toEditUserData: EditUserData;
    onRequestClose: () => void;
    afterEdit: () => void;
}

interface EditUserFormData{
    phone: string;
    email: string;
    company: number;
    role: number;
}

interface EditUserData{
    id: number;
    name: string;
    phone: string;
    email: string;
    company: number;
    role: number;
}

const EditUserFormSchema = yup.object().shape({
    phone: yup.string().min(9, "Existe Telefone com menos de 9 dígitos?"),//51991090700
    email: yup.string().required("Informe um E-mail").email("Informe um e-mail válido"),
    company: yup.number().required("Selecione uma Empresa"),
    role: yup.number().required("Selecione um Cargo")
});

export function EditUserModal( { isOpen, toEditUserData, afterEdit, onRequestClose } : EditUserModalProps){
    const companies = useCompanies();
    const roles = useRoles();

    const history = useHistory();
    const toast = useToast();
    const { showErrors } = useErrors();

    const { handleSubmit, formState, control} = useForm<EditUserFormData>({
        resolver: yupResolver(EditUserFormSchema),
        defaultValues: {
            phone: toEditUserData.phone,
            email: toEditUserData.name,
            company: toEditUserData.company,
            role: toEditUserData.role,
        }
    });

    const handleEditUser = async (userData : EditUserFormData) => {
        try{
            await api.post(`/users/edit/${toEditUserData.id}`, userData);

            toast({
                title: "Sucesso",
                description: "Dados do usuário atualizados.",
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

    return(
        <Modal isOpen={isOpen} onClose={onRequestClose} size="xl">
            <ModalOverlay />
            <ModalContent as="form" borderRadius="24px" onSubmit={handleSubmit(handleEditUser)}>
                <ModalHeader p="10" fontWeight="700" fontSize="2xl">Editar usuário {toEditUserData.name}</ModalHeader>

                <ModalCloseButton top="10" right="5"/>
                
                <ModalBody pl="10" pr="10">
                    <Stack spacing="6">

                        <HStack spacing="4" align="baseline">
                            <ControlledInput control={control} value={toEditUserData.email} name="email" type="text" placeholder="E-mail" variant="outline" error={formState.errors.email}/>
                            <ControlledInput control={control} value={toEditUserData.phone} name="phone" type="text" placeholder="Telefone" variant="outline" mask="phone" error={formState.errors.phone}/>
                        </HStack>


                        <HStack spacing="4" align="baseline">
                        { companies.isLoading ? (
                            <Flex justify="center">
                                <Spinner/>
                            </Flex>
                        ) : (
                                <ControlledSelect control={control} name="company" value={toEditUserData.company.toString()} variant="outline" error={formState.errors.email}> 
                                        <option key="0" value="0">Empresa</option>
                                        {companies.data && companies.data.map((company:Company) => {
                                            return (
                                                <option key={company.id} value={company.id}>{company.name}</option>
                                            )
                                        })}
                                </ControlledSelect>
                            )
                        }

                        { companies.isLoading ? (
                            <Flex justify="center">
                                <Spinner/>
                            </Flex>
                        ) : (
                            <ControlledSelect control={control} name="role" value={toEditUserData.role.toString()} variant="outline" error={formState.errors.email}>
                                    <option key="0" value="0">Cargo</option>
                                    {roles.data && roles.data.map((role:Role) => {
                                        return (
                                            <option key={role.id} value={role.id}>{role.name}</option>
                                        )
                                    })}
                            </ControlledSelect>
                            )
                        }
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