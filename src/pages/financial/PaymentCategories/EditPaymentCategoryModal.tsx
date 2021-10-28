import { Checkbox, Flex, HStack, Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, useToast } from "@chakra-ui/react";
import { SolidButton } from "../../../components/Buttons/SolidButton";
import { ControlledInput } from "../../../components/Forms/Inputs/ControlledInput";

import {  Controller, useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { api } from "../../../services/api";
import { useHistory } from "react-router";
import { useErrors } from "../../../hooks/useErrors";
import { ColorPicker } from "../../../components/Forms/ColorPicker";
import { useEffect, useState } from "react";
import { redirectMessages } from "../../../utils/redirectMessages";
import { isAuthenticated } from "../../../services/auth";
import { ControlledCheckbox } from "../../../components/Forms/CheckBox/ControlledCheckbox";

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
    individual: boolean;
}

interface EditPaymentCategoryData{
    id: number;
    name: string;
    color: string;
    individual: boolean;
}

const EditPaymentCategoryFormSchema = yup.object().shape({
    name: yup.string().required('Nome da categoria é obrigatório'),
    color: yup.string(),
    individual: yup.boolean(),
});

export function EditPaymentCategoryModal( { isOpen, toEditPaymentCategoryData, color, changeColor, afterEdit, onRequestClose } : EditPaymentCategoryModalProps){
    //const [color, setColor] = useState('#ffffff');


    const history = useHistory();
    const toast = useToast();
    const { showErrors } = useErrors();

    const { handleSubmit, reset, register, formState, control} = useForm<EditPaymentCategoryFormData>({
        resolver: yupResolver(EditPaymentCategoryFormSchema),
        defaultValues: {
            name: toEditPaymentCategoryData.name,
            color: toEditPaymentCategoryData.color,
            individual: toEditPaymentCategoryData.individual,
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
            reset();
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

    const [isIndividualChecked, setIsIndividualChecked] = useState<boolean>(() => {
        console.log(toEditPaymentCategoryData.individual);
        const isChecked = toEditPaymentCategoryData.individual ? true : false;

        return isChecked;
    });

    useEffect(() => {
        setIsIndividualChecked(toEditPaymentCategoryData.individual ? true : false);
    }, [toEditPaymentCategoryData.individual, setIsIndividualChecked]);

    const handleChangeIsIndividualChecked = () => {
        setIsIndividualChecked(!isIndividualChecked);
    }

    console.log(isIndividualChecked);

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

                        <Flex as="div">
                            {/* <Controller 
                                name="individual"
                                control={control}
                                defaultValue={isIndividualChecked}
                                render={({ field: {ref, onChange, ...field} }) => 
                                        <Checkbox ref={ref} {...field} name="individual" error={formState.errors.individual} onChange={(event) => {handleChangeIsIndividualChecked(); onChange(event);}} isChecked={isIndividualChecked} colorScheme="blue" size="md" mr="15" borderRadius="full" fontSize="sm" color="gray.800" value={1}>
                                            Individual
                                        </Checkbox>
                                }
                            /> */}
                            <ControlledCheckbox label="Desabilitar no resultado" control={control} defaultIsChecked={toEditPaymentCategoryData.individual} name="individual" error={formState.errors.individual}/>
                        </Flex>
                    
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