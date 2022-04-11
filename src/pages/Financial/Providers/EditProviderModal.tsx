import { HStack, Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, useToast } from "@chakra-ui/react";
import { SolidButton } from "../../../components/Buttons/SolidButton";
import { ControlledInput } from "../../../components/Forms/Inputs/ControlledInput";

import {  useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { api } from "../../../services/api";
import { useHistory } from "react-router";
import { useErrors } from "../../../hooks/useErrors";
import { redirectMessages } from "../../../utils/redirectMessages";
import { isAuthenticated } from "../../../services/auth";
import { useEffect } from "react";

interface EditProviderModalProps{
    isOpen: boolean;
    toEditProviderData: EditProviderData;
    onRequestClose: () => void;
    afterEdit: () => void;
}

interface EditProviderFormData{
    name: string;
}

interface EditProviderData{
    id: number;
    name: string;
}

const EditProviderFormSchema = yup.object().shape({
    name: yup.string().required('Nome do fornecedor é obrigatório'),
    color: yup.string(),
});

export function EditProviderModal( { isOpen, toEditProviderData, afterEdit, onRequestClose } : EditProviderModalProps){
    const history = useHistory();
    const toast = useToast();
    const { showErrors } = useErrors();

    const { handleSubmit, formState, control} = useForm<EditProviderFormData>({
        resolver: yupResolver(EditProviderFormSchema),
        defaultValues: {
            name: toEditProviderData.name,
        }
    });

    const handleEditProvider = async (providerData : EditProviderFormData) => {

        try{
            await api.put(`/providers/update/${toEditProviderData.id}`, providerData);

            toast({
                title: "Sucesso",
                description: `O fornecedor ${toEditProviderData.name} foi atualizado.`,
                status: "success",
                duration: 12000,
                isClosable: true,
            });

            afterEdit();
            onRequestClose();
        }catch(error:any) {
            console.log(error);
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
            <ModalContent as="form" borderRadius="24px" onSubmit={handleSubmit(handleEditProvider)}>
                <ModalHeader p="10" fontWeight="700" fontSize="2xl">Editar o fornecedor {toEditProviderData.name}</ModalHeader>

                <ModalCloseButton top="10" right="5"/>
                
                <ModalBody pl="10" pr="10">
                    <Stack spacing="6">

                        <HStack spacing="4" align="baseline">
                            <ControlledInput control={control} value={toEditProviderData.name} name="name" type="text" placeholder="Nome da categoria" variant="outline" error={formState.errors.name}/>
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