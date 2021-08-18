import { HStack, Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, useToast } from "@chakra-ui/react";
import { SolidButton } from "../../../components/Buttons/SolidButton";
import { ControlledInput } from "../../../components/Forms/Inputs/ControlledInput";

import {  useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { api } from "../../../services/api";
import { useHistory } from "react-router";
import { useErrors } from "../../../hooks/useErrors";
import { ColorPicker } from "../../../components/Forms/ColorPicker";
import { useEffect } from "react";
import { redirectMessages } from "../../../utils/redirectMessages";
import { isAuthenticated } from "../../../services/auth";

interface EditCashDeskCategoryModalProps{
    isOpen: boolean;
    toEditCashDeskCategoryData: EditCashDeskCategoryData;
    onRequestClose: () => void;
    afterEdit: () => void;
    changeColor: (color:string) => void;
    color: string;
}

interface EditCashDeskCategoryFormData{
    name: string;
    color: string;
}

interface EditCashDeskCategoryData{
    id: number;
    name: string;
    color: string;
}

const EditCashDeskCategoryFormSchema = yup.object().shape({
    name: yup.string().required('Nome da categoria é obrigatório'),
    color: yup.string(),
});

export function EditCashDeskCategoryModal( { isOpen, toEditCashDeskCategoryData, color, changeColor, afterEdit, onRequestClose } : EditCashDeskCategoryModalProps){
    //const [color, setColor] = useState('#ffffff');


    const history = useHistory();
    const toast = useToast();
    const { showErrors } = useErrors();

    const { handleSubmit, formState, control} = useForm<EditCashDeskCategoryFormData>({
        resolver: yupResolver(EditCashDeskCategoryFormSchema),
        defaultValues: {
            name: toEditCashDeskCategoryData.name,
            color: toEditCashDeskCategoryData.color,
        }
    });

    const handleEditCashDeskCategory = async (CashDeskCategoryData : EditCashDeskCategoryFormData) => {
        CashDeskCategoryData.color = color;

        if(CashDeskCategoryData.color === '#ffffff'){
            toast({
                title: "Ops",
                description: `Selecione uma cor diferente`,
                status: "warning",
                duration: 12000,
                isClosable: true,
            });

            return;
        }

        try{
            await api.put(`/cashdesk_categories/update/${toEditCashDeskCategoryData.id}`, CashDeskCategoryData);

            toast({
                title: "Sucesso",
                description: `A categoria ${toEditCashDeskCategoryData.name} foi atualizado.`,
                status: "success",
                duration: 12000,
                isClosable: true,
            });

            afterEdit();
            onRequestClose();
        }catch(error) {
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
            <ModalContent as="form" borderRadius="24px" onSubmit={handleSubmit(handleEditCashDeskCategory)}>
                <ModalHeader p="10" fontWeight="700" fontSize="2xl">Editar a categoria {toEditCashDeskCategoryData.name}</ModalHeader>

                <ModalCloseButton top="10" right="5"/>
                
                <ModalBody pl="10" pr="10">
                    <Stack spacing="6">

                        <HStack spacing="4" align="baseline">
                            <ColorPicker color={color} setNewColor={changeColor}/>
                            <ControlledInput control={control} value={toEditCashDeskCategoryData.name} name="name" type="text" placeholder="Nome da categoria" variant="outline" error={formState.errors.name}/>
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