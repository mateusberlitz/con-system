import { HStack, Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, useToast } from "@chakra-ui/react";
import { SolidButton } from "../../../components/Buttons/SolidButton";
import { ControlledInput } from "../../../components/Forms/Inputs/ControlledInput";

import {  useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { api } from "../../../services/api";
import { useHistory } from "react-router";
import { useErrors } from "../../../hooks/useErrors";
import { Company } from "../../../types";
import { useEffect } from "react";
import { redirectMessages } from "../../../utils/redirectMessages";
import { isAuthenticated } from "../../../services/auth";

interface EditCompanyModalProps{
    isOpen: boolean;
    toEditCompanyData: Company;
    onRequestClose: () => void;
    afterEdit: () => void;
}

interface EditNewCompanyFormData{
    name: string;
    address: string;
    phone?: string;
    cnpj?: string;
}

const EditNewCompanyFormSchema = yup.object().shape({
    name: yup.string().required('Nome da Empresa Obrigatório'),
    address: yup.string().required('Endereço Obrigatório'),
    phone: yup.string().min(9, "Existe Telefone com menos de 9 dígitos?"),//51991090700
    cnpj: yup.string().min(12, "Não parece ser um CNPJ correto"),//02.999.999/0001-00
});

export function EditCompanyModal( { isOpen, toEditCompanyData, afterEdit, onRequestClose } : EditCompanyModalProps){
    const history = useHistory();
    const toast = useToast();
    const { showErrors } = useErrors();

    const { handleSubmit, formState, control} = useForm<EditNewCompanyFormData>({
        resolver: yupResolver(EditNewCompanyFormSchema),
    });

    const handleEditCompany = async (companyData : EditNewCompanyFormData) => {
        try{
            await api.put(`/companies/edit/${toEditCompanyData.id}`, companyData);

            toast({
                title: "Sucesso",
                description: "Dados da empresa foram alterados.",
                status: "success",
                duration: 12000,
                isClosable: true,
            });

            afterEdit();
        }catch(error) {
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
            <ModalContent as="form" borderRadius="24px" onSubmit={handleSubmit(handleEditCompany)}>
                <ModalHeader p="10" fontWeight="700" fontSize="2xl">Alterar Empresa {toEditCompanyData.name}</ModalHeader>

                <ModalCloseButton top="10" right="5"/>
                
                <ModalBody pl="10" pr="10">
                    <Stack spacing="6">
                        
                        <ControlledInput control={control} name="name" type="text" placeholder="Nome da empresa" variant="outline" value={toEditCompanyData.name} error={formState.errors.name} focusBorderColor="purple.600"/>
                        <HStack spacing="4" align="baseline">
                            <ControlledInput control={control} name="cnpj" mask="cnpj" type="text" placeholder="CNPJ" variant="outline" value={toEditCompanyData.cnpj} error={formState.errors.cnpj} focusBorderColor="purple.600"/>
                            <ControlledInput control={control} name="phone" mask="phone" type="text" placeholder="Telefone" variant="outline" value={toEditCompanyData.phone} error={formState.errors.phone} focusBorderColor="purple.600"/>
                        </HStack>
                        <ControlledInput control={control} name="address" type="text" placeholder="Endereço" variant="outline" value={toEditCompanyData.address} error={formState.errors.address} focusBorderColor="purple.600"/>
                        
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