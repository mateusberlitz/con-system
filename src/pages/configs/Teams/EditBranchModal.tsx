import { HStack, Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, useToast } from "@chakra-ui/react";
import { SolidButton } from "../../../components/Buttons/SolidButton";
import { ControlledInput } from "../../../components/Forms/Inputs/ControlledInput";

import {  useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { api } from "../../../services/api";
import { useHistory } from "react-router";
import { useErrors } from "../../../hooks/useErrors";
import { Company, State, User } from "../../../types";
import { useEffect } from "react";
import { redirectMessages } from "../../../utils/redirectMessages";
import { isAuthenticated } from "../../../services/auth";
import { ControlledSelect } from "../../../components/Forms/Selects/ControlledSelect";
import { useUsers } from "../../../hooks/useUsers";
import { useCompanies } from "../../../hooks/useCompanies";
import { useStates } from "../../../hooks/useCompanies copy";

interface EditBranchModalProps{
    isOpen: boolean;
    toEditBranchData: EditBranchFormData;
    onRequestClose: () => void;
    afterEdit: () => void;
}

export interface EditBranchFormData{
    id: number;
    name: string;
    address: string;
    phone?: string;
    email?: string;
    cnpj?: string;
    manager: number;
    company: number;
    state: number;
    city: string;
}

const EditBranchFormSchema = yup.object().shape({
    name: yup.string().required('Nome da filial obrigatório'),
    company: yup.number().required('A qual essa filial pertence?'),
    manager: yup.number().required('Informe o gerente desta filial'),
    state: yup.number().required('Informe o estado'),
    city: yup.string().required('Informe o estado'),
    address: yup.string().required('Endereço Obrigatório'),
    phone: yup.string().min(9, "Informe um telefone com 9 dígitos"),//51991090700
    email: yup.string().email("Informe um e-mail válido"),
    cnpj: yup.string().min(12, "Não parece ser um CNPJ correto"),//02.999.999/0001-00
});

export function EditBranchModal( { isOpen, toEditBranchData, afterEdit, onRequestClose } : EditBranchModalProps){
    const history = useHistory();
    const toast = useToast();
    const { showErrors } = useErrors();

    console.log(toEditBranchData);

    const { handleSubmit, formState, control, reset} = useForm<EditBranchFormData>({
        resolver: yupResolver(EditBranchFormSchema),
    });

    const handleEditBranch = async (branchData : EditBranchFormData) => {
        try{
            await api.post(`/branches/update/${toEditBranchData.id}`, branchData);

            toast({
                title: "Sucesso",
                description: "Dados da filial foram alterados.",
                status: "success",
                duration: 12000,
                isClosable: true,
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

    const users = useUsers({});
    const companies = useCompanies();
    const states = useStates();

    console.log(formState);

    return(
        <Modal isOpen={isOpen} onClose={onRequestClose} size="xl">
            <ModalOverlay />
            <ModalContent as="form" borderRadius="24px" onSubmit={handleSubmit(handleEditBranch)}>
                <ModalHeader p="10" fontWeight="700" fontSize="2xl">Alterar Filial {toEditBranchData.name}</ModalHeader>

                <ModalCloseButton top="10" right="5"/>
                
                <ModalBody pl="10" pr="10">
                    <Stack spacing="6">
                        
                        <ControlledInput control={control} name="name" type="text" placeholder="Nome da filial" variant="outline" value={toEditBranchData.name} error={formState.errors.name} focusBorderColor="purple.600"/>
                        
                        <ControlledSelect value={toEditBranchData.company} control={control} h="45px" name="company" w="100%" fontSize="sm" focusBorderColor="purple.300" bg="gray.400" variant="outline" _hover={ {bgColor: 'gray.500'} } size="lg" borderRadius="full" placeholder="Empresa" error={formState.errors.company}>
                            {(!companies.isLoading && !companies.error) && companies.data.map((company:Company) => {
                                return (
                                    <option key={company.id} value={company.id}>{company.name}</option>
                                )
                            })}
                        </ControlledSelect>
 
                        <ControlledInput control={control} name="phone" mask="phone" type="text" placeholder="Telefone" variant="outline" value={toEditBranchData.phone} error={formState.errors.phone} focusBorderColor="purple.600"/>
                        <ControlledInput control={control} name="email" type="email" placeholder="E-mail" variant="outline" value={toEditBranchData.email} error={formState.errors.email} focusBorderColor="purple.600"/>
                        
                        <ControlledSelect value={toEditBranchData.manager}  control={control} h="45px" name="manager" w="100%" fontSize="sm" focusBorderColor="purple.300" bg="gray.400" variant="outline" _hover={ {bgColor: 'gray.500'} } size="lg" borderRadius="full" placeholder="Gerente" error={formState.errors.manager}>
                            {(!users.isLoading && !users.error) && users.data.map((user:User) => {
                                return (
                                    <option key={user.id} value={user.id}>{user.name}</option>
                                )
                            })}
                        </ControlledSelect>

                        <HStack spacing="4" align="baseline" justifyContent="flex-end">
                            <ControlledSelect value={toEditBranchData.state}  control={control} h="45px" name="state" w="100%" fontSize="sm" focusBorderColor="purple.300" bg="gray.400" variant="outline" _hover={ {bgColor: 'gray.500'} } size="lg" borderRadius="full" placeholder="Estado" error={formState.errors.state}>
                                {(!states.isLoading && !states.error) && states.data.map((state:State) => {
                                    return (
                                        <option key={state.id} value={state.id}>{state.name}</option>
                                    )
                                })}
                            </ControlledSelect>
                            
                            <ControlledInput control={control} name="city" type="text" placeholder="Cidade" variant="outline" value={toEditBranchData.city} error={formState.errors.city} focusBorderColor="purple.600"/>
                        </HStack>

                        <ControlledInput control={control} name="address" type="text" placeholder="Endereço" variant="outline" value={toEditBranchData.address} error={formState.errors.address} focusBorderColor="purple.600"/>
                        
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