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

interface EditPaymentCategoryModalProps{
    isOpen: boolean;
    toEditPaymentCategoryData: EditPaymentCategoryData;
    onRequestClose: () => void;
    afterEdit: () => void;
    changeColor: (color:string) => void;
    color: string;
}

interface EditPaymentCategoryFormData{
    name: string;
    color: string;
}

interface EditPaymentCategoryData{
    id: number;
    name: string;
    color: string;
}

const EditPaymentCategoryFormSchema = yup.object().shape({
    name: yup.string().required('Nome da categoria é obrigatório'),
    color: yup.string(),
});

export function EditPaymentCategoryModal( { isOpen, toEditPaymentCategoryData, color, changeColor, afterEdit, onRequestClose } : EditPaymentCategoryModalProps){
    //const [color, setColor] = useState('#ffffff');


    const history = useHistory();
    const toast = useToast();
    const { showErrors } = useErrors();

    const { handleSubmit, formState, control} = useForm<EditPaymentCategoryFormData>({
        resolver: yupResolver(EditPaymentCategoryFormSchema),
        defaultValues: {
            name: toEditPaymentCategoryData.name,
            color: toEditPaymentCategoryData.color,
        }
    });

    const handleEditPaymentCategory = async (paymentCategoryData : EditPaymentCategoryFormData) => {
        paymentCategoryData.color = color;

        if(paymentCategoryData.color === '#ffffff'){
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
            await api.put(`/payment_categories/update/${toEditPaymentCategoryData.id}`, paymentCategoryData);

            toast({
                title: "Sucesso",
                description: `A categoria ${toEditPaymentCategoryData.name} foi atualizado.`,
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

    return(
        <Modal isOpen={isOpen} onClose={onRequestClose} size="xl">
            <ModalOverlay />
            <ModalContent as="form" borderRadius="24px" onSubmit={handleSubmit(handleEditPaymentCategory)}>
                <ModalHeader p="10" fontWeight="700" fontSize="2xl">Editar a categoria {toEditPaymentCategoryData.name}</ModalHeader>

                <ModalCloseButton top="10" right="5"/>
                
                <ModalBody pl="10" pr="10">
                    <Stack spacing="6">

                        <HStack spacing="4" align="baseline">
                            <ColorPicker color={color} setNewColor={changeColor}/>
                            <ControlledInput control={control} value={toEditPaymentCategoryData.name} name="name" type="text" placeholder="Nome da categoria" variant="outline" error={formState.errors.name}/>
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