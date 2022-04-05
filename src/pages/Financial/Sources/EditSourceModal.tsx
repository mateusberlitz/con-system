import { HStack, Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, useToast } from "@chakra-ui/react";
import { SolidButton } from "../../../components/Buttons/SolidButton";
import { ControlledInput } from "../../../components/Forms/Inputs/ControlledInput";

import {  useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { api } from "../../../services/api";
import { useHistory } from "react-router";
import { useErrors } from "../../../hooks/useErrors";

interface EditSourceModalProps{
    isOpen: boolean;
    toEditSourceData: EditSourceData;
    onRequestClose: () => void;
    afterEdit: () => void;
}

interface EditSourceFormData{
    name: string;
}

interface EditSourceData{
    id: number;
    name: string;
}

const EditSourceFormSchema = yup.object().shape({
    name: yup.string().required('Nome do fornecedor é obrigatório'),
    color: yup.string(),
});

export function EditSourceModal( { isOpen, toEditSourceData, afterEdit, onRequestClose } : EditSourceModalProps){
    const history = useHistory();
    const toast = useToast();
    const { showErrors } = useErrors();

    const { handleSubmit, formState, control} = useForm<EditSourceFormData>({
        resolver: yupResolver(EditSourceFormSchema),
        defaultValues: {
            name: toEditSourceData.name,
        }
    });

    const handleEditSource = async (sourceData : EditSourceFormData) => {

        try{
            await api.put(`/sources/update/${toEditSourceData.id}`, sourceData);

            toast({
                title: "Sucesso",
                description: `A fonte de renda ${toEditSourceData.name} foi atualizada.`,
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

    return(
        <Modal isOpen={isOpen} onClose={onRequestClose} size="xl">
            <ModalOverlay />
            <ModalContent as="form" borderRadius="24px" onSubmit={handleSubmit(handleEditSource)}>
                <ModalHeader p="10" fontWeight="700" fontSize="2xl">Editar a fonte {toEditSourceData.name}</ModalHeader>

                <ModalCloseButton top="10" right="5"/>
                
                <ModalBody pl="10" pr="10">
                    <Stack spacing="6">

                        <HStack spacing="4" align="baseline">
                            <ControlledInput control={control} value={toEditSourceData.name} name="name" type="text" placeholder="Nome da fonte" variant="outline" error={formState.errors.name}/>
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