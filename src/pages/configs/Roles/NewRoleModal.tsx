import { Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, useToast } from "@chakra-ui/react";
import { SolidButton } from "../../../components/Buttons/SolidButton";


import { useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { api } from "../../../services/api";
import { useHistory } from "react-router";
import { useErrors } from "../../../hooks/useErrors";

import { Input } from "../../../components/Forms/Inputs/Input";

interface NewRoleModalProps{
    isOpen: boolean;
    onRequestClose: () => void;
    afterCreate: () => void;
}

interface CreateNewRoleFormData{
    name: string;
}

const CreateNewRoleFormSchema = yup.object().shape({
    name: yup.string().required('Nome do cargo é obrigatório'),
});

export function NewRoleModal( { isOpen, onRequestClose, afterCreate } : NewRoleModalProps){
    const history = useHistory();
    const toast = useToast();
    const { showErrors } = useErrors();

    const { register, handleSubmit, reset, formState} = useForm<CreateNewRoleFormData>({
        resolver: yupResolver(CreateNewRoleFormSchema),
    });

    const handleCreateNewRole = async (roleData : CreateNewRoleFormData) => {
        try{
            await api.post('/roles/store', roleData);

            toast({
                title: "Sucesso",
                description: `O novo cargo ${roleData.name} foi cadastrado`,
                status: "success",
                duration: 12000,
                isClosable: true,
            });

            onRequestClose();
            afterCreate();
            reset();
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
            <ModalContent as="form" borderRadius="24px" onSubmit={handleSubmit(handleCreateNewRole)}>
                <ModalHeader p="10" fontWeight="700" fontSize="2xl">Cadastrar um novo cargo</ModalHeader>

                <ModalCloseButton top="10" right="5"/>
                
                <ModalBody pl="10" pr="10">
                    <Stack spacing="6">
                        
                        <Input register={register} name="name" type="text" placeholder="Título do cargo" variant="outline" error={formState.errors.name}/>

                    </Stack>
                </ModalBody>

                <ModalFooter p="10">
                    <SolidButton mr="6" color="white" bg="purple.300" colorScheme="purple" type="submit" isLoading={formState.isSubmitting}>
                        Cadastrar
                    </SolidButton>

                    <Link onClick={onRequestClose} color="gray.700" fontSize="14px">Cancelar</Link>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}